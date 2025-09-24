#!/usr/bin/env node

import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';

interface FileToUpdate {
  path: string;
  type: 'package.json' | 'context7.json';
}

// Get command line arguments
const command = process.argv[2];
const newVersion = process.argv[3];

// Get the project root directory (parent of scripts folder)
const projectRoot = path.join(__dirname, '..');

// Function to get current version from package.json
function getCurrentVersion(): string {
  const packagePath = path.join(projectRoot, 'package.json');

  try {
    if (!fs.existsSync(packagePath)) {
      console.error('❌ Cannot find package.json');
      process.exit(1);
    }

    const content = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(content);
    return packageJson.version;
  } catch (error) {
    console.error('❌ Error reading current version:', (error as Error).message);
    process.exit(1);
  }
}

// Function to update context7.json with new version in previousVersions
function updateContext7Json(newVersion: string, oldVersion: string): string | null {
  const context7Path = path.join(projectRoot, 'context7.json');

  try {
    if (!fs.existsSync(context7Path)) {
      console.log('⚠️  context7.json not found - skipping Context7 update');
      return null;
    }

    const content = fs.readFileSync(context7Path, 'utf8');
    const context7Json = JSON.parse(content);

    // Add the old version to previousVersions if it's not already there
    if (!context7Json.previousVersions) {
      context7Json.previousVersions = [];
    }

    // Only add old version if it's different from new version and not already in previousVersions
    if (oldVersion !== newVersion) {
      const oldVersionTag = `v${oldVersion}`;
      const existingVersion = context7Json.previousVersions.find(
        (v: any) => v.tag === oldVersionTag
      );

      if (!existingVersion) {
        // Add old version to the beginning of previousVersions
        context7Json.previousVersions.unshift({
          tag: oldVersionTag,
          title: `version ${oldVersion}`,
        });

        // Keep only the 5 most recent versions to avoid clutter
        if (context7Json.previousVersions.length > 5) {
          context7Json.previousVersions = context7Json.previousVersions.slice(0, 5);
        }

        const updatedContent = JSON.stringify(context7Json, null, 2) + '\n';
        fs.writeFileSync(context7Path, updatedContent);

        console.log(`✅ Updated context7.json: Added v${oldVersion} to previousVersions`);
        return updatedContent;
      } else {
        console.log(
          `ℹ️  Version v${oldVersion} already exists in context7.json previousVersions - no update needed`
        );
        return null;
      }
    } else {
      console.log('ℹ️  No version change detected - skipping context7.json update');
      return null;
    }
  } catch (error) {
    console.error('❌ Error updating context7.json:', (error as Error).message);
    return null;
  }
}

// Function to increment patch version (e.g., 1.0.1 -> 1.0.2)
function incrementPatchVersion(version: string): string {
  const versionParts = version.split('.');
  if (versionParts.length !== 3) {
    throw new Error('Invalid version format');
  }

  const major = parseInt(versionParts[0]);
  const minor = parseInt(versionParts[1]);
  const patch = parseInt(versionParts[2]);

  return `${major}.${minor}.${patch + 1}`;
}

// Function to execute git operations
function executeGitOperations(version: string, updatedFiles: number, hasContext7: boolean): void {
  console.log('\n🔄 Committing changes to git...');

  try {
    // Check if we're in a git repository and change to project root
    process.chdir(projectRoot);
    execSync('git status', { stdio: 'ignore' });

    // Determine which files to add
    const filesToAdd = ['package.json'];
    const fileDescriptions = ['package.json'];

    if (hasContext7 && fs.existsSync(path.join(projectRoot, 'context7.json'))) {
      filesToAdd.push('context7.json');
      fileDescriptions.push('context7.json');
    }

    if (filesToAdd.length === 0) {
      console.log('⚠️  No files to commit');
      return;
    }

    // Add files to git
    const gitAddCmd = `git add ${filesToAdd.join(' ')}`;
    execSync(gitAddCmd, { stdio: 'ignore' });
    console.log(`📝 Added to git: ${fileDescriptions.join(', ')}`);

    // Generate commit message
    const filesDescription = hasContext7 ? 'package.json and context7.json' : 'package.json';
    const commitMessage = `chore: bump version to v${version}

Updated version in ${filesDescription}${hasContext7 ? ' and added to Context7 previousVersions' : ''}`;

    // Commit the changes
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'pipe' });
    console.log('✅ Successfully committed version changes');
    console.log(`📝 Commit message: "chore: bump version to v${version}"`);

    // Show the commit hash
    const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    console.log(`🔗 Commit hash: ${commitHash}`);
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not a git repository')) {
      console.log('⚠️  Not in a git repository - skipping git operations');
    } else if (err.message.includes('nothing to commit')) {
      console.log('ℹ️  No changes to commit (files may already be up to date)');
    } else {
      console.error('❌ Git operation failed:', err.message);
      console.log('💡 You may need to manually commit the changes');
    }
  }
}

// Function to show current versions
function showVersions(): void {
  console.log('📋 Current Version:');

  const packagePath = path.join(projectRoot, 'package.json');

  try {
    if (!fs.existsSync(packagePath)) {
      console.log('⚠️  Package.json: File not found');
      return;
    }

    const content = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(content);
    const version = packageJson.version;

    console.log(`📦 Package.json: ${version}`);
  } catch (error) {
    console.log(`❌ Package.json: Error reading version (${(error as Error).message})`);
  }
}

// Function to update all version-related files
function updateVersions(version: string): void {
  // Validate version format (basic semver check)
  const versionPattern = /^\d+\.\d+\.\d+$/;
  if (!versionPattern.test(version)) {
    console.error('❌ Invalid version format. Please use semantic versioning (e.g., 1.0.0)');
    process.exit(1);
  }

  // Get current version before updating
  const currentVersion = getCurrentVersion();

  console.log(`🚀 Updating version to ${version}...`);

  // Files to update
  const filesToUpdate: FileToUpdate[] = [
    {
      path: 'package.json',
      type: 'package.json',
    },
    {
      path: 'context7.json',
      type: 'context7.json',
    },
  ];

  let updatedFiles = 0;
  let errors = 0;
  let hasContext7Updated = false;

  filesToUpdate.forEach(({ path: filePath, type }) => {
    const fullPath = path.join(projectRoot, filePath);

    try {
      if (!fs.existsSync(fullPath)) {
        if (type === 'context7.json') {
          console.log(`⚠️  File not found: ${filePath} - skipping Context7 update`);
          return;
        } else {
          console.warn(`⚠️  File not found: ${filePath}`);
          return;
        }
      }

      const content = fs.readFileSync(fullPath, 'utf8');
      let updatedContent: string;

      if (type === 'package.json') {
        // Update package.json
        const packageJson = JSON.parse(content);
        const oldVersion = packageJson.version;
        packageJson.version = version;
        updatedContent = JSON.stringify(packageJson, null, 2) + '\n';
        fs.writeFileSync(fullPath, updatedContent);

        console.log(`✅ Updated ${filePath}: ${oldVersion} → ${version}`);
        updatedFiles++;
      } else if (type === 'context7.json') {
        // Update context7.json - add current version to previousVersions
        const result = updateContext7Json(version, currentVersion);
        if (result !== null) {
          hasContext7Updated = true;
          updatedFiles++;
        }
      } else {
        throw new Error(`Unknown file type: ${type}`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${filePath}:`, (error as Error).message);
      errors++;
    }
  });

  // Summary
  console.log('\n📊 Summary:');
  console.log(`✅ Successfully updated: ${updatedFiles} files`);
  if (errors > 0) {
    console.log(`❌ Errors: ${errors} files`);
    process.exit(1);
  } else {
    console.log('🎉 All files updated successfully!');

    // Execute git operations if files were successfully updated
    if (updatedFiles > 0) {
      executeGitOperations(version, updatedFiles, hasContext7Updated);
    }

    const filesNote = hasContext7Updated ? 'package.json and context7.json' : 'package.json';
    console.log(`\n💡 Note: Version has been updated in ${filesNote}`);
  }
}

// Handle different commands
if (!command || command === 'show' || command === 'version') {
  showVersions();
  process.exit(0);
}

if (command === 'update') {
  if (!newVersion) {
    // Auto-increment patch version if no version provided
    const currentVersion = getCurrentVersion();
    const nextVersion = incrementPatchVersion(currentVersion);
    console.log(`🔄 Auto-incrementing version: ${currentVersion} → ${nextVersion}`);
    updateVersions(nextVersion);
  } else {
    updateVersions(newVersion);
  }
  process.exit(0);
} else {
  // Backward compatibility: if first arg is a version number, treat it as update
  const versionPattern = /^\d+\.\d+\.\d+$/;
  if (versionPattern.test(command)) {
    // First argument is a version, use it for update
    const version = command;
    updateVersions(version);
    process.exit(0);
  } else {
    console.error('❌ Invalid command');
    console.log('Usage:');
    console.log('  npx tsx scripts/version-helper.ts show              # Show current version');
    console.log('  npx tsx scripts/version-helper.ts version           # Show current version');
    console.log(
      '  npx tsx scripts/version-helper.ts update            # Auto-increment patch version & commit'
    );
    console.log(
      '  npx tsx scripts/version-helper.ts update <version>  # Update to specific version & commit'
    );
    console.log(
      '  npx tsx scripts/version-helper.ts <version>         # Update to specific version & commit (legacy)'
    );
    console.log('');
    console.log('Examples:');
    console.log('  npx tsx scripts/version-helper.ts show');
    console.log(
      '  npx tsx scripts/version-helper.ts update            # 1.0.1 → 1.0.2 & git commit'
    );
    console.log(
      '  npx tsx scripts/version-helper.ts update 1.1.0      # Update to 1.1.0 & git commit'
    );
    console.log(
      '  npx tsx scripts/version-helper.ts 1.1.0             # Update to 1.1.0 & git commit'
    );
    console.log('');
    console.log('Git Integration:');
    console.log('  • Automatically stages package.json and context7.json files (git add)');
    console.log('  • Creates a commit with descriptive message');
    console.log('  • Adds previous version to context7.json previousVersions array');
    console.log('  • Handles cases where not in a git repository gracefully');
    process.exit(1);
  }
}

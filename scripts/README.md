# Scripts

This directory contains utility scripts for the sipay-node project.

## Version Helper (`version-helper.ts`)

A TypeScript utility script that automatically updates version numbers across
multiple files in the project and maintains Context7 documentation versioning.

### Files Updated

The script updates the version in the following files:

- `package.json` - Main package version
- `context7.json` - Context7 configuration with version history for documentation

### Context7 Integration

When updating versions, the script automatically:

- Adds the current version to the `previousVersions` array in `context7.json`
- Maintains the 5 most recent versions for Context7 documentation
- Helps developers access different API versions through Context7

### Usage

#### Show Current Versions

```bash
# Using npm scripts (recommended)
pnpm run version:show

# Or directly with tsx
npx tsx scripts/version-helper.ts show
```

#### Auto-increment Patch Version

```bash
# Using npm scripts (recommended)
pnpm run version:update
# or
pnpm run version:bump

# Or directly with tsx
npx tsx scripts/version-helper.ts update
```

This will automatically increment the patch version (e.g., `1.0.1` → `1.0.2`)
and commit the changes.

#### Update to Specific Version

```bash
# Using npm scripts
pnpm run version:update -- 1.1.0

# Or directly with tsx
npx tsx scripts/version-helper.ts update 1.1.0
# or (legacy syntax)
npx tsx scripts/version-helper.ts 1.1.0
```

### Features

- ✅ **Automatic file updates**: Updates all version references across the project
- ✅ **Context7 integration**: Maintains version history for documentation platform
- ✅ **Git integration**: Automatically stages and commits changes with descriptive commit messages
- ✅ **Validation**: Validates semantic versioning format
- ✅ **Error handling**: Graceful error handling for missing files or git issues
- ✅ **Status reporting**: Shows before/after versions and update summary

### Git Integration

The script automatically:

1. Stages the updated files (`git add package.json context7.json`)
2. Creates a commit with a descriptive message
3. Shows the commit hash

Example commit message:

```
chore: bump version to v1.1.2

Updated version in package.json and context7.json and added to Context7 previousVersions
```

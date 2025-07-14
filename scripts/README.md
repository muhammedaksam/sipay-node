# Scripts

This directory contains utility scripts for the ayyildiz-node project.

## Version Helper (`version-helper.ts`)

A TypeScript utility script that automatically updates version numbers across
multiple files in the project.

### Files Updated

The script updates the version in the following files:

- `package.json` - Main package version
- `src/VersionInfo.ts` - Static version constants (MAJOR, MINOR, PATCH)
- `src/__tests__/VersionInfo.test.ts` - Test expectations for version values

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

- ✅ **Automatic file updates**: Updates all version references across the
  project
- ✅ **Git integration**: Automatically stages and commits changes with
  descriptive commit messages
- ✅ **Validation**: Validates semantic versioning format
- ✅ **Error handling**: Graceful error handling for missing files or git issues
- ✅ **Status reporting**: Shows before/after versions and update summary

### Git Integration

The script automatically:

1. Stages the updated files (`git add`)
2. Creates a commit with a descriptive message
3. Shows the commit hash

Example commit message:

```
chore: bump version to v1.0.2

Updated version across the following files:
- package.json
- src/VersionInfo.ts
- src/__tests__/VersionInfo.test.ts
```

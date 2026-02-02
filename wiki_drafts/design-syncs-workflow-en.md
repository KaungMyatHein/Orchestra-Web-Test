# Orchestra Design System Sync Workflow

This document explains the `.github/workflows/design-syncs.yml` file, which automates the process of generating and syncing design tokens whenever token files are updated.

## Workflow Triggers

```yaml
on:
  push:
    paths:
      - 'tokens/**/*.json'
```

The workflow is triggered automatically whenever a `push` is made to the repository, but ONLY if the changes include files ending in `.json` inside the `tokens` directory or its subdirectories.

## Concurrency Control

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

This ensures that if multiple pushes happen quickly, only the latest one runs. Any previous runs that are still in progress for the same branch will be cancelled to save resources and avoid conflicts.

## Job Details: `build-tokens`

Runs on: `ubuntu-latest`
Permissions: `contents: write` (Required to push generated files back to the repo)

### Steps

#### 1. Checkout Repository
```yaml
uses: actions/checkout@v4
with:
  fetch-depth: 0 
```
Downloads the code. `fetch-depth: 0` fetches the entire history, which is important for git operations like rebasing.

#### 2. Setup Node.js
```yaml
uses: actions/setup-node@v4
with:
  node-version: '22'
```
Installs Node.js version 22, which is required for the build scripts.

#### 3. Install Dependencies
```yaml
run: npm ci
```
Installs the project dependencies accurately based on `package-lock.json`.

#### 4. Pull Latest Changes
```yaml
run: git pull origin main --rebase
```
Ensures the runner has the absolute latest code from the main branch to avoid merge conflicts before generating new files.

#### 5. Run Build Script
```yaml
run: npm run tokens
```
Executes the custom build script (`build.js`) to process the JSON tokens and generate code for Web, Android, iOS, and Flutter.

#### 6. Debug generated outputs
```yaml
run: ... ls -la ...
```
Lists the contents of the output directories to verify that files were actually created.

#### 7. Commit Generated Files
```yaml
run: |
  git config user.name "github-actions[bot]" ...
  [ -d "src/styles" ] && git add src/styles/*.css src/styles/*.ts ...
  git commit -m "🎨 Design Token Updates"
  git push
```
- Configures git user as a bot.
- Checks if output directories exist and adds generated files (`.css`, `.ts`, `.swift`, `.kt`, `.dart`) to git.
- If there are changes, commits them with the message "🎨 Design Token Updates" and pushes them back to the repository.

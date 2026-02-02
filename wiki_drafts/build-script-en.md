# Build Script Documentation

This document explains the `build.js` file, which is responsible for transforming raw design tokens (JSON files) into platform-specific code (CSS, TypeScript, Swift, Kotlin, Dart).

## Usage

To run the script manually:

```bash
node build.js [platform]
```

- `platform`: Can be `web`, `android`, `ios`, `flutter`, or `all`. (Default is `web`)

## Script Structure

### 1. Helper Functions

- **`toKebabCase` / `toCamelCase` / `toSnakeCase`**: 
  - Converts strings to different naming conventions needed for different platforms (e.g., `primary-color` for CSS, `primaryColor` for JS/Swift).

- **`ensureDir`**: 
  - Creates the destination directory if it doesn't exist.

- **`flattenToMap`**: 
  - Takes a nested object and flattens it into a single-level map with slash-separated keys. Useful for looking up primitive references.

- **`resolveAlias`**: 
  - Resolves references like `{colors/blue/500}` to their actual values found in the primitive map.

### 2. Platform Writers

The script defines specific functions to generate code for each platform:

- **`writeWebThemeFiles`**: 
  - Generates `.css` files with CSS variables.
  - Generates `.ts` files with TypeScript constants.
  - Preserves existing variables found in target files to avoid overwriting unrelated code.

- **`writeAndroidThemeFiles`**: 
  - Generates `.kt` (Kotlin) object with `const val` properties.

- **`writeIOSTokenFiles`**: 
  - Generates `.swift` enum with `static let` properties.

- **`writeFlutterThemeFiles`**: 
  - Generates `.dart` class with `static const` properties.

### 3. Main Logic

1. **Validation**: Checks if the `tokens` directory exists and contains JSON files.
2. **Setup**: Identifying target platforms based on arguments.
3. **Processing**: Iterates through each `.json` file:
    - Identifies **Primitive** and **Component** collections (using fallback logic or env vars).
    - Flattens the primitive collection for easy lookup.
    - Iterates through the component collection (brands/modes).
    - Resolves aliases and creates a list of tokens.
    - Calls the appropriate writer functions for the selected platforms.

# Building jSin

This project uses TypeScript in source code, and is also minified when built.


## Compiling

To produce the distributable output for use and/or submission, run the appropriate build script defined in the `package.json` manifest from
the project root directory.

In other words:
  - For Chrome or Chromium-based browsers: `npm run build-chromium`
  - For Firefox or Firefox-based browsers: `npm run build-firefox`

The output can be found in the `dist/` directory, in the named browser-specific subdirectory. In Firefox builds, for instance, the manifest
should now be located at `dist/firefox/manifest.json`.


## Distributing

When distributing the extension, produce a zip of the files in the output folder (i.e. `firefox/` or `chromium/`).

On macOS systems, there as `__MACOSX/` folder generated in the zip containing metadata - this should be removed, which can be done using the
following commands in the output folder:
```
$ zip -d filename.zip __MACOSX/\*
```

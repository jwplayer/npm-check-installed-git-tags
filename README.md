# npm-check-installed-git-tags
Verify the package.json version of git dependencies matches what gets installed.

## Automated Usage
Add `npm-check-installed-git-tags` as a script:

If the current package will be installed with npm:
1. use the following `prepare` script
2. add this package to `devDependencies`
```json
"script": {
  "prepare": "npm-check-installed-git-tags"
},
"devDependencies":{
  "npm-check-installed-git-tags": "<version>"
}
```

If the current this package will be installed using git
1. add the following `postinstall` script
2. add this package to `dependencies`
```json
"script": {
  "postinstall": "npm-check-installed-git-tags"
},
"dependencies":{
  "npm-check-installed-git-tags": "<version>"
}
```

> We use `postinstall` and `dependencies` for `git` versioned packages because npm lifecycle scripts do special things on prepare for git packages. For more information see the NOTE on the `prepare` lifecycle script here: https://docs.npmjs.com/cli/v8/using-npm/scripts

This will make your installation fail if you use git dependencies and the tag specified in package.json for the version, is not actually what is installed. This is useful for ci runs so that things fail when package versions are updated.


## Manual Usage
After running `npm install` you can run `npm-check-installed-git-tags` to see if packages that are installed are incorrect. If they are you will be prompted to run `npm-check-installed-git-tags-and-fix` to fix the issues in a minimal way (see #2 in the Why is this needed section).

## Disable
Remove the `prepare`/`postinstall` script or set `DO_NOT_RUN_NPM_CHECK_INSTALLED_GIT_TAGS=1` as an environment variable

## Why is this needed

The incorrect version can be installed when the git tag is updated in package.json as npm does not update `package-lock.json` for git dependencies in that case. This can be fixed by doing one of two things:

1. minimally by doing `npm install <git-repo#tag>`
2. removing `package-lock.json` and doing`npm install` to generate it again.

> See: https://github.com/npm/cli/issues/3973 for information on why npm isn't going to fix this.


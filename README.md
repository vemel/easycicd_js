# GitHubActions

Hackable GitHub Actions pack for JavaScript/TypeScript and Python projects.
Comes with a nice and a bit shy CLI manager. 

- [GitHubActions](#githubactions)
  - [Usage](#usage)
  - [Description](#description)
    - [GitHubActions Zen](#githubactions-zen)
    - [What it does](#what-it-does)
    - [What it does not](#what-it-does-not)
    - [How to modify workflows and keep updated](#how-to-modify-workflows-and-keep-updated)
  - [Secrets](#secrets)
  - [Workflows](#workflows)
    - [Run style checks and unit tests](#run-style-checks-and-unit-tests)
    - [Update Pull Request labels](#update-pull-request-labels)
    - [Update Release from Pull Request](#update-release-from-pull-request)
    - [Create Release Pull Request](#create-release-pull-request)
    - [Publish to NPM](#publish-to-npm)
    - [Create Release draft](#create-release-draft)
  - [TODO](#todo)

## Usage

```bash
# in a GitHub repository root
npm i --save-dev github-actions
mkdir -p .github/workflows

# list available workflows
npx ghactions --help

# add or update all workflows
npx ghactions all

# force update all workflows
npx ghactions all --force

# check if workflows can be safely updated
npx ghactions --check

# for python use ghactions_py instead of ghactions
```

## Description

### GitHubActions Zen

- Enforce best practices for versioning and changelog in a passive-aggressive way
- Write Release and Pull Request notes in [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format
- Follow [SemVer](https://semver.org/) or [PEP 440](https://www.python.org/dev/peps/pep-0440/) versioning schema
- Noone likes to write and assemble Release notes, so leave it to automation
- Always leave a final decision to a human in case automation goes crazy
- All actions use only Node.js 12 for speed and stability
- Every action should have an additional manual trigger in case of trouble
- Full compatibility with [nektos/act](https://github.com/nektos/act) for local execution
- Do not try to build one-fits-all soultion, provide customization instead

### What it does

- Enforces [SemVer](https://semver.org/) or [PEP 440](https://www.python.org/dev/peps/pep-0440/) versioning schema
- Release and Pull Request notes follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format
- Supports publishing new versions to [npm](https://www.npmjs.com/)
- Automatically bumps version in `package.json` and adds published Release notes to `CHANGELOG.md`
- Releases are build in `release/*` branches to prevent unwanted changes 

### What it does not

- Does not update files in your branches, all updates happen in newly created `release/*` branch,
  so you can always check that automation does exactly what you want
- Does not analyze your project files to suggest versions, all suggested versions are based
  only on Release/Pull Request notes

### How to modify workflows and keep updated
- Set `github-actions-managed: false` on manual edit to prevent step overwrite on update
- User-added steps survive update as well
- Deleted steps are restored on update, so make them empty instead of removing
- Comments in yaml are removed on update, sorry :(

## Secrets

- `NPM_TOKEN` - If set, new releases are published to [npm](https://www.npmjs.com/) on Release Pull Request merge
- `PYPI_PASSWORD` - If set, new releases are published to [PyPI](https://pypi.org/) on Release Pull Request merge

## Workflows

### Run style checks and unit tests

Workflow: [on_push_check.yml](workflows/on_push_check.yml)

- Starts on push to any branch
- Runs linting if `lint` script is available in `package.json`
- Runs unit tests if `test` script is available in `package.json`
- Uses `npm` cache to improve performance

```bash
# install this action to .github/workflows
npx ghactions on_push_check
```

### Update Pull Request labels

Workflow: [on_pull_opened_or_edited.yml](./workflows/on_pull_opened_or_edited.yml)

- Starts on Pull Request opened or edited event
- Pull Request notes must be in [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format
- If Pull Request branch name is `release/*`, adds `release` label
- If Pull Request notes has `Removed` section, adds `major` label
- If Pull Request notes has `Added`, `Changed` or `Deprecated` sections, adds `minor` label
- Otherwise adds `patch` label

```bash
# install this action to .github/workflows
npx ghactions on_pull_opened_or_edited
```

### Update Release from Pull Request

Workflow: [on_pull_merged.yml](./workflows/on_pull_merged.yml)

- Starts on Pull Request merge for non-`release/*` branch
- Creates or updates a Release draft for Pull Request base branch
- Release draft notes are merged from existing notes and Pull Request notes
- Each entry added from Pull Request notes contains a link to the Pull Request 
- Release draft suggested version is based on Release notes

```bash
# install this action to .github/workflows
npx ghactions on_pull_merged
```

### Create Release Pull Request

Workflow: [on_release_published.yml](./workflows/on_release_published.yml)

- Starts on Release published
- Release notes must be in [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format
- Creates a Release Pull Request from Release target branch with `release` label
- Release Pull Request contains only version bump in `package.json` and updated `CHANGELOG.md`
- Release Pull Request uses branch `release/<version>`

```bash
# install this action to .github/workflows
npx ghactions on_release_published
```

### Publish to NPM

Workflow: [on_release_pull_merged.yml](./workflows/on_release_pull_merged.yml)

- Starts on Pull Request merge for `release/*` branch
- Uses Pull Request branch for deployment, so released version contains only changes
  from base branch when Release had been published
- Builds package if `build` script is available in `package.json`
- Publishes new version to [npm](https://www.npmjs.com/) if `NPM_TOKEN` secret is set (`javascript`)
- Publishes new version to [PyPI](https://pypi.org/) if `PYPI_PASSWORD` secret is set (`python`)

```bash
# install this action to .github/workflows
npx ghactions on_release_pull_merged
```

### Create Release draft

Workflow: [on_demand_create_release_draft.yml](./workflows/on_demand_create_release_draft.yml)

- Starts only manually
- Can be used if you do not enforce Pull Request-based updates and commit directly to `target` branch
- Creates or updates a release draft for `target` branch
- Release notes are populated from `Unreleased` section of `CHANGELOG.md`
- Sets suggested version as `name` and `tag` of the Release


```bash
# install this action to .github/workflows
npx ghactions on_demand_create_release_draft
```

## TODO

- [ ] Add `npm run coverage` support
- [ ] Add `flake8` support
- [ ] Add `pylint` support
- [ ] Add `pytest` support
- [ ] Add `pytest-cov` support
- [ ] Add `mypy` support
- [ ] Add `pyright` support
- [ ] Add `latest` ref support
- [ ] Use `latest` tag for updates by default instead of `main`
- [ ] Publish to GitHub Packages
# GitHub Actions for Python projects

- [GitHub Actions for Python projects](#github-actions-for-python-projects)
  - [Installation](#installation)
  - [Zen](#zen)
  - [Secrets](#secrets)
  - [TODOx](#todox)
  - [Actions](#actions)
    - [Run style checks and unit tests](#run-style-checks-and-unit-tests)
    - [Update Pull Request labels](#update-pull-request-labels)
    - [Update Release from Pull Request](#update-release-from-pull-request)
    - [Create Release Pull Request](#create-release-pull-request)
    - [Publish to NPM](#publish-to-npm)
    - [Create Release draft](#create-release-draft)

## Installation

```bash
# in a GitHub repository root
npm i -g github-actions
mkdir -p .github/workflows

# install all workflows to .github/workflows
ghactions_py all
```

Index: [index.yml](./index.yml)

## Zen

- Enforce best practices for versioning and changelog in a passive-aggressive way
- Write Release and Pull Request notes in [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format
- Follow [PEP 440](https://www.python.org/dev/peps/pep-0440/) versioning schema
- Noone likes to write and assemble Release notes, so leave it to automation
- Always leave a final decision to a human in case automation goes crazy
- All actions use only Node.js 12 for speed and stability
- Every action should have an additional manual trigger in case of trouble
- Full compatibility with [nektos/act](https://github.com/nektos/act) for local execution
- Do not try to build one-fits-all soultion, provide customization instead

## Secrets
List of optional secrets to unleash secret techniques

- `PYPI_PASSWORD` - If set, new releases are published to [PyPI](https://pypi.org/) on Release Pull Request merge

## TODOx
- [ ] Add `pytest-cov` support

## Actions
### Run style checks and unit tests
Workflow: [on_push_check.yml](./on_push_check.yml)

- Starts on push to any branch
- Installs package with `poetry`, `pipenv` or `requirements[-dev].txt`
- Caches installed Python dependencies
- Runs [flake8](https://flake8.pycqa.org/) if it is installed
- Runs [pylint](https://www.pylint.org/) if it is installed
- Runs [mypy](http://mypy-lang.org/) if it is installed
- Runs [pyright](https://github.com/microsoft/pyright) if `pyrightconfig.json` file exists
- Runs [pytest](https://pytest.org/) if it is installed

```bash
# install this action to .github/workflows
ghactions_py on_push_check
```

### Update Pull Request labels

Workflow: [on_pull_opened_or_edited.yml](./on_pull_opened_or_edited.yml)

- Starts on Pull Request opened or edited event
- Pull Request notes must be in [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format
- If Pull Request branch name is `release/*`, adds `release` label
- If Pull Request notes has `Removed` section, adds `major` label
- If Pull Request notes has `Added`, `Changed` or `Deprecated` sections, adds `minor` label
- Otherwise adds `patch` label

```bash
# install this action to .github/workflows
ghactions_py on_pull_opened_or_edited
```

### Update Release from Pull Request

Workflow: [on_pull_merged.yml](./on_pull_merged.yml)

- Starts on Pull Request merge for non-`release/*` branch
- Creates or updates a Release draft for Pull Request base branch
- Release draft notes are merged from existing notes and Pull Request notes
- Each entry added from Pull Request notes contains a link to the Pull Request
- Release draft suggested version is based on Release notes

```bash
# install this action to .github/workflows
ghactions_py on_pull_merged
```

### Create Release Pull Request

Workflow: [on_release_published.yml](./on_release_published.yml)

- Starts on Release published
- Release notes must be in [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format
- Creates a Release Pull Request from Release target branch with `release` label
- Release Pull Request contains only version bump in `package.json` and updated `CHANGELOG.md`
- Release Pull Request uses branch `release/<version>`

```bash
# install this action to .github/workflows
ghactions_py on_release_published
```

### Publish to NPM

Workflow: [on_release_pull_merged.yml](./on_release_pull_merged.yml)

- Starts on Pull Request merge for `release/*` branch
- Uses Pull Request branch for deployment, so released version contains only changes
  from base branch when Release had been published
- Builds package if `build` script is available in `package.json`
- Publishes new version to [PyPI](https://pypi.org/) if `PYPI_PASSWORD`

```bash
# install this action to .github/workflows
ghactions_py on_release_pull_merged
```

### Create Release draft

Workflow: [on_demand_create_release_draft.yml](./on_demand_create_release_draft.yml)

- Starts only manually
- Can be used if you do not enforce Pull Request-based updates and commit directly to `target` branch
- Creates or updates a release draft for `target` branch
- Release notes are populated from `Unreleased` section of `CHANGELOG.md`
- Sets suggested version as `name` and `tag` of the Release


```bash
# install this action to .github/workflows
ghactions_py on_demand_create_release_draft
```
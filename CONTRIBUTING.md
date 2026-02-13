# Contributing to Super App

Thanks for contributing!

## Workflow
1. Fork and create a feature branch.
2. Keep changes focused and backward-compatible.
3. Add or update tests for every behavior change.
4. Update README when CLI behavior changes.

## Required checks
- `python3 -m unittest discover -s tests -v`
- `npm test --silent`
- `node bin/super-app.js --help`

## Pull requests
- Use the PR template.
- Explain motivation and risk.
- Include validation commands and outputs.


## Professional agentic coding contributions
- Agent-authored changes are welcome when they remain reviewable and test-backed.
- Include exact commands used for validation and summarize observed outputs.
- Call out any generated content and verify it for security and licensing before merge.
- Prefer incremental PRs over large rewrites to keep risk low and rollback simple.

# Repository integrity smoke

These checks protect repository structure only; they do not modify or validate gameplay balance, progression, economy, saves, or content.

Run all integrity checks locally with:

```bash
node .github/smoke/run-integrity.mjs
```

`integrity-manifest.json` defines the expected runtime and minimum check count. The runner discovers every `.mjs` check in this directory except itself, executes them in sorted order, and fails on the first non-zero exit code.

Keep new repository-only guards in this directory so CI picks them up automatically.

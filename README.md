# @gaonengwww/eslint-config

## Usage

```bash
pnpm add @gaonengwww/eslint-config
```

```typescript
// eslint.config.mjs
import { www } from '@gaonengwww/eslint-config';
export default www();
```

And add command in your package.json

```json
{
    "scripts":{
        "lint": "eslint .",
        "lint:fix": "eslint . --fix"
    }
}
```

### Auto Fix

```json5
// .vscode/settings.json
{

    "prettier.enable": false,
    "editor.formatOnSave": false,

    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit",
      "source.organizeImports": "never"
    },
  
    "eslint.options": {
      "flags": ["unstable_ts_config"]
    },
  
    "eslint.runtime": "node",

    "eslint.rules.customizations": [
      { "rule": "style/*", "severity": "off", "fixable": true },
      { "rule": "*-indent", "severity": "off", "fixable": true },
      { "rule": "*-spacing", "severity": "off", "fixable": true },
      { "rule": "*-spaces", "severity": "off", "fixable": true },
      { "rule": "*-order", "severity": "off", "fixable": true },
      { "rule": "*-dangle", "severity": "off", "fixable": true },
      { "rule": "*-newline", "severity": "off", "fixable": true },
      { "rule": "*quotes", "severity": "off", "fixable": true },
      { "rule": "*semi", "severity": "off", "fixable": true }
    ],
  
    // Enable eslint for all supported languages
    "eslint.validate": [
      "javascript",
      "javascriptreact",
      "typescript",
      "typescriptreact",
      "vue",
      "html",
      "markdown",
      "json",
      "json5",
      "jsonc",
      "yaml",
      "toml",
      "xml"
    ],
}
```
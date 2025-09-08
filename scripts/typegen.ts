import { builtinRules } from 'eslint/use-at-your-own-risk';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';
import { www } from '../src';
import { writeFileSync } from 'fs';

const config = [
  {
    plugins: {
      '': {
        rules: Object.entries(builtinRules.entries()),
      },
    },
  },
  ...(await www()),
];

const configNames = config.map(i => 'name' in i ? i.name : undefined).filter(Boolean);

let dts = await flatConfigsToRulesDTS(config, {
  includeAugmentation: false,
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(i => `'${i}'`).join(' | ')}
`;

writeFileSync('src/typegen.d.ts', dts);

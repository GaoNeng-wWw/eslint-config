import { Linter } from 'eslint';
import { TypescriptOptions } from '../factory';
import { renameRules } from '../utils';
import { GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from '../glob';
import pluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';

export const typescript = async (
    options: Partial<TypescriptOptions> = {}
): Promise<Linter.Config<Linter.RulesRecord>[]> => {
    const {
        files = [
            GLOB_TS,
            GLOB_TSX,
        ],
        type = 'app',
        overrides,
        parserOptions = {},
        componentExts = []
    } = options;
    files.push(
        ...componentExts.map(ext => `**/*.${ext}`)
    );
    const tsconfigPath = options?.tsconfigPath
        ? options.tsconfigPath
        : undefined;
    const isTypeAware = !!tsconfigPath;
    const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX];
    const ignoresTypeAware = options.ignoresTypeAware ?? [
        `${GLOB_MARKDOWN}/**`,
        GLOB_ASTRO_TS,
    ];
    function makeParser(typeAware: boolean, files: string[], ignores?: string[]) {
        return {
            files,
            ...ignores ? { ignores } : {},
            languageOptions: {
                parser: parserTs,
                parserOptions: {
                    extraFileExtensions: componentExts.map(ext => `.${ext}`),
                    sourceType: 'module',
                    ...typeAware
                        ? {
                            projectService: {
                                allowDefaultProject: ['./*.js'],
                                defaultProject: tsconfigPath,
                            },
                            tsconfigRootDir: process.cwd(),
                        }
                        : {},
                    ...parserOptions as any,
                },
            },
            name: `typescript/${typeAware ? 'type-aware-parser' : 'parser'}`,
        };
    }

    return [
        {
            name: 'typescript/setup',
            plugins: {
                ts: pluginTs as any
            }
        },
        ...isTypeAware
            ? [
                makeParser(false, files),
                makeParser(true, filesTypeAware, ignoresTypeAware),
            ]
            : [
                makeParser(false, files),
            ],
        {
            files,
            name: 'typescript/rules',
            rules: {
                ...renameRules(
                    pluginTs.configs['eslint-recommended'].overrides![0].rules!,
                    { '@typescript-eslint': 'ts' }
                ),
                ...renameRules(
                    pluginTs.configs.strict.rules!,
                    { '@typescript-eslint': 'ts' }
                ),
                'no-dupe-class-members': 'off',
                'no-redeclare': 'off',
                'no-use-before-define': 'off',
                'no-useless-constructor': 'off',
                'ts/method-signature-style': ['error', 'property'],
                'ts/no-dupe-class-members': 'error',
                'ts/no-dynamic-delete': 'off',
                'ts/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
                'ts/no-explicit-any': 'off',
                'ts/no-extraneous-class': 'off',
                'ts/no-import-type-side-effects': 'error',
                'ts/no-invalid-void-type': 'off',
                'ts/no-non-null-assertion': 'off',
                'ts/no-redeclare': ['error', { builtinGlobals: false }],
                'ts/no-require-imports': 'error',
                'ts/no-unused-expressions': ['error', {
                    allowShortCircuit: true,
                    allowTaggedTemplates: true,
                    allowTernary: true,
                }],
                'ts/no-unused-vars': 'off',
                'ts/no-use-before-define': ['error', { classes: false, functions: false, variables: true }],
                'ts/no-useless-constructor': 'off',
                'ts/no-wrapper-object-types': 'error',
                'ts/triple-slash-reference': 'off',
                'ts/unified-signatures': 'off',
                ...(
                    type === 'lib' ?
                        {
                            'ts/explicit-function-return-type': ['error', {
                                allowExpressions: true,
                                allowHigherOrderFunctions: true,
                                allowIIFEs: true,
                            }]
                        }
                        : {}
                ),
                'arrow-body-style': ['off'],
                ...overrides
            }
        }
    ];
};
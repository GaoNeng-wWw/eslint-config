import { Linter } from 'eslint';
import { javascript } from './rules';
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks';
import { vue } from './rules/vue';
import { FlatConfigComposer } from 'eslint-flat-config-utils';
import { typescript } from './rules/typescript';
import { isPackageExists } from 'local-pkg';
import { ParserOptions } from '@typescript-eslint/parser';
import { ignore } from './rules/ignore';

export type Override = Record<string, string | number | any[]>
export type Option<T = object> = {
    override?: Override,
    enable?: boolean,
    option?: T
}
export interface VueOptions {
    override?: Record<string, any>,
    files?: string,
    typescript?: boolean,
    sfcBlocks?: boolean | VueBlocksOptions,
    vueVersion?: number,
    enable?: boolean
}
export type TypescriptOptions = {
    files?: string[],
    overrides?: Record<string, any>,
    type?: 'app' | 'lib',
    enable?: boolean,
    tsconfigPath?: string,
    parserOptions?: ParserOptions,
    componentExts?: string[],
    filesTypeAware?: string[],
    ignoresTypeAware?: string[]
}
export interface Options {
    javascript?: Option<{
        languageOptions?: Linter.Config['languageOptions'],
        linterOptions?: Linter.Config['linterOptions'],
        plugins?: Linter.Config['plugins'][]
    }>,
    vue?: VueOptions
    typescript?: TypescriptOptions,
    ignore?: {
        userIgnore?: string[]
    }
}

export type Awaitable<T> = T | Promise<T>

const VuePackages = [
    'vue',
    'nuxt',
    'vitepress',
    '@slidev/cli',
];

export const www = (
    options: Partial<Options> = {}
): FlatConfigComposer => {
    const {
        javascript: enableJavascript = true,
        vue: enableVue = VuePackages.some((p) => isPackageExists(p)),
        typescript: enableTypescript = isPackageExists('typescript'),
        ignore: enableIgnore = true
    } = options;
    const config: Awaitable<Linter.Config[]>[] = [];
    if (enableIgnore) {
        config.push(
            ignore(options.ignore?.userIgnore ?? [])
        );
    }
    if (enableJavascript) {
        config.push(
            javascript(options.javascript?.override ?? {})
        );
    }
    if (enableVue) {
        config.push(
            vue(options.vue)
        );
    }
    if (enableTypescript) {
        config.push(typescript(options.typescript));
    }
    const composer = new FlatConfigComposer();
    composer.append(
        ...config
    );
    composer.renamePlugins({
        '@eslint-react': 'react',
        '@eslint-react/dom': 'react-dom',
        '@eslint-react/hooks-extra': 'react-hooks-extra',
        '@eslint-react/naming-convention': 'react-naming-convention',

        '@stylistic': 'style',
        '@typescript-eslint': 'ts',
        'import-x': 'import',
        'n': 'node',
        'vitest': 'test',
        'yml': 'yaml',
    });
    return composer;
};
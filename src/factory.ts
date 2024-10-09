import { Linter } from "eslint";
import { javascript } from './rules';


export type Override = Record<string, string | number | any[]>
export type Option<T = {}> = {
    override?: Override,
    enable?: boolean,
    option: T
}
export interface Options {
    javascript: Option<{
        languageOptions?: Linter.Config['languageOptions'],
        linterOptions?: Linter.Config['linterOptions'],
        plugins?: Linter.Config['plugins'][]
    }>
}
export const www = (
    options: Partial<Options>
) => {
    const config: Linter.Config[] = [];
    if (options?.javascript?.enable) {
        config.push(
            ...javascript(options.javascript.override)
        )
    }
    return config;
}
import { typescript } from './configs/typescript';
import { Awaitable, OptionsConfig, TypedFlatConfigItem } from './types'
import {isPackageExists} from 'local-pkg';
import {FlatConfigComposer} from 'eslint-flat-config-utils';
import { Javascript } from './configs/javascript';

export * from './configs/typescript'

export const www = (
  option: OptionsConfig = {},
  ...userConfig: Awaitable<TypedFlatConfigItem[]>[]
) => {
  const {
    typescript: useTypescript = isPackageExists('typescript'),
    javascript: useJavascript,
    componentExts=[]
  } = option
  const configs: Awaitable<TypedFlatConfigItem[]>[] = [];
  if (useTypescript){
    configs.push(
      typescript({
        ...resolveSubOptions(option, 'typescript'),
        componentExts,
        overrides: getOverrides(option, 'typescript')
      })
    )
  }
  if (useJavascript){
    configs.push(
      Javascript({
        overrides: getOverrides(option, 'overrides')
      })
    )
  }
  let composer = new FlatConfigComposer();
  composer = composer.append(
    ...configs,
    ...userConfig
  )
  return composer;
}

export type ResolvedOptions<T> = T extends boolean
  ? never
  : NonNullable<T>

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === 'boolean'
    ? {} as any
    : options[key] || {}
}
export function getOverrides<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
) {
  const sub = resolveSubOptions(options, key)
  return {
    ...(options.overrides as any)?.[key],
    ...'overrides' in sub
      ? sub.overrides
      : {},
  }
}
export default www;
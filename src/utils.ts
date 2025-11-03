import { Linter } from 'eslint';
import { Awaitable, OptionsConfig } from './type';
import { RuleOptions } from './typegen';
import { isPackageExists } from 'local-pkg';
import { fileURLToPath } from 'url';

export function renameRules(
  rules: Record<string, any>,
  map: Record<string, string>,
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(rules)
      .map(([key, value]) => {
        for (const [from, to] of Object.entries(map)) {
          if (key.startsWith(`${from}/`)) {
            return [to + key.slice(from.length), value];
          }
        }
        return [key, value];
      }),
  );
}
export type ResolvedOptions<T> = T extends boolean
  ? never
  : NonNullable<T>;

export function isInEditorEnv(): boolean {
  if (process.env.CI) {
    return false;
  }
  if (isInGitHooksOrLintStaged()) {
    return false;
  }
  return !!(false
    || process.env.VSCODE_PID
    || process.env.VSCODE_CWD
    || process.env.JETBRAINS_IDE
    || process.env.VIM
    || process.env.NVIM
  );
}
export function isInGitHooksOrLintStaged(): boolean {
  return !!(false
    || process.env.GIT_PARAMS
    || process.env.VSCODE_GIT_COMMAND
    || process.env.npm_lifecycle_script?.startsWith('lint-staged')
  );
}

export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m;
  return (resolved as any).default || resolved;
}
export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === 'boolean'
    ? {} as any
    : options[key] || {} as any;
}
export function getOverrides<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): Partial<Linter.RulesRecord & RuleOptions> {
  const sub = resolveSubOptions(options, key);
  return {
    ...(options.overrides as any)?.[key],
    ...'overrides' in sub
      ? sub.overrides
      : {},
  };
}

const isCwdInScope = isPackageExists('@gaonengwww/eslint-config');
const scopeUrl = fileURLToPath(new URL('.', import.meta.url));

export function isPackageInScope(name: string): boolean {
  return isPackageExists(name, { paths: [scopeUrl] });
}

export async function ensurePackages(packages: (string | undefined)[]): Promise<void> {
  if (process.env.CI || process.stdout.isTTY === false || isCwdInScope === false) {
    return;
  }

  const nonExistingPackages = packages.filter(i => i && !isPackageInScope(i)) as string[];
  if (nonExistingPackages.length === 0) { return; }

  const p = await import('@clack/prompts');
  const result = await p.confirm({
    message: `${nonExistingPackages.length === 1 ? 'Package is' : 'Packages are'} required for this config: ${nonExistingPackages.join(', ')}. Do you want to install them?`,
  });
  if (result) {
    await import('@antfu/install-pkg')
      .then(i => i.installPackage(nonExistingPackages, { dev: true }));
  }
}

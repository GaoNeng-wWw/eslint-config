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
import path from "path";

export function decapitalize(s: string): string {
    if (!s) return s;
    return `${s[0].toLowerCase()}${s.substr(1)}`;
}

export function joinURL(base: string, newPath: string): string {
    const url = new URL(base);
    let oldPathname = url.pathname;
    if (!base.endsWith("/")) oldPathname = path.dirname(oldPathname);
    const pathname = path.join(oldPathname, newPath);
    return new URL(pathname, url.origin).href;
}

export function getCommandName(): string {
    return (process.argv[1] && process.argv[1].split("/").pop()) || "ghactions";
}

export function getVersionString(): string {
    const version = process.env.npm_package_version;
    if (version) return version;
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require("../package.json").version || "unknown";
    } catch {
        return "unknown";
    }
}

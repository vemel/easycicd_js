import chalk from "chalk";
import fs from "fs";

import { getHelp, Namespace, parseArgs } from "./cli";
import { WORKFLOW_NAMES } from "./constants";
import { readLocalWorkflows, readRemoteWorkflows } from "./manager";
import { runCheckAll } from "./runCheck";
import runUpdate from "./runUpdate";

async function main(): Promise<void> {
    let args: Namespace;
    try {
        args = parseArgs();
    } catch (e) {
        console.log(e.message);
        console.log("Use `--help` to know more");
        process.exit(1);
    }
    if (args.help) {
        console.log(getHelp());
        process.exit(0);
    }
    if (!fs.existsSync("./.github/workflows")) {
        console.warn(
            chalk.red(
                `✗  ${chalk.bold(
                    ".github/workflows"
                )} directory does not exist in current path`
            )
        );
        console.warn(
            chalk.yellow("✎  Probably this is not a GitHub repository root")
        );
        console.warn(
            chalk.yellow(
                `✎  If it is, create this directory with: ${chalk.bold(
                    "mkdir -p .github/workflows"
                )}`
            )
        );
        process.exit(1);
    }
    if (args.check) {
        const names = args.update.length ? args.update : WORKFLOW_NAMES;
        const result = await runCheckAll(names, args.ref);
        process.exit(result ? 0 : 1);
    }

    if (!args.update.length) {
        console.log(getHelp());
        process.exit(0);
    }

    console.log(
        chalk.grey(
            `Checking https://github.com/vemel/github_actions_js for workflow updates`
        )
    );
    const remoteContents = await readRemoteWorkflows(args.update, args.ref);
    const localContents = new Map(await readLocalWorkflows(args.update));
    remoteContents.forEach(([name, remoteContent]) => {
        const localContent = localContents.get(name) || null;
        runUpdate(name, localContent, remoteContent, args.force);
    });
}

if (typeof require !== "undefined" && require.main === module) {
    main();
}

export default main;

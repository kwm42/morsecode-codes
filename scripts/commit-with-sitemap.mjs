#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const run = (command, args) => {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: "inherit",
    shell: false,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const [, , ...rawMessageParts] = process.argv;

if (rawMessageParts.length === 0) {
  console.error("请提供提交信息，例如：npm run commit -- \"feat: 更新内容\"");
  process.exit(1);
}

const commitMessage = rawMessageParts.join(" ");

run("node", ["scripts/generate-sitemap.mjs"]);
run("git", ["add", "--all"]);
run("git", ["commit", "-m", commitMessage]);

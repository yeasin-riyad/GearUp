import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve("src");

function walk(dir) {
  for (const file of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, file.name);

    if (file.isDirectory()) {
      walk(full);
      continue;
    }

    if (!full.endsWith(".ts")) continue;

    let code = fs.readFileSync(full, "utf8");

    code = code.replace(
      /from\s+["']([^"']*\/config)\.js["']/g,
      (_, p1) => `from "${p1}/index.js"`
    );

    fs.writeFileSync(full, code);
  }
}

walk(SRC);

console.log("✅ Config imports updated.");
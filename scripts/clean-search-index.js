import { rmSync } from "node:fs";

// This is generated for local development and must not enter the next build.
rmSync("public/pagefind", { recursive: true, force: true });

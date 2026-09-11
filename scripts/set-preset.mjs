#!/usr/bin/env node
// Switches the active theme: writes the theme name into site.json, which
// app/layout.tsx reads at render/build time.
//
//   node scripts/set-preset.mjs foundry
//   pnpm dev / pnpm build   # re-skins the whole site, no component changes

import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const presetsDir = path.join(root, "presets")
const sitePath = path.join(root, "site.json")

const name = process.argv[2]
const available = readdirSync(presetsDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""))

if (!name || !available.includes(name)) {
  console.error(`Usage: node scripts/set-preset.mjs <name>`)
  console.error(`Available themes: ${available.join(", ")}`)
  process.exit(1)
}

const site = JSON.parse(readFileSync(sitePath, "utf8"))
site.theme = name
writeFileSync(sitePath, JSON.stringify(site, null, 2) + "\n")
console.log(`site.json theme <- "${name}"`)
console.log(`Preview every block in it at /blocks?theme=${name}`)

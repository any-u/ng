#!/usr/bin/env node
'use strict'

async function main() {
  await import("../dist/cli.mjs")
}

main().catch(console.error);
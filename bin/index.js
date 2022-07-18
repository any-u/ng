#!/usr/bin/env node
'use strict'

async function main() {
  await import("../dist/index.mjs")
}

main().catch(console.error);
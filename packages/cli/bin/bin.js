#!/usr/bin/env node

async function start() {
    const { read } = await import('../dist/cjs/index.js')
    return read()
}
start()
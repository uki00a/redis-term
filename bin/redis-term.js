#!/usr/bin/env node

const argv = process.argv.slice(2);
if (argv.includes('--version')) {
  const pkg = require('../package.json');
  console.log(pkg.version);
  process.exit(0);
}

require('../lib/index');

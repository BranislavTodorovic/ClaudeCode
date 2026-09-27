// Node on this Windows installation resolves an explicit test directory as a module.
// Keep the documented `node --test tests/` command running every test suite.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
for (const file of fs.readdirSync(__dirname).filter(name => name.endsWith('.test.js')).sort()) {
  require(path.join(__dirname, file));
}

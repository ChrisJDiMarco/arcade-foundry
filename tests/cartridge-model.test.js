'use strict';
const test = require('node:test'); const assert = require('node:assert/strict');
const { defaultCartridge } = require('../src/default-cartridge');
const { validateCartridge, injectCartridgeCsp, cloneRequest } = require('../src/cartridge-model');
test('factory cartridge validates', () => assert.equal(validateCartridge(defaultCartridge).title, 'Neon Bastion'));
test('networking is rejected', () => assert.throws(() => validateCartridge({ ...defaultCartridge, html: defaultCartridge.html.replace('</script>', 'fetch("https://bad.test")</script>') }), /blocked/));
test('CSP is inserted into cartridge head', () => assert.match(injectCartridgeCsp(defaultCartridge.html), /connect-src 'none'/));
test('clone language is held at the gate', () => assert.equal(cloneRequest('clone Pac-Man exactly'), true));

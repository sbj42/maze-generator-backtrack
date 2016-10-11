/* eslint-env node */
var webDemoAlgorithm = require('@sbj42/maze-generator-dev').webDemoAlgorithm;
var path = require('path');

webDemoAlgorithm('backtrack', path.join(__dirname, '../src/backtrack.js'), path.resolve('webdemo'));

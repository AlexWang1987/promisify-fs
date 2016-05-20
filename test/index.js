var pfs = require('../index.js');
var ok = require('assert');

pfs
  .addFolder('/Users/AlexWang/xx/ab/c')
  .then(function(fi) {
    console.log('d',fi);
  })
  .catch(function(e) {
    console.log('---->', e);
  })

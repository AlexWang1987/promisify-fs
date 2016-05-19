var pfs = require('../index.js');
var ok = require('assert');

pfs
  .delFolder('../ss',true)
  .then(function(fi) {
    console.log('e',fi);
  })
  .catch(function(e) {
    console.log('---->', e);
  })

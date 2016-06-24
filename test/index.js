var pfs = require('../index.js');
var ok = require('assert');

pfs
  .getModulePackInfo()
  .then(function (d) {
    console.log(d);
  })


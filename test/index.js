var pfs = require('../index.js');

pfs
  .writeFile('../inde1x.js','sd')
  .then(function(fi) {
    console.log('e',fi);
  })
  .catch(function(e) {
    console.log('---->', e);
  })

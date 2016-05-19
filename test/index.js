var pfs = require('../index.js');

pfs
  .readFile('../inde1x.js')
  .then(function(fi) {
    console.log(fi);
  })
  .catch(function(e) {
    console.log('---->', e);
  })

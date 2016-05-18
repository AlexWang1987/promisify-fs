var pfs = require('../index.js');

pfs
  .fileExists('../READM1E2.md')
  .then(function (fi){
    console.log(fi);
  })
  .catch(function(e) {
    console.log('---->',e);
  })

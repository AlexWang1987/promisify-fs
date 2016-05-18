var pfs = require('../index.js');

pfs
  .writeFile('../READM1E.md','dsfjlsd')
  .then(function (fi){
    console.log(fi);
  })
  .catch(function(e) {
    console.log('---->',e);
  })

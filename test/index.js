var pfs = require('../index.js');

pfs
  .writeFile('../README1.md','test data')
  .then(function (fi){
    console.log(fi);
  })
  .catch(function(e) {
    console.log(e);
  })

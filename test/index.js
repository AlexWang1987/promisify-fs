var pfs = require('../index.js');

pfs
  .cloneFolder('./source/', './dest')
  .then(function (d) {
    console.log(d);
  })


var pfs = require('../index.js');

pfs
// .delFolder('./source/1.xt')
// .delFolder('./source/folder/js.js', true)
// .cloneFolder('./source/*', './dest/')
// .delFolder('./dest')

  .then(function (d) {
    console.log('->', d);
  })
  .catch(function (e) {
    console.error('catch->', e);
  })


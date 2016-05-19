# promisify-fs
This is a 'fs' promising wrapper for file operations which contains various fs-related common tasks. it will make your code more concise and neat.

`promisify-fs` aims to make file operation more intuitive. in addition, to make code more concise and neat. All methods are constructed by following promising way.

# Usage
```javascript
var fs = require('promisify-fs');

fs
  .fileExists('../index.js')
  .then(function(stat){
    console.log(stat.abs_path);
    console.log(stat.size)
  })
  .catch(function(e){
    console.error(e);
  })

//many options in stat, please refer to
//https://nodejs.org/api/fs.html#fs_class_fs_stats

fs
  .folderExists('../node_modules')
  .then(function(abs_path){
    console.log(abs_path);
  })
  .catch(function(e){
    console.error(e);
  })

fs
  .readFile('../inde1x.js')
  .then(function(fi) {
    console.log(fi);
  })
  .catch(function(e) {
    console.log('---->', e);
  })

fs
  .writeFile('../inde1x.js')
  .then(function(fi) {
    console.log(fi);
  })
  .catch(function(e) {
    console.log('---->', e);
  })

```

# API
* fileExists(file_path)
* folderExists(file_path)
* readFile(file[, options])
* writeFile((file_path, data[, options])
    if data is neither  `Buffer` nor `String`, `JSON.stringify` will be applied with extra two optional params in options,[replacer][space]
*

continuing...

If you want to have all asynchronous methods operating file, please refer to [bluebird](http://bluebirdjs.com/docs/api/promise.promisifyall.html) library.

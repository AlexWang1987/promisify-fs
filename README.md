# promisify-fs
This is a 'fs' promising wrapper for file operations which contains various fs-related common tasks. it will make your code more concise and neat.

`promisify-fs` aims to make file operation more intuitive. in addition, to make code more concise and neat. all methods are constructed by following promising ways.

# Usage
```javascript
var fs = require('promisify-fs');

fs
  .existsFile('../index.js')
  .then(function(stat){
    console.log(stat.abs_path);
    console.log(stat.size)
  })
  .catch(function(e){
    console.error(e);
  })

//many options in stat, please refer to https://npm.taobao.org/mirrors/node/latest/docs/api/fs.html#fs_class_fs_stats

fs
  .existsFolder('../node_modules')
  .then(function(abs_path){
    console.log(abs_path);
  })
  .catch(function(e){
    console.error(e);
  })


```

# API
* existsFile(file_path)
* existsFolder(file_path)
* readFile(file[, options])
* writeFile((file_path, data[, options])
*

continuing...

If you want to have all asynchronous methods relating file, please refer to [bluebird](http://bluebirdjs.com/docs/api/promise.promisifyall.html) library.

# promisify-fs
This is a 'fs' promising wrapper for file operations which contains various fs-related common tasks. it will make your code more concise and neat.

`promisify-fs` aims to make file operation more intuitive. in addition, to make code more concise and neat. all methods are constructed by following promising ways.

# Usage
```javascript
var fs = require('promisify-fs');

fs
  .existsFile('../index.js')
  .then(function(fsState){
    //file exists
    /* file state
    {
      abs_path: '/user/xxx/promisify-fs/index.js'
      dev: 2114,
      ino: 48064969,
      mode: 33188,
      nlink: 1,
      uid: 85,
      gid: 100,
      rdev: 0,
      size: 527,
      blksize: 4096,
      blocks: 8,
      atime: Mon, 10 Oct 2011 23:24:11 GMT,
      mtime: Mon, 10 Oct 2011 23:24:11 GMT,
      ctime: Mon, 10 Oct 2011 23:24:11 GMT,
      birthtime: Mon, 10 Oct 2011 23:24:11 GMT
    }
     */
    console.log(abs_path);
  })
  .catch(function(e){
    console.error(e);
  })


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


If you want to have all asynchronous methods relating file, please refer to [bluebird](http://bluebirdjs.com/docs/api/promise.promisifyall.html) library.

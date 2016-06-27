# promisify-fs
This is a 'fs' promising wrapper for file operations which contains various fs-related common tasks. it will make your code more concise, neat and efficient.

`promisify-fs` aims to make file operation more intuitive. In addition, to make code more concise and neat. All methods are constructed by following promising way.

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
* folderExists(folder_path)
* readFile(file_path[, options])
* readJSON(file_path[,options])
* delFile(file_path)
* writeFile(file_path, data[, options])
* getModulePackInfo([module])

>    if data is neither  `Buffer` nor `String`, `JSON.stringify` will be applied with extra two optional params in options,[replacer][space]

* delFolder(folder_path[,force])

>    YOU KNOW WHAT YOU ARE DOING !!!!! forcely to delete all files in this folder recursively.

* addFolder(folder_path)

>   It will create folders recursively by default.

* cloneFolder(source_path,dest_path,force)

> clone folder or files within it to a dest folder.

continuing...

If you want to have all asynchronous methods operating file, please refer to [bluebird](http://bluebirdjs.com/docs/api/promise.promisifyall.html) library.

# Good Library Companions
* [promisify-cli](https://www.npmjs.com/package/promisify-cli)
* [promisify-bash](https://www.npmjs.com/package/promisify-bash)
* [promisify-fetch](https://www.npmjs.com/package/promisify-fetch)
* [promsifiy-git](https://www.npmjs.com/package/promisify-git)
* [promsifiy-npm](https://www.npmjs.com/package/promisify-npm)

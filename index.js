/**
 * Dependences
 */
var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');

/**
 * expose promisified fs
 */
var pfs = module.exports = {};

/**
 * The file specified by `file_path` must be exactly file
 * @param  string file_path file path
 * @return promise          promise
 */
pfs.fileExists = function(file_path) {
  return Promise.fromCallback(function(node_cb) {
      fs.stat(file_path, node_cb)
    })
    .then(function(stat) {
      if(stat.isFile()) {
        if(file_path[0] == '.') stat['abs_path'] = path.resolve(file_path)
        return stat
      }

      //file is not exactly the `file` type
      return null
    })
    .error(function(e) {
      if(e.code !== 'ENOENT') {
        //other potential erros, needed to be exposed out
        throw e.cause
      }

      //file does not exist
      return null
    })
}

/**
 * The file specified by `file_path` must be exactly folder
 * @param  string file_path file path
 * @return promise          promise
 */
pfs.folderExists = function(file_path) {
  return Promise.fromCallback(function(node_cb) {
      fs.stat(file_path, node_cb)
    })
    .then(function(stat) {
      if(stat.isDirectory()) {
        if(file_path[0] == '.') stat['abs_path'] = path.resolve(file_path)
        return stat
      }

      //file is not exactly the `folder` type
      return null
    })
    .error(function(e) {
      if(e.code !== 'ENOENT') {
        //other potential erros, needed to be exposed out
        throw e.cause
      }

      //folder does not exist
      return null
    })
}

/**
 * Read file content by `file_path` , warning: the file specified must be a exactly `file` type
 * @param  string file_path   relative / absolute path
 * @param  {[type]} options   more options, please refer to https://nodejs.org/api/fs.html#fs_fs_readfile_file_options_callback
 * @return promise
 */
pfs.readFile = function(file_path, options) {
  var options = options || {};
  options['encoding'] = options['encoding'] || 'utf8';

  return Promise.fromCallback(function(node_cb) {
    fs.readFile(file_path, options, node_cb)
  })
}

/**
 * Write data with `string` `buffer` `object` type to a file, it will override former file, so be cautious to verify if it exists ahead.
 * @param  string file_path   relative/absolute path
 * @param  {[type]} data      string or buffer are internally supported, if you pass a object, 'JSON.stringify' method will be applied.
 * @param  {[type]} options   more options, please refer to https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
 * @return promise
 */

pfs.writeFile = function(file_path, data, options) {
  var options = options || {};
  options['encoding'] = options['encoding'] || 'utf8';

  return Promise.try(function() {
      if(! (file_path && data)){
        throw '<file_path> , <data> are not all assigned.'
      }
    })
    .then(function(d) {
      Promise.fromCallback(function(node_cb) {
        //try to stringify
        if(!~['String', 'Buffer'].indexOf(data.constructor.name)) {
          data = JSON.stringify(data, options.replacer || null, options.space || null);
        }

        fs.writeFile(file_path, data, options, node_cb)
      })
    })
}

pfs.delFile = function(file_path) {

}

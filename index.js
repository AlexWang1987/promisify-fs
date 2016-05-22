/**
 * Dependences
 */
var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var bash = require('promisify-bash');
var ok = require('assert');

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
        stat['abs_path'] = path.resolve(file_path);
        return stat
      }

      //file is not exactly the `file` type
      return null
    })
    .error(function(e) {
      if(e.code == 'ENOENT') {
        //file does not exist
        return null
      }

      //other potential erros, needed to be exposed out
      throw e.cause
    })
}

/**
 * The file specified by `folder_path` must be exactly folder
 * @param  string folder_path file path
 * @return promise          promise
 */
pfs.folderExists = function(folder_path) {
  return Promise.fromCallback(function(node_cb) {
      fs.stat(folder_path, node_cb)
    })
    .then(function(stat) {
      if(stat.isDirectory()) {
        stat['abs_path'] = path.resolve(folder_path);
        return stat
      }

      //file is not exactly the `folder` type
      return null
    })
    .error(function(e) {
      //folder does not exist
      if(e.code == 'ENOENT') {
        return null
      }

      //other potential erros, needed to be exposed out
      throw e.cause
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
 * read file as JSON Object
 * @param  {string} file_path file
 * @param  {object} options
 * @return {promise}           json
 */
pfs.readJSON = function (file_path, options) {
  var options = options || {};
  options['encoding'] = options['encoding'] || 'utf8';

  return pfs
    .readFile(file_path)
    .then(JSON.parse)
}


/**
 * Write data with `string` `buffer` `object` type to a file, it will override former file, so be cautious to verify if it exists ahead.
 * @param  string file_path   relative/absolute path
 * @param  {string/object/buffer} data      string or buffer are internally supported, if you pass a object, 'JSON.stringify' method will be applied.
 * @param  {object} options   more options, please refer to https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
 * @return promise
 */

pfs.writeFile = function(file_path, data, options) {
  var options = options || {};
  options['encoding'] = options['encoding'] || 'utf8';

  return Promise.try(function() {
      if(!(file_path && data)) {
        throw '<file_path> , <data> are required.'
      }
    })
    .then(function(d) {
      return Promise.fromCallback(function(node_cb) {
        //try to stringify
        if(!~['String', 'Buffer'].indexOf(data.constructor.name)) {
          data = JSON.stringify(data, options.replacer || null, options.space || null);
        }

        fs.writeFile(file_path, data, options, node_cb)
      })
    })
}

/**
 * delete file
 * @param  {string} file_path
 * @return promise           return
 */
pfs.delFile = function(file_path) {
  return Promise.fromCallback(function(node_cb) {
    fs.unlink(file_path, node_cb);
  })
}

/**
 * YOU KNOW WHAT YOU ARE DOING !!!!!
 * @param  {string} folder_path [description]
 * @param  {boolean} force forcely to delete all files in this folder recursively.
 * @return promise
 */
pfs.delFolder = function(folder_path, force) {
  return Promise.fromCallback(function(node_cb) {
      fs.rmdir(folder_path, node_cb);
    })
    .error(function(e) {
      if(e.code == 'ENOTEMPTY' && force) {
        var abs_folder_path = path.resolve(folder_path);

        //!!!!! avoiding tragedy !!!!! YOU KNOW WHAT YOU ARE DOING.
        return bash('rm -rf ' + abs_folder_path)
      }

      throw e.cause
    })
}

/**
 * create a folder recursively
 * @param {string} folder_path relative or absolute are both supported
 * @return promise
 */

pfs.addFolder = function(folder_path) {
  return Promise.try(function() {
      //assertion
      ok(folder_path, 'folder_path is required.');

      //relative support
      return path.resolve(folder_path)
    })
    .then(function(abs_folder_path) {
      return bash('mkdir -p ' + abs_folder_path)
    })
}

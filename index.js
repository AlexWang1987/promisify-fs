/*eslint-disable*/

var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
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
pfs.fileExists = function (file_path) {
  return Promise.fromCallback(function (node_cb) {
      fs.stat(file_path, node_cb)
    })
    .then(function (stat) {
      if (stat.isFile()) {
        stat['abs_path'] = path.resolve(file_path);
        return stat
      }

      //file is not exactly the `file` type
      return null
    })
    .error(function (e) {
      if (e.code == 'ENOENT') {
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
pfs.folderExists = function (folder_path) {
  return Promise.fromCallback(function (node_cb) {
      fs.stat(folder_path, node_cb)
    })
    .then(function (stat) {
      if (stat.isDirectory()) {
        stat['abs_path'] = path.resolve(folder_path);
        return stat
      }

      //file is not exactly the `folder` type
      return null
    })
    .error(function (e) {
      //folder does not exist
      if (e.code == 'ENOENT') {
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
pfs.readFile = function (file_path, options) {
  var options = options || {};
  options['encoding'] = options['encoding'] || 'utf8';

  return Promise.fromCallback(function (node_cb) {
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

pfs.writeFile = function (file_path, data, options) {
  var options = options || {};
  options['encoding'] = options['encoding'] || 'utf8';

  return Promise.try(function () {
      if (!(file_path && data)) {
        throw '<file_path> , <data> are required.'
      }
    })
    .then(function (d) {
      return Promise.fromCallback(function (node_cb) {
        //try to stringify
        if (!~['String', 'Buffer'].indexOf(data.constructor.name)) {
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
pfs.delFile = function (file_path) {
  return Promise.try(function () {
    var result = shell.rm(('-f'), file_path);
    if (result.code) {
      throw result
    }
  });
}

/**
 * YOU KNOW WHAT YOU ARE DOING !!!!!
 * @param  {string} folder_path [description]
 * @param  {boolean} force forcely to delete all files in this folder recursively.
 * @return promise
 */
pfs.delFolder = function (folder_path, force) {
  return Promise.try(function () {
    var result = shell.rm('-r' + (force ? 'f' : ''), folder_path);
    if (result.code) {
      throw result
    }
  })
}

/**
 * clone Folder
 * @param  {string} source_folder
 * @param  {string} dest_folder
 * @param  {boolen} force         it will forcely overide dest-files
 * @return {promise}
 */
pfs.cloneFolder = function (source_folder, dest_folder, force) {
  return Promise.try(function () {
    var result = shell.cp('-r' + (force ? 'f' : 'n'), source_folder, dest_folder);
    if (result.code) {
      //Throw result
      console.log('cp shelljs bug still exists, whereas the task is done.');
    }
  })
}

/**
 * create a folder recursively
 * @param {string} folder_path relative or absolute are both supported
 * @return promise
 */

pfs.addFolder = function (folder_path) {
  return Promise.try(function () {
    var result = shell.mkdir('-p', folder_path);
    if (result.code) {
      throw result
    }
  })
}

/**
 * getModulePackInfo
 * @param  {string} [module] moudle is optional. default value is require.main module.
 * @return {Promise}
 */
pfs.getModulePackInfo = function (module) {
  return Promise.try(function () {
    //specified module
    var node_modules_paths = [];
    if (module && module.paths && module.paths.length) {
      node_modules_paths = module.paths;
    }

    //require main module
    if (!node_modules_paths.length) node_modules_paths = require.main.paths;

    return Promise
      .mapSeries(node_modules_paths, function (node_modules_path) {
        var pkg_file_path = path.resolve(node_modules_path, '../package.json');
        return pfs
          .fileExists(pkg_file_path)
          .then(function (file_stat) {
            if (file_stat) {
              throw file_stat; //target package is found. stop iteration.
            }
          })
      })
      .then(function () {
        throw 'Warning: The main module of process is not distributed by npm ecosystem.';
      })
      .catch(function (file_stat) {
        return pfs.readJSON(file_stat.abs_path);
      })
  })
}

/**
 * @method getModule
 * @param  {string}  module_abs_path
 * @return {npm module}
 */
pfs.getModule = function (module_abs_path) {
  //requireChildModule
  var childModuleExports = require(module_abs_path);
  //getChildModule
  var childModule = module.children.filter(function (module) {
    return module.id.indexOf(module_abs_path) === 0;
  })[0];
  return childModule;
}


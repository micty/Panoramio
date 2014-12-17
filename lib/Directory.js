

/**
* 目录工具
*/
module.exports = (function () {

    'use strict';

    var FS = require('fs');
    var Path = require('path');

    var $ = require('./MiniQuery');
    
    
    var Log = null;

    /**
    * 递归的获取指定目录下及子目录下的所有文件列表。
    */
    function getFiles(dir) {


        if (dir.slice(-1) != '/') { //确保以 '/' 结束，统一约定，不易出错
            dir += '/';
        }

        if (!Log) {
            Log = require('./Log');
        }

        Log.yellow('读取目录: {0}', dir);
        var list = FS.readdirSync(dir);

        var a = [];


        list.forEach(function (item, index) {

            item = dir + item;

            var stat = FS.statSync(item);

            if (stat.isDirectory()) {

                var list = getFiles(item); //递归
                a = a.concat(list);
            }
            else {
                a.push(item);
            }

        });

        return a;

    }




    function eachFile(dir, fn) {

        if (dir.slice(-1) != '/') { //确保以 '/' 结束，统一约定，不易出错
            dir += '/';
        }

        Log = Log || require('./Log');
        Log.yellow('读取目录: {0}', dir);

        FS.readdir(dir, function (error, list) {

            if (error) {
                Log.red('读取错误: {0}', dir);
                return;
            }

            list.forEach(function (item, index) {

                item = dir + item;

                FS.stat(item, function (error, stat) {

                    if (error) {
                        Log.red('读取错误: {0}', item);
                        return;
                    }

                    if (stat.isDirectory()) {
                        eachFile(item, fn); //递归
                    }
                    else {
                        fn && fn(item, stat);
                    }

                });
            });
            
        });


    }


    function root() {

        var path = process.cwd();
        path = path.replace(/\\/g, '/');
        return path + '/';
    }


    /**
    * 递归地创建目录及子目录。
    */
    function create(path) {

        var dir = path.slice(-1) == '/' ? path.slice(0, -1) :
                Path.dirname(path);

        if (FS.existsSync(dir)) { //已经存在该目录
            return;
        }

        var parent = Path.dirname(dir) + '/';

        if (!FS.existsSync(parent)) {
            create(parent);
        }
       
        FS.mkdirSync(dir);

        var Log = require('./Log');
        Log.yellow('创建目录: {0}', dir);

    }

    /**
    *递归地删除目录及子目录。
    */
    function remove(path) {

        var dir = path.slice(-1) == '/' ? path.slice(0, -1) :
                Path.dirname(path);


        if (!FS.existsSync(dir)) {
            return;
        }


        var files = [];
        files = FS.readdirSync(dir);

        files.forEach(function (file, index) {

            var path = dir + "/" + file;

            if (FS.statSync(path).isDirectory()) { // 删除

                remove(path);

            } else { // 删除文件

                FS.unlinkSync(path);
            }

        });

        FS.rmdirSync(dir);
        var Log = require('./Log');
        Log.yellow('删除目录: {0}', dir);
    }



    function format(path) {


        if (path.indexOf('./') == 0) {
            path = root() + path.slice(2);
        }
        else if (path.indexOf('/') == 0) {
            path = root() + path.slice(1);
        }

        var args = [].slice.call(arguments, 1);
        args = [path].concat(args);

        return $.String.format.apply(null, args);
    }




    return {
        getFiles: getFiles,
        eachFile: eachFile,
        root: root,
        create: create,
        remove: remove,
        format: format
    };



})();


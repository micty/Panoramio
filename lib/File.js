

/**
* 文件工具
*/
module.exports = (function () {

    'use strict';

    var FS = require('fs');
    var Path = require('path');

    var $ = require('./MiniQuery');
    var Directory = require('./Directory');
    var Log = require('./Log');

    

    function write(path, text, noLog) {

        Directory.create(path);

        FS.writeFileSync(path, text);

        if (!noLog) {
            Log.yellow('写入文件: {0}', path);
        }
    }

    function read(path) {
        
        Log.yellow('读取文件: {0}', path);

        if (exists(path)) {
            return FS.readFileSync(path);
        }
        else {
            Log.red('不存在文件: {0}', path);
            return null;
        }
    }

    function exists(path) {
        return FS.existsSync(path);
    }


    function append(path, content) {
        Directory.create(path);
        FS.appendFileSync(path, content);
    }

    function remove(path) {

        if (!exists(path)) {
            return;
        }

        FS.unlinkSync(path);
        Log.yellow('删除文件: {0}', path);
    }



    function readJSON(path) {

        var json = read(path);
        if (!json) {
            return null;
        }

        try {
            json = json.toString();
            return JSON.parse(json);
        }
        catch (ex) {
            Log.red('解析 JSON 发生错误: path={0}, message={1}', ex.message, path);
            return null;
        }

    }


    function writeJSON(path, json, merged) {

        if (typeof json == 'string') { //统一输出格式
            json = JSON.parse(json);
        }

        if (merged) { //指定了要合并原来的
            var obj = readJSON(path);
            if (obj) {
                json = $.Object.extendDeeply(obj, json);
            }
        }

        json = JSON.stringify(json, null, 4);

        write(path, json);

        
    }



    return {
        write: write,
        read: read,
        exists: exists,
        readJSON: readJSON,
        writeJSON: writeJSON,
        append: append,
        remove: remove,
    };



})();


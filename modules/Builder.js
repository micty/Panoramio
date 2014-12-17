



module.exports = (function () {


    var $ = require('../lib/MiniQuery');
    var File = require('../lib/File');
    var Directory = require('../lib/Directory');
    var DictionaryList = require('../lib/DictionaryList');

    var User = require('./User');
    var Page = require('./Page');
    var Photo = require('./Photo');
    var Image = require('./Image');


    //默认配置
    var config = {};


    //对数组去重
    function unique(array) {

        var obj = {};

        return $.Array.map(array, function (item, index) {

            if (obj[item]) {
                return null;
            }

            obj[item] = true;
            return item;
        });
    }

    //移除 json 中指定的 keys
    function remove(json, keys) {

        $.Array.each(keys, function (key, index) {
            json[key] = undefined;
        });
    }


    /**
    * 读取 JSON 文件。
    */
    function readJSON(id, name) {

        var path = config.path[name];
        path = $.String.format(path, { id: id });
        return File.readJSON(path);

    }

    /**
    * 写入 JSON 文件。
    */
    function writeJSON(id, name, json) {
        
        if (arguments.length == 2) {
            json = name;
            name = id;
            id = '';
        }

        var path = config.path[name];
        path = $.String.format(path, { id: id });
        File.writeJSON(path, json);
    }


    /**
    * 从指定的对象中获取指定键的对象值；
    * 如果不存在，则分配一个。
    */
    function getObject(key$obj, key) {

        var obj = key$obj[key];
        if (!obj) {
            obj = key$obj[key] = {};
        }

        return obj;
    }

    /**
    * 从指定的对象中获取/设置指定键列表的值。
    */
    function namespace(obj, keys, value) {

        // get 操作
        if (arguments.length == 2) {

            for (var i = 0, len = keys.length; i < len; i++) {

                var key = keys[i];

                obj = obj[key];

                if (i == len - 1) {
                    return obj;
                }

                if (!obj) {
                    return;
                }
            }
        }

        // set 操作
        for (var i = 0, len = keys.length; i < len; i++) {

            var key = keys[i];

            if (i == len - 1) {
                obj[key] = value;
                return value;
            }
            
            if (obj[key]) {
                obj = obj[key];
            }
            else {
                obj = obj[key] = {};
            }
            
        }

    }


    function push(obj, keys, value) {

        if (!(keys instanceof Array)) {
            keys = [keys];
        }

        var a = namespace(obj, keys);
        if (a) {
            if (a instanceof Array) { // a 已经是一个数组，则添加进去
                a.push(value);
            }
            else { // a 是一个已存在的 value，则合并成数组
                namespace(obj, keys, [a, value]);
            }
        }
        else { //不存在，新分配
            namespace(obj, keys, value);
        }
    }



    /**
    * 构建全部数据成一个 JSON 对象。
    */
    function buildAll(id) {

        var json = User.readJSON(id);
        if (!json) {
            return;
        }

        var dicts = new DictionaryList();

        dicts.add('tag', json.tags);    //
        json.tags = undefined;          //去掉

        var count = json.pageCount;

        var page$ids = json.page$ids = {};
        var id$photo = json.id$photo = {};

        for (var no = 1; no <= count; no++) {

            var pg = Page.readJSON(id, no, count);
            if (!pg) {
                continue;
            }

            var ids = pg.ids || [];
            page$ids[no] = ids;

            $.Array.each(ids, function (id, index) {

                var pt = Photo.readJSON(id);
                if (!pt) {
                    return;
                }

                var takenDateTime = pt.takenTime.split(' ');
                pt.takenDate = takenDateTime[0];
                pt.takenTime = takenDateTime[1];
                pt.uploadDate = pt.uploadTime;

                dicts.replace(pt, [
                    'title',
                    'uploadDate',
                    'takenDate',
                    'place',
                    'camera',
                    'exposure',
                    'focalLength',
                    'fstop',
                    'isoSpeed',
                ]);

                pt.tags = dicts.add('tag', pt.tags);

                //去掉这些项
                remove(pt, ['id', 'userId', 'uploadTime']);

                id$photo[id] = pt;
            });

        }

        json.dictionary = dicts.toObject();

        if (config.write.all) {
            writeJSON(id, 'all', json);
        }

        return json;

    }


    /**
    * 按相机名称、拍照日期和拍照时间对照片 id 进行归类。
    * @param {string} id 用户 id。
    * @return {Object} 返回一个归类的后 JSON 对象。
    */
    function assort(id) {

        var json = readJSON(id, 'all') || buildAll(id);
        if (!json) {
            return;
        }

        var pageCount = json['pageCount'];
        var no$ids = json['page$ids'];
        var id$photo = json['id$photo'];
        var cameras = json['dictionary']['camera'];
        var dates = json['dictionary']['takenDate'];

        var camera$obj = {};

        for (var no = 1; no <= pageCount; no++) { //迭代每一页

            var ids = no$ids[no]; //当前页的照片 id 列表

            $.Array.each(ids, function (id, index) {

                var pt = id$photo[id];

                var keys = [
                    cameras[pt.camera], //相机名称
                    dates[pt.takenDate],//拍照日期
                    pt.takenTime        //拍照时间
                ];

                push(camera$obj, keys, id);

            });

        }

        if (config.write.assort) {
            writeJSON(id, 'assort', camera$obj);
        }

        return camera$obj;

    }

    /**
    * 根据相机、拍照日期和拍照时间查找重复的照片 id。
    * @param {string} id 用户 id。
    * @return {Object} 返回一个归类的后 JSON 对象。
    */
    function repeat(id) {
        
        var json = assort(id);

        var all = {};

        $.Object.each(json, function (camera, date$obj) {

            $.Object.each(date$obj, function (date, time$id) {

                $.Object.each(time$id, function (time, ids) {

                    if (ids instanceof Array && ids.length >= 2) {

                        namespace(all, [camera, date, time], ids);
                    }
                });
            });

        });

        if (config.write.repeat) {
            writeJSON(id, 'repeat', all);
        }

        return all;
    }



    /**
    * 获取指定用户照片与指定目录下文件的存在映射关系。
    * @param {string} id 用户 id。
    * @param {string} dir 完整的目录名。
    * @return {Object} 返回关于该用户照片映射到目录下所有文件的描述对象。
    */
    function exist(id, dir) {

        var json = assort(id);
        var file$basicExif = basicExif(dir);

        
        var id$file = {};
        var file$id = {};

        var files = Directory.getFiles(dir);
        
        $.Array.each(files, function (file, index) {

            var ext = file.slice(-4).toUpperCase();
            if (ext != '.JPG') {
                return;
            }

            var basicExif = namespace(file$basicExif, file.split('/'));

            // id 可能是个数组
            var id = basicExif ? namespace(json, [
                basicExif.camera,
                basicExif.date,
                basicExif.time]) : null;

            push(file$id, file.split('/'), id || null);

            if (!id) {
                return;
            }


            if (id instanceof Array) {
                $.Array.each(id, function (id) {
                    push(id$file, id, file);
                });
            }
            else {
                push(id$file, id, file);
            }

            
        });

        return {
            'id$file': id$file,
            'file$id': file$id
        };
        
    }



    /**
    * 获取指定用户照片与指定目录下文件的不存在的映射关系。
    * @param {string} id 用户 id。
    * @param {string} dir 完整的目录名。
    * @return {Object} 返回关于该用户照片映射到目录下所有文件的描述对象。
    */
    function noExist(id, dir) {

        var json = assort(id);
        var file$basicExif = basicExif(dir);


        var dir$name = {};

        var files = Directory.getFiles(dir);

        $.Array.each(files, function (file, index) {

            var ext = file.slice(-4).toUpperCase();
            if (ext != '.JPG') {
                return;
            }

            var basicExif = namespace(file$basicExif, file.split('/'));


            // id 可能是个数组
            var id = basicExif ? namespace(json, [
                basicExif.camera,
                basicExif.date,
                basicExif.time]) : null;

            if (id) {
                return;
            }

            var keys = file.split('/');
            push(dir$name, keys.slice(0, -1), keys.slice(-1)[0]);

        });

        return dir$name;

    }

    /**
    * 提取完整的 EXIF 信息。
    * @param {string} dir 完整的目录名。
    * @return {Object} 返回关于该目录下所有文件的完整 EXIF 信息的描述对象。
    */
    function exif(dir) {

        var path = config.path.exif;

        var json = File.readJSON(path) || {};

        var files = Directory.getFiles(dir);
        $.Array.each(files, function (file, index) {

            var keys = file.split('/');
            var exif = namespace(json, keys);

            if (exif === undefined) {
                exif = Image.getExif(file);
                namespace(json, keys, exif);
            }

        });

        if (config.write.exif) {
            writeJSON('exif', json);
        }

        return json;


    }

    /**
    * 提取基本的 EXIF 信息。
    * @param {string} dir 完整的目录名。
    * @return {Object} 返回关于该目录下所有文件的基本 EXIF 信息的描述对象。
    */
    function basicExif(dir) {

        var path = config.path.basicExif;
        var json = File.readJSON(path) || {};

        var files = Directory.getFiles(dir);

        $.Array.each(files, function (file, index) {

            var keys = file.split('/');
            var exif = namespace(json, keys);
            if (exif === undefined) {
                exif = Image.getBasicExif(file);
                namespace(json, keys, exif);
            }

        });

        if (config.write.basicExif) {
            writeJSON('basicExif', json);
        }

        return json;
    }


    return {
        buildAll: buildAll,

        assort: assort,
        repeat: repeat,
        exist: exist,
        noExist: noExist,

        exif: exif,
        basicExif: basicExif,

        config: function (obj) {
            $.Object.extend(config, obj);
        },

        readJSON: readJSON,
        writeJSON: writeJSON,
    };



})();
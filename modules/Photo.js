



module.exports = (function () {


    var $ = require('../lib/MiniQuery');
    var Directory = require('../lib/Directory');
    var File = require('../lib/File');
    var Log = require('../lib/Log');
    var Request = require('../lib/Request');


    


    var info$tag = {
        'camera': 'Camera:',
        'takenTime': 'Taken on',
        'exposure': 'Exposure:',
        'focalLength': 'Focal Length:',
        'fstop': 'F/Stop:',
        'isoSpeed': 'ISO Speed:',
        'exposureBias': 'Exposure Bias:',
    };

    var name$month = {
        'January': 1,
        'February': 2,
        'March': 3,
        'April': 4,
        'May': 5,
        'June': 6,
        'July': 7,
        'August': 8,
        'September': 9,
        'October': 10,
        'November': 11,
        'December': 12,
    };

    var name$method = {
        '': '',
        '': ''
    };

    //获取照片的 id
    function getId(html) {
        var tag0 = '<link rel="canonical" href="http://www.panoramio.com/photo/';
        var tag1 = '" />';
        return $.String.between(html, tag0, tag1);
    }

    //获取用户 id
    function getUserId(html) {
        html = $.String.between(html, '<div id="profile_name">', '?with_photo_id=');
        var a = html.match(/\d+/g);
        var id = a[0];
        return id;
    }

    //获取照片标题
    function getTitle(html) {

        html = $.String.between(html, '<title>', '</title>');
        html = $.String.between(html, 'Panoramio - Photo of ', '\n');
        return html;
    }

    //获取照片是否被选中
    function getSelected(html) {

        html = $.String.between(html, '<div class="photo-page-earth-status">', '</div>');
        return html.indexOf('Selected for Google Maps and Google Earth') > 0;
    }

    //获取照片拍摄地点描述
    function getPlace(html) {
        html = $.String.between(html, '<p id="place">', '</p>');
        html = $.String.between(html, 'Photo taken in ', '\n');
        return html;
    }

    //获取标签列表
    function getTags(html) {
        html = $.String.between(html, '<ul id="interim-tags">', '<li id="show_all_tags">');
        var a = html.split('a>');

        a = $.Array.map(a, function (item, index) {

            var a = item.split('<a');

            var html = a[1];
            if (!html) {
                return null;
            }

            var tag = $.String.between(html, '">', '</');
            tag = tag.replace(/\n+/g, '');
            return $.String(tag).trimStart().trimEnd().valueOf();
        });

        return a;
    }

    //获取纬度
    function getLatitude(html) {
        return $.String.between(html, '<abbr class="latitude" title="', '">');
    }

    //获取经度
    function getLongitude(html) {
        return $.String.between(html, '<abbr class="longitude" title="', '">');
    }

    //获取附近的照片 id 列表
    function getNearbyIds(html) {
        html = $.String.between(html, '<div id="nearby_photos">', '</a></div>');
        if (!html) {
            return [];
        }

        var ids = html.match(/\/photo\/\d+/g);
        return ids.map(function (item, index) {
            return item.replace('/photo/', '');
        });
    }

    

    //获取照片的上传时间
    function getUploadTime(html) {

        var html0 = html;

        try {

            html = $.String.between(html, '<ul id="details">', '</li>');

            //处理
            //Uploaded on August 2, 2013
            //Uploaded on November 10
            if (html.indexOf('Uploaded on ') > 0) {

                html = $.String.between(html, 'Uploaded on ', '\n');
                html = html.replace(/,/g, ''); //去掉可能存在的逗号

                var a = html.split(' ');

                var month = name$month[a[0]];
                var day = parseInt(a[1]);
                var year = parseInt(a[2]) || (new Date().getFullYear());

                var dt = new Date(year, month - 1, day);

                if (isNaN(dt.getTime())) { //非法日期
                    return '';
                }

                dt = $.Date.format(dt, 'yyyy-MM-dd');
                return dt;
            }

            //处理
            //Uploaded 30 minutes ago
            //Uploaded 3 hours ago
            if (html.indexOf('Uploaded ')> 0 && html.indexOf(' ago') > 0) {

                html = $.String.between(html, 'Uploaded ', ' ago'); //30 minutes

                var a = html.split(' ');    //['30', 'minutes']
                var value = parseInt(a[0]); //30
                var name = $.String.toCamelCase('add-' + a[1]); //addMinutes

                var dt = $.Date[name](new Date(), 0 - value);
                dt = $.Date.format(dt, 'yyyy-MM-dd');

                return dt;
            }
        }
        catch (ex) {
            var id = getId(html0);
            Log.red('解析照片上传时间错误: id={0}, message={1}', id, ex.message);
        }

        return '';

    }

    //获取全部信息
    function getInfos(html) {

        var obj = $.Object.map(info$tag, function (key, value) {
            return $.String.between(html, '<li>' + value + ' ', '</li>');
        });

        return $.Object.extend({
            'id': getId(html),
            'userId': getUserId(html),
            'title': getTitle(html),
            'selected': getSelected(html),
            'latitude': getLatitude(html),
            'longitude': getLongitude(html),
            'uploadTime': getUploadTime(html),
            'place': getPlace(html),
            'nearbyIds': getNearbyIds(html),
            'tags': getTags(html),

        }, obj);

    }



    //默认配置
    var config = {};


    /**
    * 构造器。
    */
    function Photo(id) {

        var meta = {
            'id': id
        };

        $.Object.extend(meta, {
            'url': $.String.format(config.url, meta),
            'htmlPath': $.String.format(config.path.html, meta),
            'jsonPath': $.String.format(config.path.json, meta),
        });

        this.meta = meta;
        this.id = id;
    }


    Photo.prototype = { //实例方法
        constructor: Photo,

        /**
        * 发起 GET 网络请求以获取页面信息。
        * @param {function} fn 请求成功后的回调函数。
        * 参数 fn 会接受到一个信息的对象作为其参数。
        */
        get: function (fn) {

            var self = this;
            var meta = this.meta;

            if (config.cache) {//指定了使用缓存
                var json = Photo.readJSON(meta.id);
                if (json) {
                    if (fn) {
                        fn.call(self, json); //让 fn 里的 this 指向当前实例
                    }
                    return;
                }
            }

            Request.get(meta.url, function (html) {

                if (config.write.html) { //写入 html 文件
                    File.write(meta.htmlPath, html);
                }

                var json = getInfos(html);

                if (config.write.json) {
                    File.writeJSON(meta.jsonPath, json);
                }

                if (fn) {
                    fn.call(self, json); //让 fn 里的 this 指向当前实例
                }

            });

        },

        /**
        * 移除本照片的所有数据。
        */
        clear: function () {
            var meta = this.meta;
            File.remove(meta.htmlPath);
            File.remove(meta.jsonPath);
        }
    };





    return $.Object.extend(Photo, { //静态方法

        create: function (id) {
            return new Photo(id);
        },

        config: function (obj) {
            $.Object.extend(config, obj);
        },

        /**
        * 移除指定 id 的照片的所有数据。
        */
        clear: function (id) {

            var data = {
                id: id
            };

            var path = $.String.format(config.path.html, data);
            File.remove(path);

            path = $.String.format(config.path.json, data);
            File.remove(path);
        },

        /**
        * 发起 GET 网络请求以获取指定照片的信息。
        * 请求完成后会执行指定的回调函数。
        */
        get: function (id, fn) {

            var photo = new Photo(id);
            photo.get(fn);
            return photo;
        },

        readJSON: function (id) {

            var path = $.String.format(config.path.json, { id: id });
            return File.readJSON(path);

        },

    });



})();
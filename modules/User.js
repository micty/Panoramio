



module.exports = (function () {


    var $ = require('../lib/MiniQuery');
    var File = require('../lib/File');
    var Log = require('../lib/Log');
    var Request = require('../lib/Request');




    //获取用户姓名
    function getName(html) {
        return $.String.between(html, '<title>Panoramio - Photos by ', '\n');
    }
    
    //获取用户描述
    function getDescription(html) {
        return $.String.between(html, 'class="open-quote-img">', '<img alt=""');
    }

    //获取标签列表
    function getTags(html) {

        var lines = html.split('\n');
        
        var tags = $.Array.map(lines, function (item, index) {

            if ((/\/user\/\d+\/tags\//).test(item)) {
                return $.String.between(item, '">', '</a>');
            }

            return null;
        });

        return tags;
    }

    //获取统计数
    function getStats(html) {

        var stats = html.match(/<a href="\/user\/\d+\/stats">\d+<\/a>/g);

        stats = stats.map(function (item, index) {
            var a = item.match(/\d+/g);
            return parseInt(a[1]);
        });

        return stats;
    }

    //获取总页数
    function getPageCount(html) {

        var pageNos = html.match(/photo_page=\d+"/g);

        pageNos = pageNos.map(function (item, index) {
            var a = item.match(/\d+/g);
            return parseInt(a[0]);
        });


        return $.Array.max(pageNos);
    }


    //获取全部信息
    function getInfos(html) {
        
        return {
            'id': '', //先占位，后面会补上(主要考虑到输出的 json 格式上)
            'name': getName(html),
            'description': getDescription(html),
            'pageCount': getPageCount(html),
            'stats': getStats(html),
            'tags': getTags(html),
        };
    }


    //默认配置
    var config = {};


    /**
    * 构造器。
    */
    function User(id) {

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



    User.prototype = { //实例方法
        constructor: User,

        /**
        * 发起 GET 网络请求以获取用户信息。
        * @param {function} fn 请求成功后的回调函数。
        * 参数 fn 会接受到一个信息的对象作为其参数。
        */
        get: function (fn) {

            var self = this;
            var meta = this.meta;

            Request.get(meta.url, function (html) {

                var json = getInfos(html);
                json.id = meta.id;

                if (config.write.html) {
                    File.write(meta.htmlPath, html);
                }

                if (config.write.json) {
                    self.writeJSON(json);
                }
                
                if (fn) {
                    fn.call(self, json); //让 fn 里的 this 指向当前实例
                }

            });

        },


        readJSON: function () {

            var meta = this.meta;
            var path = meta.jsonPath;

            return File.readJSON(path);

        },

        /**
        * 把指定的数据写入到 json 文件中。
        * @param {Object} json 要写入的 json 数据对象。
        */
        writeJSON: function (json) {

            var meta = this.meta;
            var path = meta.jsonPath;

            json.id = meta.id; //确保 id 正确

            File.writeJSON(path, json);

        },

        /**
        * 移除本用户的所有数据。
        */
        clear: function () {
            var meta = this.meta;
            File.remove(meta.htmlPath);
            File.remove(meta.jsonPath);
        }
    };



    return $.Object.extend(User, { //静态方法

        create: function (id) {
            return new User(id);
        },

        config: function (obj) {
            $.Object.extend(config, obj);
        },

        /**
        * 移除指定 id 的用户的所有数据。
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
        * 发起 GET 网络请求以获取指定用户的信息。
        * 请求完成后会执行指定的回调函数。
        */
        get: function (id, fn) {

            var usr = new User(id);
            usr.get(fn);
            return usr;
        },

        readJSON: function (id) {

            var path = $.String.format(config.path.json, { id: id });
            var json = File.readJSON(path);
            return json;

        },

    });


})();
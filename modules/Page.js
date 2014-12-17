



module.exports = (function () {


    var $ = require('../lib/MiniQuery');
    var File = require('../lib/File');
    var Directory = require('../lib/Directory');
    var Request = require('../lib/Request');


    //获取总页数
    function getPageCount(html) {

        var pageNos = html.match(/photo_page=\d+">/g);

        pageNos = pageNos.map(function (item, index) {
            var a = item.match(/\d+/g);
            return parseInt(a[0]);
        });


        var max = $.Array.max(pageNos);

        //先选出最大的的页码，但如果当前页是最后一页，还要继续匹配。
        var tag0 = $.String.format('photo_page={0}">{0}</a>', max);
        var tag1 = '</div>';
        html = $.String.between(html, tag0, tag1);

        var a = html.match(/<span class="selected">\d+<\/span>/g); //当前页
        if (a) { //当前页是最后一页
            max = a[0].match(/\d+/g);
            max = parseInt(max);
        }

        return max;
    }

    //获取所有的照片 id 列表
    function getIds(html) {

        var a = $.String.between(html, 'var photo_ids = [', '];');
        a = a.match(/\d+/g);

        return a;
    }

    //获取指定 id 的照片标题
    function getTitle(id, html) {

        var tag0 = 'src="http://mw2.google.com/mw-panoramio/photos/medium/' + id;
        var tag1 = 'alt="';
        html = $.String.between(html, tag0, tag1);
        html = $.String.between(html, 'title="', '"');

        return html;

    }

    //判断指定 id 的照片是否给 Google 地球和 Google 地图选中
    function getSelected(id, html) {

        var tag0 = 'src="http://mw2.google.com/mw-panoramio/photos/medium/' + id;
        var tag1 = '<div class="thumb-overlay-icon"><a';
        html = $.String.between(html, tag0, tag1);

        return html.indexOf('<div class="thumb-overlay-icon"><img') > 0;

    }

    //按标签对照片 id 进行归类
    function getTag$Ids(html) {

        html = $.String.between(html, 'var photosByTag = {', '};');
        var obj = new Function('return {' + html + '};')();
        return obj;
    }

    //按照片 id 对标签进行归类
    function getId$Tags(html) {

        html = $.String.between(html, 'var tagsByPhoto = {', '};');
        var obj = new Function('return {' + html + '};')();

        return obj;
    }



    //默认配置
    var config = {};



    /**
    * 构造器。
    * @param {string} id 用户 id。
    * @param {number} no 页码。
    */
    function Page(id, no, count) {

        var meta = {
            'id': id,
            'no': no,
            'count': count || 0,
            'sn': no - count,
        };

        $.Object.extend(meta, {
            'url': $.String.format(config.url, meta),
            'htmlPath': $.String.format(config.path.html, meta),
            'jsonPath': $.String.format(config.path.json, meta),
        });

        this.meta = meta;
        this.no = no;
        

    }





    Page.prototype = { //实例方法
        constructor: Page,


        /**
        * 发起 GET 网络请求以获取页面信息。
        * @param {function} fn 请求成功后的回调函数。
        * 参数 fn 会接受到一个信息的对象作为其参数。
        */
        get: function (fn) {

            var self = this;
            var meta = this.meta;
            var count = meta.count;

            if (config.cache && count > 0) {//指定了使用缓存，并且给定了总页数
                var json = Page.readJSON(meta.id, meta.no, count);
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
                

                var ids = getIds(html);
                var id$tags = getId$Tags(html);
                var tag$ids = getTag$Ids(html);

                var id$photo = {};

                $.Array.each(ids, function (id, index) {
                    id$photo[id] = {
                        'selected': getSelected(id, html),
                        'title': getTitle(id, html),
                        'tags': id$tags[id] || [],
                    };
                })

                var json = {
                    'userId': meta.id,      //用户 id
                    'pageNo': meta.no,      //当前页码
                    'pageCount': getPageCount(html), //总页数，以最新获取到的为准
                    'ids': ids,
                    'id$photo': id$photo,
                    'tag$ids': tag$ids,
                };

                if (config.write.json) { //写入 json 文件

                    var path = $.String.format(config.path.json, {
                        'id': meta.id,
                        'sn': meta.no - json.pageCount
                    });

                    File.writeJSON(path, json);

                }

                if (fn) {
                    fn.call(self, json); //让 fn 里的 this 指向当前实例
                }

            });
        },


        /**
        * 移除本页的所有数据。
        */
        clear: function () {
            var meta = this.meta;
            File.remove(meta.htmlPath);
            File.remove(meta.jsonPath);
        }
    };



    return $.Object.extend(Page, { //静态方法

        create: function (id, no) {
            return new Page(id, no);
        },

        config: function (obj) {
            $.Object.extend(config, obj);
        },

        /**
        * 移除指定用户的所有数据。
        */
        clear: function (userId) {

            var data = {
                id: userId,
                no: '0'
            };

            var path = $.String.format(config.path.html, data);
            Directory.remove(path);

            path = $.String.format(config.path.json, data);
            Directory.remove(path);
            
        },

        /**
        * 发起 GET 网络请求以获取指定用户指定页码的信息。
        * 请求完成后会执行指定的回调函数。
        */
        get: function (config) {

            var id = config.id;
            var no = config.no;
            var count = config.count;
            fn = config.fn;

            var page = new Page(id, no, count);
            page.get(fn);

            return page;
        },


        readJSON: function (id, no, count) {

            var path = $.String.format(config.path.json, {
                'id': id,
                'sn': no - count,
            });

            return File.readJSON(path);

        },

        /**
        * 把指定的字符串解析成指定范围内的页码列表。
        * @param {string} text 要进行解析的字符串。
        *   支持类似: '1-2, 5, 6, 8-12, 12n, 15n' 这样的格式。
        * @param {number} max 总页数，即不超过此值。
        * @return {Array} 返回解析后的页码数组。
        */
        resolve: function (text, max) {

            var resolve = arguments.callee; //引用自身，用于递归

            // '1-2, 5, 6, 8-12, 12n, 15n'
            if (text.indexOf(',') > 0) {

                var a = text.split(',');
                a = $.Array.keep(a, function (item, index) {

                    if ((/^\d+$/g).test(item)) { //纯数字的
                        return parseInt(item);
                    }

                    return resolve(item, max);
                });

                a = $.Array.reduceDimension(a); //降维
                return $.Array.unique(a);

            }


            if (text.indexOf('n') >= 0) {

                var a = text.split('n');
                var k = parseInt(a[0]) || 1;     //倍数  
                var d = parseInt(a[1] || 0);//增量
                
                a = [];

                var isMinus = k < 0;
                k = Math.abs(k);

                for (var n = 1; n <= max; n++) {

                    var item = k * n + d;
                    if (item > max || item < 1) {
                        continue;
                    }

                    a.push(item);
                }
                
                if (isMinus) {
                    a.reverse();
                }

                return a;

            }

            if (text.indexOf('-') > 0) {
                var a = text.split('-');
                var start = parseInt(a[0]);
                var end = parseInt(a[1]);

                a = [];

                if (start < end) {
                    end = Math.min(end, max);
                    for (var n = start; n <= end; n++) {
                        a.push(n);
                    }
                }
                else {
                    start = Math.min(start, max);
                    for (var n = start; n >= end; n--) {
                        a.push(n);
                    }
                }

                return a;
            }


            return [];


        },

    });




})();
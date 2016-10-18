

define('/Page', function (require, module, exports) {

    var $ = require('$');
    var Directory = require('Directory');
    var File = require('File');
    var Config = require('Config');
    var API = require('API');

    var Emitter = $.require('Emitter');
    var Parser = module.require('Parser');

    /**
    * 构造器。
    */
    function Page(config) {
        config = Config.get(module.id, config);

        var dir = Directory.root();
        var userId = config.userId; //用户 id
        var no = config.no;         //当前页码，从 1 开始。
        var total = config.total;   //总页数。
        var sn = no - total;        //编程页码，最后一页为 0，倒数第二页为 -1，倒数第三页为 -2，依次类推。

        var data = {
            'dir': dir.slice(0, -1),
            'userId': userId,
            'no': no,
            'sn': sn,
        };

        var url = $.String.format(config.url, data);

        var html = config.html;
        var json = config.json;

        var meta = {
            'userId': userId,
            'url': url,
            'cache': config.cache,
            'html': {
                'file': $.String.format(html.file, data),
                'write': html.write,
            },
            'json': {
                'file': $.String.format(json.file, data),
                'write': json.write,
            },

            'emitter': new Emitter(this),
        };

        this.meta = meta;
    }






    Page.prototype = { //实例方法
        constructor: Page,

        /**
        * 发起 GET 网络请求以获取信息。
        */
        get: function () {

            var self = this;
            var meta = this.meta;
            var emitter = meta.emitter;

            var api = new API({
                'cache': meta.cache,
                'file': meta.html.file,
                'url': meta.url,
                'parser': Parser,
            });

            api.on({
                'success': function (data) {
                    if (meta.json.write) {
                        File.writeJSON(meta.json.file, data);
                    }

                    emitter.fire('get', [data]);
                },
                'fail': function () {
                    emitter.fire('get', [null]);
                },
                'error': function () {
                    emitter.fire('get', []);
                },
            });

            api.get();
        },

        /**
        * 绑定事件。
        * 已重载 on({...}，因此支持批量绑定。
        * @param {string} name 事件名称。
        * @param {function} fn 回调函数。
        */
        on: function (name, fn) {
            var meta = this.meta;
            var emitter = meta.emitter;
            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);
        },

    };


    //静态方法。
    $.Object.extend(Page, {

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


    return Page;



});
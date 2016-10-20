
/**
* 用户头像。
*/
define('/Avatar', function (require, module, exports) {

    var $ = require('$');
    var Directory = require('Directory');
   
    var Config = require('Config');
    var Image = require('Image');

    var Emitter = $.require('Emitter');

    /**
    * 构造器。
    */
    function Avatar(config) {

        config = Config.get(module.id, config);

        var dir = Directory.root();
        var userId = config.userId;

        var data = {
            'userId': userId,
            'dir': dir.slice(0, -1),
        };

        var url = config.url;
        if (!url.startsWith('http')) { // 有些以 `//` 开头
            url = config.host.split('//')[0] + url;
        }

        var meta = {
            'userId': userId,
            'url': url,
            'cache': config.cache,
            'file': $.String.format(config.file, data),
            'write': config.write,

            'emitter': new Emitter(this),
        };

        this.meta = meta;
    }






    Avatar.prototype = { //实例方法
        constructor: Avatar,

        /**
        * 发起 GET 网络请求以获取信息。
        */
        get: function (fn) {

            fn && this.on('get', fn);

            var meta = this.meta;
            var emitter = meta.emitter;
  
            Image.get({
                'cache': meta.cache,
                'url': meta.url,
                'file': meta.file,
                'done': function (error) {
                    emitter.fire('get', []);
                },
            });
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

    return Avatar;



});
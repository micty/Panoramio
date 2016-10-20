

/**
* 串行任务处理工具类
* @namesapce
* @name SerialTasks
*/
define('SerialTasks', function (require, module, exports) {

    var $ = require('$');
    var Emitter = $.require('Emitter');

   
    function SerialTasks(list) {

        var meta = {
            'list': list,
            'emitter': new Emitter(this),
        };

        this.meta = meta;

    }



    SerialTasks.prototype = {
        constructor: SerialTasks,


        run: function () {
            var meta = this.meta;
            var list = meta.list;
            var emitter = meta.emitter;

            var index = 0;
            var len = list.length;
            var values = [];        

            function process() {
                var item = list[index];

                emitter.fire('each', [item, index, function (value) {
                    index++;
                    values.push(value); //需要收集的值，由调用者传入。

                    if (index < len) {
                        process();
                    }
                    else {
                        emitter.fire('all', [values]);
                    }
                }]);
            }

            process();
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

    return SerialTasks;




});

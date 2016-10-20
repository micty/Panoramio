

/**
* 并行任务处理工具类
* @namesapce
* @name ParallelTasks
*/
define('ParallelTasks', function (require, module, exports) {

    var $ = require('$');
    var Emitter = $.require('Emitter');

   
    function ParallelTasks(list) {

        var meta = {
            'list': list,
            'emitter': new Emitter(this),
        };

        this.meta = meta;

    }



    ParallelTasks.prototype = {
        constructor: ParallelTasks,


        run: function () {
            var meta = this.meta;
            var list = meta.list;
            var emitter = meta.emitter;
            var values = [];

            var count = list.length;
            if (count == 0) {
                emitter.fire('all', [values]);
                return;
            }

            
            var dones = new Array(count);

            function done(index) {
                dones[index] = true;
                count--;

                //单纯记录计数不够安全，因为调用者可能会恶意多次调用 done()。
                if (count > 0) { //性能优化
                    return;
                }

                //安全起见，检查每项的完成状态
                for (var i = 0, len = dones.length; i < len; i++) {

                    if (!dones[i]) {
                        return;
                    }
                }

                emitter.fire('all', [values]);
            }

            list.forEach(function (item, index) {
                (function (index) { //done(index) 是异步调用，要多一层闭包。
                    emitter.fire('each', [item, index, function (value) {

                        values.push(value); //需要收集的值，由调用者传入。
                        done(index);
                    }]);

                })(index);
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

    return ParallelTasks;




});

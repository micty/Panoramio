

/**
* 任务处理工具类
* @namesapce
* @name Tasks
*/
define('Tasks', function (require, module,  exports) {

    //并行发起异步操作
    function parallel(list, each, allDone) {

        //重载 parallel(options)
        if (!(list instanceof Array)) {
            var options = list;
            list = options.data;
            each = options.each;
            allDone = options.all;
        }

        var count = list.length;
        if (count == 0) {
            allDone && allDone([]);
            return;
        }

        var values = [];
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

            allDone && allDone(values);
        }

        list.forEach(function (item, index) {
            (function (index) { //done(index) 是异步调用，要多一层闭包。
                each(item, index, function (value) {
                    
                    values.push(value); //需要收集的值，由调用者传入。
                    done(index);
                });
            })(index);
        });
    }

    //串行发起异步操作
    function serial(list, each, allDone) {
        //重载 serial(options)
        if (!(list instanceof Array)) {
            var options = list;
            list = options.data;
            each = options.each;
            allDone = options.all;
        }


        var index = 0;
        var len = list.length;
        var values = [];

        function process() {
            var item = list[index];

            each(item, index, function (value) {
                index++;
                values.push(value); //需要收集的值，由调用者传入。

                if (index < len) {
                    process();
                }
                else {
                    allDone && allDone(values);
                }
            });
        }

        process();

    }



    return /**@lends Tasks*/ {

        'parallel': parallel,
        'serial': serial,
    };


});

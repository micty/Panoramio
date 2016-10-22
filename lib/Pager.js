

define('Pager', function (require, module, exports) {

    var $ = require('$');


    return {

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
                var end = parseInt(a[1]) || max;

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

            text = parseInt(text);

            return [text];


        },
    };


});
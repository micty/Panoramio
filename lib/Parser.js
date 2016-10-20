

define('Parser', function (require, module, exports) {

    var $ = require('$');


    /**
    * 把一个对象解析成值。
    * 规则: 迭代每个键值对，
    *   如果值是函数则调用它取得其返回值，并对返回值进一步递归解析。
    *   如果值是普通对象，则递归解析。
    *   如果值是数组，则迭代每一项进行解析。
    *   如果值是值类型，则保留。
    */
    function parse(html, value) {

        if (Array.isArray(value)) {
            value = value.map(function (value) {
                value = parse(html, value);
                return value;
            });

            return value;
        }

        if (value instanceof RegExp) {
            return value.toString();
        }

        switch (typeof value) {

            //值类型，直接复制。
            case 'string':
            case 'boolean':
            case 'number':
            case 'undefined':
                return value;

            case 'function':
                value = value(html);
             
                value = parse(html, value);
                return value;

            case 'object':

                if ($.Object.isPlain(value)) {

                    var obj = {};

                    for (var key in value) {
                        obj[key] = parse(html, value[key]);
                    }
                    
                    return obj;
                }

                return value ? value.valueOf() : null;

        }

    }


    return {
        'parse': parse,
    };



});
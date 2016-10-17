

define('Parser', function (require, module, exports) {

    var $ = require('$');


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
        /**
        * 
        */
        'parse': parse,
    }



});
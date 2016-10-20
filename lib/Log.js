


var Colors = require('colors');


define('Log', function (require, module, exports) {

    var $ = require('$');
    var File = require('File');


    var colors = [
        'black',
        'red',
        'green',
        'yellow',
        'blue',
        'magenta',
        'cyan',
        'white',
        'gray',
        'grey',

        'bgGreen',
    ];


    var now = $.Date.format(new Date(), 'yyyyMMddHHmmss');
    var file = './data/log/' + now + '.txt';
    var fails = [];


    function add(text) {

        var args = [].slice.call(arguments, 0);

        var ts = $.Date.format(new Date(), 'HH:mm:ss');
        ts = Colors.grey(ts);

        text = $.String.format.apply(null, args);
        text = ts + ' ' + text;

        console.log(text);

        text = text.replace(/\u001b\[\d\dm/g, '') + '\n';

        try { //防止 log.txt 被锁死，避免整个程序挂掉
            File.append(file, text);

            if (fails.length > 0) {
                File.append(file, fails.join(''));
                fails = [];
            }
        }
        catch (ex) {
            var msg = Colors.magenta(ex.message);
            console.log(msg);
            fails.push(text);
        }
    }


    colors.forEach(function (item, index) {

        exports[item] = function () {

            var args = [].slice.call(arguments, 0);
            var s = $.String.format.apply(null, args);
            s = Colors[item](s);

            add(s);

        };
    });

    exports.add = add;

    return exports;

});


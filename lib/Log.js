



module.exports = (function (exports) {

    

    var $ = require('./MiniQuery');
    var File = null;


    var Colors = require('colors');


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
    ];


    var fails = [];


    function add(text) {

        var args = [].slice.call(arguments, 0);

        var ts = $.Date.format(new Date(), 'HH:mm:ss');
        ts = Colors.grey(ts);

        text = $.String.format.apply(null, args);
        text = ts + ' ' + text;

        console.log(text);

        text = text.replace(/\u001b\[\d\dm/g, '') + '\n';
        
        if (!File) {
            File = require('./File');
        }

        try { //防止 log.txt 被锁死，避免整个程序挂掉
            File.append('./log.txt', text);

            if (fails.length > 0) {
                File.append('./log.txt', fails.join(''));
                fails = [];
            }
        }
        catch (ex) {
            var msg = Colors.magenta(ex.message);
            console.log(msg);
            fails.push(text);
        }
        

    }


    function clear() {
        if (!File) {
            File = require('./File');
        }

        var log = File.read('./log.txt');

        var path = $.String.format('./logs/{0}.txt', new Date().getTime());

        File.write(path, log);

        File.write('./log.txt', '', true);
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
    exports.clear = clear;


    return exports;



})(exports);



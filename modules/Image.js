



module.exports = (function () {


    var $ = require('../lib/MiniQuery');
    var Exif = require('exif');
    var Log = require('../lib/Log');
    var File = null;

    function config() {

    }


    function getBasicExif(file, fn) {


        if (fn) { //异步方式

            Exif.get(file, function (exif) {
                if (!exif) {
                    Log.red('无法读取 EXIF: {0}', file);
                    return;
                }

                Log.green('成功读取 EXIF: {0}', file);
                fn(exif);
            });


            getExif(file, function (exif) {
                if (!exif) {
                    return fn(null);
                }


                var make = exif.image.Make;
                var model = exif.image.Model;
                var dt = exif.exif.DateTimeOriginal;
                if (!make || !model || !dt) {
                    return fn(null);
                }


                try {
                    dt = dt.split(' ');

                    fn({
                        'camera': make + ' ' + model,
                        'date': dt[0].replace(/:/g, '/'), // 把 ':' 换成 '/'
                        'time': dt[1]
                    });
                }
                catch (ex) {
                    fn(null);
                }
            });

            return;
        }


        //同步方式

        var exif = getExif(file);

        if (!exif) {
            return null;
        }

        var make = exif.image.Make;
        var model = exif.image.Model;
        var dt = exif.exif.DateTimeOriginal;
        if (!make || !model || !dt) {
            return null;
        }

        try{
            dt = dt.split(' ');

            return {
                'camera': make + ' ' + model,
                'date': dt[0].replace(/:/g, '/'), // 把 ':' 换成 '/'
                'time': dt[1]
            };
        }
        catch (ex) {
            return null;
        }
        
    }


    function getExif(file, fn) {


        if (fn) { //异步方式

            Exif.get(file, function (error, exif) {
                if (error) {
                    Log.red('无法读取 EXIF: {0}', file);
                    fn(null);
                    return;
                }

                Log.green('成功读取 EXIF: {0}', file);
                fn(exif);
            });

            return;
        }

        //同步方式
        var exif = Exif.get(file);
        if (!exif) {
            Log.red('无法读取 EXIF: {0}', file);
            return null;
        }

        Log.green('成功读取 EXIF: {0}', file);
        return exif;
    }


    return {
        getExif: getExif,
        getBasicExif: getBasicExif,
        config: config
    };




})();
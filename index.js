

//主
(function () {



    var Directory = require('./lib/Directory');

    var dir = 'E:/iPhone/Photo/2014-10-12/';
    var dir = 'J:/BaiduYunDownload/Panoramio/build';
    Directory.eachFile(dir, function (file, stat) {

        console.log(file);
        console.log(stat);
    });

    return;

    var Process = require('./modules/Process');
    Process.init();

    var $ = require('./lib/MiniQuery');

    var User = require('./modules/User');
    var Page = require('./modules/Page');
    var Photo = require('./modules/Photo');


    var id = Process.getUserId();


    User.get(id, function (user) {

        var pageCount = user.pageCount;

        var list = Page.resolve('1n', pageCount);

        $.Array.each(list, function (no) {

            Page.get({
                id: user.id,
                no: no,
                count: pageCount,
                fn: function (page) {
                    $.Array.each(page.ids, function (id, index) {
                        Photo.get(id);
                    });
                }

            });

        });

    });


    



   
   


})();
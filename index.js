
//主
(function () {

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
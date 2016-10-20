

define('/Favorites/Parser', function (require, module, exports) {

    var $ = require('$');




    return {
        //先占位，调用者会改。
        'userId': '',
        'url': '',
        'host': '',

        //照片总页数。
        'page': function (html) {
            var pageNos = html.match(/photo_page=\d+/g);

            pageNos = pageNos.map(function (item, index) {
                var a = item.match(/\d+/g);
                return parseInt(a[0]);
            });

            return $.Array.max(pageNos);
        },

    };



});
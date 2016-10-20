

define('/FavPhotos/Parser', function (require, module, exports) {

    var $ = require('$');

    var pano = {
        acrylic: {
            UserPagePhoto: function (item) {
                return item;
            },
        },
    };
   

    return exports = {

        'userId': '',
        'url': '',
        'no': 0,
        'total': 0,

        //所有的照片 id 列表
        'ids': function (html) { 
            var a = $.String.between(html, 'var photo_ids = [', '];');
            a = a.match(/\d+/g);
            return a;
        },

        //按照片 id 对标签进行归类
        'id$tags': function (html) {

            html = $.String.between(html, 'var tagsByPhoto = {', '};');
            var obj = new Function('return {' + html + '};')();

            return obj;
        },

        //按标签对照片 id 进行归类
        'tag$ids': function (html) {
            html = $.String.between(html, 'var photosByTag = {', '};');
            var obj = new Function('return {' + html + '};')();
            return obj;
        },

        //照片概要信息。
        'photos': function (html) {
            var begin = 'var photos = [new pano.acrylic.UserPagePhoto({';
            var end = '})];';
            var js = $.String.between(html, begin, end);

            js = begin + js + end + '; return photos;';

            var list = new Function('pano', js)(pano);
            return list;
        },
    };

});
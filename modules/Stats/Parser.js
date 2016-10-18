

define('/Stats/Parser', function (require, module, exports) {

    var $ = require('$');


    return exports = {

        //所有者 id
        'ownerId': function (html) {
            html = $.String.between(html, 'var ownerId = ', ';');
            return html;
        },

        //照片 id
        'photoId': function (html) {
            html = $.String.between(html, 'var photoId = ', ';');
            return html;
        },

        //收藏了些照片的用户 id 列表。
        'favoredByIds': function (html) {
            html = $.String.between(html, 'var favoredByIds = [', '];');
            html = 'return [' + html + ']';
            return new Function(html)();
        },

        //照片标题
        'title': function (html) {
            html = $.String.between(html, '<img id="photo_thumbnail"', '/>');
            html = $.String.between(html, 'alt="', '"');
            return html;
        },

        //全部统计
        'total': {
            'all': function (html) {
                html = $.String.between(html, 'var totalAll = "', '";');
                return parseInt(html);

            },

            'pano': function (html) {
                html = $.String.between(html, 'var totalPano = "', '";');
                return parseInt(html);

            },

            'earth': function (html) {
                html = $.String.between(html, 'var totalEarth = "', '";');
                return parseInt(html);

            },

            'maps': function (html) {
                html = $.String.between(html, 'var totalMaps = "', '";');
                return parseInt(html);

            },

            'wapi': function (html) {
                html = $.String.between(html, 'var totalWapi = "', '";');
                return parseInt(html);

            },
        },

        //第三方统计
        'thirty': {
            'all': function (html) {
                html = $.String.between(html, 'var thirtyAll = "', '";');
                return parseInt(html);

            },

            'pano': function (html) {
                html = $.String.between(html, 'var thirtyPano = "', '";');
                return parseInt(html);

            },

            'earth': function (html) {
                html = $.String.between(html, 'var thirtyEarth = "', '";');
                return parseInt(html);

            },

            'maps': function (html) {
                html = $.String.between(html, 'var thirtyMaps = "', '";');
                return parseInt(html);

            },

            'wapi': function (html) {
                html = $.String.between(html, 'var thirtyWapi = "', '";');
                return parseInt(html);

            },
        },

        //评论数
        'comments': function (html) {
            html = $.String.between(html, '#comments_wrapper', '<br />');
            html = $.String.between(html, '<strong>', '</strong>');
            return parseInt(html);
        },

        //收藏数
        'favorites': function (html) {
            html = $.String.between(html, '#comments_wrapper', 'favorites');
            var a = html.split('<strong>');
            html = a.slice(-1)[0];
            html = '<strong>' + html;
            html = $.String.between(html, '<strong>', '</strong>');
            return parseInt(html);
        },

        //喜欢数
        'likes': function (html) {
            html = $.String.between(html, '#comments_wrapper', 'likes');
            var a = html.split('<strong>');
            html = a.slice(-1)[0];
            html = '<strong>' + html;
            html = $.String.between(html, '<strong>', '</strong>');
            return parseInt(html);
        },

        //推荐的照片列表
        'recommends': function (html) {
            html = $.String.between(html, '<h2 id="recommended_photos_for_photo_title2">', '<script type="text/javascript">');

            var list = html.split('<div class="recommended_photo">');
            list = list.slice(1).map(function (html) {

                var photoId = $.String.between(html, '<a href="/photo/', '">');
                var src = $.String.between(html, 'src="', '"');
                var title = $.String.between(html, 'title="', '"');

                var authorId = $.String.between(html, '<a href="/user/', '?');
                var authorName = $.String.between(html, '<a href="/user/', '/a>');
                authorName = $.String.between(authorName, '>', '<');


                return {
                    'photo': {
                        'id': photoId,
                        'src': src,
                        'title': title,
                    },
                    'author': {
                        'id': authorId,
                        'name': authorName,
                    },
                };

            });

            return list;
        },
        
    };

});
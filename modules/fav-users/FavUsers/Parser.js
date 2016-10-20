

define('/FavUsers/Parser', function (require, module, exports) {

    var $ = require('$');



   


    return {
        'userId': '',
        'url': '',
        'host': '',

        'list': function (html) {

            html = $.String.between(html, '<ul class="favs" id="favs">', '<li class="ajax_pagination_links"');

            var list = html.split('</li>');

            list = list.slice(0, -1).map(function (html) {

                var id = $.String.between(html, ' <a href="/user/', '?');
                var url = $.String.between(html, ' <a href="', '"').split('?')[0];

                var avatar = $.String.between(html, '<img src="', '"');
                avatar = avatar.split('?')[0]; //取 `?` 之前的部分。

                var name = $.String.between(html, 'class="favavatar" />', '<');
                name = name.split('\n')[1].trimLeft().trimRight().replace(/\&nbsp;/g, '');


                var desc = $.String.between(html, 'title="', '"');


                return {
                    'id': id,
                    'url': url,
                    'avatar': avatar,
                    'name': name,

                    'desc': desc,

                };

            });

            return list;
        },


    };



});
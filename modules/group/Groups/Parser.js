

define('/Groups/Parser', function (require, module, exports) {

    var $ = require('$');

   


    return {
        'userId': '',
        'url': '',

        'list': function (html) {

            var list = html.split('</li>');

            list = list.slice(0, -1).map(function (html) {

                var id = $.String.between(html, '<a href="/group/', '"');
                var avatar = $.String.between(html, '<img src="', '"');
                var name = $.String.between(html, 'class="gm_group_name gw_ellipsis', '/a>');
                name = $.String.between(name, '">', '<');

                return {
                    'id': id,
                    'avatar': avatar,
                    'name': name,
                };

            });

            return list;
        },


    };



});
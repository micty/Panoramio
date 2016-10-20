

define('/Comments/Parser', function (require, module, exports) {

    var $ = require('$');

   
    return {
        'userId': '',
        'url': '',
        'no': 0,
        'total': 0,

        'list': function (html) {
            html = $.String.between(html, 'id="conversations"', '<div class="paginator-wrapper">');
            var list = html.split('<div class="comment">');
            list = list.slice(1).map(function (html) {

                var photoId = $.String.between(html, '<a href="/photo/', '"');
                var photoUrl = $.String.between(html, '<img src="', '"');

                var userId = $.String.between(html, '<a class="username" href="/user/', '"');
                var userName = $.String.between(html, '<a class="username"', '>');
                userName = $.String.between(userName, 'title="', '"');

                var contents = html.split('<p>')
                contents = contents.slice(1).map(function (html) {
                    return html.split('</p>')[0];
                });

                return {
                    'author': {
                        'id': userId,
                        'name': userName,
                    },

                    'photo': {
                        'id': photoId,
                        'url': photoUrl,
                    },

                    'contents': contents,

                };

            });

            return list;
        },
    };

});


define('/User/Parser', function (require, module, exports) {

    var $ = require('$');


    //获取统计数
    function getStats(html) {

        var stats = html.match(/<a href="\/user\/\d+\/stats">\d+<\/a>/g);

        stats = stats.map(function (item, index) {
            var a = item.match(/\d+/g);
            return parseInt(a[1]);
        });

        return stats;
    }

   


    return {

        //用户 id。
        'id': function (html) {
            return $.String.between(html, 'var ownerId = ', ';');
        },

        //用户姓名
        'name': function (html) {
            return $.String.between(html, '<title>Panoramio - Photos by ', '\n');
        },

        //用户描述
        'desc': function (html) {
            return $.String.between(html, 'class="open-quote-img">', '<img alt=""');
        },

        //头像
        'avatar': function (html) {
            html = $.String.between(html, '<div id="user-page_main-header">', '<div id="user_profile_info">');
            html = $.String.between(html, 'src="', '?');
            return html;
        },

        //个人网站
        'website': function (html) {
            html = $.String.between(html, '<a class="icon_sprite icon_link" href="', '"');
            return html;
        },

        //统计数
        'stats': function (html) {
            var stats = getStats(html);

            return {
                'photo': stats[0],
                'approved': stats[1],
                'view': stats[2],

                //获取总页数
                'page': function (html) {
                    var pageNos = html.match(/photo_page=\d+"/g);

                    pageNos = pageNos.map(function (item, index) {
                        var a = item.match(/\d+/g);
                        return parseInt(a[0]);
                    });

                    return $.Array.max(pageNos);
                },
            };
        },

        //标签列表
        'tags': function (html) {
            var lines = html.split('\n');

            var tags = $.Array.map(lines, function (item, index) {

                if ((/\/user\/\d+\/tags\//).test(item)) {
                    return $.String.between(item, '">', '</a>');
                }

                return null;
            });

            return tags;
        },

    };



});
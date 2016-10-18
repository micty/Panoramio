

define('/Photo/Parser', function (require, module, exports) {

    var $ = require('$');

    var name$month = {
        'January': 1,
        'February': 2,
        'March': 3,
        'April': 4,
        'May': 5,
        'June': 6,
        'July': 7,
        'August': 8,
        'September': 9,
        'October': 10,
        'November': 11,
        'December': 12,
    };


    return exports = {

        //作者简单信息
        'author': function (html) {
            var s = $.String.between(html, '<div id="profile_name">', '</div>');

            var id = $.String.between(s, '/user/', '?with_photo_id');
            var name = $.String.between(s, 'rel="author">', '</a>');

            //照片总数
            var count = $.String.between(html, '<span class="profile-stats-text">', ' photos</span>');
            count = count.split(' ').slice(-1)[0];
            count = Number(count);
                
            return {
                'id': id,
                'name': name,
                'count': count,
            };
        },

        //照片的 id
        'id': function (html) {
            return $.String.between(html, 'var photoId = ', ';');
        },

        //照片标题
        'title': function (html) {
            html = $.String.between(html, '<title>', '</title>');
            html = $.String.between(html, 'Panoramio - Photo of ', '\n');
            return html;
        },

        //照片是否被选中
        'approved': function (html) {
            html = $.String.between(html, '<div class="photo-page-earth-status">', '</div>');
            return html.indexOf('Selected for Google Maps and Google Earth') > 0;
        },

        //照片拍摄地点描述
        'place': function (html) {
            html = $.String.between(html, '<p id="place">', '</p>');
            html = $.String.between(html, 'Photo taken in ', '\n');
            return html;
        },

        //附近的照片 id 列表
        'nearbys': function (html) {
            html = $.String.between(html, '<div id="nearby_photos">', '</a></div>');
            if (!html) {
                return [];
            }

            var ids = html.match(/\/photo\/\d+/g);
            return ids.map(function (item, index) {
                return item.replace('/photo/', '');
            });
        },

        //标签列表
        'tags': function (html) {
            html = $.String.between(html, '<ul id="interim-tags">', '<li id="show_all_tags">');
            var a = html.split('a>');

            a = $.Array.map(a, function (item, index) {

                var a = item.split('<a');

                var html = a[1];
                if (!html) {
                    return null;
                }

                var tag = $.String.between(html, '">', '</');
                tag = tag.replace(/\n+/g, '');

                return tag.trimLeft().trimRight();
            });

            return a;
        },

        //纬度
        'latitude': function (html) {
            return $.String.between(html, '<abbr class="latitude" title="', '">');
        },

        //经度
        'longitude': function (html) {
            return $.String.between(html, '<abbr class="longitude" title="', '">');
        },

        //照片的上传时间
        'uploadTime': function (html) {
            var html0 = html;

            try {
                html = $.String.between(html, '<ul id="details">', '</li>');

                //处理
                //Uploaded on August 2, 2013
                //Uploaded on November 10
                if (html.indexOf('Uploaded on ') > 0) {

                    html = $.String.between(html, 'Uploaded on ', '\n');
                    html = html.replace(/,/g, ''); //去掉可能存在的逗号
                    
                    var a = html.split(' ');

                    var month = name$month[a[0]];
                    var day = parseInt(a[1]);
                    var year = parseInt(a[2]) || (new Date().getFullYear());

                    var dt = new Date(year, month - 1, day);

                    if (isNaN(dt.getTime())) { //非法日期
                        return '';
                    }

                    dt = $.Date.format(dt, 'yyyy-MM-dd');
                    return dt;
                }

                //处理
                //Uploaded 30 minutes ago
                //Uploaded 3 hours ago
                if (html.indexOf('Uploaded ') > 0 && html.indexOf(' ago') > 0) {

                    html = $.String.between(html, 'Uploaded ', ' ago'); //30 minutes

                    var a = html.split(' ');    //['30', 'minutes']
                    var value = parseInt(a[0]); //30
                    var name = $.String.toCamelCase('add-' + a[1]); //addMinutes

                    var dt = $.Date[name](new Date(), 0 - value);
                    dt = $.Date.format(dt, 'yyyy-MM-dd');

                    return dt;
                }
            }
            catch (ex) {
                var id = exports.id(html0);
                var Log = require('Log');
                Log.red('解析照片上传时间错误: id={0}, message={1}', id, ex.message);
            }

            return '';
        },

        //相机型号
        'camera': function (html) {
            html = $.String.between(html, '<li id="tech-details">', '</ul>');
            html = $.String.between(html, '<li>Camera: ', '</li>');
            return html;
        },

        //拍摄日期(时间)
        'takenTime': function (html) {
            html = $.String.between(html, '<li id="tech-details">', '</ul>');
            html = $.String.between(html, '<li>Taken on ', '</li>');
            return html;
        },

        //曝光时间
        'exposure': function (html) {
            html = $.String.between(html, '<li id="tech-details">', '</ul>');
            html = $.String.between(html, '<li>Exposure: ', '</li>');
            return html;
        },

        //焦距
        'focalLength': function (html) {
            html = $.String.between(html, '<li id="tech-details">', '</ul>');
            html = $.String.between(html, '<li>Focal Length: ', '</li>');
            return html;
        },

        //光圈
        'fstop': function (html) {
            html = $.String.between(html, '<li id="tech-details">', '</ul>');
            html = $.String.between(html, '<li>F/Stop: ', '</li>');
            return html;
        },

        //ISO
        'isoSpeed': function (html) {
            html = $.String.between(html, '<li id="tech-details">', '</ul>');
            html = $.String.between(html, '<li>ISO Speed: ', '</li>');
            return html;
        },

        //曝光补偿。 可能不存在
        'exposureBias': function (html) {
            html = $.String.between(html, '<li id="tech-details">', '</ul>');
            html = $.String.between(html, '<li>Exposure Bias: ', '</li>');
            return html;
        },
      
        //闪光灯
        'flash': function (html) {
            html = $.String.between(html, '<li id="tech-details">', '</ul>');
            var a = html.split('<li>');
            html = '<li>' + a.slice(-1)[0];
            html = $.String.between(html, '<li>', '</li>');
            return html;
        },

        //评论
        'comments': function (html) {
            html = $.String.between(html, '<div id="comments_wrapper">', '</div>\n    <div class="paginator-wrapper">');

            var list = html.split('<div class="comment"');

            list = list.slice(1).map(function (html) {
                var avatar = $.String.between(html, '<img class="comment-avatar"', '/>');
                avatar = $.String.between(avatar, 'src="', '"');


                var s0 = $.String.between(html, '<div class="comment-author">', '</div>');

                var s1 = $.String.between(s0, '<a href="/user/', '</a>');
                var a = s1.split('">');
                var id = a[0];
                var name = a[1];

                var date = $.String.between(s0, '</a> on ', '\n');
                var text = $.String.between(html, '<p>', '</p>');

                return {
                    'author': {
                        'id': id,
                        'name': name,
                        'avatar': avatar,
                    },
                    'date': date,
                    'text': text,
                };
            });

            return list;

        },

        
    };

});
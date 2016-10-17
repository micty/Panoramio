

var defineJS = require('./f/defineJS');


defineJS.config({
    modules: [
        'lib/',
        'modules/',
    ],
});


defineJS.run(function (require, module) {


    var Config = require('Config');
    Config.use('./config.json');

    var User = module.require('User');

    var user = new User();

    user.on('get', function (data) {

        var Page = module.require('Page');
        var count = data.stats.page;

        function request(no) {

            var page = new Page({
                'id': data.id,
                'count': count,
                'no': no,
            });

            page.on('get', function (data) {
                if (no < count) {
                    //request(no + 1);
                }
            });

            page.get();
        }

        //request(1);
        request(275);
    });

    //user.get();


    var Photo = module.require('Photo');
    var photo = new Photo({
        'userId': '5167299',
        'id': '126458607',
    });

    photo.on('get', function (data) {
        console.log(data);
    });

    //photo.get();


    var Image = module.require('Image');
    var image = new Image({
        'id': '133807073',
    });

    //image.on('get', function () {

    //});

    image.get('medium');
    image.get('large');
    image.get('origin');

});



//defineJS.run(function (require) {
//    var Parser = require('Parser');
//    var data = Parser.parse('html-test', {
//        'a': 1,
//        'b': 2,
//        'c': {
//            name: 'micty',
//            desc: function (html) {
//                return html.split('-');
//            },
//        },
//        stats: [1000, 2000, new Date(), new String('abcd'), function () {
//            return {
//                test: 100,
//                fnA: function () {
//                    return ['fn-value', function () {
//                        return 10023;
//                    }];
//                },
//            };
//        }],
//    });

//    console.log(data);

//    var File = require('File');
//    File.writeJSON('./test.json', data);
//});

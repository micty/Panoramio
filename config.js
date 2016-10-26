
module.exports = {

    /**
    * 主程序模块。 即针对 index.js 中的。
    */
    '': {
        userId: '841653',
        userId: '2732962',
        userId: '5167299',
        userId: '4818033',
        userId: '1635631',
        pageNos: '1-',
    },

    /**
    * 需要运行的子任务。
    */
    '/Tasks': [
        'user.avatar',
        //'user.comments',
        //'user.fav-users',
        //'user.groups',

        'photo.detail',
        'photo.stats',

        'image.thumbnail',
        'image.medium',
        'image.large',
        'image.origin',
    ],

    /**
    * 用户模块。
    */
    '/User': {
        url: 'https://ssl.panoramio.com/user/{userId}?show=all',
        cache: true,
        html: {
            file: '../user.{userId}/{userId}/html/index.html',
            write: true,
        },
        json: {
            file: '../user.{userId}/{userId}/json/index.json',
            write: true,
        },
    },
    /**
    * 用户头像模块。
    */
    '/Avatar': {
        cache: true,
        file: '../user.{userId}/{userId}/avatar.jpg',
        write: true,
    },
    
    /**
    * 评论模块。
    */
    '/Comments': {
        url: 'https://ssl.panoramio.com/user/{userId}?comment_page={no}',
        cache: true,
        html: {
            file: '../user.{userId}/{userId}/html/comments/{sn}.html',
            write: true,
        },
        json: {
            file: '../user.{userId}/{userId}/json/comments/{sn}.json',
            write: true,
        },
    },

    /**
    * 用户收藏的摄影师模块。
    */
    '/FavUsers': {
        cache: true,
        html: {
            file: '../user.{userId}/{userId}/html/fav-users.html',
            write: true,
        },
        json: {
            file: '../user.{userId}/{userId}/json/fav-users.json',
            write: true,
        },
    },

    /**
    * 用户加入的群组模块。
    */
    '/Groups': {
        cache: true,
        html: {
            file: '../user.{userId}/{userId}/html/groups.html',
            write: true,
        },
        json: {
            file: '../user.{userId}/{userId}/json/groups.json',
            write: true,
        },
    },

    /**
    * 用户收藏的照片(首页)模块。
    */
    '/Favorites': {
        url: 'https://ssl.panoramio.com/favorites/{userId}',
        cache: true,
        html: {
            file: '../user.{userId}/{userId}/html/favorites.html',
            write: true,
        },
        json: {
            file: '../user.{userId}/{userId}/json/favorites.json',
            write: true,
        },
    },

    /**
    * 用户收藏的照片(分页)模块。
    */
    '/FavPhotos': {
        url: 'https://ssl.panoramio.com/favorites/{userId}?photo_page={no}',
        cache: true,
        html: {
            file: '../user.{userId}/{userId}/html/fav-photos/{sn}.html',
            write: true,
        },
        json: {
            file: '../user.{userId}/{userId}/json/fav-photos/{sn}.json',
            write: true,
        },
    },

    /**
    * 照片分页模块。
    */
    '/Page': {
        url: 'https://ssl.panoramio.com/user/{userId}?show=all&photo_page={no}',
        cache: true,
        html: {
            file: '../user.{userId}/{userId}/html/page/{sn}.html',
            write: true,
        },
        json: {
            file: '../user.{userId}/{userId}/json/page/{sn}.json',
            write: true,
        },
    },

    /**
    * 照片详情模块。
    */
    '/Photo': {
        url: 'https://ssl.panoramio.com/photo/{photoId}',
        cache: true,
        html: {
            file: '../user.{userId}/global/html/photo/{photoId}.html',
            write: true,
        },
        json: {
            file: '../user.{userId}/global/json/photo/{photoId}.json',
            write: true,
        },
    },

    /**
    * 照片统计模块。
    */
    '/Stats': {
        url: 'https://ssl.panoramio.com/photo/{photoId}/stats',
        cache: true,
        html: {
            file: '../user.{userId}/global/html/stats/{photoId}.html',
            write: true,
        },
        json: {
            file: '../user.{userId}/global/json/stats/{photoId}.json',
            write: true,
        },
    },

    /**
    * 照片图片模块。
    */
    '/Image': {
        retry: 10,
        timeout: 60000,
        cache: true,

        thumbnail: {
            url: 'https://mw2.google.com/mw-panoramio/photos/thumbnail/{photoId}.jpg',
            file: '../user.{userId}/global/image/thumbnail/{photoId}.jpg',
        },
        medium: {
            url: 'https://mw2.google.com/mw-panoramio/photos/medium/{photoId}.jpg',
            file: '../user.{userId}/global/image/medium/{photoId}.jpg',
        },
        large: {
            url: 'https://static.panoramio.com.storage.googleapis.com/photos/large/{photoId}.jpg',
            file: '../user.{userId}/global/image/large/{photoId}.jpg',
        },
        origin: {
            url: 'https://ssl.panoramio.com/photos/d/{photoId}.jpg',
            file: '../user.{userId}/global/image/origin/{photoId}.jpg',
        },
      
    },

    /**
    * 通用页面请求模块。
    */
    'API': {
        errorHtml: '<title>Server Error</title>',
        retry: 10,
        timeout: 35000,
    },

    /**
    * 通用图片请求模块。
    */
    'Image': {
        timeout: 55000,
    },


}

module.exports = {

    '': {
        'userId': '841653',
        'userId': '2732962',
        'userId': '5167299',
        'userId': '1635631',
        'pageNos': '1-',
    },

    '/Tasks': [
        'user.avatar',
        'user.comments',
        'user.fav-users',
        'user.groups',

        'photo.detail',
        'photo.stats',

        'image.thumbnail',
        'image.medium',
        'image.large',
        'image.origin',
    ],


    '/User': {
        url: 'https://ssl.panoramio.com/user/{id}',
        cache: true,
        html: {
            file: '../data-1635631/{id}/html/index.html',
            write: true,
        },
        json: {
            file: '../data-1635631/{id}/json/index.json',
            write: true,
        },
    },

    '/Avatar': {
        cache: true,
        file: '../data-1635631/{userId}/avatar.jpg',
        write: true,
    },
    
    '/Comments': {
        url: 'https://ssl.panoramio.com/user/{userId}?comment_page={no}',
        cache: true,
        html: {
            file: '../data-1635631/{userId}/html/comments/{sn}.html',
            write: true,
        },
        json: {
            file: '../data-1635631/{userId}/json/comments/{sn}.json',
            write: true,
        },
    },

    '/FavUsers': {
        cache: true,
        html: {
            file: '../data-1635631/{userId}/html/fav-users.html',
            write: true,
        },
        json: {
            file: '../data-1635631/{userId}/json/fav-users.json',
            write: true,
        },
    },

     '/Groups': {
        cache: true,
        html: {
            file: '../data-1635631/{userId}/html/groups.html',
            write: true,
        },
        json: {
            file: '../data-1635631/{userId}/json/groups.json',
            write: true,
        },
    },

    
    '/Favorites': {
        url: 'https://ssl.panoramio.com/favorites/{userId}',
        cache: true,
        html: {
            file: '../data-1635631/{userId}/html/favorites.html',
            write: true,
        },
        json: {
            file: '../data-1635631/{userId}/json/favorites.json',
            write: true,
        },
    },


    '/FavPhotos': {
        url: 'https://ssl.panoramio.com/favorites/{userId}?photo_page={no}',
        cache: true,
        html: {
            file: '../data-1635631/{userId}/html/fav-photos/{sn}.html',
            write: true,
        },
        json: {
            file: '../data-1635631/{userId}/json/fav-photos/{sn}.json',
            write: true,
        },
    },


    '/Page': {
        url: 'https://ssl.panoramio.com/user/{userId}?photo_page={no}',
        cache: true,
        html: {
            file: '../data-1635631/{userId}/html/page/{sn}.html',
            write: true,
        },
        json: {
            file: '../data-1635631/{userId}/json/page/{sn}.json',
            write: true,
        },
    },

    '/Photo': {
        url: 'https://ssl.panoramio.com/photo/{id}',
        cache: true,
        html: {
            file: '../data-1635631/global/html/photo/{id}.html',
            write: true,
        },
        json: {
            file: '../data-1635631/global/json/photo/{id}.json',
            write: true,
        },
    },

    '/Stats': {
        url: 'https://ssl.panoramio.com/photo/{id}/stats',
        cache: true,
        html: {
            file: '../data-1635631/global/html/stats/{id}.html',
            write: true,
        },
        json: {
            file: '../data-1635631/global/json/stats/{id}.json',
            write: true,
        },
    },

    '/Image': {
        retry: 10,
        timeout: 60000,
        cache: true,

        thumbnail: {
            url: 'https://mw2.google.com/mw-panoramio/photos/thumbnail/{id}.jpg',
            file: '../data-1635631/global/image/thumbnail/{id}.jpg',
        },
        medium: {
            url: 'https://mw2.google.com/mw-panoramio/photos/medium/{id}.jpg',
            file: '../data-1635631/global/image/medium/{id}.jpg',
        },
        large: {
            url: 'https://static.panoramio.com.storage.googleapis.com/photos/large/{id}.jpg',
            file: '../data-1635631/global/image/large/{id}.jpg',
        },
        origin: {
            url: 'https://ssl.panoramio.com/photos/d/{id}.jpg',
            file: '../data-1635631/global/image/origin/{id}.jpg',
        },
      
    },


    'API': {
        errorHtml: '<title>Server Error</title>',
        retry: 10,
        timeout: 35000,
    },

    'Image': {
        timeout: 55000,
    },


}
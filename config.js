
module.exports = {

    User: {
        url: 'http://www.panoramio.com/user/{id}',
        path: {
            html: '/download/html/user/{id}.html',
            json: '/database/user/{id}.json'
        },
        write: {
            html: false,
            json: true
        },
        cache: false,
    },

    Page: {
        url: 'http://www.panoramio.com/user/{id}?photo_page={no}',
        path: {
            html: '/download/html/page/{id}/{sn}.html',
            json: '/database/page/{id}/{sn}.json'
        },
        write: {
            html: false,
            json: true
        },

        /**
        * 是否使用已经抓取到的 json 缓存。 
        * 适用情况: 仅新增照片，从而使分页数变多
        */
        cache: true,

    },

    Photo: {
        url: 'http://www.panoramio.com/photo/{id}',
        path: {
            html: '/download/html/photo/{id}.html',
            json: '/database/photo/{id}.json'
        },
        write: {
            html: false,
            json: true
        },
        cache: true,
    },

    Builder: {
        path: {
            'all': '/build/{id}/all.json',
            'assort': '/build/{id}/assort.json',
            'repeat': '/build/{id}/repeat.json',
            'id$file': '/build/{id}/id$file.json',
            'file$id': '/build/{id}/file$id.json',
            'noExist': '/build/{id}/noExist.json',

            'exif': '/build/exif.json',
            'exif': '/build/exif.json',
            'basicExif': '/build/basicExif.json',
        },

        write: {
            'all': true,
            'assort': true,
            'repeat': true,
            'exif': true,
            'basicExif': true,
        },

        cache: {
            'all': true,
        }
    }

};
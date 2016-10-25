

/**
*
*/
define('/Tasks', function (require, module, exports) {
    
    var Config = require('Config');

    var short$name = {

        detail: 'photo.detail',
        stats: 'photo.stats',

        S: 'image.thumbnail',
        M: 'image.medium',
        L: 'image.large',
        X: 'image.origin',

        thumbnail: 'image.thumbnail',
        medium: 'image.medium',
        large: 'image.large',
        origin: 'image.origin',

        thumb: 'image.thumbnail',
     
    };


    var details = [
        'photo.detail',
        'photo.stats',

        'image.thumbnail',
        'image.medium',
        'image.large',
        'image.origin',
    ];



    var all = null; //从 config 中进来的全部任务列表。




    return {


        get: function (type) {

            all = all || Config.get(module.id);

            if (type) {

                //特别指定为具体前缀的类型，则获取该类型的全部任务。
                if (type.includes('.')) {
                    return all.filter(function (item) {
                        return item.startsWith(type);
                    });
                }

                //如果指定了具体，则为单个的任务。
                type = short$name[type] || type;
                return [type];
            }



            //否则为 details 中的。
      
            var list = details.filter(function (item) {
                return all.includes(item);
            });

            return list;
        },

    };




});

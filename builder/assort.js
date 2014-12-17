


/**
* 把照片信息按相机名称、拍照日期、拍照时间进行分类。
* 生成的 assort.json 文件格式如下:
*   {
*       "相机名称": {
            "拍照日期": {
                "拍照时间": "照片id" 或 ["照片id"]
            }
        }
*   }
*/
(function (require) {



    var Process = require('../modules/Process');
    Process.init();

    var id = Process.getUserId();


    var Builder = require('../modules/Builder');

    var json = Builder.assort(id);
    Builder.writeJSON(id, 'assort', json);



})(require);
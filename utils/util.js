/* here are common functions */

//获取到的评分数据(stars)转换成一个由由0和和1组成的数组
//思路：获取到的评分数据类型是两位数，这里不做半星处理，所以只取第一位数字，例如35代表3颗星，先转化成3，在转化成包含三个1两个个0的数组：再由试图成的wx:if处理，1转化成金色星星图片，0转化成没有颜色的星星图片
function convertToStarsArray(stars) {
    var num = stars.toString().substring(0, 1);//number转化成字符串，再截取第一位位
    var array = [];
    for (var i = 1; i <= 5; i++) {
        if (i <= num) {//加入评分为为3（num=3），就会往数组存入3个1
            array.push(1);
        } else {
            array.push(0);
        }
    }
    return array;
}

//请求接口数据
function http(url,callBack) {//url作为参数传入
    var that = this;
    wx.request({
        url: url,
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: { // 设置请求的 header;注意这里的写法！！！
            'Content-Type': 'json'
        },
        success: function (res) {// success之后,调用封装的函数处理获取到的数据
            // console.log(res)
            callBack(res.data);
        }
    })
}

//
function convertToCastString(casts){
    var castsJoin = '';
    for(var idx in casts){
        castsJoin = castsJoin + casts[idx].name + '/';
    }
    return castsJoin.substring(0,castsJoin.length-2);
}

//
function convertToCastInfos(casts){
    var castsArray = [];
    for(var idx in casts){
        var cast = {
            img: casts[idx].avatars ? casts[idx].avatars.large : '',
            name: casts[idx].name
        }
        castsArray.push(cast);
    }
    return castsArray;
}








//暴露一个接口，让其他文件调用
module.exports = {
    convertToStarsArray: convertToStarsArray,
    http: http,
    convertToCastString: convertToCastString,
    convertToCastInfos: convertToCastInfos
}
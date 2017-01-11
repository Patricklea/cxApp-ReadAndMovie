
//引入全局的变量 用来获取定义在全局上的数据
var app = getApp();
//引入公共方法utils.js这个文件
var util = require('../../../utils/util.js');

Page({

  data: {
    movie: {}
  },

  // 页面初始化 options为页面跳转所带来的参数
  onLoad: function (options) {
    // console.log(options)
    var movieId = options.id;
    var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
    util.http(url, this.processDoubanData);//不要忘了this！！
  },//onLoad

  //预览海报图片
  viewMoviePostImg: function(event){
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [src] //需要预览的图片http链接列表
    })
  },

  //处理api返回的数据
  processDoubanData: function (data) {
    // console.log(data)
    if(!data){
      return;
    }
    var director = {
      avatar: '',
      name: '',
      id: ''
    };
    if(data.directors[0] != null){
      if(data.directors[0].avatars != null){
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    };
    var movie = {
      movieImg: data.images ? data.images.large : '',
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.comments_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join('、'),
      stars: util.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary
    };
    this.setData({
      movie: movie
    })
    // console.log(movie)
  }
})


//引入公共方法utils.js这个文件
var util = require('../../utils/util.js');
//引入全局的变量 用来获取定义在全局上的数据
var app = getApp();

Page({

  data: {//这三个对象一定要初始化，否则页面加载的时候找不到这三个变量！
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult:{},
    inputText:'',
    containerShow: true,
    searchPannelShow: false
  },

  onLoad: function (options) {// 页面初始化 options为页面跳转所带来的参数
    //3个api接口
    var inTheaterUrl = app.globalData.doubanBase + '/v2/movie/in_theaters' + '?start=0&count=3';
    var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon' + '?start=0&count=3';
    var top250Url = app.globalData.doubanBase + '/v2/movie/top250' + '?start=0&count=3';

    //调用方法从接口请求数据
    //注意参数的传递过程！
    this.getMovieListData(inTheaterUrl, "inTheaters", "正在上映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "Top250");

  },//onload

  //点击电影进入详情
  onMovieTap:function(event){
    // console.log(event);
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id='+movieId
    })
  },

  //搜索框失去焦点
  onBindBlur:function(event){
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + '/v2/movie/search?q=' + text;
    this.getMovieListData(searchUrl,'searchResult','');
  },

  //搜索框退出
  onCancelImgTap: function () {
    this.setData({
      inputText: '',//搜索框内容清空
      searchResult: '',
      containerShow: true,
      searchPannelShow: false
    });
  },

  //搜索框获得焦点
  onBindFocus: function () {
    this.setData({
      containerShow: false,
      searchPannelShow: true
    })
  },

  //更多电影
  //如何确定‘更多’页面加载哪种类型的数据：视图层标签上把接口传来数据的categoryTitle变量设置为data-自定义属性，通过catchtap事件的event参数传到逻辑层 >> 逻辑层再把拿到的event中的category以url后缀传参形式传给跳转的页面 >> 跳转页面初始化方法中有个option参数，包含了传过来的category;
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category
    })
  },

  //请求接口数据
  getMovieListData: function (url, settedKey, categoryTitle) {//url作为参数传入
    var that = this;
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { // 设置请求的 header;注意这里的写法！！！
        'Content-Type': 'json'
      },
      success: function (res) {// success之后,调用封装的函数处理获取到的数据
        // console.log(res)
        that.processDoubanData(res.data, settedKey, categoryTitle);
      }
    })
  },

  //处理获取到的数据
  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {//标题长度大于6的话截取处理
        title = title.substring(0, 6) + '...'
      };
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),//使用util.js中的方法转化评分格式并赋值给stars
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
    }//for

    var readyData = {};
    readyData[settedKey] = {//readyData对象属性动态赋值！
      categoryTitle: categoryTitle,
      movies: movies
    };
    this.setData(readyData)//数据绑定到到this.data，传递至视图层
    // console.log(readyData)
  }



})//page
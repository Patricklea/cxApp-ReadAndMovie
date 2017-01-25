// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require('../../../utils/util.js');

Page({

  data: {
    movies: {},
    requestUrl: '',
    totalCount: 0,
    isEmpty: true
  },

  onLoad: function (options) {// 监听页面初始化；options为页面跳转所带来的参数
    // console.log(options);
    var category = options.category;
    this.setData({//绑定到到this.data中，利用它把变量传递到wx.setNavigationBarTitle
      navigateTitle: category
    })

    //通过category判断需要加载哪个类型的数据，然后确定对应的url，再向api请求数据；
    var dataUrl = '';
    switch (category) {
      case '正在上映':
        dataUrl = app.globalData.doubanBase + '/v2/movie/in_theaters';
        break;
      case '即将上映':
        dataUrl = app.globalData.doubanBase + '/v2/movie/coming_soon';
        break;
      case 'Top250':
        dataUrl = app.globalData.doubanBase + '/v2/movie/top250';
        break;
    };
    this.setData({//当前页面的api地址存到data中，以便上拉加载时使用
      requestUrl: dataUrl
    })

    //根据上面确定的接口url去发请求获取数据
    //注意这里http()方法是引入util的；而callBack()要通过this引用！
    util.http(dataUrl, this.processDoubanData)

  },//onLoad

  //点击电影进入详情
  onMovieTap: function (event) {
    // console.log(event);
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },

  //下来刷新
  onPullDownRefresh: function () {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();//刷新的时候显示加载进度动画
    this.data.movies = {};
    this.data.isEmpty = true;
  },

  // //上拉加载更多
  // onScrollLower: function () {
  //   var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20';
  //   util.http(nextUrl,this.processDoubanData);
  //   wx.showNavigationBarLoading();//加载的时候显示加载进度动画
  // },

  //上拉加载更多(由于scroll-view组件与onPullDownRefres冲突，所以用onReachBottom方法代替scroll-view组件的上拉属性)
  onReachBottom: function () {
    var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20';
    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();//加载的时候显示加载进度动画
  },

  //监听页面渲染完成
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  },//onReady

  //请求接口数据的方法--http()：封装到公共方法文件utils.js中了,要通过require（path）引入来使用。

  //请求到数据后，对数据处理的回调方法
  processDoubanData: function (moviesDouban) {
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
    };//for

    var totalMovies = [];//声明一个空变量（也可以是别的类型，因为赋值之前都不能确定它的数据类型）
    if (!this.data.isEmpty) {//如果不是第一次加载，就把新数据与现有老数据拼接
      totalMovies = this.data.movies.concat(movies);
    } else {//如果是第一次加载，改变数据的同时，改变this.data.isEmpty的值,因为后面都需要拼接了
      totalMovies = movies;
      this.data.isEmpty = false;
    }

    // console.log(totalMovies)
    this.setData({//数据绑定到到this.data，传递至视图层
      movies: totalMovies
    });
    this.data.totalCount += 20;
    // console.log(this.data.totalCount)
    wx.hideNavigationBarLoading();//数据加载完毕之后加载动画消失
  }

})
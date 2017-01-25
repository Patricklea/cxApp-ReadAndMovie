//引入数据文件。通过引入-data暴露的接口，并赋值给变量postsData
var postsData = require('../../data/posts-data.js')

Page({
  // data:{
  //     // posts_key:[***],
  // },

  onLoad:function(options){
    // 生命周期函数--监听页面加载;options为页面跳转所带来的参数

    //相当于把获取到的数据post_key传到上面的data属性中
    this.setData({
      // posts_key:local_database;
      posts_key:postsData.postList
    })
  },

  //文章摘要跳转到详情页
  onPostTap:function(event){
    // 把自定义属性中设置的id赋值给变量postId
    var postId = event.currentTarget.dataset.postid;
    // console.log(postId);
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+ postId,
    })
  },

  //轮播图跳转到对应文章详情页
  onSwiperTap:function(event){
    console.log(event);
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+ postId,
    })
  }

})
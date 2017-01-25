
var postsData = require('../../../data/posts-data.js');
var app = getApp();

Page({

  data: {
    isPlayingMusic: false
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var postId = options.id;
    // console.log(postId)
    this.setData({
      currentPostId: postId
    });
    //注意借口暴露过来的是是postsData.postList!
    var postData = postsData.postList[postId];
    // console.log(postData);

    this.setData({
      // 把postData中的动态数据绑定到视图层
      postData: postData
    });

    // // 设置缓存
    // wx.setStorageSync('key','缓存')
    // // 修改缓存（键名一样即可）
    // wx.setStorageSync('key','修改了key缓存的内容')

    //设关于文章收藏的缓存格式为为{posts_collected:postsCollected}，其中postsCollected以对象{1:true,2:false..}格式存在
    //先取缓存，如果存在这个值的话，就根据当前文章的id值获取到postCollected（true/false），然后绑定到到this.data
    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected
      })
    } else {
      //如果不存在的话，说明没收藏过，就设为false，同时创建一个缓存
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    };

    //从小程序的全局获取音乐播放状态
    if (app.globalData.g_isPlayingMusic && app.globalData.currentMusicPostId == postId) {
      this.setData({
        isPlayingMusic: true
      })
    };
    //调用监听音乐播放状态的方法
    this.setAudioMonitor();

  },//onLoad

  //收藏按钮点击
  onCollectionTap: function (event) {
    //先获取缓存中所有文章收藏状态
    var postsCollected = wx.getStorageSync('posts_collected');
    // console.log(this.data.currentPostId)
    //根据id从中获取当前文章收藏状态
    var postCollected = postsCollected[this.data.currentPostId];
    //取反，随着点击更换收藏/未收藏的状态
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;

    // //搭配showModal自定义函数的用法
    // this.showModal(postsCollected,postCollected);

    //更新文章是否收藏的缓存
    wx.setStorageSync('posts_collected', postsCollected);
    //更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: postCollected
    })

    //操作提示
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消收藏',
      duration: 800
    })

  },

  // //使用模态框提示
  // showModal: function(postsCollected,postCollected){
  //   //把this保存起来，防止出现指向问题
  //   var that = this;
  //   wx.shouModal({
  //     title: '操作提示',
  //     content: postCollected?"确认收藏？":"取消收藏？",
  //     confirmText: '是的',
  //     cancelText: '不是',
  //     success: function (res) {
  //         if (res.confirm) {
  //             wx.setStorageSync('posts_collected', postsCollected);
  //             // 更新数据绑定变量，从而实现切换图片
  //             that.setData({
  //                 collected: postCollected
  //             })
  //         }
  //     }
  //   })
  // },

  //音乐按钮点击
  onMusicTap: function (event) {
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postList[currentPostId];//注意这里是postsData.postList!

    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {//如果是播放状态，则暂停
      wx.pauseBackgroundAudio();
      //改变视图层图片
      this.setData({
        isPlayingMusic: false
      })
    } else {//如果是暂停状态，则开始
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg,
      });
      //改变视图层图片
      this.setData({
        isPlayingMusic: true
      })
    }
  },

  //一加载就监听音乐播放状态;点击播放按钮和总控开关都会出发这个函数
  setAudioMonitor: function () {
    var that = this;
    wx.onBackgroundAudioPlay(function () {//监听音乐开始播放
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;//改变全局中播放状态的变量
      app.globalData.g_currentMusicPostId = that.data.currentPostId;
      // console.log(app.globalData.g_currentMusicPostId)
    });
    wx.onBackgroundAudioPause(function () {//监听音乐暂停
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
      // console.log(app.globalData.g_currentMusicPostId)
    });
    wx.onBackgroundAudioStop(function () {//监听音乐停止
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
      // console.log(app.globalData.g_currentMusicPostId)
    })
  }

})
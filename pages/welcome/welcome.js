Page({
  data:{
  },
  // onLoad:function(options){
  //   // 生命周期函数--监听页面加载
  //   console.log('load');
  // },
  // onReady:function(){
  //   // 生命周期函数--监听页面初次渲染完成
  //   console.log('ready');
  // },
  // onShow:function(){
  //   // 生命周期函数--监听页面显示
  //   console.log('show');
  // },
  onTap:function(event){
    wx.switchTab({
      url: '../posts/posts',
    });
  }
})
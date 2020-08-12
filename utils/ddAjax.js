let app = getApp();

let userId=app.globalData.userId;

export function ddRequest(method = "POST", url, data) {
  var _this=this;
  return new Promise((resolve, reject) => {
    dd.httpRequest({
      url: url,
      method: method,
      data: data,
      dataType: 'json',
      headers:{
           "Content-Type": "application/json",
            "userId":userId
      },
      success: function (res) {
        console.log(res);
        resolve(res)
      },
      fail: function (res) {
        console.log(res);
        dd.redirectTo({
          url: '/pages/error/error'
      })
        reject(res)
      },
      complete: function (res) {
        console.log(res);
        dd.hideLoading();
      }
    });
  })
}



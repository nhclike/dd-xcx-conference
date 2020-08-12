function ddRequest(method = "GET", url, data, onComplete) {
  return new Promise((resolve, reject) => {
    dd.httpRequest({
      url: url,
      method: method,
      data: data,
      dataType: 'json',
      headers:{
            'a':1
          },
      success: function (res) {
        resolve(res.data)
      },
      fail: function (res) {
        reject(res)
      },
      complete: function (res) {
        if (onComplete && typeof onComplete == "function") {
          onComplete(res)
        }
      }
    });
  })
}


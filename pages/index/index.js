let app = getApp();
//替换成开发者后台设置的安全域名
import { loginUrl,getConfListOnline } from "../../utils/config"
import { ddRequest } from "../../utils/ddAjax";
//let url = "http://abcde.vaiwan.com";
//若要在测试应用中临时使用类似abcdef.vaiwan.com 的二级域名代理到无公网IP的服务端开发环境，
//请参考内网穿透工具，注意：内网穿透工具是用于开发测试，当前不保证多个开发者随意设置相同的子域名导致的冲突以及通道稳定性，因此正式应用、正式环境必须是真实的公网IP或者域名，正式应用上线不能使用本工具。
//https://ding-doc.dingtalk.com/doc#/kn6zg7/hb7000
import ErrorView from '../../components/error-view';

Page({
    ...ErrorView,

    data:{
        errorData: {
            type: 'noMeeting',
            title: '',
            button: '刷新',
            onButtonTap: 'handleBack',
            href: '/pages/index/index'
        },
        authCode:'',
        userId:'',   //后台返回的用户id用来查询会议
        confList:[  //会议列表数据
        //  {
        //   type:0,   //0党组会1审委会---是否显示列席人(只有党组会显示列席人)
        //   typeName:'党组会',
        //   id: "89628072-14fc-4c4c-8545-b40d7ce5ad0c",
        //   name:'2019年第1115次会议',
        //   presenterName:'李占国',
        //   status: 0, // 状态
	    //     	 statusName: "待召开", //状态
        //   startTime:'2019/07/10 14:30',
        //   arrivedNum:4,
        //   leaveNum:5,
        //   attendNum:6,
        //   attendData:'张三,李四,王五,赵六张三,李四,王五,赵六张三,李四,王五,赵六张三,李四,王五,赵六'
        // },
        // {
        //   type:1,
        //   typeName:'审委会',
        //   id: "89628072-14fc-4c4c-8545-b40d7ce5ad0c",
        //   name:'2019年第15次会议',
        //   presenterName:'李占国',
        //   status: 0, // 状态
	    //     	 statusName: "待召开", //状态
        //   startTime:'2019/07/10 14:30',
        //   arrivedNum:4,
        //   leaveNum:5,
        //   attendNum:6,
        //   attendData:null  //审委会去掉列席人员
        // }
        ],
        isBlank:false

    },
    //无会议刷新事件
    handleBack() {
        dd.showToast({
          content: "正在刷新",
          success: (res) => {
            setTimeout(() => {
              dd.reLaunch({
                url: '/pages/index/index'
                })  
            },20);
          },
        });
    },
    onLoad(){
        this.getUserId();

       
        
    },
    onShow(){
     
    
    },
    //请求后台接口获取用户信息
    getUserId(){
        let _this = this;
        //获取免登录授权码
        dd.getAuthCode({
            success:(res)=>{
                _this.setData({
                    authCode:res.authCode
                })
                
                //根据授权码换取用户信息(pc端不行)
                dd.httpRequest({
                    url: loginUrl,
                    method: 'POST',
                    data: {
                        authCode: res.authCode
                    },
                    dataType: 'json',
                    success: function(res) {
                        
                        let userInfo = res.data.result;
                        console.log("success---userInfo",userInfo);
                        //全局存储用户id
                        app.globalData.userId=userInfo.userId;
                        //发钉
                        //_this.sendDing()
                        //根据用户id查询当前会议
                        _this.getConfList();

                    },
                    fail: function(res) {
                        dd.alert({content: JSON.stringify(res)});
                    },
                    complete: function(res) {
                    }
                    
                });
            },
            fail: (err)=>{
                dd.alert({
                    content: JSON.stringify(err)
                })
            }
        })
    },
    
    // 跳转到详情页面--传递参数会议id
    toDetail(e){
      //审委会(隐藏详情入口)
     let confId=e.target.dataset.value;
     let type=e.target.dataset.type;
     let page='/pages/detail/detail?confId='+confId+'&type='+type;
      dd.navigateTo({ url: page });
    },
    // 下拉刷新事件
    onPullDownRefresh() {
      console.log('onPullDownRefresh', new Date());
      this.getConfList();
      setTimeout(() => {
        dd.stopPullDownRefresh();
      }, 20);
    },
    //根据用户id获取会议列表
    getConfList(){
      var _this=this;
      let userId=app.globalData.userId;
      dd.showLoading({
        content: '加载中...',
      });
      dd.httpRequest({
          headers:{
          "Content-Type": "application/json",
          "userId":userId
        },
          url: getConfListOnline, 
          method: 'POST',
          data:JSON.stringify(
            {
              userId:userId,
            }
          ) ,
          dataType: 'json',
          success: function(res) {
              console.log("success---getConfList",res);
                  //如果此人没有权限直接进入error页面
                // let page='/pages/error/error';
                // dd.navigateTo({ url: page });
              const confList=res.data.result;
              if(!!confList){
                _this.setData({
                  confList
                })
              }
              else{
                _this.setData({
                  'isBlank':true
                })
              }
          },
          fail: function(res) {
          },
          complete: function(res) {
              dd.hideLoading();
          }
          
      });
      
    },
    sendDing(){
      let userId=app.globalData.userId;
      let corpId=app.globalData.corpId;

      dd.createDing({
         users: [userId], //默认选中用户工号列表；类型: Array<String>
         corpId: corpId, // 类型: String
         alertType: 1, // 钉发送方式 0:电话, 1:短信, 2：应用内；类型 Number
         //alertDate: {"format":"yyyy-MM-dd HH:mm", "value":"2019-08-29 08:25"}, // 非必选，定时发送时间, 非定时DING不需要填写
         type: 1,// 附件类型 1：image, 2：link；类型: Number
         
         // 非必选
         // 附件信息
         attachment: {
            images: ["https://www.baidu.com/img/bd_logo1.png?where=super"], // 图片附件, type=1时, 必选；类型: Array<String>
            //image: "https://www.baidu.com/img/bd_logo1.png?where=super", // 链接附件, type=2时, 必选；类型: String    
            //title: "这是一个测试", // 链接附件, type=2时, 必选；类型: String
            //url: "https://www.baidu.com/", // 链接附件, type=2时, 必选；类型 String
            //text: "测试发钉成功" // 链接附件, type=2时, 必选；类型: String
         },
         
         text: '创建钉消息测试',  // 正文
         bizType :2, // 业务类型 0：通知DING；1：任务；2：会议；
        
         // 任务信息
         // bizType=1的时候选填
        //  taskInfo: {    
        //     ccUsers: [userId],// 抄送用户列表, 工号，类型: Array<String>
        //     deadlineTime: {"format":"yyyy-MM-dd HH:mm", "value":"2020-08-11 14:55"}, // 任务截止时间    
        //     taskRemind: 30 // 任务提醒时间, 单位分钟；支持参数: 0：不提醒；15：提前15分钟；60：提前1个小时；180：提前3个小时；1440：提前一天；类型: Number
        //  },
        
         // 日程信息
         // bizType=2的时候选填
         confInfo: {      
            bizSubType: 0,  // 子业务类型如会议: 0:预约会议, 1:预约电话会议, 2:预约视频会议；类型: Number (注: 目前只有会议才有子业务类型)；
            location: '测试会议室', // 会议地点(非必选)，类型: String    
            startTime: {"format":"yyyy-MM-dd HH:mm", "value":"2020-08-11 15:00"},// 会议开始时间  
            endTime: {"format":"yyyy-MM-dd HH:mm", "value":"2020-08-11 17:00"},// 会议结束时间    
            remindMinutes: 30, // 会前提醒。单位分钟；1:不提醒, 0:事件发生时提醒, 5:提前5分钟, 15:提前15分钟, 30:提前30分钟, 60:提前1个小时, 1440:提前一天
            remindType: 2 // 会议提前提醒方式；0:电话, 1:短信, 2:应用内；类型: Number
         },
        
         success:function(res){
            /*
            {
             "dingId": "1_1_a09f167xxx",
             "text": "钉正文内容",
             "result": true
            }
            */  
           dd.alert({
             content:JSON.stringify(res)
           })
         },
         fail:function(err){
           dd.alert({
             content:JSON.stringify(err)
           })
         }
      })
    }
})

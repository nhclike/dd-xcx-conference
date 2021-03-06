let app = getApp();
const PAGENUM=5; //每次拿5条数据
import { getConfListHistory } from "../../utils/config"
import ErrorView from '../../components/error-view';
import { ddRequest } from "../../utils/ddAjax";

Page({
  ...ErrorView,

  data: {
   errorData: {
     type: 'noHistory',
     title: '未查询到历史会议',
     button: '刷新',
     onButtonTap: 'handleBack',
     href: '/pages/historyConference/historyConference'
   },
   confList:[  //会议列表数据
  //   {
  //    type:0,   //0党组会1审委会---是否显示列席人(只有党组会显示列席人)
  //    typeName:'党组会',
  //    id: "89628072-14fc-4c4c-8545-b40d7ce5ad0c",
  //    name:'2019年第1115次会议',
  //    presenterName:'李占国',
  //    status: 0, // 状态
	// 	 statusName: "待召开", //状态
  //    startTime:'2019/07/10 14:30',
  //    arrivedNum:4,
  //    leaveNum:5,
  //    attendNum:6,
  //    attendData:'张三,李四,王五,赵六张三,李四,王五,赵六张三,李四,王五,赵六张三,李四,王五,赵六'
  //  },
  //  {
  //    type:1,
  //    typeName:'审委会',
  //    id: "89628072-14fc-4c4c-8545-b40d7ce5ad0c",
  //    name:'2019年第15次会议',
  //    presenterName:'李占国',
  //    status: 0, // 状态
	// 	 statusName: "待召开", //状态
  //    startTime:'2019/07/10 14:30',
  //    arrivedNum:4,
  //    leaveNum:5,
  //    attendNum:6,
  //    attendData:null  //审委会去掉列席人员
  //  }
   ],
   isActive:true,  //tab切换显示
   isMore:true,    //是否有下页数据
   curPage:0,          //分页显示历史会议
   totalPage:0,       //总会议数
   type:0,          //区分党组会审委会---0党组会1审委会---记录当前选中的tab
   isBlank:false

  },
   //无会议刷新事件
  handleBack() {
    var _this=this;
    dd.showToast({
      content: "正在刷新",
      success: (res) => {
        setTimeout(() => {
            _this.getConfList(); 
        },20);
      },
    });
  },
  onLoad(query){
    //根据用户id拿到会议列表
    this.getConfList();
  },
  onShow(){
    
    
  },
  // 跳转到详情页面--传递参数会议id
  toDetail(e){
    //审委会(隐藏详情入口)
    let confId=e.target.dataset.value;
    let type=e.target.dataset.type;
    if(type==0){
      let page='/pages/detail/detail?confId='+confId+'&type='+type;
      dd.navigateTo({ url: page });
    }
    
  },
  // tab切换事件
  toggleTab(e){
    const isActive=!this.data.isActive;
    let _this=this;
    let val=e.target.dataset.value;
    //dd.alert({content: "当前点击的是"+val});
    if(this.data.type==val){  //重复点击相同的tab
      return false;
    }
    //切换的时候重置页面状态
    this.setData({
      isActive,
      'type':val,
      'curPage':0,
      'confList':[],
      'isMore':true,
      'isBlank':false
    });
    setTimeout(function(){
      _this.getConfList();
    },20)
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
      content: '加载中...'
    });
    let params= JSON.stringify({
            userId:userId,
            pageNo:_this.data.curPage,    //默认显示前5条---主要用于历史会议的分页显示
            type:_this.data.type    //0党组会,1审委会
    });
    ddRequest('post',getConfListHistory,params).then((res)=>{
      console.log("success---getConfList",res);
      if(!!res.data.result){
        let confArr=res.data.result.rows;
        let totalPage=res.data.result.total;
        var confData=_this.data.confList.concat(confArr);
        _this.setData({
          'confList':confData,
          totalPage
        })
      }else{
        _this.setData({
          'isBlank':true
        })
      }
    }).catch((err)=>{
      console.log(err);
    })
  },
  //历史会议较多时分页加载每次加载5个
  loadMore(){
    console.log("loadMoreConference");
    //触发此事件说明已经拉到底部,拉取下页数据
    if(!this.data.isMore){
      return ;
    }
    if((this.data.curPage+1)*PAGENUM<this.data.totalPage){
      const curPage=++this.data.curPage;
      this.setData({
        curPage
      })
      //请求下页数据
      this.getConfList();
    }
    else{
      // dd.alert({
      //   content:'没有更多数据'
      // })
      this.setData({
        'isMore':false
      })
      console.log("没有更多数据!");
    }
    

  },

  scroll(e) {
    //console.log(e.detail.scrollTop);
  }
})
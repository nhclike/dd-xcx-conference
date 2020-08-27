//接口配置
//const BASE_URL="https://courtding.nblhtech.com";
const BASE_URL="https://courtding.xsnls.com";

export const configAjaxObj={
  timeout:30000
}
export const loginUrl=BASE_URL+"/login"           //用户免登录
export const getConfListOnline=BASE_URL+"/dingApi/conference/online"     //获取待开会议会议列表
export const getConfListHistory=BASE_URL+"/dingApi/conference/history"     //获取历史会议会议列表
export const getConfDetail=BASE_URL+"/dingApi/conference/info"     //获取会议详情

import ErrorView from '../../components/error-view';

Page({
    ...ErrorView,
    data: {
        errorData: {
            type: 'noMeeting',
            title: '暂无会议',
            button: '刷新',
            onButtonTap: 'handleBack',
            href: '/pages/index/index'
        },
    },
    handleBack() {
        dd.showToast({
          content: '正在加载',
          success: (res) => {
            setTimeout(() => {
                dd.reLaunch({
                    url:'/pages/index/index'
                });
            }, 200);
          },
        });
    }
})
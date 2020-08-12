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
          content: 'back to pages/index in 1s',
          success: (res) => {
            setTimeout(() => {
                dd.navigateBack();
            }, 1000);
          },
        });
    }
})
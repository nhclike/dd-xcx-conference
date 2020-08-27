import ErrorView from '../../components/error-view';

Page({
    ...ErrorView,
    data: {
        errorData: {
            type: 'update',
            title: '系统正在维护,请稍候再试',
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
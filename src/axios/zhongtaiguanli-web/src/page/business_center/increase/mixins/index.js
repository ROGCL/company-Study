export const Mydata = {
    data() {
        return {
            systemIds: [
                { id: '1', title: 'Android' },
                { id: '2', title: 'ios' },
                { id: '3', title: '小程序' },
            ],
            timeType: [
                { id: '1', title: '日' },
                { id: '2', title: '周' },
                { id: '3', title: '月' },
            ],
            tableOpt: {
                currentPage: 1,
                pageSize: 10,
            },
            dimensionalData: [
                {
                  title: '日期',
                  value: 1000
                },
                {
                  title: '项目',
                  value: 1003,
                },
                {
                  title: '部门',
                  value: 1001
                },
                {
                  title: '项目组',
                  value: 1002
                },
                {
                  title: '应用',
                  value: 1004
                },
                {
                  title: '系统',
                  value: 1005
                },
              ],
        }
    }
}
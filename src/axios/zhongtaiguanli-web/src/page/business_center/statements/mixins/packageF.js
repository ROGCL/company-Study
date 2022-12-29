import moment from 'moment'
export const Mydata = {
    data() {
        return {
            keyArr:['repurchase_rate','first_pay_user_rate','ql_cycle','cycle'],//百分比
            numKeyArr:['device_new','total_first_pay_user','people',"ql_number","first_pay_user","number"],//取整科学计数
            truncArr:['repurchase_price','money'],//保留两位小数科学计数
            fourNumArr:['repurchase_cost'],
            Period: [{
                    value: '1',
                    label: '1日复购'
                },
                {
                    value: '2',
                    label: '2日复购'
                },
                {
                    value: '3',
                    label: '3日复购'
                },
                {
                    value: '4',
                    label: '4日复购'
                },
                {
                    value: '5',
                    label: '5日复购'
                },
                {
                    value: '6',
                    label: '6日复购'
                },
                {
                    value: '7',
                    label: '7日复购'
                },
                {
                    value: '14',
                    label: '14日复购'
                },
                {
                    value: '30',
                    label: '30日复购'
                },
                {
                    value: '60',
                    label: '60日复购'
                },
                {
                    value: '90',
                    label: '90日复购'
                },
                {
                    value: '180',
                    label: '180日复购'
                },
                {
                    value: '365',
                    label: '365日复购'
                },
            ],
            Fnum: [{
                    value: '1',
                    label: '第一次复购'
                },
                {
                    value: '2',
                    label: '第二次复购'
                },
                {
                    value: '3',
                    label: '第三次复购'
                },
            ],
            systemIds: [{
                    id: '1',
                    title: 'Android'
                },
                {
                    id: '2',
                    title: 'ios'
                },
                {
                    id: '3',
                    title: '小程序'
                },
            ],
            apps: [],
            column: [{
                    label: '时间',
                    prop: 'date',
                },
                {
                    label: '新增',
                    prop: 'aaa',
                },
                {
                    label: '首购总人数',
                    prop: 'bbb',
                },
                {
                    label: '30日复购率',
                    prop: 'ccc',
                },
                {
                    label: '30日复购客单价',
                    prop: 'ddd',
                },
                {
                    label: '30日复购价值',
                    prop: 'eee',
                },
                {
                    label: '30日复购人数',
                    prop: 'fff',
                },
                {
                    label: '30日复购金额',
                    prop: 'ggg',
                },
            ],
            Goodscolumn: [{
                    label: '时间',
                    prop: 'date',
                },
                {
                    label: '新增',
                    prop: 'aaa',
                },
                {
                    label: '首购总人数',
                    prop: 'total_first_pay_user',
                },
                {
                    label: '首购套餐名称',
                    prop: 'goods_name',
                },
                {
                    label: '首购套餐人数',
                    prop: 'first_pay_user',
                },
                {
                    prop: 'first_pay_user_rate',
                    label: "首购套餐占比"
                },
                {
                    label: '30日复购率',
                    prop: 'ccc',
                },
                {
                    label: '30日复购客单价',
                    prop: 'ddd',
                },
                {
                    label: '30日复购价值',
                    prop: 'eee',
                },
                {
                    label: '30日复购人数',
                    prop: 'fff',
                },
                {
                    label: '30日复购金额',
                    prop: 'ggg',
                },
            ],
            GoodsMovecolumn: [{
                    label: '时间',
                    prop: 'date',
                },
                {
                    label: '新增',
                    prop: 'aaa',
                },
                {
                    label: '首购总人数',
                    prop: 'total_first_pay_user',
                },
                {
                    label: '首购套餐名称',
                    prop: 'goods_name',
                },
                {
                    label: '首购套餐人数',
                    prop: 'first_pay_user',
                },
                {
                    prop: 'first_pay_user_rate',
                    label: "首购套餐占比"
                },
                {
                    label: '30日复购率',
                    prop: 'ccc',
                },
                {
                    label: '30日复购客单价',
                    prop: 'ddd',
                },
                {
                    label: '30日复购价值',
                    prop: 'eee',
                },
                {
                    label: '30日复购人数',
                    prop: 'fff',
                },
                {
                    label: '30日复购金额',
                    prop: 'ggg',
                },
            ],
            pickerOptions: {
                shortcuts: [{
                        text: '昨天',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '近一周',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '近30天',
                        onClick(picker) {
                            const start = moment().subtract(1, 'months').format('YYYY-MM-DD')
                            const end = moment().format('YYYY-MM-DD')
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '近60天',
                        onClick(picker) {
                            const start = moment().subtract(2, 'months').format('YYYY-MM-DD')
                            const end = moment().format('YYYY-MM-DD')
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '近90天',
                        onClick(picker) {
                            const start = moment().subtract(3, 'months').format('YYYY-MM-DD')
                            const end = moment().format('YYYY-MM-DD')
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '本月',
                        onClick(picker) {
                            const end = new Date();
                            const years = end.getFullYear();
                            const mouths = end.getMonth() + 1;
                            const start = new Date(years + '-' + mouths + '-01');
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '上个月',
                        onClick(picker) {
                            const preMonth = moment().subtract(1, 'months').endOf('month')
                            const end = preMonth.format('YYYY-MM-DD')
                            const start = preMonth.format('YYYY-MM-01')
                            picker.$emit('pick', [start, end])
                        }
                    }
                ],
                disabledDate(time) {
                    return time.getTime() > Date.now() - 24 * 3600 * 1000;
                }
            },
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 24 * 3600 * 1000;
                }
            },
        }
    },
}
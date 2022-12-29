import moment from 'moment'
export const Mydata = {
  data () {
    return {
      compareKey: [],
      key: [],
      keyNumArr:[7,8,17,18,22,24,26,28,30],
      systemIds: [
        { id: '1', title: 'Android' },
        { id: '2', title: 'ios' },
        { id: '3', title: '小程序' },
      ],
      titleArr: [ '昨日毛利率', '本年累计毛利率' ],
      nameArr: [ '首日ROI', '毛利率', '新增活跃比', '买量新增比', '订单收入占比', '广告收入占比', '商店支出占比', '信息流支出占比', '百度支出占比' ,'新增用户次留','活跃用户次留'],
      numberArr:['百度CPI','ARPU值','会员ARPU','广告ARPU','买量CPI','商店CPI','信息流CPI'],
      keyArr: [ 'roi_day1', 'gross_margin_per', 'device_active_per', 'pay_acquisitions_new_per', 'order_income_per', 'ad_income_per', 'cpd_invest_per', 'fd_invest_per', 'bd_invest_per' ],
      numKeyArr: [ 'date',"project", 'department_title', 'group_title', 'app_title', 'system_title', 'roi_day1', 'gross_margin_per', 'device_active_per', 'pay_acquisitions_new_per', 'order_income_per', 'ad_income_per', 'cpd_invest_per', 'fd_invest_per', 'bd_invest_per','arpu','user_arpu','ad_arpu','pay_acquisitions_cpi','cpd_cpi','fd_cpi','bd_cpi' ],
      timeType: [
        { id: '1', title: '日' },
      ],
      column: [
        {
          label: '时间',
          prop: 'date',
        },
        {
          label:'项目',
          prop: 'project',
        },
        {
          label: '部门',
          prop: 'department_title',
        },
        {
          label: '项目组',
          prop: 'group_title',
        },
        {
          label: '应用',
          prop: 'app_title',
        },
        {
          label: '系统',
          prop: 'system_title',
        },
        {
          label: '新增',
          prop: 'device_new',
          sortable: 'custom',
        },
        {
          label: '活跃',
          prop: 'device_active',
          sortable: 'custom',
        },
        {
          label: '启动',
          prop: 'open_times',
          sortable: 'custom',
        },
        {
          label: '买量',
          prop: 'pay_acquisitions',
          sortable: 'custom',
        },
        {
          label: '收入',
          prop: 'income_all',
          sortable: 'custom',
        },
        {
          label: '支出',
          prop: 'invest_all',
        },
        {
          label: '毛利',
          prop: 'gross_margin',
        },
        {
          label: '毛利率',
          prop: 'gross_margin_per',
        },
        {
          label: '首日ROI',
          prop: 'roi_day1',
        },
        {
          label: 'ARPU值',
          prop: 'arpu',
        },
        {
          label: '会员ARPU',
          prop: 'user_arpu',
        },
        {
          label: '广告ARPU',
          prop: 'ad_arpu',
        },
        {
          label: '买量CPI',
          prop: 'pay_acquisitions_cpi',
        },
        {
          label: '商店CPI',
          prop: 'cpd_cpi',
        },
        {
          label: '信息流CPI',
          prop: 'fd_cpi',
        },
        {
          label: '百度CPI',
          prop: 'bd_cpi',
        },
        {
          label: '人均启动频次',
          prop: 'open_times_avg',
        },
        {
          label: '新增活跃比',
          prop: 'device_active_per',
        },
        {
          label: '买量新增比',
          prop: 'pay_acquisitions_new_per',
        },
        {
          label: '新增用户次留',
          prop: 'device_new_keep',
        },
        {
          label: '活跃用户次留',
          prop: 'device_active_keep',
        },
        {
          label: '订单收入',
          prop: 'order_income',
          sortable: 'custom',
        },
        {
          label: '订单收入占比',
          prop: 'order_income_per',
        },
        {
          label: '广告收入',
          prop: 'ad_income_all',
          sortable: 'custom',
        },
        {
          label: '广告收入占比',
          prop: 'ad_income_per',
        },
        {
          label: '商店支出',
          prop: 'cost_app',
          sortable: 'custom',
        },
        {
          label: '商店支出占比',
          prop: 'cpd_invest_per',
        },
        {
          label: '信息流支出',
          prop: 'cost_feed',
          sortable: 'custom',
        },
        {
          label: '信息流支出占比',
          prop: 'fd_invest_per',
        },
        {
          label: '百度支出',
          prop: 'cost_baidu',
          sortable: 'custom',
        },
        {
          label: '百度支出占比',
          prop: 'bd_invest_per',
        },
      ],
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
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      comparison_data: [
        {
          title: '指标对比',
          value: 1
        },
        {
          title: '维度对比',
          value: 2
        },
        {
          title: '时间对比',
          value: 3
        },
      ],
      infoDeparts: [],
      DashboardSetting: {
        basename: '',
        children: []
      },
      apps: [],
      sort: {
        prop: '',
        order: ''
      },
      checked: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '昨天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [ start, end ])
            }
          },
          {
            text: '近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [ start, end ])
            }
          }, {
            text: '近30天',
            onClick (picker) {
              const start = moment().subtract(1, 'months').format('YYYY-MM-DD')
              const end = moment().format('YYYY-MM-DD')
              picker.$emit('pick', [ start, end ])
            }
          }, {
            text: '近60天',
            onClick (picker) {
              const start = moment().subtract(2, 'months').format('YYYY-MM-DD')
              const end = moment().format('YYYY-MM-DD')
              picker.$emit('pick', [ start, end ])
            }
          }, {
            text: '近90天',
            onClick (picker) {
              const start = moment().subtract(3, 'months').format('YYYY-MM-DD')
              const end = moment().format('YYYY-MM-DD')
              picker.$emit('pick', [ start, end ])
            }
          }, {
            text: '本月',
            onClick (picker) {
              const end = new Date();
              const years = end.getFullYear();
              const mouths = end.getMonth() + 1;
              const start = new Date(years + '-' + mouths + '-01');
              picker.$emit('pick', [ start, end ])
            }
          }, {
            text: '上个月',
            onClick (picker) {
              const preMonth = moment().subtract(1, 'months').endOf('month')
              const end = preMonth.format('YYYY-MM-DD')
              const start = preMonth.format('YYYY-MM-01')
              picker.$emit('pick', [ start, end ])
            }
          }
        ],
        disabledDate (time) {
          return time.getTime() > Date.now() - 24 * 3600 * 1000;
        }
      },
      pickerOptions0: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 24 * 3600 * 1000;
        }
      },
    }
  },
}
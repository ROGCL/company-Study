import moment from 'moment'
export const Mydata = {
  data () {
    return {
      timeType: [
        { id: '1', title: '日' },
      ],
      apps: [],
      keyNumArr:[32,49,35,37,38],
      systemIds: [
        { id: '1', title: 'Android' },
        { id: '2', title: 'ios' },
        { id: '3', title: '小程序' },
      ],
      adtypemine_id: [],
      adpositionid_id: [],
      ad_platform: [],
      numberArr:['广告ARPU', 'CPC'],
      // cpc
      nameArr: [ '占总收入占比','占广告收入占比', 'CTR', '填充率', '展示率' ],
      keyArr: [ 'cost_rate', 'ad_ctr', 'ad_gft', 'ad_show_rate','all_cost_rate' ],
      numKeyArr: ['ad_arpu_two', 'app_key_oth', 'ad_title', 'ad_id', 'th_cate', 'bu_adpositionid_id', 'bu_adtypemine_id', 'date','placement_id_oth', 'department_title','project', 'group_title', 'app_title', 'system_title', 'cost_rate', 'ad_ctr', 'ad_gft', 'ad_show_rate', 'all_cost_rate', 'ad_cpc'],
      ad_id: [],
      title: [],
      app_key_oth: [],
      comparison_data: [
        {
          title: '指标对比',
          value: 1,
        },
        {
          title: '维度对比',
          value: 2,
        },
        {
          title: '时间对比',
          value: 3,
        },
      ],
      dimensionalData: [
        {
          title: '日期',
          value: 1000,
        },
        {
          title: '项目',
          value: 1003,
        },
        {
          title: '应用',
          value: 1004,
        },
        {
          title: '系统',
          value: 1005,
        },
        {
          title: '广告类型',
          value: 1007,
        },
        {
          title: '广告位',
          value: 1008,
        },
        {
          title: '收入渠道',
          value: 1006,
        },
        {
          title: 'ADID',
          value: 1009,
        },
        {
          title: '广告名称',
          value: 1010,
        },
        {
          title: '三方媒体ID',
          value: 1011,
        },
        {
          title: '三方广告位id',
          value: 1012,
        },
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
          label: '应用',
          prop: 'app_title',
        },
        {
          label: '系统',
          prop: 'system_title',
        },
        {
          label: '广告类型',
          prop: 'bu_adtypemine_id',
        },
        {
          label: '广告位',
          prop: 'bu_adpositionid_id',
        },
        {
          label: '收入渠道',
          prop: 'th_cate',
        },
        {
          label: 'ADID',
          prop: 'ad_id',
        },
        {
          label: '广告名称',
          prop: 'ad_title',
        },
        {
          label: '三方媒体id',
          prop: 'app_key_oth',
        },
        {
          label: "三方广告位id",
          prop: "placement_id_oth",
        },
        {
          label: '广告收入',
          prop: 'cost',
          sortable: 'custom',
        },
        {
          label: '占总收入占比',
          prop: 'all_cost_rate',
        },
        {
          label: '占广告收入占比',
          prop:'cost_rate'
        },
        {
          label: '广告ARPU',
          prop: 'ad_arpu_two',
        },
        {
          label: 'ECPM',
          prop: 'ad_ecpm',
          sortable: 'custom',
        },
        {
          label: 'CTR',
          prop: 'ad_ctr',
          sortable: 'custom',
        },
        {
          label: 'CPC',
          prop: 'ad_cpc',
          sortable: 'custom',
        },
        {
          label: '填充率',
          prop: 'ad_gft',
          sortable: 'custom',
        },
        {
          label: '展示率',
          prop: 'ad_show_rate',
          sortable: 'custom',
        },
        {
          label: '人均广告次数',
          prop: 'ad_show_avg_active',
        },
        {
          label: '次均广告次数',
          prop: 'ad_show_avg_start',
        },
        {
          label: '请求数（本地）',
          prop: 'request',
          sortable: 'custom',
        },
        {
          label: '下发数（本地）',
          prop: 'return',
          sortable: 'custom',
        },
        {
          label: '展示数（本地）',
          prop: 'show',
          sortable: 'custom',
        },
        {
          label: '点击数（本地）',
          prop: 'click',
          sortable: 'custom',
        },
        {
          label: '请求数（第三方）',
          prop: 'request_th',
          sortable: 'custom',
        },
        {
          label: '下发数（第三方）',
          prop: 'return_th',
          sortable: 'custom',
        },
        {
          label: '展示数（第三方）',
          prop: 'show_th',
          sortable: 'custom',
        },
        {
          label: '点击数（第三方）',
          prop: 'click_th',
          sortable: 'custom',
        },
        {
          label: '人均广告请求频次',
          prop: 'man_ad_frequency',
        },
        {
          label: '次均广告请求频次',
          prop: 'times_ad_frequency',
        },
        {
          label: '现位置人均请求频次',
          prop: 'man_req_frequency',
        },
        {
          label: '现位置人均展示频次',
          prop: 'man_show_frequency',
        },
      ],
      DashboardSetting: {
        basename: '',
        children: []
      },
      pictLoading: false,
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
          return time.getTime() > Date.now() - 24*3600*1000;
        }
      },
      pickerOptions0: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 24*3600*1000;
        }
      }
    }
  }
}
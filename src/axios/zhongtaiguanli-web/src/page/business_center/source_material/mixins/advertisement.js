import moment from 'moment'
export const Mydata = {
  data () {
    return {
      timeType: [
        { id: '1', title: '日' },
      ],
      apps: [],
      systemIds: [
        { id: '1', title: 'Android' },
        { id: '2', title: 'ios' },
      ],
      adtypemine_id: [],
      adpositionid_id: [],
      ad_platform: [],
      numberArr:[],
      nameArr:['点击率','安卓下载开始率','安卓下载完成率','安卓安装完成率','激活率','首次付费率','99%进度播放率','25%进度播放率','50%进度播放率','75%进度播放率','播放10s率','播放5s率','播放3s率','播放2s率','播放完成率','次留率'],
      keyArr: [ 'convert_rate','ctr','download_start_rate','download_finish_rate','install_finish_rate','active_rate', 'active_pay_rate','play_100_feed_break_rate','play_75_feed_break_rate','play_50_feed_break_rate','play_25_feed_break_rate','play_duration_10s_rate','play_duration_5s_rate','play_duration_3s_rate','play_duration_2s_rate','play_over_rate','event_next_day_stay_ratio'],
      numKeyArr: [ 'cost','show','click','avg_show_cost','download_start','download_finish','install_finish','active','active_pay_cost','play_100_feed_break','play_75_feed_break','play_50_feed_break','play_25_feed_break','play_duration_10s','play_duration_3s','play_duration_2s','play_duration_sum','total_play','play_over','like','comment','custom','event_next_day_stay' ],
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
          value: 1001,
        },
        {
          title: '应用',
          value: 1002,
        },
        {
          title: '系统',
          value: 1003,
        },
        {
          title: '投放平台',
          value: 1004,
        },
        {
          title: '投放渠道',
          value: 1005,
        },
        {
          title: '素材ID',
          value: 1006,
        },
      ],
      column: [
        {
          label: '日期',
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
          label: '投放平台',
          prop: 'platform',
        },
        {
          label: '投放渠道',
          prop: 'channel',
        },
        {
          label: '视频',
          prop: 'material_id',
        },
        {
          label: '总花费',
          prop: 'cost',
          sortable: 'custom',
          width:"100"
        },
        {
          label: '曝光数',
          prop: 'show',
          sortable: 'custom',
          width:"100"
        },
        {
          label: '点击数',
          prop:'click',
          sortable: 'custom',
          width:"100"
        },
        {
          label: '点击率',
          prop: 'ctr',
          width:"100"
        },
        {
          label: '平均点击单价',
          prop: 'avg_click_cost',
          width:"120"
        },
        {
          label: '平均千次展现费用',
          prop: 'avg_show_cost',
          width:"150"
        },
        {
          label: '安卓下载开始数',
          prop: 'download_start',
          sortable: 'custom',
        },
        {
          label: '安卓下载开始成本',
          prop: 'download_start_cost',
          width:"150"
        },
        {
          label: '安卓下载开始率',
          prop: 'download_start_rate',
          width:"135"
        },
        {
          label: '安卓下载完成数',
          prop: 'download_finish',
          sortable: 'custom',
        },
        {
          label: '安卓下载完成成本',
          prop: 'download_finish_cost',
          width:"150"
        },
        {
          label: '安卓下载完成率',
          prop: 'download_finish_rate',
          width:"135"
        },
        {
          label: '安卓安装完成数',
          prop: 'install_finish',
          sortable: 'custom',
        },
        {
          label: '安卓安装完成成本',
          prop: 'install_finish_cost',
          width:"150"
        },
        {
          label: '安卓安装完成率',
          prop: 'install_finish_rate',
          width:"135"
        },
        {
          label: '激活数',
          prop: 'active',
          sortable: 'custom',
          width:"100"
        },
        {
          label: '激活成本',
          prop: 'active_cost',
          width:"100"
        },
        {
          label: '激活率',
          prop: 'active_rate',
          width:"100"
        },
        {
          label: '首次付费次数',
          prop: 'pay_count',
          sortable: 'custom',
        },
        {
          label: '首次付费成本',
          prop: 'active_pay_cost',
          width:"124"
        },
        {
          label: '首次付费率',
          prop: 'active_pay_rate',
          
        },
        {
          label: '99%进度播放数',
          prop: 'play_100_feed_break',
          sortable: 'custom',
        },
        {
          label: '99%进度播放率',
          prop: 'play_100_feed_break_rate',
          width:"150"
        },
        {
          label: '75%进度播放数',
          prop: 'play_75_feed_break',
          sortable: 'custom',
        },
        {
          label: '75%进度播放率',
          prop: 'play_75_feed_break_rate',
          width:"150"
          
        },
        {
          label: '50%进度播放数',
          prop: 'play_50_feed_break',
          sortable: 'custom',
        },
        {
          label: '50%进度播放率',
          prop: 'play_50_feed_break_rate',
          width:"150"
          
        },
        {
          label: '25%进度播放数',
          prop: 'play_25_feed_break',
          sortable: 'custom',
        },
        {
          label: '25%进度播放率',
          prop: 'play_25_feed_break_rate',
          width:"150"
          
        },
        {
          label: '播放10s数',
          prop: 'play_duration_10s',
          sortable: 'custom',
        },
        {
          label: '播放10s率',
          prop: 'play_duration_10s_rate',
          width:"110"
        },
        {
          label: '播放5s率',
          prop: 'play_duration_5s_rate',
          width:"110"
          
        },
        {
          label: '播放3s数',
          prop: 'play_duration_3s',
          sortable: 'custom',
        },
        {
          label: '播放3s率',
          prop: 'play_duration_3s_rate',
          width:"110"
          
        },

        {
          label: '播放2s数',
          prop: 'play_duration_2s',
          sortable: 'custom',
        },
        {
          label: '播放2s率',
          prop: 'play_duration_2s_rate',
          width:"110"
          
        },
        {
          label: '总播放时长(单位s)',
          prop: 'play_duration_sum',
          sortable: 'custom',
        },
        {
          label: '总播放数',
          prop: 'total_play',
          sortable: 'custom',
        },
        {
          label: '播放完成数',
          prop: 'play_over',
          sortable: 'custom',
        },
        {
          label: '播放完成率',
          prop: 'play_over_rate',
          width:"110"
          
        },
        {
          label: '点赞数',
          prop: 'like',
          sortable: 'custom',
        },
        {
          label: '评论数',
          prop: 'comment',
          sortable: 'custom',
        },
        {
          label: '分享数',
          prop: 'share',
          sortable: 'custom',
        },
        {
          label: '次留数',
          prop: 'event_next_day_stay',
          sortable: 'custom',
        },
        {
          label: '次留成本',
          prop: 'event_next_day_stay_cost',
          width:"100"
        },
        {
          label: '次留率',
          prop: 'event_next_day_stay_ratio',
          width:"85"
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
      },
      HMcolumn:[
        {
          label: '视频',
          prop: 'date',
        },
        {
          label: '点击转化率环比增长',
          prop: 'cycle',
        },
        {
          label: '消耗',
          prop: 'cost',
        },
        {
          label: '点击率',
          prop: 'ctr',
        },
        {
          label: '转化率',
          prop: 'click_pay_rate',
        },
        {
          label: '转化成本',
          prop: 'cost_pay_cost',
        },
      ]
    }
  }
}
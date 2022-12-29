import moment from 'moment'
export const Mydata = {
  data() {
    return {
      compareKey: [],
      key: [],
      keyNumArr: [],
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
      titleArr: [],
      nameArr: [],
      numberArr: [],
      keyArr: ['total_subscribe_money_rate', 'total_week_money_rate', 'total_month_money_rate', 'total_quarter_money_rate', 'total_year_money_rate', 'total_ever_money_rate', 'total_subscribe_uv_rate',
        'total_week_uv_rate', 'total_month_uv_rate', 'total_quarter_uv_rate', 'total_year_uv_rate', 'total_ever_uv_rate', 'total_pay_subscribe_uv_rate', 'total_pay_week_uv_rate', 'total_pay_quarter_uv_rate',
        'total_pay_month_uv_rate', 'total_pay_year_uv_rate', 'total_pay_ever_uv_rate', 'total_new_money_rate', 'total_old_money_rate', 'pay_rate', 'vip_page_rate', 'vip_order_rate', 'pay_success_rate', 'device_new_reg_rate',
        'total_other_money_rate', 'total_other_uv_rate' ,  'total_pay_other_uv_rate'
      ],
      numKeyArr: ['total_money','total_subscribe_money','total_week_money','total_month_money','total_quarter_money','total_year_money','total_ever_money','total_uv','total_subscribe_uv','total_week_uv',
    'total_quarter_uv','total_year_uv','total_ever_uv','total_pay_uv','total_pay_subscribe_uv','total_pay_week_uv','total_pay_month_uv','total_pay_quarter_uv','total_pay_year_uv','total_pay_ever_uv',
    ,'total_new_money','total_old_money','unit_price','device_active','vip_page_uv',
    ],
      timeType: [{
        id: '1',
        title: '日'
      }, ],
      column: [{
          label: "",
          width: 240,
          fixed: false,
          children: [{
              label: "日期",
              prop: "date",
            },
            {
              label: "星期",
              prop: 'week',
            },
          ],
        },
        {
          label: "成功支付订单金额占比",
          children: [{
              label: "订阅订单总金额占比",
              prop: "total_subscribe_money_rate",
              sortable: 'custom',
              width:180
            },
            {
              label: "周卡总金额占比",
              prop: "total_week_money_rate",
              sortable: 'custom',
              width:160
            },
            {
              label: "月卡总金额占比",
              prop: "total_month_money_rate",
              sortable: 'custom',
              width:160
            },
            {
              label: "季卡总金额占比",
              prop: "total_quarter_money_rate",
              sortable: 'custom',
              width:160
            },
            {
              label: "年卡总金额占比",
              prop: "total_year_money_rate",
              sortable: 'custom',
              width:160
            },
            {
              label: "永久总金额占比",
              prop: "total_ever_money_rate",
              sortable: 'custom',
              width:160
            },
            {
              label: "其他类总金额占比",
              prop: "total_other_money_rate",
              sortable: 'custom',
              width:160
            },
            {
              label: "总充值金额",
              prop: "total_money",
              sortable: 'custom',
              width:150
            },
            {
              label: "订阅订单总金额",
              prop: "total_subscribe_money",
              sortable: 'custom',
              width:160
            },
            {
              label: "周卡总金额",
              prop: "total_week_money",
              sortable: 'custom',
            },
            {
              label: "月卡总金额",
              prop: "total_month_money",
              sortable: 'custom',
            },
            {
              label: "季卡总金额",
              prop: "total_quarter_money",
              sortable: 'custom',
            },
            {
              label: "年卡总金额",
              prop: "total_year_money",
              sortable: 'custom',
            },
            {
              label: "永久总金额",
              prop: "total_ever_money",
              sortable: 'custom',
            },
            {
              label: "其他类总金额",
              prop: "total_other_money",
              sortable: 'custom',
              width:160
            },
          ],
        },
        {
          label: "整体下单占比",
          children: [{
              label: "订阅订单总下单占比",
              prop: "total_subscribe_uv_rate",
              sortable: 'custom',
              width:180
            },
            {
              label: "周卡总下单占比",
              prop: "total_week_uv_rate",
              sortable: 'custom',
              width:160
            },
            {
              label: "月卡总下单占比",
              prop: "total_month_uv_rate",
              sortable: 'custom',
              width:160
            },
            {
              label: "季卡总下单占比",
              prop: "total_quarter_uv_rate",
              sortable: 'custom',
              width:160
            },
            {
              label: "年卡总下单占比",
              prop: "total_year_uv_rate",
              sortable: 'custom',
              width:160
            },
            {
              label: "永久总下单占比",
              prop: "total_ever_uv_rate",
              sortable: 'custom',
              width:160
            },
            {
              label: "其他类总下单占比",
              prop: "total_other_uv_rate",
              sortable: 'custom',
              width:160
            },
            {
              label: "会员总下单uv",
              prop: "total_uv",
              sortable: 'custom',
              width:150
            },
            {
              label: "订阅订单总下单uv",
              prop: "total_subscribe_uv",
              sortable: 'custom',
              width:160
            },
            {
              label: "周卡总下单uv",
              prop: "total_week_uv",
              sortable: 'custom',
              width:150
            },
            {
              label: "月卡总下单uv",
              prop: "total_month_uv",
              sortable: 'custom',
              width:150
            },
            {
              label: "季卡总下单uv",
              prop: "total_quarter_uv",
              sortable: 'custom',
              width:150
            },
            {
              label: "年卡总下单uv",
              prop: "total_year_uv",
              sortable: 'custom',
              width:150
            },
            {
              label: "永久总下单uv",
              prop: "total_ever_uv",
              sortable: 'custom',
              width:150
            },
            {
              label: "其他类总下单uv",
              prop: "total_other_uv",
              sortable: 'custom',
              width:150
            },
          ],
        },
        {
          label: "整体支付成功订单占比",
          children: [{
              label: "订阅订单总支付成功占比",
              prop: "total_pay_subscribe_uv_rate",
              sortable: 'custom',
              width:200
            },
            {
              label: "周卡总支付成功占比",
              prop: "total_pay_week_uv_rate",
              sortable: 'custom',
              width:180
            },
            {
              label: "季卡总支付成功占比",
              prop: "total_pay_quarter_uv_rate",
              sortable: 'custom',
              width:180
            },
            {
              label: "月卡总支付成功占比",
              prop: "total_pay_month_uv_rate",
              sortable: 'custom',
              width:180
            },
            {
              label: "年卡总支付成功占比",
              prop: "total_pay_year_uv_rate",
              sortable: 'custom',
              width:180
            },
            {
              label: "永久总支付成功占比",
              prop: "total_pay_ever_uv_rate",
              sortable: 'custom',
              width:180
            },
            {
              label: "其他类总支付成功占比",
              prop: "total_pay_other_uv_rate",
              sortable: 'custom',
              width:195
            },
            {
              label: "会员总支付成功uv",
              prop: "total_pay_uv",
              sortable: 'custom',
              width:180
            },
            {
              label: "订阅订单总支付成功uv",
              prop: "total_pay_subscribe_uv",
              sortable: 'custom',
              width:200
            },
            {
              label: "周卡总支付成功uv",
              prop: "total_pay_week_uv",
              sortable: 'custom',
              width:180
            },
            {
              label: "月卡总支付成功uv",
              prop: "total_pay_month_uv",
              sortable: 'custom',
              width:180
            },
            {
              label: "季卡总支付成功uv",
              prop: "total_pay_quarter_uv",
              sortable: 'custom',
              width:180
            },
            {
              label: "年卡总支付成功uv",
              prop: "total_pay_year_uv",
              sortable: 'custom',
              width:180
            },
            {
              label: "永久总支付成功uv",
              prop: "total_pay_ever_uv",
              sortable: 'custom',
              width:180
            },
            {
              label: "其他类总支付成功uv",
              prop: "total_pay_other_uv",
              sortable: 'custom',
              width:180
            },

          ],
        },
      ],
      column1: [{
          label: '应用',
          prop: 'appid',
        },
        {
          label: '系统',
          prop: 'system',
        },
        {
          label: "渠道",
          prop: "origin",
        },
        {
          label: "支付方式",
          prop: "pay_way",
        },
        {
          label: "订单路径",
          prop: "from_path",
        },
        {
          label: '总充值金额',
          prop: 'total_money',
          sortable: 'custom',
        },
        {
          label: '新用户充值金额',
          prop: 'total_new_money',
          sortable: 'custom',
        },
        {
          label: '老用户充值金额',
          prop: 'total_old_money',
          sortable: 'custom',
        },
        {
          label: '新用户充值金额占比',
          prop: 'total_new_money_rate',
          sortable: 'custom',
        },
        {
          label: '老用户充值金额占比',
          prop: 'total_old_money_rate',
          sortable: 'custom',
        },
        {
          label: '总arpu',
          prop: 'arpu',
          sortable: 'custom',
        },
        {
          label: '总付费率',
          prop: 'pay_rate',
          sortable: 'custom',
        },
        {
          label: '客单价',
          prop: 'unit_price',
          sortable: 'custom',
        },
        {
          label: '会员页到达率',
          prop: 'vip_page_rate',
          sortable: 'custom',
        },
        {
          label: '会员下单率',
          prop: 'vip_order_rate',
          sortable: 'custom',
        },
        {
          label: '支付成功率',
          prop: 'pay_success_rate',
          sortable: 'custom',
        },
        {
          label: '日活',
          prop: 'device_active',
          sortable: 'custom',
        },
        {
          label: '会员页uv',
          prop: 'vip_page_uv',
          sortable: 'custom',
        },
        {
          label: '下单uv',
          prop: 'total_uv',
          sortable: 'custom',
        },
        {
          label: '支付成功uv',
          prop: 'total_pay_uv',
          sortable: 'custom',
        },
      ],
      column2: [{
          label: '应用',
          prop: 'appid',
        },
        {
          label: '系统',
          prop: 'system',
        },
        {
          label: "渠道",
          prop: "origin",
        },
        {
          label: "支付方式",
          prop: "pay_way",
        },
        {
          label: "订单路径",
          prop: "from_path",
        },
        {
          label: '新用户充值金额占比',
          prop: 'total_new_money_rate',
          sortable: 'custom',
        },
        {
          label: '新用户充值金额',
          prop: 'total_new_money',
          sortable: 'custom',
        },
        {
          label: '新用户arpu',
          prop: 'arpu',
          sortable: 'custom',
        },
        {
          label: '新用户付费率',
          prop: 'pay_rate',
          sortable: 'custom',
        },
        {
          label: '新用户会员价值',
          prop: 'vip_value',
          sortable: 'custom',
        },
        {
          label: '新用户客单价',
          prop: 'unit_price',
          sortable: 'custom',
        },
        {
          label: '激活注册率',
          prop: 'device_new_reg_rate',
          sortable: 'custom',
        },
        {
          label: '会员页到达率',
          prop: 'vip_page_rate',
          sortable: 'custom',
        },
        {
          label: '会员下单率',
          prop: 'vip_order_rate',
          sortable: 'custom',
        },
        {
          label: '支付成功率',
          prop: 'pay_success_rate',
          sortable: 'custom',
        },
        {
          label: '新增',
          prop: 'device_new',
          sortable: 'custom',
        },
        {
          label: '新用户会员页uv',
          prop: 'vip_page_uv',
          sortable: 'custom',
        },
        {
          label: '新用户下单uv',
          prop: 'total_uv',
          sortable: 'custom',
        },
        {
          label: '新用户支付成功uv',
          prop: 'total_pay_uv',
          sortable: 'custom',
        }
      ],
      column3: [{
          label: '应用',
          prop: 'appid',
        },
        {
          label: '系统',
          prop: 'system',
        },
        {
          label: "渠道",
          prop: "origin",
        },
        {
          label: "支付方式",
          prop: "pay_way",
        },
        {
          label: "订单路径",
          prop: "from_path",
        },
        {
          label: '老用户充值金额占比',
          prop: 'total_old_money_rate',
          sortable: 'custom',
        },
        {
          label: '老用户充值金额',
          prop: 'total_old_money',
          sortable: 'custom',
        },
        {
          label: '老用户arpu',
          prop: 'arpu',
          sortable: 'custom',
        },
        {
          label: '老用户付费率',
          prop: 'pay_rate',
          sortable: 'custom',
        },
        {
          label: '老用户会员价值',
          prop: 'vip_value',
          sortable: 'custom',
        },
        {
          label: '老用户客单价',
          prop: 'unit_price',
          sortable: 'custom',
        },
        {
          label: '老用户会员页到达率',
          prop: 'vip_page_rate',
          sortable: 'custom',
        },
        {
          label: '老用户会员下单率',
          prop: 'vip_order_rate',
          sortable: 'custom',
        },
        {
          label: '老用户支付成功率',
          prop: 'pay_success_rate',
          sortable: 'custom',
        },
        {
          label: '老用户数',
          prop: 'old_user_num',
          sortable: 'custom',
        },
        {
          label: '老用户会员页uv',
          prop: 'vip_page_uv',
          sortable: 'custom',
        },
        {
          label: '老用户下单uv',
          prop: 'total_uv',
          sortable: 'custom',
        },
        {
          label: '老用户支付成功uv',
          prop: 'total_pay_uv',
          sortable: 'custom',
        }
      ],
      dimensionalData: [{
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
      comparison_data: [{
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
      user_tooltiptext1:'总充值金额：总付费金额<br>新用户充值金额：新用户付费金额<br>老用户充值金额：老用户付费金额<br>新用户充值金额占比：新用户充值金额/总充值金额<br>老用户充值金额占比：老用户充值金额/总充值金额<br>总arpu：总充值金额/日活<br>总付费率：支付成功uv/日活<br>客单价：总充值金额/支付成功uv<br>会员页到达率：会员页uv/日活<br>会员下单率：下单uv/会员页uv<br>支付成功率：支付成功uv/下单uv',
      user_tooltiptext2:'新用户收入占比：新用户充值金额/总充值金额<br>新用户arpu：新用户充值金额/日活<br>新用户付费率：新用户支付成功uv/新增<br>新用户会员价值：新用户充值金额/新增<br>新用户客单价：新用户充值金额/新用户支付成功uv<br>激活注册率：注册用户数/新增<br>会员页到达率：新用户会员页uv/新增<br>会员下单率：新用户下单uv/新用户会员页uv<br>支付成功率：新用户支付成功uv/新用户下单uv',
      user_tooltiptext3:"老用户收入占比：老用户充值金额/总充值金额<br>老用户arpu：老用户充值金额/日活<br>老用户付费率：老用户支付成功uv/老用户数<br>老用户会员价值：老用户充值金额/老用户数<br>老用户客单价：老用户充值金额/老用户支付成功uv<br>老用户会员页到达率：老用户会员页uv/老用户数<br>老用户会员下单率：老用户下单uv/老用户会员页uv<br>老用户支付成功率：老用户支付成功uv/老用户下单uv",
      order_tooltiptext1:"订阅订单总金额占比：订阅订单总金额/总充值金额<br>周卡总金额占比：周卡总金额/总充值金额<br>月卡总金额占比：月卡总金额/总充值金额<br>季卡总金额占比：季卡总金额/总充值金额<br>年卡总金额占比：年卡总金额/总充值金额<br>永久总金额占比：永久总金额/总充值金额<br>订阅订单总下单占比：订阅订单总下单uv/会员总下单uv<br>周卡总下单占比：周卡总下单uv/会员总下单uv<br>月卡总下单占比：月卡总下单uv/会员总下单uv<br>季卡总下单占比：季卡总下单uv/会员总下单uv<br>年卡总下单占比：年卡总下单uv/会员总下单uv<br>永久总下单占比：永久下单uv/会员总下单uv<br>订阅订单总支付成功占比：订阅订单总支付成功uv/会员总支付成功uv<br>周卡总支付成功占比：周卡总支付成功uv/会员总支付成功uv<br>月卡总支付成功占比：月卡总支付成功uv/会员总支付成功uv<br>季卡总支付成功占比：季卡总支付成功uv/会员总支付成功uv<br>年卡总支付成功占比：年卡总支付成功uv/会员总支付成功uv<br>永久总支付成功占比：永久总支付成功uv/会员总支付成功uv",
      order_tooltiptext2:"新用户订阅订单总金额占比：新用户订阅订单总金额/新用户总充值金额<br>新用户周卡总金额占比：新用户周卡总金额/新用户总充值金额<br>新用户月卡总金额占比：新用户月卡总金额/新用户总充值金额<br>新用户季卡总金额占比：新用户季卡总金额/新用户总充值金额<br>新用户年卡总金额占比：新用户年卡总金额/新用户总充值金额<br>新用户永久总金额占比：新用户永久总金额/新用户总充值金额<br>新用户订阅订单总下单占比：新用户订阅订单总下单uv/新用户会员总下单uv<br>新用户周卡总下单占比：新用户周卡总下单uv/新用户会员总下单uv<br>新用户月卡总下单占比：新用户月卡总下单uv/新用户会员总下单uv<br>新用户季卡总下单占比：新用户季卡总下单uv/新用户会员总下单uv<br>新用户年卡总下单占比：新用户年卡总下单uv/新用户会员总下单uv<br>新用户永久总下单占比：新用户永久下单uv/新用户会员总下单uv<br>新用户订阅订单总支付成功占比：新用户订阅订单总支付成功uv/新用户会员总支付成功uv<br>新用户周卡总支付成功占比：新用户周卡总支付成功uv/新用户会员总支付成功uv<br>新用户月卡总支付成功占比：新用户月卡总支付成功uv/新用户会员总支付成功uv<br>新用户季卡总支付成功占比：新用户季卡总支付成功uv/新用户会员总支付成功uv<br>新用户年卡总支付成功占比：新用户年卡总支付成功uv/新用户会员总支付成功uv<br>新用户永久总支付成功占比：新用户永久总支付成功uv/新用户会员总支付成功uv",
      order_tooltiptext3:"老用户订阅订单总金额占比：老用户订阅订单总金额/老用户总充值金额<br>老用户周卡总金额占比：老用户周卡总金额/老用户总充值金额<br>老用户月卡总金额占比：老用户月卡总金额/老用户总充值金额<br>老用户季卡总金额占比：老用户季卡总金额/老用户总充值金额<br>老用户年卡总金额占比：老用户年卡总金额/老用户总充值金额<br>老用户永久总金额占比：老用户永久总金额/老用户总充值金额<br>老用户订阅订单总下单占比：老用户订阅订单总下单uv/老用户会员总下单uv<br>老用户周卡总下单占比：老用户周卡总下单uv/老用户会员总下单uv<br>老用户月卡总下单占比：老用户月卡总下单uv/老用户会员总下单uv<br>老用户季卡总下单占比：老用户季卡总下单uv/老用户会员总下单uv<br>老用户年卡总下单占比：老用户年卡总下单uv/老用户会员总下单uv<br>老用户永久总下单占比：老用户永久下单uv/老用户会员总下单uv<br>老用户订阅订单总支付成功占比：老用户订阅订单总支付成功uv/老用户会员总支付成功uv<br>老用户周卡总支付成功占比：老用户周卡总支付成功uv/老用户会员总支付成功uv<br>老用户月卡总支付成功占比：老用户月卡总支付成功uv/老用户会员总支付成功uv<br>老用户季卡总支付成功占比：老用户季卡总支付成功uv/老用户会员总支付成功uv<br>老用户年卡总支付成功占比：老用户年卡总支付成功uv/老用户会员总支付成功uv<br>老用户永久总支付成功占比：老用户永久总支付成功uv/老用户会员总支付成功uv",
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
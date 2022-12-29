export const Mydata = {
  data() {
    return {
      // 表格数据
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      // 投放平台数据
      platformOptions:[
        {
          label:"全选",
          value:""
        },
        {
          label:'巨量引擎',
          value:1,
        },
        {
          label:'磁力聚星',
          value:5,
        }
      ],
      // 动态数据
      dimensionalData: [{
          title: '日期',
          value: 1000
        },
        {
          title: '应用',
          value: 1010
        },
        {
          title: '投放平台',
          value: 1050
        },
        {
          title: '渠道号',
          value: 1030
        },
        {
          title: '关键行为ID',
          value: 1040
        },
      ],
      // 表头
      column:[
        {
          label: '投放金额',
          prop: 'real_cost',
          sortable: 'custom',

        },
        {
          label: '新增',
          prop: 'device_new',
          sortable: 'custom',
        },
        {
          label: '24h内设备行为完成数',
          prop: 'hours_24',
          sortable: 'custom',
        },
        {
          label: '回传平台行为数',
          prop: 'callback_num',
          sortable: 'custom',

        },
        {
          label: '回传时长均值(h)',
          prop: 'duration_avg',
          sortable: 'custom',
          width:"150"
        },
        {
          label: '未回传平台行为数',
          prop: 'no_callback_num',
          sortable: 'custom',

        },
        {
          label: '达成率',
          prop: 'yield_rate',
          sortable: 'custom',

        },
        {
          label: '行为成本',
          prop: 'event_cost',
          sortable: 'custom',

        },
        {
          label: '激活成本',
          prop: 'activate_cost',
          sortable: 'custom',

        },
        {
          label: '首日arpu',
          prop: 'arpu_1',
          sortable: 'custom',
          width:"110"
        },
        {
          label: '首日广告arpu',
          prop: 'arpu_ad_1',
          sortable: 'custom',
          width:"140"

        },
        {
          label: '首日付费arpu',
          prop: 'arpu_order_1',
          sortable: 'custom',
          width:"140"

        },
        {
          label: '次留',
          prop: 'keep_rate',
          sortable: 'custom',

        },
        {
          label: '1日回收',
          prop: 'income_1',
          sortable: 'custom',

        },
        {
          label: '1日ROI',
          prop: 'income_roi_1',
          sortable: 'custom',
          width:"100"
        },
        {
          label: '1日广告回收',
          prop: 'income_ad_1',
          sortable: 'custom',
          width:"130"
        },
        {
          label: '1日广告回ROI',
          prop: 'income_ad_roi_1',
          sortable: 'custom',
          width:"138"

        },
        {
          label: '1日付费回收',
          prop: 'income_order_1',
          sortable: 'custom',
          width:"130"


        },
        {
          label: '1日付费ROI',
          prop:"income_order_roi_1",
          sortable: 'custom',
          width:"130"
        },
        {
          label: '3日回收',
          prop: 'income_3',
          sortable: 'custom',
          width:"95"
        },
        {
          label: '3日ROI',
          prop: 'income_roi_3',
          sortable: 'custom',
          width:"95"
        },
        {
          label: '7日回收',
          prop: 'income_7',
          sortable: 'custom',
          width:"95"

        },
        {
          label: '7日ROI',
          prop: 'income_roi_7',
          sortable: 'custom',
          width:"95"

        },
        {
          label: '14日回收',
          prop: 'income_14',
          sortable: 'custom',
          width:"105"

        },
        {
          label: '14日ROI',
          prop: 'income_roi_14',
          sortable: 'custom',
          width:"105"

        },
        {
          label: '30日回收',
          prop: 'income_30',
          sortable: 'custom',
          width:"105"

        },
        {
          label: '30日ROI',
          prop: 'income_roi_30',
          sortable: 'custom',
          width:"105"

        },
        {
          label: '60日回收',
          prop: 'income_60',
          sortable: 'custom',
          width:"105"

        },
        {
          label: '60日ROI',
          prop: 'income_roi_60',
          sortable: 'custom',
          width:"105"

        },
        
      ],
      // 需要转为整数的表格列
      numKeyArr:["device_new","hours_24","callback_num","no_callback_num"],
      // 需要转为保留两位数百分比的表格列
      doubleDigitArr:["yield_rate","keep_rate","income_roi_1","income_ad_roi_1","income_order_roi_1","income_roi_3","income_roi_7","income_roi_14","income_roi_30","income_roi_60"],
      // 需要转为保留四位数百分比的表格列
      fourNumArr:["arpu_1","arpu_ad_1","arpu_order_1"],
      // 需要转为小数保存后两位不加百分比
      sumKeyArr:["real_cost","duration_avg","event_cost","activate_cost","income_1","income_ad_1","income_order_1","income_3","income_7","income_14","income_30","income_60"]
    }
  }
}
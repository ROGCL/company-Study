export const Mydata = {
  data() {
    return {
      // 表格数据
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
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
          label: '新增',
          prop: 'device_new',
          sortable: 'custom',
          width:"74"
        },
        {
          label: '设备行为完成数',
          prop: 'event_success_num',
          sortable: 'custom',
          width:"150"
        },
        {
          label: '达成率',
          prop: 'yield_rate',
          sortable: 'custom',
        },
        {
          label: '0-3h',
          prop: 'hours_3',
          sortable: 'custom',
          width:"74"
        },
        {
          label: '0-3h达成率',
          prop: 'yield_rate_3',
          sortable: 'custom',
          width:"120"
        },
        {
          label: '0-6h',
          prop: 'hours_6',
          sortable: 'custom',
          width:"74"
        },
        {
          label: '0-6h达成率',
          prop: 'yield_rate_6',
          sortable: 'custom',
          width:"120"
        },
        {
          label: '0-12h',
          prop: 'hours_12',
          sortable: 'custom',
          width:"85"
        },
        {
          label: '0-12h达成率',
          prop: 'yield_rate_12',
          sortable: 'custom',
          width:"130"
        },
        {
          label: '>12h',
          prop: 'gt_12',
          sortable: 'custom',
          width:"80"
        },
        {
          label: '>12h达成率',
          prop: 'yield_rate_gt_12',
          sortable: 'custom',
          width:"130"
        },
      ],
      // 需要转为整数的表格列
      numKeyArr:["device_new","event_success_num","hours_3","hours_6","hours_12","gt_12"],
      // 百分比保留两位小数
      doubleDigitArr:["yield_rate","yield_rate_3","yield_rate_6","yield_rate_12","yield_rate_gt_12"],
    }
  }
}
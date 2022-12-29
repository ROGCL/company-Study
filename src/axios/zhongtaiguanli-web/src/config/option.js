import moment from 'moment'

const pickerOptions = {
  shortcuts: [
    {
      text: '昨天',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '近一周',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '近30天',
      onClick (picker) {
        const start = moment().subtract(1, 'months').format('YYYY-MM-DD')
        const end = moment().format('YYYY-MM-DD')
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '近60天',
      onClick (picker) {
        const start = moment().subtract(2, 'months').format('YYYY-MM-DD')
        const end = moment().format('YYYY-MM-DD')
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '近90天',
      onClick (picker) {
        const start = moment().subtract(3, 'months').format('YYYY-MM-DD')
        const end = moment().format('YYYY-MM-DD')
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '本月',
      onClick (picker) {
        const end = new Date();
        const years = end.getFullYear();
        const mouths = end.getMonth() + 1;
        const start = new Date(years + '-' + mouths + '-01');
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '上个月',
      onClick (picker) {
        const preMonth = moment().subtract(1, 'months').endOf('month')
        const end = preMonth.format('YYYY-MM-DD')
        const start = preMonth.format('YYYY-MM-01')
        picker.$emit('pick', [start, end])
      }
    }
  ],
}

const timeTypeOption = (time) => {

  return [
    {
      label: '天',
      value: 1,
      disabled: false
    }, {
      label: '周',
      value: 2,
      disabled: moment(time[1]).diff(moment(time[0]), 'days') < 7
    }, {
      label: '月',
      value: 3,
      disabled: moment(time[1]).diff(moment(time[0]), 'months') < 1
    }
  ]
}
const isNewUserOption = [
  {
    label: '总订单统计',
    value: 0,
    disabled: false
  },
  // {
  //   label: '新用户订单统计',
  //   value: 1,
  //   disabled: false
  // },
]


export {
  pickerOptions,
  isNewUserOption,
  timeTypeOption
}
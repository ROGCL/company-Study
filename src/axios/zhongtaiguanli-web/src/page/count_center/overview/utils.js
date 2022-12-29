import { Dashboard_activePayUserPer, Dashboard_deviceActiveVersion, Dashboard_userKeep, Dashboard_deviceAddDis, Dashboard_incomePer, Dashboard_orderConversionFunnel, Dashboard_lifeCycle, Dashboard_userValue, Dashboard_newUserPay, Dashboard_sevenDayOrderRecycle, Dashboard_firstBuyRebuyPer, Dashboard_userRoi,Dashboard_deviceNewTop5 } from '@/config/api/index';

import bar1 from './components/bar/bar1'
import bar2 from './components/bar/bar2'
import bar3 from './components/bar/bar3'
import bar4 from './components/bar/bar4'
import line1 from './components/line/line1'
import line2 from './components/line/line2'
import pie from './components/pie/pie'
import vtable from './components/table/table'

let deviceNewTop5 = [];
Dashboard_deviceNewTop5().then((res) => {

	if (res) {
		res[1].date.forEach((item,index) => {
			deviceNewTop5.push({
				value:index+1,
				label:item
			})
		});
	}
	
});

let baseChartFilter = [
	{
		value: '1',
		label: '今天对比昨天'
	},
	{
		value: '2',
		label: '最近7天'
	}, {
		value: '3',
		label: '最近30天'
	}, {
		value: '4',
		label: '最近60天'
	}
]

let incomeChartFilter = [
	{
		value: '1',
		label: '最近7天'
	}, {
		value: '2',
		label: '最近30天'
	}, {
		value: '3',
		label: '最近60天'
	}
]

let incomeChartFilterDate = [
	{
		value: '4',
		label: '今天对比昨天'
	},
	{
		value: '1',
		label: '最近7天'
	}, {
		value: '2',
		label: '最近30天'
	}, {
		value: '3',
		label: '最近60天'
	}
]

let baseTab = [
	{
		id: 7,
		title: '新激活设备',
		data: {
			status: 0,
			today: {
				title: '今日实时',
				value: 0
			},
			yesterday: {
				title: '昨日全天',
				value: 0
			},
			ratio: {
				title: '昨日同期',
				value: 0
			}
		}
	},
	{
		id: 8,
		title: '活跃用户数',
		data: {
			status: 0,
			today: {
				title: '今日实时',
				value: 0
			},
			yesterday: {
				title: '昨日全天',
				value: 0
			},
			ratio: {
				title: '昨日同期',
				value: 0
			}
		}
	},
	{
		id: 10,
		title: '人均启动次数',
		data: {
			status: 0,
			today: {
				title: '今日实时',
				value: 0
			},
			yesterday: {
				title: '昨日全天',
				value: 0
			},
			ratio: {
				title: '昨日同期',
				value: 0
			}
		}
	},
	{
		id: 11,
		title: '均次使用时长',
		data: {
			status: 0,
			today: {
				title: '今日实时',
				value: 0
			},
			yesterday: {
				title: '昨日全天',
				value: 0
			},
			ratio: {
				title: '昨日同期',
				value: 0
			}
		}
	}
]

let incomeTab = [
	{
		id: 19,
		title: '订单收入(元)',
		data: {
			status: 0,
			today: {
				title: '今日',
				value: 0
			},
			yesterday: {
				title: '昨日',
				value: 0
			},
			ratio: {
				title: '环比',
				value: 0
			}
		}
	},
	{
		id: 17,
		title: '收入(元)',
		data: {
			status: 0,
			today: {
				title: '昨日',
				value: 0
			},
			yesterday: {
				title: '前日',
				value: 0
			},
			ratio: {
				title: '环比',
				value: 0
			}
		}
	},
	{
		id: 18,
		title: '广告收入(元)',
		data: {
			status: 0,
			today: {
				title: '昨日',
				value: 0
			},
			yesterday: {
				title: '前日',
				value: 0
			},
			ratio: {
				title: '环比',
				value: 0
			}
		}
	},
	{
		id: 20,
		title: '支出(元)',
		data: {
			status: 0,
			today: {
				title: '昨日',
				value: 0
			},
			yesterday: {
				title: '前日',
				value: 0
			},
			ratio: {
				title: '环比',
				value: 0
			}
		}
	},
	{
		id: 21,
		title: '毛利(元)',
		data: {
			status: 0,
			today: {
				title: '昨日',
				value: 0
			},
			yesterday: {
				title: '前日',
				value: 0
			},
			ratio: {
				title: '环比',
				value: 0
			}
		}
	},
	{
		id: 22,
		title: '单用户价值(元)',
		data: {
			status: 0,
			today: {
				title: '昨日',
				value: 0
			},
			yesterday: {
				title: '前日',
				value: 0
			},
			ratio: {
				title: '环比',
				value: 0
			}
		}
	},
]

let date = [ {
	value: '1',
	label: '30天前'
}, {
	value: '2',
	label: '60天前'
}, {
	value: '3',
	label: '120天前'
} ]

let show = [ {
	value: '1',
	label: '订单量'
}, {
	value: '2',
	label: '订单金额'
} ]

let keep = [ {
	value: '1',
	label: '新用户留存'
}, {
	value: '2',
	label: '活跃用户留存'
} ]



let user = [ {
	value: '1',
	label: '全部用户'
}, {
	value: '2',
	label: '付费用户'
} ]

let roi = [ {
	value: '1',
	label: '全部'
}, {
	value: '2',
	label: '订单'
}, {
	value: '3',
	label: '广告'
} ]

function upOrDwon (status) {
	let clss = '';
	switch (status) {
		case -1:
			clss = 'down'
			break;
		case 0:
			break;
		case 1:
			clss = 'up'
			break;
	}
	return clss;
}

function upOrDwonIcon (status) {
	let clss = '';
	switch (status) {
		case -1:
			clss = 'icon-xiadie'
			break;
		case 1:
			clss = 'icon-shangzhang'
			break;
	}
	return clss;
}

const BASIC_CHARTLIST = [
	{
		id: 16,
		title: '活跃用户付费用户占比',
		tips: [ '(今日)' ],
		desc: '活跃用户付费用户占比=活跃会员（设备）数量/活跃用户（设备）数量<br>注意“活跃会员（设备）数量”为APP前端SDK上报的，并不完全等于活跃的付费账号数量。<br>如果APP的SDK版本较早可能会出现无活跃会员数据的情况。',
		request: Dashboard_activePayUserPer,
		component: pie
	},
	{
		id: 12,
		title: '渠道新增分布',
		tips: [ '(前5位近7日)', '(仅Android)' ],
		desc: '指新增用户（设备）中前5名的渠道的近7日新增曲线。<br>方便及时查看主要新增渠道的变化趋势。',
		request: Dashboard_deviceAddDis,
		component: line2
	},
	{
		id: 13,
		title: '版本活跃分布',
		tips: [ '(昨日)' ],
		desc: '指昨天活跃用户（设备）数量中前6名的渠道号分布。<br>用于关注APP发版后新版的覆盖情况。',
		echartsProp: {
			inverse: true
		},
		request: Dashboard_deviceActiveVersion,
		component: bar1
	},
	{
		id: 40,
		title: '渠道日新增Top5',
		desc: '近七日内，单日新增数量排前五的渠道',
		echartsProp: {
			inverse: true
		},
		option:deviceNewTop5,
		request: Dashboard_deviceNewTop5,
		component: bar1
	},
	
	{
		id: 14,
		title: '留存率',
		desc: '可以切换“新用户留存”和“活跃用户留存”。<br>X天新用户留存=当日新增用户在X天的活跃数/当日新用户数量<br>X天活跃用户留存=当日活跃用户在X天的活跃数/当日活跃用户数量',
		option: keep,
		request: Dashboard_userKeep,
		component: vtable
	},
	{
		id: 15,
		title: '用户生命周期',
		desc: '当天新激活设备(n)启动次数累加总次数(m)，每天只记录1次启动，除以当天新激活设备(n)。如<br>1月1日新激活设备1000个，第2天启动设备600，第3天启动设备300，第4天启动设备100，则<br>第2天LT = (1000 + 600) / 1000，第3天LT = (1000 + 600 + 300) / 1000，第四天LT = <br>(1000 + 600 + 300 + 100) / 1000<br>可以筛选查看30天/60天前，到今天的LT。',
		tips: [],
		option: date,
		request: Dashboard_lifeCycle,
		component: bar3
	}
]

const INCOME_CHARTLIST = [
	{
		id: 23,
		title: '收入占比',
		tips: [ '(昨日)' ],
		desc: '昨天总收入中，订单收入和广告收入的占比。',
		request: Dashboard_incomePer,
		component: pie
	},
	{
		id: 25,
		title: '首日付费新用户',
		desc: '当天新增激活设备所注册的账号，以及这些账号在当天内完成支付的订单<br>（包括当天复购的订单）。',
		request: Dashboard_firstBuyRebuyPer,
		option: show,
		component: bar2
	},
	{
		id: 27,
		title: 'ROI',
		desc: '投资回报率（ROI）= 当日新增用户带来的总收入 / 当日推广金额<br>订单ROI=当日新增用户带来的订单收入 / 当日推广金额<br>广告ROI=当日新增用户带来的广告收入 / 当日推广金额',
		option: roi,
		request: Dashboard_userRoi,
		component: vtable
	},
	{
		id: 24,
		title: '付费转化',
		desc: '指当天新增的设备，后续完成注册、下单、支付的数量。<br>这里展示的注册、下单、支付都仅限',
		echartsProp: {
			inverse: false
		},
		request: Dashboard_orderConversionFunnel,
		component: bar1
	},
	{
		id: 26,
		title: '单用户价值',
		tips: [ '(近7日)' ],
		desc: '单用户价值=总收入/活跃用户<br>单付费用户价值=支付成功金额/支付成功人数',
		request: Dashboard_userValue,
		option: user,
		component: line1
	},
	{
		id: 29,
		title: '毛利率',
		desc: '毛利=总收入-支出<br>毛利率=毛利/总收入',
		echartsProp: {
			series: {
				stack: null
			}
		},
		request: Dashboard_sevenDayOrderRecycle,
		tips: [ '' ],
		component: bar4
	},
]

export {
	baseTab,
	incomeTab,
	date,
	show,
	user,
	upOrDwon,
	upOrDwonIcon,
	BASIC_CHARTLIST,
	INCOME_CHARTLIST,
	baseChartFilter,
	incomeChartFilter,
	incomeChartFilterDate
}

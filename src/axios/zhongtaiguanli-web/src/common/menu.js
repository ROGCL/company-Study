const menu = [
	{
		name: '统计中心',
		children: [
			{
			name: '概览',
			children: [
				{
					name: '基础数据概览'
				}, {
					name: '收入支出概览'
				}
			]
		},
		{
			name: '用户分析',
			children: [
				{
					name: '下载激活'
				}, {
					name: '活跃用户'
				}, {
					name: '留存用户'
				}, {
					name: '用户流失率'
				}, {
					name: '用户构成'
				}, {
					name: '启动次数'
				}, {
					name: '使用时长'
				}
			]
		}, {
			name: '收入统计',
			children: [
				{
					name: '订单转化漏斗'
				}, {
					name: '订单金额统计'
				}, {
					name: '退单金额统计'
				}, {
					name: '转化率统计'
				}, {
					name: '回收统计(按渠道)'
				}, {
					name: '总收入统计'
				}, {
					name: '广告收入'
				}
				, {
					name: '复购情况查询'
				}
			]
		}, {
			name: '用户价值',
			children: [
				{
					name: '用户价值'
				}, {
					name: '用户生命周期价值'
				}, {
					name: 'LT（按流水率）'
				}, {
					name: 'LT（按天）'
				}, {
					name: '新用户数据'
				}, {
					name: '新用户支付数据'
				}, {
					name: '会员收入ROI'
				}
			]
		}, {
			name: '渠道质量管理',
			children: [
				{
					name: '渠道质量趋势'
				}, {
					name: '算法控制'
				}, {
					name: '指标以及评分明细'
				}, {
					name: '上传数据'
				}
			]
		},
		{
			name: '投放数据',
			children: [
				{
					name: '渠道投放统计'
				}
			]
		}, {
			name: '其它内容',
			children: [
				// {
				// 	name: '数据导入'
				// },
				{
					name: '注册用户'
				}, {
					name: '全部订单'
				}, {
					name: 'SDK统计'
				},
			]
		}
		]
	}, {
		name: '管理中心',
		children: [
			{
				name: '用户管理'
			}, {
				name: '用户添加'
			}, {
				name: '用户修改'
			}, {
				name: 'App管理'
			},
			{
				name: '操作日志'
			}, {
				name: 'App添加'
			}, {
				name: 'App编辑'
			}, {
				name: '其他内容'
			}
		]
	}, {
		name: '商务数据',
		children: [
			{
				name: '广告收入统计'
			}, {
				name: '广告收入上传'
			}, {
				name: '投放支出上传'
			}, {
				name: '广告收入统计（概览）'
			}
		]
	}, {
		name: '数据概览'
	}
]

export default menu
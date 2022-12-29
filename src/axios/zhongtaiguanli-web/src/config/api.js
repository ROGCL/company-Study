/****
 * 说明
 * 所有list接口
 * {
 *  navCate参数：1：统计折线图，2：表格，3：柱形图，
 *  isDownload： (true, false) 是否下载
 * }
 * ****/

const api = {
	/**** 权限相关 ****/
	// 账号管理
	admin: {
		edit: 'admin/saveUserInfo',
		detail: 'admin/getUserInfo',
		edit_auth: 'admin/savePermissions',
		menu: 'system/getMenu',
		auth_detail: 'admin/getUserPermissions',
		app: 'system/appsV2'
	},
	Auth: {
		logout: 'Login/webLogout',
		login: 'login/login',
		menu: 'system/allMenu'
	},
	/**** 权限相关 end****/
	/**** 管理中心 ****/
	User: {
		list: 'admin/index',
		add: 'admin/save',
		edit: 'admin/save',
		remove: 'admin/del',
		detail: 'admin/get',
		editPwd: 'admin/passwordChange',
		resetPwd: 'admin/complexPassword',
		baseSave: 'admin/baseSave'
	},
	App: {
		list: 'App/index',
		add: 'App/save',
		edit: 'App/save',
		remove: 'App/del',
		detail: 'App/get'
	},
	/**** 管理中心 end****/

	/**** 数据概览 ****/
	General: 'app/all',
	/**** 数据概览 end****/

	/**** 字典相关 ****/
	Dict: {
		app: 'System/apps',
		channel: 'App/getChannel',
		app_version: 'App/getVersion',
	},
	/**** 字典相关 end****/
	/*** 广告相关 **/
	Ads: {
		ad_app: 'Ads/getApp',
		position: 'Ads/getPosition',
		ad_types: 'Ads/getAdType',
		resource: 'Ads/getResource',
		ad_cate: 'Ads/getAdCate',
	},
	ad_index: {
		list: 'Ads/index',
		count: 'Ads/index',
		sumArr: 'Ads/index',
	},
	/*** 广告相关 end **/
	/**** 用户分析 ****/
	down_active: {
		list: 'User_Statistics/download',
		count: 'User_Statistics/download',
	},
	active_user: {
		list: 'User_Statistics/active',
		count: 'User_Statistics/active',
	},
	keep_user: {
		list: 'User_Statistics/keep',
		count: 'User_Statistics/keep',
	},
	active_user_keep: {
		list: 'User_Statistics/activeKeep',
		count: 'User_Statistics/activeKeep',
	},
	churn_user: {
		list: 'User_Statistics/wastageRate',
		count: 'User_Statistics/wastageRate',
	},
	user_from: {
		list: 'User_Statistics/userForm',
		count: 'User_Statistics/userForm',
	},
	/**** 用户分析 end****/

	/**** 用户价值 ****/
	user_value: {
		list: 'User_Statistics/userValue',
		count: 'User_Statistics/userValue',
	},
	user_life: {
		list: 'User_Statistics/lifecycle',
		count: 'User_Statistics/lifecycle',
	},
	user_life_cost: {
		list: 'User_Statistics/allLTV',
		count: 'User_Statistics/allLTV',
	},
	user_life_cost_pay: {
		list: 'User_Statistics/payLTV',
		count: 'User_Statistics/payLTV',
	},
	keep_lt: {
		list: 'User_Statistics/keepLT',
		count: 'User_Statistics/keepLT',
	},
	new_user: {
		list: 'User_Statistics/newUser',
		count: 'User_Statistics/newUser',
	},
	new_user_pay: {
		list: 'User_Statistics/newUserPay',
		count: 'User_Statistics/newUserPay',
	},
	return_on_investment: {
		list: 'User_Statistics/roi',
		count: 'User_Statistics/roi',
	},
	/**** 用户价值 end****/

	/**** 统计中心 ****/
	start_times: {
		list: 'Behavior_Statistics/startTime',
		count: 'Behavior_Statistics/startTime',
	},
	duration_of_use: {
		list: 'Behavior_Statistics/useTime',
		count: 'Behavior_Statistics/useTime',
	},
	quantity_statistics_detail: {
		list: 'Quantity_Statistics/detail',
		count: 'Quantity_Statistics/detail',
	},
	/**** 统计中心 end****/

	/**** 订单统计 ****/
	order_funnel: {
		list: 'Order_Statistics/conversionFunnel',
		count: 'Order_Statistics/conversionFunnel',
	},
	converse_rate: {
		list: 'Order_Statistics/percent',
		count: 'Order_Statistics/percent',
	},
	charge_back_amount: {
		list: 'Order_Statistics/orderChargeBack',
		count: 'Order_Statistics/orderChargeBack',
	},
	order_amount: {
		list: 'Order_Statistics/orderMoney',
		count: 'Order_Statistics/orderMoney',
	},
	order_income: {
		list: 'Order_Statistics/income',
		count: 'Order_Statistics/income',
	},
	order_income_register: {
		list: 'Order_Statistics/incomeUser',
		count: 'Order_Statistics/incomeUser',
	},
	order_income_origin: {
		list: 'Order_Statistics/incomeOrigin',
		count: 'Order_Statistics/incomeOrigin',
	},
	all_income: {
		list: 'Order_Statistics/allIncome',
		count: 'Order_Statistics/allIncome',
	},
	ad_income: {
		list: 'Order_Statistics/clickIncome',
		count: 'Order_Statistics/clickIncome',
	},
	/**** 订单统计 end****/

	/**** 投放数据 ****/
	put_in_data_count: {
		list: 'Invest_Statistics/channel',
		count: 'Invest_Statistics/channel'
	},
	/**** 投放数据 end****/

	/**** 其他内容 ****/
	lead_in: {
		upload: 'File/upload'
	},
	registered_user: {
		list: 'App/user',
		count: 'App/user'
	},
	all_order: {
		list: 'App/order',
		count: 'App/order'
	},
	SDK_count: {
		list: 'App/report',
		count: 'App/report'
	}
	/**** 其他内容 end****/
}

export {
	api
}

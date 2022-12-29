import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import _store from 'store2'
/** USER **/
import user from './user'
/** LIST **/
import user_manage from './list/user_manage'
import app_manage from './list/app_manage'
import start_times from './list/start_times'
import duration_of_use from './list/duration_of_use'
import down_active from './list/down_active'
import active_user from './list/active_user'
import keep_user from './list/keep_user'
import active_user_keep from './list/active_user_keep'
import churn_user from './list/churn_user'
import user_from from './list/user_from'
import order_funnel from './list/order_funnel'
import user_value from './list/user_value'
import user_life from './list/user_life'
import user_life_cost from './list/user_life_cost'
import user_life_cost_pay from './list/user_life_cost_pay'
import new_user from './list/new_user'
import new_user_pay from './list/new_user_pay'
import return_on_investment from './list/return_on_investment'
import converse_rate from './list/converse_rate'
import charge_back_amount from './list/charge_back_amount'
import order_amount from './list/order_amount'
import put_in_data_count from './list/put_in_data_count'
import order_income from './list/order_income'
import order_income_register from './list/order_income_register'
import order_income_origin from './list/order_income_origin'
import registered_user from './list/registered_user'
import all_order from './list/all_order'
import SDK_count from './list/SDK_count'
import keep_lt from './list/keep_lt'
import ad_income from './list/ad_income'
import all_income from './list/all_income'
/** COMMON **/
import menu from './common/menu'
import upload from './common/upload'
import general from './common/general'
/** DICT **/
import app from './dict/app'
import app_version from './dict/app_version'
import channel from './dict/channel'
/** list **/
import ad_index from './list/ad_index'
import ad_app from './list/ad_app'
import position from './list/position'
import ad_types from './list/ad_types'
import ad_cate from './list/ad_cate'
import resource from './list/resource'

const isDev = process.env.NODE_ENV === 'development'

Vue.use(Vuex)

export default () => {
	const store = new Vuex.Store({
		strict: isDev,
		mutations: {
			resetAllState(state, payload = []) {
				if (payload instanceof Array === false) {
					return
				}

				const initState = _store.get('initState')
				const _initState = payload.length ? _.omit(initState, payload) : initState

				_.extend(state, _initState)
			}
		},
		modules: {
			user,
			menu,
			upload,
			general,
			app,
			app_version,
			channel,
			user_manage,
			app_manage,
			start_times,
			order_funnel,
			converse_rate,
			charge_back_amount,
			order_amount,
			duration_of_use,
			down_active,
			active_user,
			keep_user,
			active_user_keep,
			churn_user,
			user_from,
			user_value,
			user_life,
			user_life_cost,
			user_life_cost_pay,
			new_user,
			new_user_pay,
			return_on_investment,
			put_in_data_count,
			order_income,
			order_income_register,
			order_income_origin,
			registered_user,
			all_order,
			SDK_count,
			keep_lt,
			ad_index,
			ad_app,
			position,
			ad_types,
			ad_cate,
			resource,
			ad_income,
			all_income,
		}
	})

	if (module.hot) {
		module.hot.accept([
			'./user',
			'./common/general',
			'./list/user_manage',
			'./list/app_manage',
			'./list/start_times',
			'./list/duration_of_use',
			'./dict/app',
			'./dict/app_version',
			'./dict/channel',
			'./common/menu',
			'./common/upload',
			'./list/down_active',
			'./list/active_user',
			'./list/keep_user',
			'./list/active_user_keep',
			'./list/churn_user',
			'./list/user_from',
			'./list/user_value',
			'./list/user_life',
			'./list/user_life_cost',
			'./list/user_life_cost_pay',
			'./list/new_user',
			'./list/new_user_pay',
			'./list/return_on_investment',
			'./list/order_funnel',
			'./list/converse_rate',
			'./list/charge_back_amount',
			'./list/order_amount',
			'./list/put_in_data_count',
			'./list/order_income',
			'./list/order_income_register',
			'./list/order_income_origin',
			'./list/registered_user',
			'./list/all_order',
			'./list/SDK_count',
			'./list/keep_lt',
			'./list/ad_index',
			'./list/ad_app',
			'./list/position',
			'./list/ad_types',
			'./list/ad_cate',
			'./list/resource',
			'./list/ad_income',
			'./list/all_income',
		], () => {
			const _user = require('./user').default
			const _general = require('./common/general').default
			const _app = require('./dict/app').default
			const _app_version = require('./dict/app_version').default
			const _channel = require('./dict/channel').default
			const _menu = require('./common/menu').default
			const _upload = require('./common/upload').default
			const _user_manage = require('./list/user_manage').default
			const _app_manage = require('./list/app_manage').default
			const _start_times = require('./list/start_times').default
			const _duration_of_use = require('./list/duration_of_use').default
			const _down_active = require('./list/down_active').default
			const _active_user = require('./list/active_user').default
			const _keep_user = require('./list/keep_user').default
			const _active_user_keep = require('./list/active_user_keep').default
			const _churn_user = require('./list/churn_user').default
			const _user_from = require('./list/user_from').default
			const _user_value = require('./list/user_value').default
			const _user_life = require('./list/user_life').default
			const _user_life_cost = require('./list/user_life_cost').default
			const _user_life_cost_pay = require('./list/user_life_cost_pay').default
			const _new_user = require('./list/new_user').default
			const _new_user_pay = require('./list/new_user_pay').default
			const _return_on_investment = require('./list/return_on_investment').default
			const _order_funnel = require('./list/order_funnel').default
			const _converse_rate = require('./list/converse_rate').default
			const _charge_back_amount = require('./list/charge_back_amount').default
			const _order_amount = require('./list/order_amount').default
			const _put_in_data_count = require('./list/put_in_data_count').default
			const _order_income = require('./list/order_income').default
			const _order_income_user = require('./list/order_income_register').default
			const _order_income_origin = require('./list/order_income_origin').default
			const _registered_user = require('./list/registered_user').default
			const _all_order = require('./list/all_order').default
			const _SDK_count = require('./list/SDK_count').default
			const _keep_lt = require('./list/keep_lt').default
			const _ad_index = require('./list/ad_index').default
			const _ad_app = require('./list/ad_app').default
			const _position = require('./list/position').default
			const _ad_types = require('./list/ad_types').default
			const _ad_cate = require('./list/ad_cate').default
			const _resource = require('./list/resource').default
			const _ad_income = require('./list/ad_income').default
			const _all_income = require('./list/all_income').default

			store.hotUpdate({
				user: _user,
				general: _general,
				app: _app,
				app_version: _app_version,
				channel: _channel,
				menu: _menu,
				upload: _upload,
				user_manage: _user_manage,
				app_manage: _app_manage,
				start_times: _start_times,
				duration_of_use: _duration_of_use,
				down_active: _down_active,
				active_user: _active_user,
				keep_user: _keep_user,
				active_user_keep: _active_user_keep,
				churn_user: _churn_user,
				user_from: _user_from,
				user_value: _user_value,
				user_life: _user_life,
				user_life_cost: _user_life_cost,
				user_life_cost_pay: _user_life_cost_pay,
				new_user: _new_user,
				new_user_pay: _new_user_pay,
				return_on_investment: _return_on_investment,
				order_funnel: _order_funnel,
				converse_rate: _converse_rate,
				charge_back_amount: _charge_back_amount,
				order_amount: _order_amount,
				newPutInDataCount: _put_in_data_count,
				order_income: _order_income,
				order_income_register: _order_income_user,
				order_income_origin: _order_income_origin,
				registered_user: _registered_user,
				all_order: _all_order,
				SDK_count: _SDK_count,
				keep_lt: _keep_lt,
				ad_types: _ad_types,
				ad_index: _ad_index,
				ad_app: _ad_app,
				position: _position,
				ad_cate: _ad_cate,
				resource: _resource,
				ad_income: _ad_income,
				all_income: _all_income,
			})
		})
	}

	return store
}

import _ from 'lodash'
import axios from '@/util/axios'
import { getName } from './util'

export default ({
	type = '',
	state = {},
	query = {},
	mutations = {},
	actions = {},
	listApi = '',
	countApi = '',
	addApi = '',
	removeApi = '',
	detailApi = '',
	format = ''
}) => {

	const listInitState = {
		loading: false,
		init: false,
		data: [],
		msg: '',
		total: 0,
		sumArr: {},
		query: {
			// 当前页码
			currentPage: 1,
			// 每页显示几条数据
			pageSize: 10,

			...query
		}
	}

	const addInitState = {
		data: {},
		loading: false,
		msg: ''
	}

	const removeInitState = {
		data: {},
		loading: false,
		msg: ''
	}

	const detailInitState = {
		data: {},
		query: {},
		loading: false,
		msg: ''
	}

	const countInitState = {
		data: {},
		query: {},
		loading: false,
		msg: ''
	}

	const leadInitState = {
		data: {},
		query: {},
		loading: false,
		msg: ''
	}

	const initState = {
		list: { ...listInitState, ...state },
		detail: detailInitState,
		add: addInitState,
		remove: removeInitState,
		count: countInitState,
		lead: leadInitState
	}

	const _initState = _.clone(initState)
	const typeUc = type.toUpperCase()
	// 列表
	const LIST_SUCCESS = `LIST_${typeUc}_SUCCESS`
	const LIST_RESET = `LIST_${typeUc}_RESET`
	const LIST_LOADING = `LIST_${typeUc}_LOADING`
	const LIST_LOADED = `LIST_${typeUc}_LOADED`
	// 统计
	const COUNT_SUCCESS = `COUNT_${typeUc}_SUCCESS`
	const COUNT_RESET = `COUNT_${typeUc}_RESET`
	const COUNT_LOADING = `COUNT_${typeUc}_LOADING`
	const COUNT_LOADED = `COUNT_${typeUc}_LOADED`
	// 导出
	const LEAD_SUCCESS = `LEAD_${typeUc}_SUCCESS`
	const LEAD_RESET = `LEAD_${typeUc}_RESET`
	const LEAD_LOADING = `LEAD_${typeUc}_LOADING`
	const LEAD_LOADED = `LEAD_${typeUc}_LOADED`
	// 查
	const DETAIL_SUCCESS = `DETAIL_${typeUc}_SUCCESS`
	const DETAIL_RESET = `DETAIL_${typeUc}_RESET`
	const DETAIL_LOADING = `DETAIL_${typeUc}_LOADING`
	const DETAIL_LOADED = `DETAIL_${typeUc}_LOADED`
	// 增
	const ADD_SUCCESS = `ADD_${typeUc}_SUCCESS`
	const ADD_LOADING = `ADD_${typeUc}_LOADING`
	const ADD_LOADED = `ADD_${typeUc}_LOADED`

	// 删
	const REMOVE_SUCCESS = `REMOVE_${typeUc}_SUCCESS`
	const REMOVE_LOADING = `REMOVE_${typeUc}_LOADING`
	const REMOVE_LOADED = `REMOVE_${typeUc}_LOADED`


	if (!_.isPlainObject(mutations)) {
		return
	}

	mutations = _.extend(mutations, {
		/** List **/
		[LIST_SUCCESS](state, payload) {
			state.list = {
				...state.list,
				...payload
			}

			state.list.msg = ''
		},
		[LIST_RESET](state, payload) {
			state.list = _initState.list
		},
		[LIST_LOADING](state, payload) {
			state.list.loading = true
		},
		[LIST_LOADED](state, payload) {
			state.list.loading = false
		},
		/** Count **/
		[COUNT_SUCCESS](state, payload) {
			state.count = {
				...state.count,
				...payload
			}
			state.count.msg = ''
		},
		[COUNT_RESET](state, payload) {
			state.count = _initState.count
		},
		[COUNT_LOADING](state, payload) {
			state.count.loading = true
		},
		[COUNT_LOADED](state, payload) {
			state.count.loading = false
		},
		/** Lead **/
		[LEAD_SUCCESS](state, payload) {
			state.lead = {
				...state.lead,
				...payload
			}
			state.lead.msg = ''
		},
		[LEAD_RESET](state, payload) {
			state.lead = _initState.lead
		},
		[LEAD_LOADING](state, payload) {
			state.lead.loading = true
		},
		[LEAD_LOADED](state, payload) {
			state.lead.loading = false
		},
		/** Add **/
		[ADD_SUCCESS](state, payload) {
			state.add.data = {
				...state.add.data,
				...payload
			}
			state.add.msg = ''
		},
		[ADD_LOADING](state, payload) {
			state.add.loading = true
		},
		[ADD_LOADED](state, payload) {
			state.add.loading = false
		},
		/** Remove **/
		[REMOVE_SUCCESS](state, payload) {
			state.remove.data = {
				...state.remove.data,
				...payload
			}

			state.remove.msg = ''
		},
		[REMOVE_LOADING](state, payload) {
			state.remove.loading = true
		},
		[REMOVE_LOADED](state, payload) {
			state.remove.loading = false
		},
		/** Detail **/
		[DETAIL_SUCCESS](state, payload) {
			state.detail = {
				...state.detail,
				...payload
			}
			state.detail.msg = ''
		},
		[DETAIL_RESET](state, payload) {
			state.detail = _initState.detail
		},
		[DETAIL_LOADING](state, payload) {
			state.detail.loading = true
		},
		[DETAIL_LOADED](state, payload) {
			state.detail.loading = false
		}
	})

	return {
		state: initState,
		mutations: mutations,
		actions: _.extend(actions, {
			// 获取列表 / 增删改查的方法
			[getName(type, 'get', 'list')]: async ({ state, commit, rootState }, params = {}) => {
				const {
					list: {
						init,
						query,
						data,
					}
				} = state

				const assignParams = Object.assign({}, query, params)

				const { ignore = true } = params

				if (!ignore && init && _.isEqual(query, assignParams)) {
					return [null, data]
				}

				commit(DETAIL_RESET)
				commit(LIST_LOADING)

				const [err, res] = await axios.post(listApi, assignParams)

				commit(LIST_LOADED)

				if (err) {
					if (res) {
						return [err, res]
					}
					return [err]
				}

				if (format) {
					format(res, assignParams, commit);
					return
				}

				const {
					list,
					total,
					sumArr
				} = res

				commit(LIST_SUCCESS, {
					init: true,
					data: list,
					query: assignParams,
					sumArr,
					total
				})

				return [null, res]
			},
			[getName(type, 'get', 'count')]: async ({ state, commit, rootState }, params = {}) => {
				commit(COUNT_RESET)
				commit(COUNT_LOADING)

				const [err, res] = await axios.post(countApi, params)

				commit(COUNT_LOADED)

				if (err) {
					return [err]
				}

				commit(COUNT_SUCCESS, {
					data: res,
					query: params
				})

				return [null, res]
			},
			[getName(type, 'add')]: async ({ state, commit, rootState }, params = {}) => {
				commit(ADD_LOADING)

				const [err, res] = await axios.post(addApi, params)

				commit(ADD_LOADED)


				if (err) {
					if (res) {
						return [err, res]
					}
					return [err]
				}

				const { data } = res

				commit(ADD_SUCCESS, { ...data })

				return [null, data]
			},
			[getName(type, 'remove')]: async ({ state, commit, rootState }, params = {}) => {
				commit(REMOVE_LOADING)

				const [err, res] = await axios.post(removeApi, params)

				commit(REMOVE_LOADED)


				if (err) {
					if (res) {
						return [err, res]
					}
					return [err]
				}

				const { data } = res

				commit(REMOVE_SUCCESS, { ...data })

				return [null, data]
			},
			[getName(type, 'get')]: async ({ state, commit, rootState }, params = {}) => {
				commit(DETAIL_RESET)
				commit(DETAIL_LOADING)

				const [err, res] = await axios.post(detailApi, params)

				commit(DETAIL_LOADED)

				if (err) {
					if (res) {
						return [err, res]
					}
					return [err]
				}

				commit(DETAIL_SUCCESS, {
					data: res,
					query: params
				})

				return [null, res]
			},
			[getName(type, 'lead')]: async ({ state, commit, rootState }, params = {}) => {
				commit(LEAD_RESET)
				commit(LEAD_LOADING)

				const [err, res] = await axios.post(listApi, params)

				commit(LEAD_LOADED)

				if (err) {
					if (res) {
						return [err, res]
					}
					return [err]
				}

				commit(LEAD_SUCCESS, {
					data: res,
					query: params
				})

				return [null, res]
			}
		})
	}
}

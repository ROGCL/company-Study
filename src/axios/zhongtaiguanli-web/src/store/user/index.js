import store from 'store2'
import axios from '@/util/axios'
import { addRoute, resetRoute } from '@/common/router'

import { api } from '@/config/api'

const initState = {
	timeout: false,
	auth: false,
	about_expire: false,
	loginToken: store.get('loginToken') || '',
	data: store.get('user') || {},
	menu: store.get('menu') || [],
	loading: false,
	breadcrumbRight:null
}

export default {
	state: initState,
	mutations: {
		UPDATE_USER: (state, payload) => {
			state.data = { ...state.data, ...payload }

			state.auth = true
			state.timeout = false

			store.set('user', { ...payload })
		},
		UPDATE_MENU: (state, payload) => {
			state.menu = payload
			store.set('menu', payload)
		},
		RESET_MENU (state, payload) {
			state.menu = []

			resetRoute()
			store.remove('route')
		},
		UPDATE_TOKEN: (state, payload) => {
			state.loginToken = payload

			store.set('loginToken', payload)
		},
		RESET_USER (state, payload) {
			state.user = {}
			state.auth = false
			state.timeout = false

			store.remove('user')
			store.remove('token')
		},
		LOGIN_TIMEOUT (state, payload) {
			const chromePluginId = localStorage.getItem('chromePluginId')
			state.timeout = true
			store.clearAll()
			localStorage.setItem('chromePluginId',chromePluginId)
		},
		LOGIN_LOADING (state) {
			state.loading = true
		},
		LOGIN_LOADED (state) {
			state.loading = false
		},
		UPDATE_BREADCRUMB (state, payload){
			state.breadcrumbRight = payload
		},
		REMOVE_BREADCRUMB (state){
			state.breadcrumbRight = null
		}
	},
	actions: {
		async LOGIN ({ state, commit, rootState }, params) {
			commit('LOGIN_LOADING')

			const [ err, res ] = await axios.post(api.Auth.login, {
				...params
			})

			commit('LOGIN_LOADED')

			if (err) {
				return [ err ]
			}

			const {
				loginToken = '',
				adminInfo = {}
			} = res

			commit('UPDATE_USER', adminInfo)
			commit('UPDATE_TOKEN', loginToken)

			return [ null, adminInfo ]
		},
		async LOGOUT ({ state, commit, rootState }) {
			const chromePluginId = localStorage.getItem('chromePluginId')
			const version = localStorage.getItem('version')
			await store.clearAll()
			localStorage.setItem('chromePluginId',chromePluginId)
			localStorage.setItem('version',version)

			return [ null, '退出成功' ]
		},
		async GET_AUTH_MENU ({ state, commit, rootState }, params = {}) {
			commit('LOGIN_LOADING')

			const [ err, res ] = await axios.post(api.Auth.menu, { ...params })

			commit('LOGIN_LOADED')

			if (err) {
				return [ err ]
			}

			const dynamicRoute = await addRoute(res)

			commit('UPDATE_MENU', res)

			return [ null, dynamicRoute ]
		}
	}
}

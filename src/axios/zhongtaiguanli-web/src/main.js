import Vue from 'vue'
import $echarts from 'echarts'
import _store from 'store2'
import moment from 'moment'
import App from './App.vue'
import './common/element.js'
import router from '@/common/router/index'
import createStore from './store/index'
import axios from '@/util/axios'
import JsonExcel from 'vue-json-excel'
import {checkVersion} from '@/util/version'
import {
	waterMark,
	removeWaterMark
} from '@/util/waterMark'
import * as filters from './util/filters'
import Contextmenu from "vue-contextmenujs"
Vue.use(Contextmenu);
// https://okee.oceanengine.com/vue#/
import { DatePicker} from '@okee-uikit/vue';
Vue.use(DatePicker);
// Vue.use(Cascader);
import elCascaderMulti from "el-cascader-multi";
Vue.use(elCascaderMulti);

import dataPicker from '@/component/date-picker/dataPicker'
Vue.component('dataPicker', dataPicker)

Vue.component('downloadExcel', JsonExcel)

import '@/style/index.less'

const store = createStore();

Vue.config.productionTip = false

Object.keys(filters).forEach((key) => {
	Vue.filter(key, filters[key])
})
moment.locale('zh-cn')
Vue.prototype.$echarts = $echarts
Vue.prototype.$http = axios
Vue.prototype.$moment = moment

router.onReady((to, from) => {
	// 屏蔽掉登录页进入添加重复路由的情况
	if (to.name === '@in') {
		return
	}

	if(localStorage.getItem('loginToken')){
		store.dispatch('GET_AUTH_MENU', {
			appId: to.query.appId
		})
	}
})

router.beforeEach((to, from, next) => {
	const story_user = _store.get('user')
	if (story_user && !!Object.keys(story_user).length) {
		const {
			realname = '', phone = ''
		} = story_user
		
		if(from.name != 'login'){
			checkVersion()
		}

		waterMark(realname + phone.substring(phone.length - 4))

		if (from.query.appId) {
			//路由切换时，如果没有就添加，有就跳过执行，添加固定参数
			if (!to.query.appId) {
				//准备一个跳转的query对象
				let {
					query,
					meta
				} = to
				query.appId = from.query.appId || ''
				
				if (query.appId && !meta.OffAppId) {
					next({
						path: to.path,
						query: query
					})
				} else {
					next()
				}
			} else {
				next()
			}
		} else {
			next()
		}
	} else {
		removeWaterMark()
		if (to.name === 'login') {
			next()
		} else {
			next('/login')
		}
	}
	
	if (process.env.NODE_ENV == 'production') {
		if (to.path) {
			window._hmt.push(['_trackPageview', '/#' + to.fullPath]);
		}
	}

	next()
})
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
import Vue from 'vue'
import Router from 'vue-router'
import { InitRoute } from './module/index'
import getRoutes from '@/util/getRoutes'

Vue.use(Router)

// 相同路由点击报错解决方案
const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

const noFoundRoute = {
	path: '*',
	name: '404',
	component: resolve => require(['@/page/auth/404'], resolve),
	meta: { auth: true, menu: false, name: '404' }
}

const createRouter = () => {
	const routes = InitRoute()

	return new Router({
		routes,
		base: process.env.BASE_URL,
		scrollBehavior() {
			return { x: 0, y: 0 }
		}
	})
}

const router = createRouter()

// 页面刷新时重置路由再进行添加不然会出现重复路由
const addRoute = (config) => {
	const dynamicRoute = getRoutes(config)
	const newRouter = createRouter()

	router.matcher = newRouter.matcher
	router.options = newRouter.options

	dynamicRoute.forEach(_ => {
		router.addRoute(_)
		router.options.routes.push(_)
	})

	router.addRoute(noFoundRoute)
	router.options.routes.push(noFoundRoute)

	return (dynamicRoute)
}

const resetRoute = () => {
	const newRouter = createRouter()

	router.matcher = newRouter.matcher
	router.options.routes = InitRoute()
}

export default router

export {
	addRoute,
	resetRoute
}
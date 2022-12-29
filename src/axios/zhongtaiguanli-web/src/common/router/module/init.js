const EmptyLayout = resolve => require(['@/layout/basic/empty'], resolve)

const initRoute = () => ([
	{
		path: '/',
		redirect: '/login'
	}, {
		path: '/login',
		name: 'login',
		component: resolve => require(['@/page/auth/login'], resolve),
		meta: { auth: true, menu: false, name: '登录' }
	}, {
		path: '/user_center',
		name: 'user_center',
		component: EmptyLayout,
		meta: { auth: true, menu: false, name: '用户中心' },
		children: [
			{
				path: '/user_center/edit',
				name: 'user_edit',
				component: resolve => require(['@/page/user_center/edit'], resolve),
				meta: { auth: true, menu: false, name: '修改个人信息' }
			}, {
				path: '/user_center/edit_pwd',
				name: 'user_edit_pwd',
				component: resolve => require(['@/page/user_center/edit_pwd'], resolve),
				meta: { auth: true, menu: false, name: '重置密码' }
			}, {
				path: '/user_center/edit_base',
				name: 'user_edit_base',
				component: resolve => require(['@/page/user_center/edit_base'], resolve),
				meta: { auth: true, menu: false, name: '个人中心' }
			}
		]
	}, {
		path: '/test',
		name: 'test',
		component: resolve => require(['@/page/test'], resolve),
		meta: { auth: false, menu: false, name: '测试' }
	}
])

export default initRoute
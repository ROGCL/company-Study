import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/loginPages'
    },
    {
        path: '/loginPages',
        name: 'loginPages',
        component: () => import('@/pages/login-pages.vue')
    },
    {
        path: '/homePages',
        name: 'homePages',
        component: () => import('@/pages/home-pages.vue'),
        meta: {
            isAuth: true
        },
        // 重定向到首页，默认显示首页
        children: [
            {
                path: '/indexPages',
                name: 'indexPages',
                redirect: '/homePages',
                component: () => import('@/pages/children/index-pages.vue'),
                meta: {
                    isAuth: true
                }
            },
            {
                path: '/onlinePages',
                name: 'onlinePages',
                component: () => import('@/pages/children/online-pages.vue'),
                meta: {
                    isAuth: true
                },
                children: [
                    {
                        path: 'analysisPages',
                        name: 'analysisPages',
                        component: () => import('@/pages/children/childrens/analysis-pages.vue'),
                        meta: {
                            isAuth: true
                        },
                    },
                    {
                        path: 'designPages',
                        name: 'designPages',
                        component: () => import('@/pages/children/childrens/design-pages.vue'),
                        meta: {
                            isAuth: true
                        },
                    },
                    {
                        path: 'elsePages',
                        name: 'elsePages',
                        component: () => import('@/pages/children/childrens/else-pages.vue'),
                        meta: {
                            isAuth: true
                        },
                    },
                    {
                        path: 'internalPages',
                        name: 'internalPages',
                        component: () => import('@/pages/children/childrens/internal-pages.vue'),
                        meta: {
                            isAuth: true
                        },
                    },
                    {
                        path: 'managementPages',
                        name: 'managementPages',
                        component: () => import('@/pages/children/childrens/management-pages.vue'),
                        meta: {
                            isAuth: true
                        },
                    },
                    {
                        path: 'mannagerPages',
                        name: 'mannagerPages',
                        component: () => import('@/pages/children/childrens/mannager-pages'),
                        meta: {
                            isAuth: true
                        },
                    },
                    {
                        path: 'qualityPages',
                        name: 'qualityPages',
                        component: () => import('@/pages/children/childrens/quality-pages.vue'),
                        meta: {
                            isAuth: true
                        },
                    },
                    {
                        path: 'sparePages',
                        name: 'sparePages',
                        component: () => import('@/pages/children/childrens/spare-pages.vue'),
                        meta: {
                            isAuth: true
                        },
                    },
                    {
                        path: 'technologyPages',
                        name: 'technologyPages',
                        component: () => import('@/pages/children/childrens/technology-pages.vue'),
                        meta: {
                            isAuth: true
                        },
                    }
                ]
            }
        ]
    },

    {
        path: '/symbolPages',
        name: 'symbolPages',
        component: () => import('@/pages/symbol-pages.vue'),
        meta: {
            isAuth: true
        },
    },
    //权重管理，管理员可以进入该路由，普通用户不能看这个界面(普通用户只能看个人学习记录界面)
    {
        path: '/imporantPages',
        name: 'imporantPages',
        component: () => import('@/pages/important-pages.vue'),
        meta: {
            isAuth: true
        },
    },
    //单节课添加界面
    {
        path:'/addSingleClassPages',
        name:'addclassPages',
        component:()=>import('@/pages/addSingleClass-pages.vue'),
        meta:{
         isAuth:true
        }
     },
     //系列课添加界面
     {
        path:'/addMoreClassPages',
        name:'addMoreClassPages',
        component:()=>import('@/pages/addMoreClass-pages.vue'),
        meta:{
         isAuth:true
        }
     },
     //编辑课页面
     {
      path:'/redactPages',
      name:'redactPages',
      component:()=>import('@/pages/redact-pages.vue')
     },
    //退出登录
    {
        path: '/studyPages',
        name: 'styduPages',
        component: () => import('@/pages/study-pages.vue'),
        redirect: '/loginPages'
    },
    {
        path: '/broadPages',
        name: 'broadPages',
        component: () => import('@/pages/broad-pages.vue'),
        meta: {
            isAuth: true
        },
    },
    {
      path:'/recordLearning',
      name:'recordLearning',
      component:()=>import('@/pages/recordLearning-pages.vue'),
      meta:{
        isAuth: true
      }
    },
    {
        path: '*',
        component: () => import('@/pages/notFound-pages.vue'),
    }
]

const router = new VueRouter({
    routes
})
// 添加白名单，未登录时，不能够进去的页面
// let whiteList = ["/homePages","/symbolPages","/studyPages","/broadPages"]
// 白名单项用作判断过于复杂，可以在需要作权限控制的路由组件身上，加上meta对象给定特殊的标识符，再进行判断（简化代码量）
// console.log(localStorage.getItem("token"))
// let token = localStorage.getItem('token')  
router.beforeEach((to, from, next) => {
    if (to.meta.isAuth) {
        if (sessionStorage.getItem("token")) {
            next()
            // sessionStorage.removeItem("token")
        } else {
            alert("请输入正确的账户或密码后在进行查看")
            next('/loginPages')
        }
    } else {
        next()
    }

})

// 全局后置守卫----初始化的时候被调用、每次路由切换之后被调用（没有next（），只有to，from）
export default router
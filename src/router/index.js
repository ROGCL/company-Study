import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui';
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/loginPages'
    },
    {
        path: '/loginPages',
        name: 'loginPages',
        component: () => import('@/pages/login/login-pages copy.vue')
    },
    {
        path: '/homePages',
        name: 'homePages',
        component: () => import('@/pages/home/home-pages.vue'),
        meta: {
            isAuth: true
        },
    },

    {
        path: '/symbolPages',
        name: 'symbolPages',
        component: () => import('@/pages/manager/user/symbol-pages.vue'),
        meta: {
            isAuth: true
        },
    },
    //权重管理，管理员可以进入该路由，普通用户不能看这个界面(普通用户只能看个人学习记录界面)
    {
        path: '/imporantPages',
        name: 'imporantPages',
        component: () => import('@/pages/manager/Administrator/important-pages.vue'),
        meta: {
            isAuth: true
        },
    },
    //单节课添加界面
    {
        path:'/addSingleClassPages',
        name:'addclassPages',
        component:()=>import('@/pages/manager/course/addSingleClass-pages.vue'),
        meta:{
         isAuth:true
        }
     },
     //系列课添加界面
     {
        path:'/addMoreClassPages',
        name:'addMoreClassPages',
        component:()=>import('@/pages/manager/course/addMoreClass-pages.vue'),
        meta:{
         isAuth:true
        }
     },
     //编辑课页面
     {
      path:'/redactPages',
      name:'redactPages',
      component:()=>import('@/pages/manager/Administrator/redact-pages.vue')
     },
    {
        path: '/broadPages',
        name: 'broadPages',
        component: () => import('@/pages/videoPlay/broad-pages.vue'),
        meta: {
            isAuth: true
        },
    },
    {
      path:'/recordLearning',
      name:'recordLearning',
      component:()=>import('@/pages/manager/Administrator/recordLearning-pages.vue'),
      meta:{
        isAuth: true
      }
    },
    {
        path: '*',
        component: () => import('@/pages/notFound/notFound-pages.vue'),
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
    let token = sessionStorage.getItem("token")
    if (to.meta.isAuth) {
        if (token) {
            next()
            // sessionStorage.removeItem("token")
        } else {
            Message.error('请输入账号或密码后在进行查看')
            next('/loginPages')
        }
    }else {
        next()
    }

})

// 全局后置守卫----初始化的时候被调用、每次路由切换之后被调用（没有next（），只有to，from）
export default router
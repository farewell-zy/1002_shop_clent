import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/store'

// 安装Vue插件
Vue.use(VueRouter)

// 缓存原本的push方法
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
// 指定新的push方法
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  console.log('push', onResolve, onReject)
  // 如果指定了成功或失败的回调
  if (onResolve || onReject) {
    // 直接调用原本的push方法
    // originalPush(location, onResolve, onReject)
    return originalPush.call(this, location, onResolve, onReject)
  } 
  // 没有指定成功或失败回调, 必须用catch处理
  return originalPush.call(this, location).catch((err) => {
    // 如果是重复导航产生的错误, 不再向外传递错误
    if (VueRouter.isNavigationFailure(err)) {
      // resolve err
      return err  // 产生的是成功的promise, 成功promise的value是err
    }
    // 如果是其它原因导航的错误, 将错误向下传递
    // throw error
    return Promise.reject(err)
  })
}

VueRouter.prototype.replace = function (location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject)
  } 
  return originalReplace.call(this, location).catch((err) => {
    if (VueRouter.isNavigationFailure(err)) {
      return err  
    }
    return Promise.reject(err)
  })
}


// 向外暴露路由器对象
const router = new VueRouter({
  // 模式
  mode: 'history', // 不带#
  // 应用中的所有路由
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

// 注册全局前置导航守卫，用来对token校验(根据token获取用户信息)
router.beforeEach(async (to,from,next) => {
  // to跳转的目的地路由对象
  // from跳转来自的
  // next一个函数
  // next()代表无条件放行
  // next('/')代表强制跳转到指定位置
  // next(false)代表什么都不做，原地不动

  // 第一步:守卫拦截住，先去获取用户的token
  let token = store.state.user.token
  let userInfo = store.state.user.userInfo.name

  if(token){
    // 如果token存在，代表用户登录过
    if(to.path === '/login'){
      // 用户已经登录了，还要往登录页面去跳，没必要
      next('/')
    } else{
      // 如果用户已经登陆了，但是跳转的不再是登录页，需要看用户的信息获取了没有
      if(userInfo){
        // 如果用户的信息已经获取，无条件放行
        next()
      }else{
        // 用户已经登录，但是用户还没有获取用户信息
        try {
          // 如果获取用户信息成功，用户拿到，无条件放行
          await store.dispatch('getUserInfo')// 用户根据token获取yoghurt信息
          next()
        } catch (error) {
          // 根据token获取用户信息失败代表token可能过期了
          // 把用户的过期token给清理掉，重新跳转登录页面
          store.dispatch('clearToken')
          next('/login')
        }
      }
    }
  } else {
    // 用户根本没登录
    // 目前我们什么都不做
    // 如果用户访问的是交易相关 支付相关 个人中心相关 那么跳转到登录页面
    let targetPath = to.path
    if(targetPath.indexOf('/trade')!==-1 || targetPath.indexOf('/pay')!==-1 || targetPath.startsWith('/center')){
      // next('/login')// 这样写可以直接去登录页但登录成功不会去到之前的地方
      next('/login?redirect='+targetPath) // 想要回到之前去的地方，必须把想去的那个地方带到登录路径
    }
    next()
  }
})
export default router



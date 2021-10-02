import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'


// 1. 配置通用的基础路径和超时
const service = axios.create({
  baseURL: '/mock',//设置当前项目当中所有接口路径的公共路径部分，基本路径
  timeout: 20000,//当ajax请求超过设置的这个时间就会报错
  
})

// 2. 显示请求进度条
service.interceptors.request.use((config) => {
  NProgress.start()
  //携带临时标识
  let userTempId = store.state.user.userTempId
  if(userTempId){
    config.headers.userTempId = userTempId
  }
  //携带登录后标识token
  let token = store.state.user.token
  if(token){
    config.headers.token = token
  }
  return config
})

// 添加响应拦截器
service.interceptors.response.use(
  response => {
    NProgress.done()
    return response.data
  },
  error => {
    NProgress.done()
    alert(error.message || '未知的请求错误')
    return Promise.reject(error)
  }
)

export default service
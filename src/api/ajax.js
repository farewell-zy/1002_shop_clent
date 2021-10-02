// axios二次封装
// 1. 配置通用的基础路径和超时
// 2. 显示请求进度条
// 3. 成功返回的数据不再是response, 而直接是响应体数据response.data
// 4. 统一处理请求错误, 具体请求也可以选择处理或不处理
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'

// 1. 配置通用的基础路径和超时
const service = axios.create({
  baseURL: '/api',
  timeout: 20000,
})

// 2. 显示请求进度条
// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    // 显示请求进度条: 在请求拦截器中
    NProgress.start()
    // 请求头内部需要添加临时标识，后期每个请求都会带上这个临时标识
    let userTempId = store.state.user.userTempId;
    if(userTempId){
      config.headers.userTempId = userTempId
    }
    
    // 登录成功后，需要把token添加到请求头当中，从今以后所有的请求当中都要带上这个token
    let token = store.state.user.token
    if(token){
      config.headers.token = token
    }

    return config // 后面就会根据返回的config, 使用xhr对象发ajax请求
})

// 添加响应拦截器
service.interceptors.response.use(
  response => {
    // 隐藏请求进度条: 在响应拦截器成功的回调中
    NProgress.done()
    return response.data
  },
  error => {
    // 隐藏请求进度条: 在响应拦截器失败的回调中
    NProgress.done()
    /* 4. 统一处理请求错误, 具体请求也可以选择处理或不处理 */
    alert(error.message || '未知的请求错误')
    // return  new Promise(() => {})返回的是pending的状态，代表终端
    // return Promise.reject(new Error('发送ajax请求失败'))后面想继续处理这个错误返回失败的promise
    // return error // 不能这么写
    // throw error
    return Promise.reject(new Error('发送ajax请求失败'))
  }
)
export default service
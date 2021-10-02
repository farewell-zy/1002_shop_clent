import { getToken, getUserTempId } from "@/utils/userabout"
import { reqUserRegister, reqGetCode, reqUserLogin, reqGetUserInfo, reqUserAddressList } from '@/api'

const state = {
  // 存数据
  // getUserTempId()这个函数时专门用来生成用户的临时标识
  userTempId: getUserTempId(),
  code:'',
  // token:'', //第一次登录的时候先初始化为空串是不对的，无法自动登录
  // 以前没登录过初始化空串没问题，有登陆过就从localStorage里面获取
  token:localStorage.getItem('TOKEN_KEY'),
  // 根据token获取用户信息
  userInfo:{},

  userAddressList: []
}


const mutations = {
  // 直接修改数据
  RECEIVE_CODE(state, code){
    state.code = code
  },
  RECEIVE_TOKEN(state, token){
    state.token = token
  },
  RECEIVE_USERINFO(state,userInfo){
    state.userInfo = userInfo
  },
  RESET_TOKEN(state){
    state.token = ''
  },
  RECEIVE_USERADDRESSLIST(state,userAddressList){
    state.userAddressList = userAddressList
  }
}

const actions = {
  // 与组件当中用户对接
  // 一般是异步发请求
  // 提交mutations
  async userRegister({commit},userInfo){
    const result = await reqUserRegister(userInfo)
    if(result.dode === 200){
      return 'ok'
    } else {
      return Promise.reject(new Error('failed'))
    }
  },

  // 请求获取code
  async getCode({commit},phone){
    const result = await reqGetCode(phone)
    if(result.code === 200){
      commit('RECEIVE_CODE',result.data)
      return 'ok'
    } else{
      return Promise.reject(new Error('failed'))
    }
  },

  // 请求登录
  async userLogin({commit},userInfo){
    const result = await reqUserLogin(userInfo)
    if(result.code === 200){
      commit('RECEIVE_TOKEN', result.data.token)
      // token获取后需要存储到localStorage当中，因为在一定时间内不是随意更改的(过期时间)
      // 自动登录
      localStorage.setItem('TOKEN_KEY', result.data.token)
      // 有后续操作，就return
      return 'ok'
    } else{
      return Promise.reject(new Error('failed'))
    }
  },

  // 根据token请求获取用户信息
  async getUserInfo({commit}){
    const result = await reqGetUserInfo()
    if(result.code === 200){
      commit('RECEIVE_USERINFO',result.data)
      return 'ok'
    }else{
      return Promise.reject(new Error('failed'))
    }
  },

  // 清除用户的token
  async clearToken({commit}){
    commit('RESET_TOKEN')
    // token过期时，不但要清楚data,也要清除localStorage
    localStorage.removeItem('RESET_TOKEN')
  },

  // 请求退出登录
  async userLogout({commit}){
    const result = await reqUserLogout()
    if(result.code === 200){
      commit('RESET_TOKEN')
      localStorage.removeItem('RESET_TOKEN')
      return 'ok'
    } else{
      return Promise.reject(new Error('failed'))
    }
  },

  // 获取用户收获信息地址
  async getUserAddressList({commit}){
    const result = await reqUserAddressList()
    if(result.code === 200){
      commit('RECEIVE_USERADDRESSLIST',result.data)
    }
  },


}


const getters = {
  // 后面用来简化数据的操作
}



export default ({
  state,
  mutations,
  actions,
  getters
})
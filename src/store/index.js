import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import user from './modules/user'
import home from './modules/home'
import search from './modules/search'
import detail from './modules/detail'
import shopcart from './modules/shopcart'
import trade from '@/store/modules/trade'


const state = {
  // 存数据
}


const mutations = {
  // 直接修改数据
}

const actions = {
  // 与组件当中用户对接
  // 一般是异步发请求
  // 提交mutations
}

const getters = {
  // 后面用来简化数据的操作
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  // modules代表模块化
  modules:{
    user,
    home,
    search,
    detail,
    shopcart,
    trade
  }
})
import {reqCategoryList,reqBannerList,reqFloorList,reqRecommends} from '@/api'


const state = {
  // 存数据
  categoryList: [],
  bannerList: [],
  floorList: [],
  recommends: []
}


const mutations = {
  // 直接修改数据
  RECEIVE_CATEGORYLIST(state,categoryList) {
    state.categoryList = categoryList
  },
  RECEIVE_BANNERLIST(state,bannerList){
    state.bannerList = bannerList
  },
  RECEIVE_FLOORLIST(state,floorList){
    state.floorList = floorList
  },
  RECEIVE_RECOMMENDS(state, recommends){
    state.recommends = recommends
  }
}

const actions = {
  // 与组件当中用户对接
  // 一般是异步发请求
  // 提交mutations
  async getCategoryList({commit}) {
    // 发送请求拿数据，提交给mutations,存储到state
    // await和async作用:可以通过同步代码实现异步效果，可读性强
    // 之前统一处理过所以不用try{}catch(error){}
    // .then().catch()：可读性不强，里面还是有异步代码（异步回调函数）
    const result = await reqCategoryList()
    if(result.code === 200){
      commit('RECEIVE_CATEGORYLIST', result.data)
    }
  },
  async getBannerList({commit}){
    const result = await reqBannerList()
    if(result.code === 200){
      commit('RECEIVE_BANNERLIST', result.data)
    }
  },
  async getFloorList({commit}){
    const result = await reqFloorList()
    if(result.code === 200){
      commit('RECEIVE_FLOORLIST', result.data)
    }
  },
  async getRecommends({commit}){
    const result = await reqRecommends()
    if(result.code === 200){
      commit('RECEIVE_RECOMMENDS', result.data)
    }
  }
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
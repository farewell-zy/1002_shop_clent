import { reqSearchInfo } from "@/api"
const state = {
  searchInfo:{}
}
const mutations = {
  RECEIVE_SEARCHINFO(state,searchInfo){
    state.searchInfo = searchInfo
  }
} 
const actions = {
  async getSearchInfo({commit},searchParams){
    // searchParams这个参数是用户发请求的时候，也就是dispatch的时候给我们传递的对象
    // 这个参数在actions的函数当中只能在{commit}后面
    const result = await reqSearchInfo(searchParams)
    if(result.code === 200){
      commit('RECEIVE_SEARCHINFO',result.data)
    }
  }
}
const getters = {
  // 后面用来简化数据的操作
  // 为什么要用getters，是因为我们获取的数据内部结构复杂，使用起来不方便，甚至出现小问题(假报错)
  attrsList(state){
    return state.searchInfo.attrsList || [] // 空数组为了后期不出现假报错
  },
  goodsList(state){
    return state.searchInfo.goodsList || [] 
  },
  trademarkList(state){
    return state.searchInfo.trademarkList || [] 
  },
}
export default ({
  state,
  mutations,
  actions,
  getters
})
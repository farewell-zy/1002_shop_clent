import {reqAddOrUpdateShopCart, reqShopCartInfo, reqUpdataCartIscheck, deleteShopCart} from '@/api'

const state = {
  // 存数据
  shopCartInfo: []
}


const mutations = {
  // 直接修改数据
  RECEIVE_SHOPCARTINFO(state,shopCartInfo){
    state.shopCartInfo = shopCartInfo
  }
}

const actions = {
  // 与组件当中用户对接
  // 一般是异步发请求
  // 提交mutations
  // 后面用来简化数据的操作
  async addOrUpdateShopCart({commit},{skuId,skuNum}){
    const result = await reqAddOrUpdateShopCart(skuId,skuNum)
    // 这个写法，async函数返回的promise函数永远成功的，不合常理
    // if(result.code === 200){
    //   return 'ok'
    // }else{
    //   return 'failed'
    // }
    if(result.code === 200){
      return 'ok'
    }else{
      return Promise.reject(new Error('failed'))
    }
  },
  async getShopCartInfo({commit}){
    const result = await reqShopCartInfo()
    if(result.code===200) {
      commit('RECEIVE_SHOPCARTINFO',result.data)
    }
  },

  // 修改购物车选中
  async updataCartIscheck({commit},{skuId,isCheckId}){
    const result = reqUpdataCartIscheck(skuId,isCheckId)
    if(result.code === 200){
      return 'ok'
    }else{
      return Promise.reject(new Error('failed'))
    }
  },

  // 使用Promise.all 采用单个修改的接口去修改多个，但是真正的不是这样做的
  // 真正的就应该有一个修改多个的接口
  updataCartIscheckAll({commit,getters,dispatch},isChecked){
    let promises = []
    getters.cartInfo.cartInfoList.forEach(item => {
      if(item.isCheckId=== isChecked) return
      let promise = dispatch('updataCartIscheck',{skuId:item.skuId,isChecked:isChecked})
      promises.push(promise)
    });
    return Promise.all(promises)
  },

  // 删除单个
  async deleteShopCart({commit},skuId){
    const result = await reqDeleteShopCart(skuId)
    if(result.code === 200){
      return 'ok'
    }else{
      return Promise.reject(new Error('failed'))
    }
  },
  // 删除多个
  deleteShopCartAll({commit,getters,dispatch}){
    let promises = []
    getters.cartInfo.cartInfoList.forEach(item => {
      if(!item.isChecked) return
      let promise = dispatch('deleteShopCart',item.skuId);
      promises.push(promise)
    })
    return Promise.all(promises)
  }
}

const getters = {
  cartInfo(state){
    // 这个拿到的是购物车列表
    return state.shopCartInfo[0] || {}
  }
}



export default ({
  state,
  mutations,
  actions,
  getters
})
// 这个文件写的都是函数，接口请求函数
import request from './ajax'
import mockAjax from './mockAjax'

// 请求三集分类列表数据
export const reqCategoryList = () => {
  return request({
    url: '/get/product/getBaseCategoryList',
    method: 'get'
  })
}

// 请求获取模拟接口的数据banner和floor
export const reqBannerList = () => {
  return mockAjax({
    url:'/banners',
    method: 'get'
  })
}
export const reqRecommends = () => {
  return mockAjax({
    url: '/recommends',
    method: 'get'
  })
}

export const reqFloorList = () => {
  return mockAjax({
      url: '/floors',
      method: 'get'
  })
}


export const reqSearchInfo = (searchParams) => {
  return request({
    url:'/post/list',// 接口地址
    method: 'post',
    data: searchParams// 用户搜索的参数
  })
}
// 这个请求参数，searchParams必须是一个对象，可以是空对象，但必须传
// 其实用户发请求的时候，这个参数给空对象{}，也是可以获取数据的，代表获取商品默认搜索数据

export const reqDetailInfo = (skuId) => {
  return request({
    url:`/get/item/${ skuId }`,
    method: 'get',
  })
}

// 请求添加购物车
export const reqAddOrUpdateShopCart = (skuId,skuNum) => {
  return request({
    url: `/post/cart/addToCart/${ skuId }/${ skuNum }`,
    method: 'post'
  })
}
// 请求页面数据
export const reqShopCartInfo = () => {
  return request({
    url:'/get/cart/cartList',
    method: 'get'
  })
}
// 修改购物车选中状态
export const reqUpdataCartIscheck = (skuId,isChecked) => {
  return request({
    url: `/get/cart/checkCart/${skuId}/${isChecked}`,
    method: 'get'
  })
}
// 请求删除购物车数据
export const reqDeleteShopCart = (skuId) => {
  return request({
    url: `/delete/cart/deleteCart/${skuId}`,
    method: 'delete'
  })
}
// 请求注册用户
// 参数请求体 code phone password
export const reqUserRegister = (userInfo) => {
  return request({
    url:'/post/user/passport/register',
    method:'post',
    data:userInfo
  })
}
// 请求获取用户注册验证码
export const reqGetCode = (phone) => {
  return request({
    url:`/get/user/passport/sendCode/${phone}`,
    method: 'get'
  })
}
// 请求用户的登录
// 返回东西不严谨
// data：{
//   nickName:'Administrator',
//   name:'Admin',
//   token: dwadaglajf
// }
export const reqUserLogin = (userInfo) => {
  return request({
    url:'/post/user/passport/login',
    method: 'post',
    data: userInfo
  })
}

// 根据token请求获取用户信息
// 参数是token已经在请求头中添加了
export const reqGetUserInfo = (token) => {
  return request({
    url:'/get/user/passport/auth/getUserInfo',
    method:'get',
    data: token
  })
}
// 退出登录
export const reqUserLogout = () => {
  return request({
    url: '/get/user/passport/logout',
    method:'get'
  })
}

// 请求获取用户收获地址的信息
export const reqUserAddressList = () => {
  return request({
    url: '/get/user/userAddress/auth/findUserAddress', 
    method: 'get'
  })
}

// 获取订单交易信息
export const reqTradeInfo = () => {
  return request({
    url: '/get/order/auth/trade',
    method: 'get'
  })
}

// 请求提交创建订单
export const reqSubmitOrder = (tradeNo,tradeInfo) => {
  return request({
    url: `/post/order/auth/submitOrder?tradeNo=${tradeNo}`,
    method: 'post',
    data: tradeInfo
  })
}

// 请求获取支付信息
export const reqPayInfo = (orderId) => {
  return request({
    url: `/get/payment/weixin/createNative/${orderId}`,
    method:'get'
  })
}

// 请求获取订单支付状态
export const reqPayStatus = (orderId)=> {
  return request({
    url:`/get/payment/weixin/queryPayStatus/${orderId}`,
    method: 'get'
  })
}

// 请求获取我的订单列表数据
export const reqMyOrderInfo = (page,limit) => {
  return request({
    url: `/get/order/auth/${page}/${limit}`,
    method: 'get'
  })
}
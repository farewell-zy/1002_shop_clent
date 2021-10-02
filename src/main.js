import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // 简写

import 'swiper/css/swiper.css'
import './mock/mockServer' // 引入让模拟的生效

import * as API from '@/api' // 直接获取接口请求函数文件暴露出来的对象(*通配符所有的，as API起了个别名，将所有放到对象里)
// import '@/api'

import { Button, MessageBox, Message } from 'element-ui';

import './utils/validate.js'

// 图片懒加载
import VueLazyload from 'vue-lazyload'
import loading from '@/assets/images/loading.gif'
// 在图片界面没有进入到可视化范围前不加载，在没有得到图片前先显示loading图片
Vue.use(VueLazyload,{ // 内部定义了一个指定lazy
  loading, // 指定未加载得到图片之前的loading
})

// element-ui当中分为两种组件
// 第一种组件和下面这个Button一样，可以引入然后全局注册
// Vue.component(Button.name, Button);// 两种引用方法
Vue.use(Button)
// 第二种组件就和MessageBox类似，引入后不能直接注册，而是挂载Vue原型上使用
Vue.prototype.$msgbox = MessageBox;// 用来做弹框的
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message;// 用来做提示消息的



import TypeNav from '@/components/TypeNav'
import SlideLoop from '@/components/SlideLoop'
import Pagination from '@/components/Pagination'

// 注册全局组件
Vue.component('TypeNav', TypeNav)
Vue.component('SlideLoop', SlideLoop)
Vue.component('Pagination', Pagination)


// 浏览器控制台不显示非生产环境打包的提示
Vue.config.productionTip = false

new Vue({
  beforeCreate () {
    // 1) 创建或指定事件总线对象, 保存到Vue的原型上
    Vue.prototype.$bus = this // 安装总线 代表任意组件内部都可以通过this.$bus访问vm实例
    Vue.prototype.$API = API // 不通过vuex发送请求
  },

  render: h => h(App),
  router,
  store,
}).$mount('#app')

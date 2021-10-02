/* 
所有路由匹配的数组
*/
// import Home from '../pages/Home'// 同步引入
//import函数可以让文件单独打包，并且动态加载(路由懒加载)
const Home = () => import('@/pages/Home')
import Search from '@/pages/Search'
// const Search = () => import('@/pages/Search')



import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade'
import Pay from '@/pages/Pay'
import PaySuccess from '@/pages/PaySuccess'
import Center from '@/pages/Center'
import Myorder from '@/pages/Center/MyOrder'
import GroupOrder from '@/pages/Center/GroupOrder'


//import from 这样的写法
//一个是同步引入，从上往下依次执行引入
//它不能动态引入
//它是把所有的组件全部引入完成才执行下面代码，webpack打包的时候会把所有的引入组件集体打包，打包成一个大文件
//效率比较慢

//import函数可以让路由组件单独打包   还支付动态引入
//写法很简单，路由组件在注册的时候可以是一个组件也可以是一个函数
//写成函数，当路由被访问的时候，对应的函数就会调用，然后对应的import函数才会执行 动态引入并打包成单独文件


export default [
  {
    path:'/center',
    component:Center,
    children:[
      {
        path:'myorder',
        component:Myorder
      },
      {
        path:'grouporder',
        component: GroupOrder
      },
      {
        path:'',
        redirect: 'myorder'
      }
    ]
  },
  {
    path:'/trade',
    component:Trade,
    beforeEnter:(to, from, next) => {
      // 只有从购物车界面才能跳到交易页面
      if(from.path === '/shopcart'){
        next()
      }else{
        next(false)
      }
    }
  },
  {
    path:'/pay',
    component:Pay,
    beforeEnter:(to, from, next) => {
      if(from.path === '/trade'){
        next()
      }else{
        next(false)
      }
    }
  },
  {
    path:'/paysuccess',
    component:PaySuccess
  },
  {
    path:'/shopcart',
    component:ShopCart
  },
  {
    path:'/addcartsuccess',
    component:AddCartSuccess,
    beforeEnter:(to, from, next) => {
      let skuNum = to.query.skuNum
      let skuInfo = sessionStorage.getItem('SKUINFO_KEY')
      if(skuNum && skuInfo){
        next()
      }else{
        alert('必须携带参数才能跳转')
        // next('/')
        next(false)// 这里是什么都不做
      }
    }
  },
  {
    path: '/detail/:goodsId',
    component: Detail
  },
  {
    path: '/',
    component: Home
    // component后面可以是一个组件也可以是一个函数
    // 这个函数当用户第一次访问Home组件的时候就会执行
  },
  {
    name: 'search',
    path: '/search/:keyword?',
    component: Search,
    // props: true, // 只映射params参数
    props: (route) => ({keyword3: route.params.keyword, keyword4: route.query.keyword2}) 
  },
  {
    name: 'register',
    path: '/register',
    component: Register,
    meta: {
      isHideFooter: true
    }
  },
  {
    path: '/login',
    component: Login,
    meta: {
      isHideFooter: true
    },
  },
]
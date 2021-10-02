<template>
  <div id="app">
    <!-- <el-button type="danger" icon="el-icon-delete"></el-button> -->
    <Header></Header>
    <!-- 所有的一级路由都在此显示 -->
    <router-view></router-view>
    <Footer v-show="!$route.meta.isHideFooter"></Footer>
  </div>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  mounted () {
    // 获取三级分类
    this.$store.dispatch('getCategoryList');
    this.$store.dispatch('getBannerList');
  },
}
</script>

<style>

</style>

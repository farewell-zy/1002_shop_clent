<template>
  <div>
    <TypeNav></TypeNav>
    <ListContainer/>
    <TodayRecommend></TodayRecommend>
    <Rank></Rank>
    <Like></Like>
    <Floor v-for="floor in floorList" :key="floor.id" :floor="floor"></Floor>
    <Brand></Brand>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import ListContainer from './ListContainer'
import TodayRecommend from './TodayRecommend'
import Rank from './Rank/Rank.vue'
import Like from './Like/Like.vue'
import Floor from './Floor/Floor.vue'
import Brand from './Brand/Brand.vue'


export default {
  name: 'Home',

  mounted () {
    this.$store.dispatch('getRecommends')
    this.$store.dispatch('getFloorList')
  },

  computed: {
    ...mapState({
      floorList: state => state.home.floorList
    })
  },

  // 注册局部组件
  components: {
    ListContainer,
    TodayRecommend,
    Rank,
    Like,
    Floor,
    Brand,
  }
}
</script>
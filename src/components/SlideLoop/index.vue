<template>
  <div class="swiper-container" ref="bannerSwiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="banner in bannerList" :key="banner.id">
        <img :src="banner.imageUrl" style="width: 100%; height: 100%" />
      </div>
    </div>
    <div class="swiper-pagination"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
import Swiper from "swiper";
export default {
  name: "SlideLoop",
  props: ['bannerList'],
  watch: {
    bannerList: {
      immediate: true, // 这里加没用，单纯为了代码一样
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          setTimeout(() => {
            new Swiper(this.$refs.bannerSwiper, {
              loop: true, // 循环模式选项
              // 如果需要分页器
              pagination: {
                el: ".swiper-pagination",
              },
              // 如果需要前进后退按钮
              navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              },
            });
          });
        });
      },
    },
  },
};
</script>

<style lang="less" scoped>
</style>

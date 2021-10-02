<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <li class="with-x" v-if="searchParams.categoryName"> 
              {{ searchParams.categoryName }}<i @click="removeCategoryName">x</i>
            </li>
            <li class="with-x" v-if="searchParams.keyword"> 
              {{ searchParams.keyword }}<i @click="removeKeyword">x</i>
            </li>
            <li class="with-x" v-if="searchParams.trademark"> 
              {{ searchParams.trademark.split(":")[1] }}<i @click="removeTrademark">x</i>
            </li>
            <li class="with-x" v-for="(prop, index) in searchParams" :key="prop"> 
              {{ prop.split(":")[1] }}<i @click="removeProp(index)">x</i>
            </li>
          </ul>
        </div>
        <!--selector-->
        <SearchSelector @searchForTrademark="searchForTrademark" @searchForProps="searchForProps"/>

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <!-- order: '1:desc' -->
                <li :class="{ active: sortFlag === '1' }">
                  <a href="javascript:" @click="changSort(1)"
                    >综合
                    <i
                      v-if="sortFlag === 1"
                      class="iconfont"
                      :class="{
                        icondown: sortType === 'desc',
                        iconup: sortType === 'asc',
                      }"
                    ></i>
                  </a>
                </li>
                <li>
                  <a href="javascript:">销量 </a>
                </li>
                <li>
                  <a href="#">新品</a>
                </li>
                <li>
                  <a href="#">评价</a>
                </li>
                <li :class="{ active: sortFlag === '2' }">
                  <a href="javascript:" @click="changSort(2)">价格
                    <i 
                      v-if="sortFlag === 2"
                      class="iconfont"
                      :class="{ icondown: sortType === 'desc', iconup: sortType === 'asc',
                      }"
                    ></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <h2>{{ goodsList.length }}</h2>
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="goods in goodsList" :key="goods.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link to="'/detail/'+goods.id">
                      <img v-lazy="goods.defaultImg" alt="" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ goods.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <router-link to="/detail/'goods.id">{{ goods.title }}</router-link>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <Pagination 
          :currentPageNo="searchParams.pageNo"
          :total="searchInfo.total"
          :pageSize="searchParams.pageSize"
          :continueNo="5"
          @changePageNo="changePageNo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import SearchSelector from "./SearchSelector/SearchSelector";
export default {
  name: "Search",
  components: {
    SearchSelector,
  },
  data() {
    return {
      searchParams: {
        category1Id: "", // 一级分类ID
        category2Id: "", // 二级分类ID
        category3Id: "", // 三级分类ID
        categoryName: "", // 分类名称
        keyword: "", // 搜索关键字
        props: [], // ["属性ID:属性值:属性名"]示例: ["2:6.0～6.24英寸:屏幕尺寸"]
        trademark: "", // 品牌: "ID:品牌名称"示例: "1:苹果"

        order: "1:desc", // 排序方式 1: 综合,2: 价格 asc: 升序,desc: 降序 示例: "1:desc"
        pageNo: 1, // 页码
        pageSize: 10, // 每页数量
      },
    };
  },
  // 按照三级分类和关键字搜索
  beforeMount() {
    this.handlerSearchParams();
  },
  mounted() {
    this.getSearchInfo();
  },
  methods: {
    getSearchInfo() {
      // dispatch如果传递多个参数，那么多个参数必须构成一个对象去传
      // 也就是说dispatch只能传递一个参数{a:100，b:200}
      this.$store.dispatch("getSearchInfo", this.searchParams);
    },
    handlerSearchParams() {
      let { category1Id, category2Id, category3Id, categoryName } = this.$route.query;
      let { keyword } = this.$route.params;
      let searchParams = {
        ...this.searchParams,
        category1Id,
        category2Id,
        category3Id,
        categoryName,
        keyword,
      };
      Object.keys(searchParams).forEach(item => {
        if(searchParams[item] === ''){
          delete searchParams[item];
        }
      })
      this.searchParams = searchParams;
    },
    // 删除分类名称搜索条件，重新发送请求
    removeCategoryName() {
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      this.searchParams.categoryName = undefined;
      // this.getSearchInfo();
      // 这里删除数据以后不会动原来的路径，所以这样发不行
      // this.$router.push({ name: search, params: this.$route.params });
      this.searchParams.pageNo = 1;
      this.$router.replace({ name: search, params: this.$route.params });
    },
    // 删除关键字
    removeKeyword() {
      this.searchParams.keyword = undefined;
      this.$bus.$emit("clearKeyword"); // 通知hearder组件清空关键字
      // this.getSearchInfo();
      // 这里依赖的是监视里的代码
      this.searchParams.pageNo = 1;
      // this.$router.push({ name: search, query: this.$route.query });
      this.$router.replace({ name: search, query: this.$route.query });
    },
    // 用户点击品牌后，根据品牌搜索重新发送请求
    searchForTrademark(trademark) {
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      this.searchParams.pageNo = 1;
      this.getSearchInfo();
    },
    // 删除品牌后重新发送请求
    removeTrademark() {
      this.searchParams.trademark = undefined;
      this.searchParams.pageNo = 1;
      this.getSearchInfo();
    },
    // 点击平台属性值，根据平台属性搜索重新发送请求
    searchForProps() {
      let prop = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      // 需要判断数组当中是否已经存在这个属性

      let isRepeate = this.searchParams.props.some((item) => item === prop);
      if (isRepeate) {
        return; //证明已经存在，发过请求了
      }

      this.searchParams.props.push(prop);
      this.searchParams.pageNo = 1;
      this.getSearchInfo();
    },
    // 用户删除某个属性值，重新发送请求
    removeProp(index) {
      this.searchParams.props.splice(index, 1);
      this.searchParams.pageNo = 1;
      this.getSearchInfo();
    },
    // 排序
    changSort(sortFlag) {
      let originSortFlag = this.sortFlag;
      let originSortType = this.sortType;
      let newOrder = "";
      if (sortFlag === originSortFlag) {
        newOrder = `${originSortFlag}:${
          originSortType === "asc" ? "desc" : "asc"
        }`;
      } else {
        newOrder = `${sortFlag}:desc`;
      }
      this.searchParams.order = newOrder;
      this.searchParams.pageNo = 1;
      this.getSearchInfo();
    },
    // 分页器点击切换页码的时候触发的自定义时间
    changePageNo(page){
      this.searchParams.pageNo = page;
      this.getSearchInfo()
    }
  },
  computed: {
    ...mapGetters(["goodsList"]),
    ...mapState({
      searchInfo:state=>state.search.searchInfo
    }),
    // 优化代码
    sortFlag() {
      return this.searchParams.order.split(':')[0];
    },
    sortType() {
      return this.searchParams.order.split(":")[1];
    },
  },
  watch: {
    // 可以简写
    $route(newValue, oldValue) {
      this.handlerSearchParams();
      this.getSearchInfo();
    },
    // $route: {
    //   handler(newValue, oldValue) {
    //   },
    // },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>
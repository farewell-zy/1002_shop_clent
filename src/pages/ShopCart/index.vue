<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="cart in cartInfoList" :key="cart.id">
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" :checked="cart.isChecked" @click="updateOneCheck(cart)"/>
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl" />
            <div class="item-msg">{{ cart.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="changeCartNum(cart, -1, true)">-</a>
            <input autocomplete="off" type="text" :value="cart.skuNum" minnum="1" class="itxt" @change="changeCartNum(cart, $event.target.value * 1, false)"/>
            <a href="javascript:void(0)" class="plus" @click="changeCartNum(cart, 1, true)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cart.skuPrice * cart.skuNum }}</span>
          </li>
          <li class="cart-list-con7">
            <a href="javascript:;" class="sindelet" @click="deleteOne(cart)">删除</a>
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" v-model="isCheckAll" />
        <span>全选</span>
      </div>
      <div class="option">
        <a href="javascript:;" @click="deleteAll">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择<span>{{ checkedNum }}</span>件商品
        </div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ allMoney }}</i>
        </div>
        <div class="sumbtn">
          <router-link to="/trade" class="sum-btn">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ShopCart",
  mounted() {
    this.getShopCartInfo();
  },
  methods: {
    getShopCartInfo() {
      this.$store.dispatch("getShopCartInfo");
    },
    // 修改购物车商品数量
    async changeCartNum(cart, disNum, flag) {
      // disNum如果点击的是加号和减号，我们传递过来的是1和-1 变化的量
      // flag用来判断用户是点击+-进来的还是输入框失去焦点进来的
      // 获取原来本身的数量
      let originNum = cart.skuNum;
      if (flag) {
        if (originNum + disNum < 1) {
          // 证明原本的数量变化之后，比1还小，那么我们应该修正disNum
          // disNum = -(originNum - 1)
          disNum = 1 - originNum;
        }
      } else {
        // 证明这个里面传递的是input输入的值，它代表最终的值
        if (disNum < 1) {
          disNum = 1 - originNum; // disNum代表的是变化的量
        } else {
          disNum = disNum - originNum;
        }
      }
      try {
        await this.$store.dispatch("addOrUpdateShopCart", {
          skuId: cart.skuId,
          skuNum: disNum,
        });
        this.getShopCartInfo();
      } catch (error) {
        alert(error.message);
      }
    },
    // 修改购物车选中状态,单个修改
    async updateOneCheck(cart) {
      try {
        //发请求去修改
        await this.$store.dispatch("updataCartIscheck", {
          skuId: cart.skuId,
          isChecked: cart.isChecked ? 0 : 1,
        });
        // 成功就重新获取购物车列表数据
        this.getShopCartInfo()
      } catch (error) {
        alert(error.message);
      }
    },
    // 删除单个购物车数据
    async deleteOne(cart){
      try {
        await this.$store.dispatch('deleteShopCart',cart.skuId)
        this.getShopCartInfo()
      } catch (error) {
        alert('删除失败'+error.message)
      }
    },
    // 删除多个
    async deleteAll(){
      try {
        await this.$store.dispatch('deleteShopCartAll')      
        this.getShopCartInfo()
      } catch (error) {
        alert('删除失败'+error.message)
      }
    }
  },
  computed: {
    // mapState使用数组  必须名字相同   数据只能总的state当中的数据才能使用，模块化后不能使用
    // ...mapState['shopCartInfo']
    ...mapGetters(["cartInfo"]),
    cartInfoList() {
      return this.cartInfo.cartInfoList || [];
    },

    checkedNum() {
      return this.cartInfoList.reduce((prev, item) => {
        if (item.isChecked) {
          prev += item.skuNum;
        }
        return prev;
      }, 0);
    },

    // 统计总价
    allMoney() {
      return this.cartInfoList.reduce((prev, item) => {
        if (item.isChecked) {
          prev += item.skuNum * item.skuPrice;
        }
        return prev;
      }, 0);
    },

    // 计算全选数据
    isCheckAll: {
      get() {
        // 读取
        return this.cartInfoList.every((item) => item.isChecked);
      },
      set(val) {
        try {
          // val 获取到的是用户点击全选之后，多选框的checked的属性值，他是一个布尔值
          // 写的，修改
          // const result = this.$store.dispatch('updateCartIscheckAll', val?1:0)
          // console.log(result) // ['ok','ok','ok','ok']
          this.$store.dispatch('updateCartIscheckAll', val?1:0)
          this.getShopCartInfo();
        } catch (error) {
          alert('修改失败'+error.message)
        }
      },
    },
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
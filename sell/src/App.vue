<template>
    <div id="app">
        <MyHeader :seller="seller"></MyHeader>
        <div class="tab border-1px">
            <div class="tab-item">
                <router-link to="/goods">商品</router-link>
            </div>
            <div class="tab-item">
                <router-link to="/ratings">评论</router-link>
            </div>
            <div class="tab-item">
                <router-link to="/seller">商家</router-link>
            </div>
        </div>
        <keep-alive>
            <router-view :seller="seller"></router-view>
        </keep-alive>

    </div>
</template>

<script>
  import MyHeader from './components/header/MyHeader'
  import {urlParts} from './common/js/util'

  const ERR_OK = 0;
  export default {
    name: 'App',
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParts();
            console.log(queryParam)
            return queryParam.id;
          })()
        }
      }
    },
    created() {
      this.$http.get('/api/seller?id=' + this.seller.id)
        .then((response) => {
          response = response.body;
          if (response.errno === ERR_OK) {
            // this.seller = response.data;
            //使用这种es6的方法可以不用覆盖seller原来的id值
            this.seller = Object.assign({}, this.seller, response.data);
          }
        })
    },
    components: {
      MyHeader
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "./common/stylus/mixin.styl"
    .tab
        display: flex
        width: 100%
        height: 40px
        line-height: 40px
        border-1px(rgba(7, 17, 27, 0.1))
        .tab-item
            flex: 1
            text-align center
            & > a
                display: block
                font-size: 14px
                color: rgb(77, 85, 93)
                &.active
                    color: rgb(240, 20, 20)
</style>

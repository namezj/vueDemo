<template>
    <div class="cartcontrol">
        <transition name="move">
            <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart" transition="move">
                <span class="inner inner_move icon-remove_circle_outline"></span>
            </div>
        </transition>
        <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
        <div class="cart-add icon-add_circle" @click="addCart"></div>
    </div>
</template>
<script>
  import Vue from 'vue'

  export default {
    name: "cartcontrol",
    props: {
      food: {
        type: Object
      }
    },
    created() {

    },
    methods: {
      addCart(event) {
        //不是自己派生的不实现，解决pc页面时触发2次click事件
        if (!event._constructed) {
          return
        }
        if (!this.food.count) {
          // this.food.count=1;通过这个set方法添加一个属性用户可以实时的观测到
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        this.$emit('cart-add', event.target); //添加这句，提交'cart-add'事情给父组件，第二个是要传递的参数
      },
      decreaseCart(event) {
        if (!event._constructed) {
          return
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.cartcontrol
    font-size :0
    .cart-decrease
        display :inline-block
        padding:6px
        opacity :1
        transform :translate3d(0,0,0)
        .inner
            display :inline-block
            line-height :24px
            font-size :24px
            color:rgb(0,160,220)
            transform :rotate(0)
            transition :all 0.4s linear
        &.move-enter-active, &.move-leave-active{
            transition: all 0.4s linear
        }
        &.move-enter,&.move-leave-to
            opacity :0
            transform :translate3d(24px,0,0)
            .inner_move
                transform :rotate(180deg)
    .cart-count
        display :inline-block
        vertical-align :top
        width :12px
        padding-top :6px
        line-height :24px
        text-align :center
        font-size :10px
        color :rgb(147,153,159)
    .cart-add
        display :inline-block
        padding:6px
        line-height :24px
        font-size :24px
        color:rgb(0,160,220)
</style>
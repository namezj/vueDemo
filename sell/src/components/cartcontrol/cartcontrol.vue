<template>
    <div class="cartcontrol">
        <transition name="move">
            <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart" transition="move">
                <span class="inner icon-remove_circle_outline"></span>
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
    props:{
      food:{
        type:Object
      }
    },
    created(){

    },
    methods:{
      addCart(event){
        //不是自己派生的不实现，解决pc页面时触发2次click事件
        if(!event._constructed){
          return
        }
        if(!this.food.count){
          // this.food.count=1;通过这个set方法添加一个属性用户可以实时的观测到
          Vue.set(this.food,'count',1);
        }else{
          this.food.count++;
        }
      },
      decreaseCart(event){
        if(!event._constructed){
          return
        }
        if(this.food.count){
          this.food.count--;
        }
      }
    }
  }
</script>
<style coped lang="stylus" rel="stylesheet/stylus">
.cartcontrol
    font-size :0
    .cart-decrease
        display :inline-block
        padding:6px
        transition :all 0.4s linear
        .inner
            display :inline-block
            line-height :24px
            font-size :24px
            color:rgb(0,160,220)
        &.move-enter,&.move-leave-to
            opacity :0
            transform :translate3d(24px,0,0)
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
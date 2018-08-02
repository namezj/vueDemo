<template>
    <div class="shopCart">
        <div class="content">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div :class="{'highLight':totalCount>0}" class="logo">
                        <i class="icon-shopping_cart" :class="{'highLight':totalCount>0}"></i>
                    </div>
                    <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                </div>
                <div class="price" :class="{'highLight':totalPrice>0}">￥{{totalPrice}}元</div>
                <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
            </div>
            <div class="content-right">
                <div class="pay" :class="payClass">
                    {{payDesc}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "shopcart",
    props:{
      selectFoods:{
        type:Array,
        default(){
          return [
            {price:20,count:1}
          ];
        }
      },
      deliveryPrice:{
        type:Number,
        default:0
      },
      minPrice:{
        type:Number,
        default:0
      }
    },
    computed:{
      //计算属性
      totalPrice(){
        let total=0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        })
        return total
      },
      totalCount(){
        let count=0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        })
        return count
      },
      payDesc(){
        if(this.totalPrice===0){
          return `￥${this.minPrice}元起送`;
        }else if(this.totalPrice<this.minPrice){
          let diff=this.minPrice-this.totalPrice;
          return `还差￥${diff}元起送`;
        }else{
          return '去结算';
        }
      },
      payClass(){
        if(this.totalPrice<this.minPrice){
          return 'not-enough';
        }else{
          return 'enough';
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.shopCart
    position :fixed
    left:0
    bottom :0
    z-index :50
    width :100%
    height 48px
    .content
        display :flex
        background :#141d27
        font-size :0
    .content-left
        flex :1
        .logo-wrapper
            display :inline-block
            vertical-align :top
            position :relative
            top:-10px
            margin :0 12px
            padding :6px
            width:56px
            height :56px
            box-sizing :border-box
            border-radius: 50%
            background :#141d27
            .logo
                width :100%
                height :100%
                border-radius :50%
                background :#2b343c
                text-align :center
                &.highLight
                    background :rgb(0,160,220)
                .icon-shopping_cart
                    line-height :44px
                    font-size :24px
                    color:#80858a
                    &.highLight
                        color:#ffffff
            .num
                position :absolute
                top:0
                right:0
                width:24px
                padding: 3px 0;
                text-align :center
                border-radius :16px
                font-size :9px
                font-weight :700
                color: #ffffff
                background :rgb(240,20,20)
                box-shadow :0 4px 8px 0 rgba(0,0,0,0.4)
        .price
            display :inline-block
            vertical-align :top
            line-height :24px
            margin-top :12px
            box-sizing :border-box
            padding-right :12px
            border-right :1px solid rgba(255,255,255,0.1)
            font-size :16px
            font-weight :700
            color:rgba(255,255,255,0.4)
            &.highLight
                color:#fff
        .desc
            display :inline-block
            vertical-align :top
            margin :12px 0 0 12px
            line-height :24px
            color:rgba(255,255,255,0.4)
            font-size :10px
    .content-right
        flex :0 0 105px
        width:105px
        .pay
            height :48px
            line-height :48px
            text-align :center
            font-size :12px
            color:rgba(255,255,255,0.4)
            font-weight :700
            &.not-enough
                background :#2b333b
            &.enough
                background :#00b43c
                color:#fff
</style>
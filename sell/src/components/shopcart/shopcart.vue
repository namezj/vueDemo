<template>
    <div class="shopCart">
        <div class="content" @click="toggleList">
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
            <div class="content-right" @click.stop.prevent="pay">
                <div class="pay" :class="payClass">
                    {{payDesc}}
                </div>
            </div>
        </div>
        <!--定义小球动画-->
        <div class="ball-container">
            <transition-group name="drop" tag="div" @before-enter="beforeEnter" @enter="enter"
                              @after-enter="afterEnter">
                <div v-for="(ball,index) in balls" v-show="ball.show" class="ball" :key="index">
                    <div class="inner inner-hook inner_move"></div>
                </div>
            </transition-group>
        </div>
        <transition name="fold">
            <div class="shopcart-list" v-show="listShow">
                <div class="list-header">
                    <h1 class="title">购物车</h1>
                    <span class="empty" @click="empty">清空</span>
                </div>
                <div class="list-content" ref="listContent">
                    <ul>
                        <li class="food" v-for="food in selectFoods">
                            <span class="name">{{food.name}}</span>
                            <div class="price">
                                <span>￥{{food.price*food.count}}</span>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <cartcontrol :food="food"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="list-mask" @click="hideList" v-show="listShow"></div>
        </transition>
    </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import cartcontrol from '../cartcontrol/cartcontrol'

  export default {
    name: "shopcart",
    data() {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true
      }
    },
    components: {
      cartcontrol
    },
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    computed: {
      //计算属性
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        })
        return total
      },
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        })
        return count
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true//结合BScroll的接口使用,是否将click事件传递,默认被拦截了
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show
      }
    },
    methods: {
      drop(el) {
        //使隐藏的小球显示，并保存当前点击的dom元素
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeEnter(el) {
        //TODO 小球点击成曲线功能未实现
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();//返回元素相对于视口偏移的位置
            let x = rect.left - 32;  //点击的按钮与小球（fixed）之间x方向的差值
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';    //设置初始位置前，手动置空，覆盖之前的display：none，使其显示
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;  //外层元素做纵向的动画，y是变量
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];//内层元素做横向动画,inner-hook（用于js选择的样式名加上-hook，表明只是用                                                                      //于js选择的，没有真实的样式含义）
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      enter(el) {
        let rf = el.offsetHeight;
        this.$nextTick(() => {//异步执行
          el.style.webkitTransform = 'translate3d(0,0,0)';    //重置回来
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });
      },
      afterEnter(el) {
        //TODO 小球点击成曲线功能未实现
        let ball = this.dropBalls.shift();  //取到做完动画的球，再置为false，即重置，它还可以接着被利用
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList() {
        if (!this.totalCount) {
          return
        }
        this.fold = !this.fold;
      },
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        })
      },
      hideList() {
        this.fold = true;
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return
        }
        window.alert(`支付${this.totalPrice}元`);
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin.styl"
    .shopCart
        position: fixed
        left: 0
        bottom: 0
        z-index: 50
        width: 100%
        height 48px
        .content
            display: flex
            background: #141d27
            font-size: 0
            .content-left
                flex: 1
                .logo-wrapper
                    display: inline-block
                    vertical-align: top
                    position: relative
                    top: -10px
                    margin: 0 12px
                    padding: 6px
                    width: 56px
                    height: 56px
                    box-sizing: border-box
                    border-radius: 50%
                    background: #141d27
                    .logo
                        width: 100%
                        height: 100%
                        border-radius: 50%
                        background: #2b343c
                        text-align: center
                        &.highLight
                            background: rgb(0, 160, 220)
                        .icon-shopping_cart
                            line-height: 44px
                            font-size: 24px
                            color: #80858a
                            &.highLight
                                color: #ffffff
                    .num
                        position: absolute
                        top: 0
                        right: 0
                        width: 24px
                        height :16px
                        line-height :16px
                        text-align: center
                        border-radius: 16px
                        font-size: 9px
                        font-weight: 700
                        color: #ffffff
                        background: rgb(240, 20, 20)
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
                .price
                    display: inline-block
                    vertical-align: top
                    line-height: 24px
                    margin-top: 12px
                    padding-right: 12px
                    box-sizing: border-box
                    border-right: 1px solid rgba(255, 255, 255, 0.1)
                    font-size: 16px
                    font-weight: 700
                    color: rgba(255, 255, 255, 0.4)
                    &.highLight
                        color: #fff
                .desc
                    display: inline-block
                    vertical-align: top
                    margin: 12px 0 0 12px
                    line-height: 24px
                    color: rgba(255, 255, 255, 0.4)
                    font-size: 10px
            .content-right
                flex: 0 0 105px
                width: 105px
                .pay
                    height: 48px
                    line-height: 48px
                    text-align: center
                    font-size: 12px
                    color: rgba(255, 255, 255, 0.4)
                    font-weight: 700
                    &.not-enough
                        background: #2b333b
                    &.enough
                        background: #00b43c
                        color: #fff
        .ball-container
            .ball
                position fixed
                left 32px
                bottom 22px
                z-index 200
                transition: all 0.6s cubic-bezier(0.49, -0.29, 0.75, 0.41)
                .inner
                    width 16px
                    height 16px
                    border-radius 50%
                    background rgb(0, 160, 220)
                    transition: all 0.4s linear

        .shopcart-list
            position: absolute
            left: 0
            top: 0
            z-index: -1
            width: 100%
            transition: all 0.5s
            transform: translate3d(0, -100%, 0)
            &.fold-enter, &.fold-leave-to
                transform: translate3d(0, 0, 0)
            .list-header
                height: 40px
                line-height: 40px
                padding: 0 18px
                background: #f3f5f7
                border-bottom: 1px solid rgba(7, 17, 27, 0.1)
                .title
                    float: left
                    font-size: 14px
                    color: rgb(7, 17, 27)
                .empty
                    float: right
                    font-size: 12px
                    color: rgb(0, 160, 220)

            .list-content
                padding: 0 18px
                max-height: 217px
                overflow: hidden
                background: #ffffff
                .food
                    position: relative
                    padding: 12px 0
                    box-sizing: border-box
                    border-1px(rgba(7, 17, 27, 0.1))
                    .name
                        line-height: 24px
                        font-size: 14px
                        color: rgb(7, 17, 27)
                    .price
                        position absolute
                        right: 90px
                        bottom: 12px
                        line-height: 24px
                        font-size: 14px
                        font-weight: 700
                        color: rgb(240, 20, 20)
                    .cartcontrol-wrapper
                        position: absolute
                        right: 0
                        bottom: 6px

        .list-mask
            position: fixed
            top: 0
            left: 0
            width: 100%
            height: 100%
            z-index: -2
            backdrop-filter: blur(10px)
            transition: all 0.5s
            opacity: 1
            background: rgba(7, 17, 27, 0.6)
            &.fade-enter, &.fade-leave-to
                opacity: 0
                background: rgba(7, 17, 27, 0)
</style>
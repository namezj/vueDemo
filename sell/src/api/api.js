import axios from 'axios';
import router from '@/router'

// let base = 'https://www.easy-mock.com/mock/5b6bb0d02681c8397f853248/api'
let token
if (window.location.href.indexOf("token") != -1) {
  let category = window.location.href
  let CCZCtoken = category.substring(category.lastIndexOf('=') + 1, category.length);
  localStorage.token = CCZCtoken
}

const $axios = axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'TOKEN': localStorage.token
  }
})

window.setupWebViewJavascriptBridge = (callback) => {
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge)
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  const WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
}

//invalidToken 关闭webview方法
$axios.interceptors.response.use(
  response => {
    if (response.data.code == 2) {
      if (navigator.userAgent.indexOf("cczc") != -1) {
        alert(response.data.message)
        setupWebViewJavascriptBridge((bridge) => {
          bridge.callHandler('invalidToken', {}, (response) => {
          });
        })
      } else {
        localStorage.removeItem('token')
        router.replace({
          path: '/views/login',
          query: {redirect: router.currentRoute.fullPath}
        })
      }
    }
    return response
  },
  error => {
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  })

//获取商家信息
export const sellerHttp = params => {
  return axios.get(`/api/seller`, {params: params}).then(res => res.data);
}
//获取商品信息
export const goodsHttp = params => {
  return axios.get(`/api/goods`, {params: params}).then(res => res.data);
}
//获取评价信息
export const ratingsHttp = params => {
  return axios.get(`/api/ratings`, {params: params}).then(res => res.data);
}
/*//发送验证码
export const sendCodes = params => {
  return axios.get(`${base}/charge-total/rest/userinfo/api/phoneCode`, {params: params}).then(res => res.data);
};
//订单详情
export const findOrderByTradeFlowNo = params => {
  return $axios.get(`${base}/charge-total/rest/order/findOrderByTradeFlowNo`, {params: params}).then(res => res.data);
};*/

window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

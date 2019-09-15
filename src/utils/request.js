import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import router from '@/router'

let loadingInstance // loading
// create an axios instance
const service = axios.create({
  // baseURL: '/api', // url = base url + request url
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    loadingInstance = Loading.service({
      background: 'rgb(0,0,0,0)'
    })
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    const { code, msg } = res
    // 关闭loading
    loadingInstance.close()

    if (code !== 0) {
      Message({
        message: msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(response)
    }
    return Promise.resolve(res)
  },
  error => {
    const { response } = error
    const { status, data = {}} = response || {}

    // 关闭loading
    loadingInstance.close()

    switch (status) {
      case 401:
        // 未登录或过期
        router.push({ name: 'login' })
        store.dispatch('user/logout')
        // router.push({ name: 'login' })
        // router.push(`/login?redirect=${this.$route.fullPath}`)
        break
      case 404:
        MessageBox.alert('服务器出错', '提示', {
          type: 'error'
        })
        break
      default:
        MessageBox.alert(data.msg || '服务器出错', '提示', {
          type: 'error'
        })
    }
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service

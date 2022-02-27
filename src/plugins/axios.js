import router from '@/router'
import axios from 'axios'

// 设置baseURL
axios.defaults.baseURL = 'http://localhost:8091/'

// 设置请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 设置响应拦截器
axios.interceptors.response.use(response => {
  if (response.data.code === 90002) {
    router.push('/login')
  }
  return response
})

export default axios

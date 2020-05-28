// 通用接口调用方法
import axios from 'axios'

// 配置响应拦截器
axios.interceptors.response.use(function (response){
  return response.data
},function(error){
  return Promise.reject(error)
})

// 通过参数的解构赋值获取参数信息
export default({method = 'get',url,data,params}) =>{
  // return的结果是Promise实例对象
  return axios({
    // 请求基准路径
    baseURL:'http://localhost:8080',    //本地服务地址
    // baseURL:'http://api-haoke-dev.itheima.net',    //线上地址
    // 请求方式（默认是get)
    method:method,
    // 请求地址
    url:url,
    //post请求参数
    data:data,
    //get请求参数
    params:params
  })

}
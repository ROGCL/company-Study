import _ from 'axios'
import { Message } from 'element-ui';
const axios = _.create({
//  baseURL:'http://172.168.11.229:9000/',
 baseURL:process.env.VUE_APP_PROXY,
 headers:{
    "Content-Type":"application/json",
 }
});
axios.interceptors.request.use(
   cfg=>{
      let token = sessionStorage.getItem('token')
      // let obj = cfg.headers
      // Object.prototype.hasOwnProperty.call(obj,cfg.headers)
      // console.log('%cindex.js line:14 object', 'color: #007acc;', token);
      // cfg.headers['Authenticator'] = token
      if(!cfg.headers.hasOwnProperty.call('token')&&token){
         cfg.headers.Authenticator = token
      }
      return cfg   
   },
   function(err){
      return Promise.reject(err)
   }
)
axios.interceptors.response.use(
   res => {
      // 当返回的code===50的时候，登陆失败
      if(res.status !== 200){
         Message.error(res.data.message)
         //sessionStorage.removeItem('token')
         //Message.error('登录已过期,请重新登录')
      }else{
         return res
      }
   },
   err =>{
      return Promise.reject(err)
   }
)
export default axios
/* 
发送ajax请求
封装axios库
函数的返回值是promise对象
1.优化：统一处理请求异常
      在外层报一个自己创建的promise对象
      在请求出错时，不调用reject
*/
import axios from 'axios'
import { message } from 'antd'
const BASE = ''
export default function ajax(url,data={},method='GET'){
    return new Promise((resolve,reject) =>{
        let promise
        //1.执行异步ajax请求
        const URL = BASE+url
        if(method==='GET'){
            promise = axios.get(URL,{params:data})
        }else{
            promise = axios.post(URL,data)
        }
        //2.成功,调用resovle(value)
        promise.then(res =>{
            resolve(res)
        }).catch((error)=>{
            message.error('请求出错'+error.message)
        })
        //3.失败，提示异常信息，不调用reject
    })
}
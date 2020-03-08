import ajax from '../ajax'
// import "../../assets/js/mock"
//每个函数的返回值都是promise对象
//登陆
export function reqLogin(data){
    return ajax('/login',data,'POST')
}
export const reqAdd = (data) => ajax('/add',data,'POST')
import React, { Component } from "react";
import { Link ,withRouter} from "react-router-dom";
import { Menu, Icon } from "antd";
import "./index.less";
import logo from "../../assets/images/login.png";
import menuList from "../../config/menuConfig";
import storage from '../../utils/storage'
const { SubMenu } = Menu;
class LeftNav extends Component {
  /* 根据menu的数据数组生成对应的标签数组,使用map和递归 */
  // getMenuNodes_map = (menuList) => {
  //   return menuList.map(item => {
  //     if (!item.children) {
  //       return (
  //         <Menu.Item key={item.key}>
  //           <Link to={item.key}>
  //             <Icon type={item.icon} />
  //             <span>{item.title}</span>
  //           </Link>
  //         </Menu.Item>
  //       );
  //     } else {
  //       return (
  //         <SubMenu
  //           key={item.key}
  //           title={
  //             <span>
  //               <Icon type={item.icon} />
  //               <span>{item.title}</span>
  //             </span>
  //           }
  //         >
  //          {this.getMenuNodes(item.children)}
  //         </SubMenu>
  //       );
  //     }
  //   });
  // };
  /* 根据menu的数据数组生成对应的标签数组,使用reduce和递归 */
  getMenuNodes = (menuList) => {
     //得到当前路由路径
     const path = this.props.location.pathname
    return menuList.reduce((pre,item)=>{
      //如果当前用户有item对应的权限，才显示对应的菜单项
      if(this.hasAuth(item)){
        if(!item.children){
          pre.push((
            <Menu.Item key={item.key}>
                <Link to={item.key}>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </Link>
              </Menu.Item>
          ))
        }else{
          const cItem = item.children.find(cItem =>path.indexOf(cItem.key)===0)
          if(cItem){
            this.openKey=item.key
          }
          pre.push((
            <SubMenu
                key={item.key}
                title={
                  <span>
                    <Icon type={item.icon} />
                    <span>{item.title}</span>
                  </span>
                }
              >
               {this.getMenuNodes(item.children)}
              </SubMenu>
          ))
        }
      }else{

      }
      return pre
    },[])
  }
  //判断当前用户对item是否有权限
  hasAuth=(item)=>{
    //1、如果当前用户是admin 2、看用户有没有这个权限 key在不在menus中 3、如果当前item时公开的
    const {key,isPublic}=item
    const menus = (storage.get('user')).role.menus
    const username = (storage.get('user')).username
    if(username==='admin'||isPublic||menus.indexOf(key)!==-1){
      return true
    }else if(item.children){//4、如果当前用户由此item的某个子item的权限
      return !!item.children.find(child=>menus.indexOf(child.key)!==-1)
    }
    return false
  }
  /* 
  在第一次render前执行一次
  为第一个render（）准备数据（必须同步的）
  */
  componentWillMount(){
      this.menuNodes = this.getMenuNodes(menuList)
  }
  render() {
    //得到当前路由路径
    let path = this.props.location.pathname
    if(path.indexOf('/product')===0){//当前请求的路由是商品或者商品的子路由
      path = '/product'
    }
    const openKey = this.openKey
    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt="login" />
          <h1>硅谷后台</h1>
        </Link>
        <Menu selectedKeys={[path]} defaultOpenKeys={[openKey]} mode="inline" theme="dark">
          {this.menuNodes}
        </Menu>
      </div>
    );
  }
}
/* 
withRouter高阶组件：
包装非路由组建，返回一个新的组件
新的组件向非路由组件传递三个属性：history/location/match

*/
export default withRouter(LeftNav)

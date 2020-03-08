import React, { Component } from "react";
import storage from "../../utils/storage";
import { Redirect,Route,Switch } from "react-router-dom";
import { Layout } from "antd";
import LeftNav from '../../components/left-nav/index'
import HeadNav from '../../components/head-nav/index'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
const { Footer, Sider, Content } = Layout;
/* 
    后台管理的路由组件
*/
export default class admin extends Component {
  render() {
    const user = storage.get("user");
    // const username = JSON.parse(user.data).username;
    if (!user) {
      return <Redirect to="/login" />;
    }
    return (
      <Layout style={{minHeight:'100%'}}>
        <Sider>
            <LeftNav />
        </Sider>
        <Layout>
          <HeadNav>HeadNav</HeadNav>
          <Content style={{margin:20, backgroundColor:'#fff'}}>
              <Switch>
                <Route path='/home' component={Home}></Route>
                <Route path='/category' component={Category}></Route>
                <Route path='/product' component={Product}></Route>
                <Route path='/user' component={User}></Route>
                <Route path='/role' component={Role}></Route>
                <Route path='/bar' component={Bar}></Route>
                <Route path='/line' component={Line}></Route>
                <Route path='/pie' component={Pie}></Route>
                <Redirect to='/home'/>
              </Switch>
          </Content>
          <Footer style={{textAlign:'center',color:'#ccc'}}>推荐使用谷歌浏览器，可以获得更佳的页面操作体验</Footer>
        </Layout>
      </Layout>
    );
  }
}

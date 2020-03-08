import React, { Component } from "react";
import { Form, Icon, Input, Button,message } from "antd";
import {Redirect} from 'react-router-dom'
import "./index.less";
import logo from "../../assets/images/login.png";
import {reqLogin} from '../../api/login/index'
import storage from '../../utils/storage'
const Item = Form.Item; //不能写在import之前
/* 
  登录的路由组件
*/
class login extends Component {
  handleSubmit = e => {
    //组织事件的默认行为
    e.preventDefault();
    this.props.form.validateFields(async(err, values) => {
        //校验成功
        if (!err) {
          const {username,password} = values
            const response = await reqLogin({username,password})
            console.log('成功',response)
            if(response.status===200){
              message.success('登录成功')
              storage.set('user',response.data.data)
              //跳转到管理界面
              this.props.history.replace('/')
            }else{
              message.error('登录失败')
            }
        }
    });
    //得到form对象
    // const form = this.props.form;
    //获取表单输入的数值
    // const values = form.getFieldsValue();
    // console.log("handleSumbit()", values);
  };
  //对密码进行自定义验证
  validator = (rule,value,callback) => {
    if(!value){
        callback('密码必须输入')
    }else if(value.length<4||value.length>12){
        callback('密码长度不能大于12位，且不能小于4位')
    }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
        callback('密码必须是英文、数字和下划线组成')
    }else{
        callback()
    }
  };
  render() {
    if(storage.get('user')){
      return <Redirect to='/'/>
    }
    //得到强大功能的form对象
    const form = this.props.form;
    const { getFieldDecorator } = form;
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="" />
          <h1>React后台登录界面SPA</h1>
        </header>
        <section className="login-content">
          <h2>用户登陆</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {getFieldDecorator("username", {
                //声明式验证：直接使用别人定义好的验证规则
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "用户名必须输入"
                  },
                  { min: 4, message: "用户名至少4位" },
                  { max: 12, message: "用户名最多12位" },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message: "用户名必须是英文、数字和下划线组成"
                  }
                ],
                initialValue:'yangfan'//指定初始值
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="用户名"
                />
              )}
            </Item>
            <Item>
              {getFieldDecorator("password", {
                rules: [
                  {
                    validator: this.validator
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="密码"
                />
              )}
            </Item>
            <Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登陆
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    );
  }
}
/* 
    1.高阶函数（create）
        1).一类特别的函数
            a. 接受函数类型的参数
            b. 返回值是函数
        2）.常见
            a.定时器：setTimeOut()  setInterval()
            b.promise:Promise(()=>{}) then(value=>{},reason = >{})
            c.数组遍历的相关方法：forEach()/filter()/map()/reduce()/find()/findIndex()
            d.函数对象的bind()：fn.bind()
            e.Form.create()/getFieldDecorator()()
        3).高阶函数更新动态，更加具有扩展性
    2.高阶组件
        1).本质就是一个函数
        2).接收一个组件（被包装组件），返回一个新的组件（包装组件），包装组件会向被包装组件传入特定属性数据
        3).作用：扩展组件的功能
        4).高阶组件也是高阶函数：接受一个组件函数，返回一个新的组件函数
*/
/* 
    包装From组件生成一个新的组件：Form（Login）
    新组件会向From组件传递一个强大的对象属性：form
*/
const WrapLogin = Form.create()(login);
export default WrapLogin;


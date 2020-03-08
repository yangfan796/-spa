import React, { Component } from "react";
import { Form, Select, Input } from "antd";
import {reqRoles} from '../../api/role'
import PropsTypes from 'prop-types'
const { Option } = Select;
const Item = Form.Item;
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 }
};
class AddUpdate extends Component {
  static propsTypes = {
    setForm:PropsTypes.func.isRequired,
    user:PropsTypes.object.isRequired,
  }
  state = {
    roles:[]
  }
  //对密码进行自定义验证
  validator = (rule, value, callback) => {
    if (!value) {
      callback("密码必须输入");
    } else if (value.length < 4 || value.length > 12) {
      callback("密码长度不能大于12位，且不能小于4位");
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback("密码必须是英文、数字和下划线组成");
    } else {
      callback();
    }
  };
  reqRoles = async() =>{
    const res = await reqRoles({})
    if(res.data.status===0){
      console.log(res.data.data)
      this.setState({roles:res.data.data})
    }
  }
  componentWillMount(){
    this.reqRoles()
    //将form对象通过setForm()传递父组件
    this.props.setForm(this.props.form)
  }
  render() {
    const form = this.props.form;
    const {roles} =this.state
    const { getFieldDecorator } = form;
    const user = this.props.user;
    this.user = user || {};
    const {username,password,phone,email,role_id} =this.user
    const validatemessages = {
      required: "This field is required!",
      types: {
        email: "Not a validate email!",
        number: "Not a validate number!"
      },
      number: {
        range: "Must be between ${min} and ${max}"
      }
    };
    return (
      <Form {...layout} validatemessages={validatemessages}>
        <Item label="用户名">
          {getFieldDecorator("username", {
            initialValue: username,
            rules: [
              { required: true, whitespace: true, message: "用户名不能为空" },
              { min: 4, message: "用户名至少4位" },
              { max: 12, message: "用户名最多12位" },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: "用户名必须是英文、数字和下划线组成"
              }
            ]
          })(<Input placeholder="请输入用户名" />)}
        </Item>
        <Item label="密码">
          {getFieldDecorator("password", {
            initialValue: password,
            rules: [
              {
                validator: this.validator
              }
            ]
          })(<Input type="password" placeholder="请输入密码" />)}
        </Item>
        <Item label="手机号">
          {getFieldDecorator(
            "phone",
            {
              initialValue: phone,
              rules: [
                { required: true, whitespace: true, message: "手机号不能为空" },
                {
                  pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                  message: "请输入正确的手机号"
                }
              ]
            }
          )(<Input placeholder='请输入正确的手机号'/>)}
        </Item>
        <Item label="邮箱" name={["user", "email"]} rules={[{ type: "email" }]}>
          {
            getFieldDecorator('email',{
              initialValue: email,
              rules: [
                { required: true, whitespace: true, message: "邮箱不能为空" },
                {
                    pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                    message: '邮箱格式不正确',
                },
                {
                    max: 50,
                    message: '邮箱不得超过50字符',
                },
            ]
            })(<Input placeholder='请输入邮箱'/>)
          }
        </Item>
        <Item label="角色">
          {getFieldDecorator("rple", {
            initialValue: role_id,
            rules: [
              { required: true, whitespace: true, message: "角色不能为空" },
            ]
          })(
            <Select placeholder="请选择角色">
              {
                roles.map(i=><Option value={i._id} key={i._id}>{i.name}</Option>)
              }
            </Select>
          )}
        </Item>
      </Form>
    );
  }
}
export default Form.create()(AddUpdate);

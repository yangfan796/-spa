import React, { Component } from "react";
import PropsTypes from 'prop-types'
import { Form, Input } from "antd";
const Item = Form.Item;
const formItemLayout = {
    labelCol: { span: 4},
    wrapperCol: { span: 18 }
  };
class AddForm extends Component {
  static propsTypes = {
    setForm:PropsTypes.func.isRequired
  }
  componentWillMount(){
    //将form对象通过setForm()传递父组件
    this.props.setForm(this.props.form)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form {...formItemLayout}>
        <Item label='角色名称'>
          {getFieldDecorator("roleName", {
            initialValue: "",
            rules:[
              {required:true,message:'角色名称不能为空'}
            ]
          })(<Input placeholder="请输入角色名称" />)}
        </Item>
      </Form>
    );
  }
}
export default Form.create()(AddForm);

import React, { Component } from "react";
import { Form, Input } from "antd";
import PropsTypes from 'prop-types'
const Item = Form.Item;
class UpdateForm extends Component {
  static propsTypes ={
    categoryName:PropsTypes.string.isRequired,
    setForm:PropsTypes.func.isRequired
  }
  componentWillMount(){
    //将form对象通过setForm()传递父组件
    this.props.setForm(this.props.form)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {caregoryName} =this.props
    return (
      <Form>
        <Item>
          {getFieldDecorator("categoryName", {
            initialValue: caregoryName,
            rules:[
              {required:true,message:'分类名称不能为空'}
            ]
          })(<Input placeholder="请输入分类名称" />)}
        </Item>
      </Form>
    );
  }
}
export default Form.create()(UpdateForm);

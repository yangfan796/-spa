import React, { Component } from "react";
import PropsTypes from 'prop-types'
import { Form, Select, Input } from "antd";
const Item = Form.Item;
const Option = Select.Option;
class AddForm extends Component {
  static propsTypes = {
    categorys:PropsTypes.array.isRequired,
    parentId:PropsTypes.string.isRequired,
    setForm:PropsTypes.func.isRequired
  }
  componentWillMount(){
    //将form对象通过setForm()传递父组件
    this.props.setForm(this.props.form)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {categorys,parentId} =this.props
    return (
      <Form>
        <Item>
          {getFieldDecorator("parentId", {
            initialValue: parentId,
          })(
            <Select>
              <Option value='0'>一级分类</Option>
              {
                categorys.map(i=><Option value={i._id}>{i.name}</Option>)
              }
            </Select>
          )}
        </Item>
        <Item>
          {getFieldDecorator("categoryName", {
            initialValue: "",
            rules:[
              {required:true,message:'分类名称不能为空'}
            ]
          })(<Input placeholder="请输入分类名称" />)}
        </Item>
      </Form>
    );
  }
}
export default Form.create()(AddForm);

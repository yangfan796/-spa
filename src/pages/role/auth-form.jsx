import React, { Component } from "react";
import PropsTypes from "prop-types";
import { Form, Input, Tree } from "antd";
import menuConfig from '../../config/menuConfig'
const Item = Form.Item;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
};
const treeData = [
  {
    title: "平台权限",
    key: "0",
    children: menuConfig
  }
];
export default class AuthForm extends Component {
  static propsTypes = {
    role: PropsTypes.object
  };
  constructor (props){
      super(props)
      const {menus} = this.props.role
      this.state = {
        checkedKeys:menus
      }
  }
  getMenus = () =>this.state.checkedKeys
  onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  onCheck = (checkedKeys, info) => {
    console.log("onCheck", checkedKeys, info);
    this.setState({checkedKeys})
  };
  //根据新传入的role来更新checkedKeys的状态
  /* 当组件接收到新的属性时自动调用 */
  componentWillReceiveProps(nextProps){
    const menus = nextProps.role.menus
    this.setState({
        checkedKeys:menus
    })
  }
  render() {
    const {checkedKeys} =this.state
    const {role} = this.props
    return (
      <Form>
        <Item label="角色名称" {...formItemLayout}>
          <Input value={role.name} disabled />
        </Item>
        <Tree
          defaultExpandAll
          checkable
          checkedKeys={checkedKeys}
          onSelect={this.onSelect}
          onCheck={this.onCheck}
          treeData={treeData}
        />
      </Form>
    );
  }
}

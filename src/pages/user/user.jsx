import React, { Component } from "react";
import { Card, Table, Button, Modal, message } from "antd";
import { reqUserList, reqAddUpdateUser ,reqDeleteUser} from "../../api/user";
import LinkButton from "../../components/link-button";
import moment from "moment";
import { PAGE_SIZE } from "../../utils/constants";
import AddUpdate from "./add-update";
/* 用户 */
export default class User extends Component {
  state = {
    dataSource: [],
    roles: [],
    showAdd: false,
    addMark:0,
    user:{},
  };
  addUser = () => {
    this.setState({
      showAdd: true,
      addMark:1
    });
  };
  upadateUser = (user) =>{
    this.setState({
      showAdd: true,
      addMark:0,
      user
    });
  }
  delUser = (user) =>{
    console.log(user)
    Modal.confirm({
      title: '确定要删除该用户吗？',
      onOk :async()=>{
        const res = await reqDeleteUser({_idwwwwgaaawawdw:user._id})
        if(res.data.status===0){
          message.success('删除成功')
          this.reqUserList();
        }else{
          message.error('删除失败')
        }
      },
      onCancel:()=>{
          
      },
    })
  }
  init = () => {
    this.columns = [
      {
        title: "用户名",
        dataIndex: "username"
      },
      {
        title: "邮箱",
        dataIndex: "email"
      },
      {
        title: "电话",
        dataIndex: "phone"
      },
      {
        title: "注册时间",
        dataIndex: "create_time",
        render: create_time => {
          return moment(create_time).format("YYYY-MM-DD HH:mm:ss");
        }
      },
      {
        title: "所属角色",
        dataIndex: "role_id",
        render: role_id =>
          this.state.roles.find(role => role._id === role_id).name
      },
      {
        title: "操作",
        width: 150,
        render: (user) => (
          <span>
            <LinkButton onClick={() => {this.upadateUser(user)}}>修改</LinkButton>
            <LinkButton onClick={() => {this.delUser(user)}}>删除</LinkButton>
          </span>
        )
      }
    ];
  };
  //添加或者更新用户
  addOrUpdate = async () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        console.log(values)
        const {username,password,phone,email,rple} = values
        this.setState({
          showAdd: false
        });
        let res
        if(this.state.addMark===1){
          res = await reqAddUpdateUser({username,password,phone,email,role_id:rple});
        }else{
          res = await reqAddUpdateUser({username,password,phone,email,role_id:rple,_id:this.state.user._id});
        }
        if(res.data.status===0){
          this.form.resetFields()
          this.setState({
            user:{}
          })
          message.success('添加用户成功')
          this.reqUserList();
        }else{
          message.error('添加用户失败')
        }
      }
    });
  };
  reqUserList = async () => {
    const res = await reqUserList();
    console.log(res);
    if (res.data.status === 0) {
      this.setState({
        dataSource: res.data.data.users,
        roles: res.data.data.roles
      });
    }
  };
  componentWillMount() {
    this.init();
  }
  componentDidMount() {
    this.reqUserList();
  }
  render() {
    const { dataSource, showAdd ,addMark,user} = this.state;
    const title = (
      <Button type="primary" onClick={this.addUser}>
        创建用户
      </Button>
    );
    return (
      <Card title={title}>
        <Table
          bordered
          dataSource={dataSource}
          columns={this.columns}
          rowKey="_id"
          pagination={{
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true
          }}
        />
        <Modal
          title={addMark===1?'创建用户':'修改用户信息'}
          visible={showAdd}
          onOk={this.addOrUpdate}
          onCancel={() => {
            this.setState({ showAdd: false ,user:{}});
            this.form.resetFields()
          }}
        >
          <AddUpdate
            user={user}
            setForm={form => {
              this.form = form;
            }}
          ></AddUpdate>
        </Modal>
      </Card>
    );
  }
}

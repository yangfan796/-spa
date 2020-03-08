import React, { Component  } from "react";
import { Card, Button, Table,Modal, message } from "antd";
import {PAGE_SIZE} from '../../utils/constants'
import {reqRoles,reqAddRole,reqUpdateRole} from '../../api/role'
import AddForm from './add-form'
import AuthForm from './auth-form'
import storage from "../../utils/storage";
import moment from 'moment'
/* 角色管理 */
export default class Role extends Component {
    state = {
        roles:[],
        role:{},//选中的role
        loading:false,
        showAdd:false,
        showAuth:false
    }
    constructor(props) {
      super(props);
      //创建用来保存ref标识的标签对象的容器
      this.auth = React.createRef();
    }
  initColums = () => {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name"
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render:(create_time) =>moment(create_time).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render:(auth_time)=>{
          console.log(auth_time)
          if(auth_time){
            return moment(auth_time).format('YYYY-MM-DD HH:mm:ss')
          }
        }
      },
      {
        title: "授权人",
        dataIndex: "auth_name"
      }
    ];
  };
  reqRoles = async()=>{
    const res = await reqRoles({})
    if(res.data.status===0){
        this.setState({
            roles:res.data.data
        })
    }
  }
  onRow = (role) =>{
    return{
        onClick:event =>{
            this.setState({role})
        }
    }
  }
  addRole = () =>{
      this.form.validateFields(async (err, values) => {
          if(!err){
            const res = await reqAddRole({name:values.roleName})
            if(res.data.status===0){
              message.success('创建角色成功')
              // this.reqRoles()
              this.setState(state =>({
                roles:[...state.roles,res.data.data]
              }))
            }else{
              message.error('创建角色失败')
            }
            this.setState({showAdd:false})
            this.form.resetFields();
          }
      })
  }
  addAuth = async() =>{
    this.setState({showAuth:false})
    const {role} = this.state
    const menus = this.auth.current.getMenus();
    role.menus = menus
    role.auth_time = (new Date()).getTime()
    role.auth_name = (storage.get("user")).username;
    const res = await reqUpdateRole(role)
    if(res.data.status===0){
      //如果跟新的是自己当前的角色 强制退出
      if(role._id===storage.get('user').role_id){
        storage.remove('user')
        this.props.history.replace('/login')
        message.warning('当前用户的角色权限已修改,请重新登陆')
      }else{
        message.success('设置权限成功')
        this.setState({
          roles:[...this.state.roles]
        })
      }
    }else{
      message.error('设置权限失败')
    }
  }
  componentWillMount() {
    this.initColums();
  }
  componentDidMount(){
      this.reqRoles()
  }
  render() {
      const {roles,loading,role,showAdd,showAuth  } =this.state
    const title = (
      <span>
        <Button type="primary" style={{ marginRight: 5 }} onClick={()=>this.setState({showAdd:true})}>
          创建角色
        </Button>
        <Button type="primary" disabled={!role._id} onClick={()=>this.setState({showAuth:true})}>
          设置角色权限
        </Button>
      </span>
    );
    return (
      <Card title={title}>
        <Table
          bordered
          dataSource={roles}
          rowSelection={{
            type:'radio',
            selectedRowKeys:[role._id],
            onSelect: (role)=>{
              this.setState({
                role
              })
            }
          }}
          columns={this.columns}
          rowKey="_id"
          loading={loading}
          onRow={this.onRow}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
          }}
        />
        <Modal
          title="添加角色"
          visible={showAdd}
          onOk={this.addRole}
          onCancel={()=>{
            this.setState({showAdd:false}) 
            this.form.resetFields()}}
        >
          <AddForm
            setForm={form => {
              this.form = form;
            }}
          ></AddForm>
        </Modal>
        <Modal
          title="设置角色权限"
          visible={showAuth}
          onOk={this.addAuth}
          onCancel={()=>{
            this.setState({showAuth:false})}}
        >
          <AuthForm role={role} ref={this.auth}></AuthForm>
        </Modal>
      </Card>
    );
  }
}

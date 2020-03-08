import React, { Component } from "react";
import { Card, Table, Icon, Button, message, Modal } from "antd";
import LinkButton from "../../components/link-button";
import {
  reqCategoryList,
  reqUpdateCategory,
  reqAddCategory
} from "../../api/category";
import AddForm from "./addForm";
import UpdateForm from "./updateForm";
/* 
商品分类路由
*/
export default class Category extends Component {
  state = {
    category: [], //一级分类列表
    subCategorys: [], //二级
    parentId: "0",
    parentName: "",
    loading: false,
    showStates: 0 //标识model的显示 1显示添加、2显示更新
  };
  //初始化表格的所有列的数组
  initColumns = () => {
    this.columns = [
      {
        title: "分类名称",
        dataIndex: "name"
      },
      {
        title: "操作",
        width: 300,
        render: category => (
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>
              修改分类
            </LinkButton>
            {/* 如何向事件回调传递参数：先定义一个匿名函数， 在函数中调用处理的函数并传入数据*/}
            {this.state.parentId === "0" ? (
              <LinkButton onClick={() => this.showSubCategorys(category)}>
                查看子分类
              </LinkButton>
            ) : null}
          </span>
        )
      }
    ];
  };
  reqCategoryList = async parentId => {
    parentId = parentId || this.state.parentId;
    this.setState({ loading: true });
    const res = await reqCategoryList({ parentId });
    this.setState({ loading: false });
    if (res.data.status === 0) {
      if (parentId === "0") {
        this.setState({
          category: res.data.data
        });
      } else {
        this.setState({
          subCategorys: res.data.data
        });
      }
    } else {
      message.error("获取分类失败");
    }
  };
  showSubCategorys = category => {
    console.log(category);
    this.setState(
      {
        parentId: category._id,
        parentName: category.name
      },
      () => {
        console.log(this.state.parentId);
        this.reqCategoryList();
      }
    );
  };
  showCategorys = () => {
    this.setState({
      parentId: "0",
      parentName: "",
      subCategorys: []
    });
  };
  /* 
  点击影藏modal
  */
  handleCancel = () => {
    this.setState({
      showStates: 0
    });
    this.form.resetFields();
  };
  showAdd = () => {
    this.setState({
      showStates: 1
    });
  };
  showUpdate = category => {
    this.category = category;
    this.setState({
      showStates: 2
    });
  };
  addCategory = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        const { parentId, categoryName } = values;
        const res = await reqAddCategory({ parentId, categoryName });
        if (res.data.status === 0) {
          //添加的分类就是当前分类的列表
          if (parentId === this.state.parentId) {
            this.reqCategoryList();
          } else if (parentId === "0") {
            this.reqCategoryList("0");
          }
        }
        this.setState({
          showStates: 0
        });
        this.form.resetFields();
      }
    });
  };
  updateCategory = async () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        const categoryId = this.category._id;
        const { categoryName } = values;
        const res = await reqUpdateCategory({ categoryId, categoryName });
        if (res.data.status === 0) {
          this.reqCategoryList();
        }
        this.setState({
          showStates: 0
        });
        this.form.resetFields();
      }
    });
  };
  componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.reqCategoryList();
  }
  render() {
    const {
      category,
      loading,
      subCategorys,
      parentId,
      parentName,
      showStates
    } = this.state;
    const categorys = this.category || {};
    const title =
      parentId === "0" ? (
        "一级分类列表"
      ) : (
        <span>
          <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
          <Icon type="arrow-right" style={{ marginRight: 5 }}></Icon>
          <span>{parentName}</span>
        </span>
      );
    const extra = (
      <Button type="primary" onClick={this.showAdd}>
        <Icon type="plus"></Icon>
        添加
      </Button>
    );
    return (
      <Card title={title} extra={extra}>
        <Table
          dataSource={parentId === "0" ? category : subCategorys}
          columns={this.columns}
          loading={loading}
          bordered
          rowKey="_id"
          pagination={{ defaultPageSize: 6, showQuickJumper: true }}
        />
        <Modal
          title="添加分类"
          visible={showStates === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            categorys={category}
            parentId={parentId}
            setForm={form => {
              this.form = form;
            }}
          ></AddForm>
        </Modal>
        <Modal
          title="更新分类"
          visible={showStates === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm
            caregoryName={categorys.name}
            setForm={form => {
              this.form = form;
            }}
          ></UpdateForm>
        </Modal>
      </Card>
    );
  }
}

import React, { Component } from "react";
import { Card, Select, Input, Button, Icon, Table, message } from "antd";
import { reqProductList, reqSearchProductList,reqUpdateStatus } from "../../api/product";
import LinkButton from "../../components/link-button";
import { PAGE_SIZE } from "../../utils/constants";
const Option = Select.Option;
// product的默认子组建
export default class ProductHome extends Component {
  state = {
    products: [],
    total: 0,
    loading: false,
    searchName: "",
    searchType: "productName"
  };
  reqUpdateStatus = async(product) =>{
    const {_id,status}=product
    const res = await reqUpdateStatus({productId:_id,status:status===1?2:1})
    if (res.data.status === 0) {
      message.success('更新商品成功')
      this.reqProductList(this.pageNum)
    }
  }
  //初始化table列的数组
  initColumns = () => {
    this.columns = [
      {
        title: "商品名称",
        dataIndex: "name",
        key: "name",
        width: 200
      },
      {
        title: "商品描述",
        dataIndex: "desc",
        key: "desc"
      },
      {
        title: "价格",
        dataIndex: "price",
        width: 100,
        render: price => "￥" + price
      },
      {
        title: "状态",
        // dataIndex: "status",
        width: 100,
        render: product =>(
            <span>
              <Button type="primary" onClick={()=>this.reqUpdateStatus(product)}>
                {product.status===1?'下架':'上架'}
              </Button>
              <span>{product.status===1?'在售':'已下架'}</span>
            </span>
          )
      },
      {
        title: "操作",
        width: 100,
        render: product => (
          <span>
            <LinkButton onClick={() => this.props.history.push('/product/detail',{product})}>
              详情
            </LinkButton>
            <LinkButton onClick={() => this.props.history.push('/product/addupdate',product)}>
              修改
            </LinkButton>
          </span>
        )
      }
    ];
  };
  reqProductList = async pageNum => {
    this.pageNum = pageNum
    this.setState({ loading: true });
    const { searchName, searchType } = this.state;
    let res
    if (searchName) {
       res = await reqSearchProductList({
        pageNum,
        pageSize: PAGE_SIZE,
        searchName,
        searchType
      });
    } else {
      res = await reqProductList({ pageNum, pageSize: PAGE_SIZE });
    }
    this.setState({ loading: false });
    if (res.data.status === 0) {
      this.setState({
        total: res.data.data.total,
        products: res.data.data.list
      });
    }
  };
  componentDidMount(){
    this.reqProductList();
  }
  componentWillMount() {
    this.initColumns();
  }
  render() {
    const { products, total, loading, searchType, searchName } = this.state;
    const title = (
      <span>
        <Select
          value={searchType}
          style={{ width: 150 }}
          onChange={value => this.setState({ searchType: value })}
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input
          placeholder="关键字"
          style={{ width: 150, margin: "0 15px" }}
          value={searchName}
          onChange={e => this.setState({ searchName: e.target.value })}
        />
        <Button type="primary" onClick={() => this.reqProductList(1)}>
          搜索
        </Button>
      </span>
    );
    const extra = (
      <Button type="primary" onClick={()=>this.props.history.push('/product/addupdate')}>
        <Icon type="plus"></Icon>
        添加商品
      </Button>
    );
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          dataSource={products}
          columns={this.columns}
          rowKey="_id"
          loading={loading}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            total,
            onChange: this.reqProductList,
            current:this.pageNum
          }}
        />
      </Card>
    );
  }
}

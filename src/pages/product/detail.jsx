import React, { Component } from "react";
import { Card, Icon, List } from "antd";
import img from "../../assets/images/login.png";
import LinkButton from "../../components/link-button";
import {reqCategoryInfo} from '../../api/category'
const Item = List.Item;
//商品详情
export default class ProductDetail extends Component {
  state = {
    cName1: "",
    cName2: ""
  };
  async componentDidMount() {
    const { pCategoryId, categoryId} = this.props.location.state.product;
    if(pCategoryId===0){
        const res = await reqCategoryInfo({categoryId})
        this.setState({cName1:res.data.data.name})
    }else{
        // const res1 = await reqCategoryInfo({categoryId:pCategoryId})
        // const res2 = await reqCategoryInfo({categoryId})
        const results=await Promise.all([reqCategoryInfo({categoryId:pCategoryId}),reqCategoryInfo({categoryId})])
        this.setState({cName1:results[0].data.data.name,cName2:results[1].data.data.name})
    }
  }
  render() {
    const { name, desc, price, detail } = this.props.location.state.product;
    const {cName1,cName2} =this.state
    const title = (
      <span>
        <LinkButton>
          <Icon
            type="arrow-left"
            style={{ color: "green", marginRight: 15, fontSize: 16 }}
            onClick={() => this.props.history.goBack()}
          ></Icon>
        </LinkButton>
        <span>商品详情</span>
      </span>
    );
    return (
      <Card title={title} className="product-detail">
        <List>
          <Item>
            <span className="left">商品名称:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className="left">商品描述:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className="left">商品价格:</span>
            <span>{price}元</span>
          </Item>
          <Item>
            <span className="left">所属分类:</span>
            <span>{cName1}{cName2?'-->'+cName2:''}</span>
          </Item>
          <Item>
            <span className="left">商品图片:</span>
            <span>
              {/* {
                    imgs.map(img =>(
                        <img className="product-img" src={img} key={img} alt="img" />
                    ))
                } */}
              <img className="product-img" src={img} alt="" />
              <img className="product-img" src={img} alt="" />
            </span>
          </Item>
          <Item>
            <span className="left">商品详情:</span>
            <span>{detail}</span>
          </Item>
        </List>
      </Card>
    );
  }
}

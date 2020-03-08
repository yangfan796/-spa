import React, { Component } from "react";
import { Card, Form, Input, Cascader, Button, Icon, message } from "antd";
import LinkButton from "../../components/link-button";
import { reqCategoryList } from "../../api/category";
import { reqAddGood } from "../../api/product";
import PicturesWall from "./picture-wall.jsx";
import RichTextEditor from "./rich-text-editor";
const { Item } = Form;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 8 }
};
//产品的添加和修改子路又
class ProductAddUpdate extends Component {
  state = {
    options: []
  };
  constructor(props) {
    super(props);
    //创建用来保存ref标识的标签对象的容器
    this.pw = React.createRef();
    this.editor = React.createRef();
  }
  loadData = async selectedOptions => {
    const targetOption = selectedOptions[0];
    targetOption.loading = true;
    const subCategoryList = await this.reqCategoryList(targetOption.value);
    targetOption.loading = false;
    if (subCategoryList && subCategoryList.length > 0) {
      const cOptions = subCategoryList.map(e => ({
        value: e._id,
        label: e.name,
        isLeaf: true
      }));
      targetOption.children = cOptions;
    } else {
      targetOption.isLeaf = true;
    }
    this.setState({
      options: [...this.state.options]
    });
  };
  validator = (rule, value, callback) => {
    console.log(typeof value);
    if (value * 1 > 0) {
      callback();
    } else {
      callback("价格必须大于0");
    }
  };
  submit = e => {
    //进行表单验证
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      //校验成功
      if (!err) {
        const { name, desc, price, cate, categoryIds } = values;
        let pCategoryId, categoryId;
        if (categoryIds.length === 1) {
          pCategoryId = 0;
          categoryId = categoryIds[0];
        } else {
          pCategoryId = categoryIds[0];
          categoryId = categoryIds[1];
        }
        const imgs = this.pw.current.getImgs();
        const detail = this.editor.current.getDetail();
        const product = { name,
          desc,
          price,
          cate,
          pCategoryId,
          categoryId,
          imgs,
          detail}
          if(this.isUpdate){
            product._id=this.product._id
          }
        const res = await reqAddGood(product);
        if (res.data.status === 0) {
          message.success(`${this.isUpdate?'更新':'添加'}商品成功`);
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate?'更新':'添加'}商品失败`);
        }
      }
    });
  };
  reqCategoryList = async parentId => {
    const res = await reqCategoryList({ parentId });
    if (res.data.status === 0) {
      const list = res.data.data;
      if (parentId === 0) {
        this.initOptions(list);
      } else {
        return list;
      }
    }
  };
  initOptions = async list => {
    const options = list.map(e => ({
      value: e._id,
      label: e.name,
      isLeaf: false
    }));
    const { product, isUpdate } = this;
    const { pCategoryId } = product;
    if (isUpdate && pCategoryId!=='0') {
      const subCategoryList = await this.reqCategoryList(pCategoryId);
      const cOptions = subCategoryList.map(e => ({
        value: e._id,
        label: e.name,
        isLeaf: true
      }));
      //找到商品一级option对象
      const targetOption = options.find(e => e.value === pCategoryId);
      targetOption.children = cOptions;
    }
    this.setState({
      options
    });
  };
  componentWillMount() {
    this.reqCategoryList(0);
    const product = this.props.location.state;
    this.isUpdate = !!product;
    this.product = product || {};
  }
  render() {
    const { product, isUpdate } = this;
    const { pCategoryId, categoryId, imgs, detail } = product;
    const categoryIds = [];
    if (isUpdate) {
      if (pCategoryId === 0) {
        categoryIds.push(categoryId);
      } else {
        categoryIds.push(pCategoryId);
        categoryIds.push(categoryId);
      }
    }
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon
            type="arrow-left"
            style={{ fontSize: 18, marginRight: 5 }}
          ></Icon>
        </LinkButton>
        <span>{isUpdate ? "修改商品" : "添加商品"}</span>
      </span>
    );
    const { getFieldDecorator } = this.props.form;
    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="商品名称">
            {getFieldDecorator("name", {
              initialValue: product.name,
              rules: [{ required: true, message: "必须输入商品名称" }]
            })(<Input placeholder="请输入商品名称" />)}
          </Item>
          <Item label="商品描述">
            {getFieldDecorator("desc", {
              initialValue: product.desc,
              rules: [{ required: true, message: "必须输入商品描述" }]
            })(
              <TextArea
                placeholder="请输入商品描述"
                autoSize={{ minRows: 2, maxRows: 5 }}
              />
            )}
          </Item>
          <Item label="商品价格">
            {getFieldDecorator("price", {
              initialValue: product.price,
              rules: [
                { required: true, message: "必须输入商品价格" },
                { validator: this.validator }
              ]
            })(
              <Input
                type="number"
                placeholder="请输入商品价格"
                addonAfter="元"
              />
            )}
          </Item>
          <Item label="商品分类">
            {getFieldDecorator("categoryIds", {
              initialValue: categoryIds,
              rules: [{ required: true, message: "必须指定商品分类" }]
            })(
              <Cascader
                placeholder="请指定商品分类"
                options={this.state.options} /* 列表数据 */
                loadData={this.loadData} /* 加载下一级的回调 */
                changeOnSelect
              />
            )}
          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.pw} imgs={imgs}></PicturesWall>
          </Item>
          <Item
            label="商品详情"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 20 }}
          >
            <RichTextEditor ref={this.editor} detail={detail}></RichTextEditor>
          </Item>
          <Item>
            <Button type="primary" onClick={this.submit}>
              提交
            </Button>
          </Item>
        </Form>
      </Card>
    );
  }
}
export default Form.create()(ProductAddUpdate);

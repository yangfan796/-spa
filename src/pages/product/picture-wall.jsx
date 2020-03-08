import React, { Component } from "react";
import { Upload, Modal,Icon,message} from 'antd';
import PropTypes from 'prop-types'
import {reqDelImg} from '../../api/product'
import {BASE_IMG_URL} from '../../utils/constants'
// import { PlusOutlined } from '@ant-design/icons';
import './product.less'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {
    static propTypes={
        imgs:PropTypes.array
    }
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };
  constructor(props){
      super(props)
      let fileList = []
      const {imgs} = this.props
      if(imgs&&imgs.length>0){
        fileList=imgs.map((e,i) =>({
            uid:-i,
            name:e,
            status:'done',
            url:BASE_IMG_URL+e
        }))
      }
      this.state = {
        previewVisible: false,
        previewImage: '',
        fileList,
      };
  }
  getImgs = () =>{
      return this.state.fileList.map(file=>file.name)
  }
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async ({file,fileList }) => {
    this.setState({ fileList })
    //一旦上传成功，将当前上传的file的信息修正（name,url）
    if(file.status==='done'){
         const res=file.response
         console.log(res)
         if(res.status===0){
            message.success('图片上传成功')
            file=fileList[fileList.length-1]
            const {name,url}=res.data
            file.name=name
            file.url=url
         }else{
             message.error('上传图片失败')
         }
    }else if(file.status==='removed'){
        const res = await reqDelImg({name:file.name})
        if(res.data.status===0){
            message.success('删除图片成功')
        }else{
            message.error('删除图片失败')
        }
    }
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type='plus'></Icon>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"//上传地址
          listType="picture-card"
          accept='image/*' //只接收图片格式
          name='image' //请求参数名
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
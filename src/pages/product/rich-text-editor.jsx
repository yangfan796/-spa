import React, { Component } from "react";
//富文本编辑器
import { EditorState, convertToRaw,ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import PropsTypes from "prop-types";
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default class RichTextEditor extends Component {
  static propsTypes = {
    detail: PropsTypes.string.required
  };
  constructor(props) {
    super(props);
    const html = this.props.detail;
    if (html) {
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
          editorState
        };
      }
    }else{
        this.setState({
            editorState: EditorState.createEmpty()
        })
    }
  }
  state = {
    editorState: EditorState.createEmpty() //创建没有内容的编辑对象
  };

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
  };
  uploadImageCallBack=(file)=> {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/manage/img/upload');
        xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const res = JSON.parse(xhr.responseText);
          const url = res.data.url
          resolve({data:{link:url}});
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }
  getDetail = () => {
    const { editorState } = this.state;
    //给伏组件返回html的文本
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  };
  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          editorStyle={{
            border: "1px solid black",
            minHeight: 200,
            padding: 10
          }}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
          }}
        />
        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
      </div>
    );
  }
}

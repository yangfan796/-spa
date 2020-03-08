import React, { Component } from "react";
import "./index.less";
import { Modal } from 'antd';
import LinkButton from '../link-button'
import { withRouter } from "react-router-dom";
import storage from "../../utils/storage";
import { reqWeather } from "../../api/jsonp";
import menuList from "../../config/menuConfig";
import { formateDate } from "../../utils/date";
class headNav extends Component {
  state = {
    currentTime: formateDate(Date.now()),
    dayPictureUrl: "",
    weather: ""
  };
  getTime = () => {
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now());
      this.setState({ currentTime });
    }, 1000);
  };
  getWeather = async () => {
    const { dayPictureUrl, weather } = await reqWeather("马鞍山");
    this.setState({ dayPictureUrl, weather });
  };
  getTitle() {
    const path = this.props.location.pathname;
    let title;
    menuList.forEach(e => {
      if (e.key === path) {
        title = e.title;
      } else if(e.children) {
        const cItem = e.children.find(cItem => path.indexOf(cItem.key) === 0);
        if (cItem) {
          title = cItem.title;
        }
      }
    });
    return title;
  }
  //退出登录
  logout = () =>{
    Modal.confirm({
      content: '确认退出吗？',
      onOk:()=> {
        storage.remove('user')
        this.props.history.replace('/login')
      },
    });
  }
  /* 
    第一次reader之后执行一次
    一般再次执行异步操作：发ajax请求/启动定时器
    */
  componentDidMount() {
    //获取当前时间
    this.getTime();
    this.getWeather();
  }
  //当前组件卸载之前调用
  componentWillUnmount(){
    //清除定时器
    clearInterval(this.intervalId)
  }
  render() {
    const username = (storage.get("user")).username;
    const { currentTime, dayPictureUrl, weather } = this.state;
    const title = this.getTitle();
    return (
      <div className="head-nav">
        <div className="header-top">
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="" />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(headNav);

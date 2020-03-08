import React,{Component} from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom'

import Login from './pages/login/index'
import Admin from './pages/admin/index'
/* 
  应用的根组件
*/
export default class App extends Component {

  render(){
    return(
      <BrowserRouter>
        <Switch>{/* 之匹配其中一个 */}
          <Route exact path='/login' component={Login}></Route>
          <Route path='/' component={Admin}></Route>
        </Switch>
      </BrowserRouter>
    )
  }
}

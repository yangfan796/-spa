import React,{Component} from 'react';
import {BrowserRouter,HashRouter,Route,Switch} from 'react-router-dom'

import Login from './pages/login/index'
import Admin from './pages/admin/index'
/* 
  应用的根组件
*/
export default class App extends Component {

  render(){
    return(
      <HashRouter>
        <Switch>{/* 之匹配其中一个 */}
          <Route path='/login' component={Login}></Route>
          <Route path='' component={Admin}></Route>
        </Switch>
      </HashRouter>
    )
  }
}

import React from 'react';
import './App.css';
// 导入antd-mobile的样式文件
import 'antd-mobile/dist/antd-mobile.css';
// import { Button } from 'antd-mobile';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from './views/login/index'
import Home from './views/home/index'
import City from './views/city/index'
import MapUse from './views/map/index'

// 导入字体图标
import '../src/assets/fonts/iconfont.css'

function NotFound() {
    return <div > NotFound < /div>
}

function App() {
    return ( 
      <BrowserRouter>
        <Switch>
        <Redirect exact from = '/' to = '/home' />
        <Route path = '/login' component = { Login } />  
        <Route path = '/home' component = { Home } />  
        <Route path= '/city' component = {City} />
        <Route path= '/map' component = {MapUse} />
        <Route component = { NotFound } />  
        </Switch> 
        </BrowserRouter>
    );
}

export default App;
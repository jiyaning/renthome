import React from 'react';
import './App.css';
//导入antd-mobile的样式文件
import 'antd-mobile/dist/antd-mobile.css';
// import { Button } from 'antd-mobile';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from './views/login/index'
import Home from './views/home/index'

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
        <Route component = { NotFound } />  
        </Switch> 
        </BrowserRouter>
    );
}

export default App;
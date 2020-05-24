/*
主页
*/
import React from 'react';
import { Route, Switch, Redirect} from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import './index.css';

function Index (){
  return <div>Index</div>
}
function Find (){
  return <div>Find</div>
}
function Info (){
  return <div>Info</div>
}
function My (){
  return <div>My</div>
}

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'index',
    };
  }
  
  //动态生成底部菜单
  renderMenuItems = ()=>{
    const menuData = [
      {
        title:'主页',
        key:'index'
      },
      {
        title:'找房',
        key:'find'
      },
      {
        title:'资讯',
        key:'info'
      },
      {
        title:'我的',
        key:'my'
      },
    ]
    return  menuData.map((item)=>(
      <TabBar.Item
            icon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(https://zos.alipayobjects.com/rmsportal/psUFoAMjkCcjqtUCNPxB.svg) center center /  21px 21px no-repeat' }}
              />
            }
            selectedIcon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(https://zos.alipayobjects.com/rmsportal/IIRLrXXrFAhXVdhMWgUI.svg) center center /  21px 21px no-repeat' }}
              />
            }
            title={item.title}
            key={item.key}
            selected={this.state.selectedTab === item.key}
            //控制菜单的点击切换
            onPress={() => {
              this.setState({
                selectedTab: item.key,
              });
              this.props.history.push('/home/'+item.key)
            }}
          />
    ))
  }

  render (){
    return (
      <div class='home-menu'>
        {/*路由组件显示的位置*/}
        <Switch>
          <Redirect from='/home' exact to='/home/index'></Redirect>
          <Route path='/home/index' component={Index} />
          <Route path='/home/find' component={Find} />
          <Route path='/home/info' component={Info} />
          <Route path='/home/my' component={My} />
        </Switch>
        
       {/*二级菜单路由的链接*/}
       {/* <Link to='/home/index'>首页</Link>
       <Link to='/home/find'>找房</Link>
       <Link to='/home/info'>资讯</Link>
       <Link to='/home/my'>我的</Link> */}
      <TabBar
          noRenderContent={true}
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          tabBarPosition="bottom"
        >
          {this.renderMenuItems()}
        </TabBar>
      </div>
    )
  }
}

export default Home
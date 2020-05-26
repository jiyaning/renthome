/*
主页
*/
import React from 'react';
import { Route, Switch, Redirect} from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import './index.scss';
import Index from '../index/index'
import Find from '../find/index'
import Info from '../info/index'
import My from '../my/index'

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
        key:'index',
        icon: 'icon-ind'
      },
      {
        title:'找房',
        key:'find',
        icon: 'icon-findHouse'
      },
      {
        title:'资讯',
        key:'info',
        icon: 'icon-myinfo'
      },
      {
        title:'我的',
        key:'my',
        icon: 'icon-my'
      },
    ]
    return  menuData.map((item)=>(
      <TabBar.Item
            icon={<i className={`iconfont ${item.icon}`}></i>}
            selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
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
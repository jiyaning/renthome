/*
主页模块
*/
import React from 'react'
import { Carousel, Flex, Grid } from 'antd-mobile';
import axios from 'axios'
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
import './index.scss'

class Index extends React.Component {

  state = {
    swiperData: [],
    groupsData: [],
    newsData: []
  }

  // 加载轮播图数据
  loadSwiper = async () => {
    // axios.get('http://localhost:8080/home/swiper').then(res =>{
    //   if(res.status == 200){
    //     console.log(res)
    //     this.setState({
    //       swiperData : res.data.body
    //     })
    //   }
    // })
    const res = await axios.get('http://localhost:8080/home/swiper')
    if (res.status == 200) {
      console.log(res)
      this.setState({
        swiperData: res.data.body
      })
    }
  }

  loadGroup = async () => {
    const res = await axios.get('http://localhost:8080/home/groups')
    if (res.status == 200) {
      console.log(res)
      this.setState({
        groupsData: res.data.body
      })
    }
  }

  loadNews = async () => {
    const res = await axios.get('http://localhost:8080/home/news')
    if (res.status == 200) {
      console.log(res)
      this.setState({
        newsData: res.data.body
      })
    }
  }

  componentDidMount() {
    this.loadSwiper()
    this.loadGroup()
    this.loadNews()
  }

  renderSwiper = () => {
    const swiperItems = this.state.swiperData.map(item => (
      <img key={item.id} src={"http://localhost:8080" + item.imgSrc} alt="" />
    ))
    return (
      <Carousel dots autoplay infinite>
        {swiperItems}
      </Carousel>
    )
  }

  renderMenu = () => {
    const navDatas = [{
      id: 1,
      title: '整租',
      img: nav1
    }, {
      id: 2,
      title: '合租',
      img: nav2
    }, {
      id: 3,
      title: '地图找房',
      img: nav3
    }, {
      id: 4,
      title: '去出租',
      img: nav4
    }]
    const FlexItem = navDatas.map(item => (
      <Flex.Item key={item.id}>
        <img src={item.img} alt="" />
        <p>{item.title}</p>
      </Flex.Item>
    ))
    return (
      <Flex className='index-menu'>
        {FlexItem}
      </Flex>
    )
  }

  renderGroup = () => {
    return (
      <div className="group">
        {/* 租房小组标题 */}
        <Flex className="group-title" justify="between">
          <h3>租房小组</h3>
          <span>更多</span>
        </Flex>
        {/* 租房小组内容 */}
        < Grid
          data={this.state.groupsData}
          columnNum={2}
          square={false}
          hasLine={false}
          renderItem={item => (
            <Flex className="grid-item" justify="between">
              <div className="desc">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
            </Flex>
          )}
        />
      </div>
    )
  }

  renderNews = () => {
    const newsTag = this.state.newsData.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://api-haoke-dev.itheima.net${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
    return (
      <div className="news">
        <h3 className="group-title">最新资讯</h3>
        {newsTag}
      </div>

    )
  }

  render() {
    return (
      <div className='index'>
        {/* 轮播图 */}
        {this.renderSwiper()}
        {/* 菜单 */}
        {this.renderMenu()}
        {/* 租房小组 */}
        {this.renderGroup()}
        {/* 最新资讯 */}
        {this.renderNews()}
      </div>
    )
  }
}

export default Index
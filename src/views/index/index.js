/*
主页模块
*/
import React from 'react'
import { Carousel, Flex, } from 'antd-mobile';
import axios from 'axios'
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
import './index.scss'

class Index extends React.Component {

  state = {
    swiperData: []
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

  componentDidMount() {
    this.loadSwiper()
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

  render() {
    return (
      <div>
        <div>主页页面</div>
        {/* 轮播图 */}
        {this.renderSwiper()}
        {/* 菜单 */}
        {this.renderMenu()}
      </div>
    )
  }
}

export default Index
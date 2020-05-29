/*
地图模块
*/
import React from 'react'
import { Toast } from 'antd-mobile';

class MapUse extends React.Component {

  state = {
    longitude: '',
    latitude: ''
  }

  getLocation = () => {
    // 基于浏览器定位，优先调用浏览器H5定位接口，如果失败会调用IP定位
    const geolocation = new window.BMap.Geolocation();
    let that =this
    geolocation.getCurrentPosition(function (res) {
      if (this.getStatus() === window.BMAP_STATUS_SUCCESS) {
        console.log(res.address.city)
        Toast.info('您的位置：' + res.point.lng + ',' + res.point.lat);
        that.setState({
          longitude: res.point.lng,
          latitude: res.point.lat
        })
        that.createMap()
      }
      else {
        Toast.info('获取定位失败!');
      }
    });
  }

  createMap = () => {
    // 初始化地图
    // 1、创建地图实例对象
    const map = new window.BMap.Map("container")
    // 2、创建地图中心点坐标
    const point = new window.BMap.Point(this.state.longitude, this.state.latitude)
    // 3、设置地图的中心点坐标和缩放级别 
    map.centerAndZoom(point, 12)
    // 开启鼠标滚轮缩放
    map.enableScrollWheelZoom(true);
  }

  componentDidMount() {
    // 
    this.getLocation()
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        <div id="container" style={{ height: '100%' }}></div>
      </div>
    )
  }
}

export default MapUse
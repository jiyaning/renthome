/*
地图模块
*/
import React from 'react'
import { Toast } from 'antd-mobile';

class MapUse extends React.Component {

  state={
    longitude:'116.404',
    latitude:'39.915'
  }

  getLocation = () => {
    console.log("地理定位")
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
    }
    else {
      Toast.info('您的浏览器不支持地理定位！', 2)
    }
  }

  showPosition = (position) => {
    console.log(position)
    var longitudeValue = position.coords.longitude;  //获得当前位置的经度
    var latitudeValue = position.coords.latitude;    //获得当前位置的纬度
    console.log("经度："+longitudeValue+"---纬度："+latitudeValue);
    if(longitudeValue !== null || longitudeValue !==''){
      this.setState({
        longitude:longitudeValue,
        latitude:latitudeValue
      })
    }
    this.createMap()
  }

  showError = (error)=>{
    console.log(error);
    Toast.info("获取用户位置失败！", 2)
  }

  createMap = ()=>{
    // 初始化地图
    // 1、创建地图实例对象
    const map = new window.BMapGL.Map("container")
    // 2、创建地图中心点坐标
    const point = new window.BMapGL.Point(this.state.longitude,this.state.latitude)
    // 3、设置地图的中心点坐标和缩放级别 
    map.centerAndZoom(point, 12)
    // 开启鼠标滚轮缩放
    map.enableScrollWheelZoom(true);
  }

  componentDidMount() {
    this.getLocation()
    this.createMap()
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
/*
地图模块
*/
import React from 'react'
import { NavBar, Icon, Toast } from 'antd-mobile';
import './index.scss'
import { getCurrentCity, BASE_IMG_URL } from '../../utils/config'
import request from '../../utils/request';
class MapUse extends React.Component {

  state = {
    longitude: '',
    latitude: '',
    houseData: [],    // 地图覆盖物数据
    areaList: [],     // 小区房源列表
    isShow: false     // 控制列表展示或者隐藏
  }

  // 获取一级覆盖物数据
  loadFirstLevelData = async () => {
    Toast.loading('正在加载...', 0)
    const city = await getCurrentCity()
    const res = await request({
      url: 'area/map',
      params: {
        id: city.value
      }
    })
    if (res.status === 200) {
      this.setState({
        houseData: res.body
      })
      Toast.hide()
    }
  }

  // 封装绘制单个覆盖物的方法
  drawSingleOverlay = (map, overlayData, type) => {
    // 覆盖物坐标点
    const point = new window.BMap.Point(overlayData.coord.longitude, overlayData.coord.latitude)
    // 添加地图覆盖物
    let opts = {
      // 表示覆盖物绘制的坐标
      position: point,
      // 覆盖物中心点的偏移量
      offset: new window.BMap.Size(-30, -30)
    }
    // 创建地图覆盖物（Label内容支持富文本）
    let overInfo
    overInfo = `
             <div class='map-overlay'>
                <div>${overlayData.label}</div>
                <div>${overlayData.count}套</div>
              </div>`
    if (type === 'third') {
      // 调整三级覆盖物的样式
      overInfo = `
                  <div class='map-overlay-area'>
                    <span>${overlayData.label}</span>
                    <span>${overlayData.count}套</span>
                  </div>
                `
    }
    // label表示一个覆盖物
    let label = new window.BMap.Label(overInfo, opts);
    // 给覆盖物绑定事件
    label.addEventListener('click', (e) => {
      if (type === 'first') {
        // 绘制二级覆盖物
        this.drawSecondLevelOverlay(map, overlayData)
      } else if (type === 'second') {
        this.drawThirdLevelOverlay(map, overlayData)
      } else {
        this.showHouseList(overlayData.value)
        // 控制地图的移动
        // 获取点击时鼠标的位置坐标
        const { clientX, clientY } = e.changedTouches[0]
        // 获取地图中心点坐标
        const x0 = window.innerWidth / 2
        const y0 = (window.innerHeight - 330) / 2
        // 地图移动的距离（必须使用中心点坐标-点击位置的坐标）
        const x = x0 - clientX
        const y = y0 - clientY
        // 调用地图的API实现地图的移动
        map.panBy(x, y)
      }

    })
    // 调整默认的覆盖物样式
    label.setStyle({
      border: 0,
      background: 'rgba(0, 0, 0, 0)'
    })
    // 把地图覆盖物添加到地图中
    map.addOverlay(label)
  }

  // 批量绘制一级覆盖物
  drawFirstLevelOverlay = (map) => {
    const { houseData } = this.state
    houseData.forEach((item) => {
      // 绘制单个覆盖物
      this.drawSingleOverlay(map, item, 'first')
    })
  }

  // 绘制二级覆盖物
  drawSecondLevelOverlay = async (map, overlayData) => {
    // 一级覆盖物点击时，
    // 1、需要清空原有覆盖物，
    setTimeout(() => {
      // 防止出现警告
      map.clearOverlays()
    }, 0)
    Toast.loading('正在加载...', 0)
    // 2、根据点击的一级覆盖物，获取对应二级覆盖物的数据
    const res = await request({
      url: 'area/map',
      params: {
        id: overlayData.value
      }
    })
    // 3、绘制二级覆盖物
    const point = new window.BMap.Point(overlayData.coord.longitude, overlayData.coord.latitude)
    // 放大地图
    map.centerAndZoom(point, 13)
    res.body.forEach(item => {
      // 绘制单个二级覆盖物
      this.drawSingleOverlay(map, item, 'second')
    })
    Toast.hide()
  }

  // 绘制三级覆盖物
  drawThirdLevelOverlay = async (map, overlayData) => {
    // 1、清空二级覆盖物
    setTimeout(() => {
      map.clearOverlays()
    }, 0)
    Toast.loading('正在加载...', 0)
    // 2、放大地图
    const point = new window.BMap.Point(overlayData.coord.longitude, overlayData.coord.latitude)
    map.centerAndZoom(point, 15)
    // 3、调用接口获取三级覆盖物数据
    const res = await request({
      url: 'area/map',
      params: {
        id: overlayData.value
      }
    })
    // 4、批量绘制
    res.body.forEach(item => {
      // 绘制三级覆盖物
      this.drawSingleOverlay(map, item, 'third')
    })
    Toast.hide()
  }

  // 展示房源列表
  showHouseList = async (id) => {
    const res = await request({
      url: 'houses',
      params: {
        cityId: id
      }
    })
    if (res.status === 200) {
      console.log(res)
      this.setState({
        areaList: res.body.list,
        // 加载完数据显示房源列表
        isShow: true
      })

    }
  }

  createMap = async () => {
    // 获取当前城市信息
    const city = await getCurrentCity()
    // console.log(city)
    if (city) {
      // 根据城市名称获取城市的经纬度
      const geo = new window.BMap.Geocoder()
      // getPoint参数：（1、城市名称；2、回调函数；3、国家名称）
      geo.getPoint(city.label, (data) => {
        // 获取城市经纬度数据
        let info = {
          lng: data && data.lng,
          lat: data && data.lat
        }
        this.setState({
          longitude: info.lng,
          latitude: info.lat
        })
        // 初始化地图
        // 1、创建地图实例对象
        const map = new window.BMap.Map("container")
        // 2、创建地图中心点坐标
        const point = new window.BMap.Point(info.lng, info.lat)
        // 3、设置地图的中心点坐标和缩放级别 
        map.centerAndZoom(point, 11)
        // 开启鼠标滚轮缩放
        map.enableScrollWheelZoom(true);

        // 给地图绑定移动事件
        map.addEventListener('movestart', () => {
          this.setState({
            // 隐藏房源列表
            isShow: false
          })
        })

        // 批量绘制一级覆盖物
        this.drawFirstLevelOverlay(map)
      }, '中国')
    }

  }

  async  componentDidMount() {
    // 获取一级覆盖物数据(加载完成数据后才去初始化地图)
    await this.loadFirstLevelData()
    // 初始化地图
    this.createMap()
  }

  renderAreaList = () => {
    const { areaList } = this.state
    const listTag = areaList.map(item => (
      <div className='house' key={item.houseCode}>
        <div className='img-wrap'>
          <img className='img' src={BASE_IMG_URL + item.houseImg} alt="" />
        </div>
        <div className='content'>
          <h3 className='title'>{item.title}</h3>
          <div className='desc'>{item.desc}</div>
          <div>
            {item.tags && item.tags.map((item, index) => {
              // tagCls类名所有需要从1-3进行变化
              let i = (index + 1) % 3 === 0 ? 3 : (index + 1) % 3
              let tagCls = 'tag' + i
              return (
                <span key={index} className={['tag', tagCls].join(' ')}>
                  {item}
                </span>
              )
            })}
          </div>
          <div className='price'>
            <span className='price-num'>{item.price}</span> 元/月
          </div>
        </div>
      </div>
    ))
    return (
      <div className={['house-list', this.state.isShow ? 'show' : ''].join(' ')}>
        <div className='title-wrap'>
          <h1 className='list-title'>房屋列表</h1>
          <a className='title-more' href="/house/list">
            更多房源
          </a>
        </div>
        <div className='house-items'>
          {listTag}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        {/* 导航栏 */}
        <NavBar
          mode="light"
          icon={<Icon type='left' />}
          onLeftClick={() => {
            // 左侧点击事件,跳转首页
            this.props.history.push('/home')
          }}
        >地图找房</NavBar>
        {/* 地图区域 */}
        <div id="container"></div>
        {/*房源列表的模板*/}
        {this.renderAreaList()}
      </div>
    )
  }
}

export default MapUse
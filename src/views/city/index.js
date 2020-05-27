/*
城市选择列表
*/
import React from 'react'
import { NavBar, Icon } from 'antd-mobile';
import request from '../../utils/request'
// 导入长列表缓存组件和样式
import { AutoSizer, List } from 'react-virtualized'
import 'react-virtualized/styles.css'
import './index.scss'

class City extends React.Component {

  state = {
    cityData: {}
  }

  loadCitys = async () => {
    // 获取城市列表的原始数据
    const res = await request({ url: 'area/city', params: { level: 1 } })
    // 把原始城市列表数据进行分组
    if (res.status == 200) {
      console.log(res.body)
      const cityData = this.formatCityList(res.body)

      // 获取热门城市数据
      const hotCity = await request({ url: 'area/hot' })
      if (hotCity.status == 200) {
        cityData.cityObj['hot'] = hotCity.body
        cityData.cityIndex.unshift('hot')
      }

      // 当前城市数据处理（当前城市信息应该通过地理定位获取）
      cityData.cityObj['#'] = [{ label: '北京' }]
      cityData.cityIndex.unshift('#')

      // 把分好组的城市列表数据更新到状态
      this.setState({
        cityData: cityData
      })
    }
    console.log(this.state.cityData)

  }

  formatCityList = (cityList) => {
    // 把原始的城市列表数据进行分组
    /*
      let cityObj = {
        'a':[{label:'安庆',short:'aq'},.....],
        'b':[{label:'北京',short:'bj'},{label:'宝鸡',short:'bj'},...],
        'c':[{label:'长沙',short:'cs'},....]
      }
    */
    let cityObj = {}
    cityList.forEach(item => {
      // 判断cityObj中是否已经包含特定字符，
      // 如果不包含，添加一个新的字符并且初始化一个数组
      // 如果包含，项目对应数组中添加一项数据
      // 1、获取城市的首字符
      let firstLetter = item.short.substr(0, 1)
      // 2、判断对象中是否包含指定的属性
      if (cityObj.hasOwnProperty(firstLetter)) {
        // 已经存在该属性
        cityObj[firstLetter].push(item)
      } else {
        // 不存在该属性，向对象中添加一个属性
        cityObj[firstLetter] = [item]
      }
    })
    // 获取对象所有的key并且进行排序
    let letters = Object.keys(cityObj).sort()
    return {
      cityObj: cityObj,
      cityIndex: letters
    }
  }

  // renderCityList = () => {
  //   // 展示城市列表
  //   const { cityObj, cityIndex } = this.state.cityData
  //   // 遍历对象
  //   let tags = []
  //   // 由于数据是异步更新的，所有必须进行存在性判断
  //   cityIndex && cityIndex.forEach((letter, index) => {
  //     // 把分组的字符添加到数组
  //     tags.push(<div key={index}>{letter}</div>)
  //     let cityList = cityObj[letter]
  //     cityList.forEach((city, i) => {
  //       // 把分组下的每一个城市名称添加到数组
  //       tags.push(<div key={index + '-' + i}>{city.label}</div>)
  //     })
  //   })
  //   return (
  //     <div>
  //       {tags}
  //     </div>
  //   )
  // }

  calcRowHeight = ({ index }) => {
    // 动态计算每一行列表的高度
    const { cityObj, cityIndex } = this.state.cityData
    // 获取当前标题字符
    const letter = cityIndex[index]
    // 获取当前行列表数据
    const list = cityObj[letter]
    // 计算公式：标题的高度 + 每一个城市的高度 * 当前行城市的数量
    return 36 + 50 * list.length
  }

  rowRenderer = ({ key, style, index }) => {
    // 负责渲染每一行数据
    // key表示每一行信息的唯一标识
    // style表示每一行模板的样式
    // index表示每一条数据的索引
    const { cityObj, cityIndex } = this.state.cityData
    // 获取每一行标题的字符
    const letter = cityIndex[index]
    // 获取城市列表数据
    const list = cityObj[letter]
    // 动态生成城市列表
    const cityTags = list.map((item, index) => (
      <div className="name" key={item.value + index}>{item.label}</div>
    ))
    return (
      <div key={key} style={style} className="city">
        <div className="title">{letter}</div>
        {cityTags}
      </div>
    )
  }

  renderCityList = () => {
    return (
      <AutoSizer>
        {({ height, width }) => {
          // AutoSizer用于获取Lint组件父容器的宽度和高度
          // 判断状态数据是否存在,只有数据存在了，才可以计算行高
          const { cityIndex } = this.state.cityData
          return cityIndex && <List
            width={width}
            height={document.documentElement.clientHeight - 45}
            rowCount={cityIndex.length}
            rowHeight={this.calcRowHeight}
            rowRenderer={this.rowRenderer}
          />
        }}
      </AutoSizer>
    )
  }

  componentDidMount() {
    this.loadCitys()
    // 获取屏幕的宽度和高度
    // let x = document.documentElement.clientWidth
    // let y = document.documentElement.clientHeight
    // console.log(x, y)
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        {/* 顶部导航 */}
        <NavBar
          mode="light"
          icon={<Icon type='left' />}
          onLeftClick={() => {
            // 左侧点击事件
            // 跳回到主页面
            // this.props.history.push('/home')
            // this.props.history.goBack()
            this.props.history.go(-1)
          }}
        >城市选择</NavBar>
        {/* 城市选择列表 */}
        {this.renderCityList()}
      </div>
    )
  }
}

export default City
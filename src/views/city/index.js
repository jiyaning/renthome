/*
城市选择列表
*/
import React from 'react'
import { NavBar, Icon, Toast } from 'antd-mobile';
import request from '../../utils/request'
import { getCurrentCity } from '../../utils/config'
// 导入长列表缓存组件和样式
import { AutoSizer, List } from 'react-virtualized'
import 'react-virtualized/styles.css'
import './index.scss'

class City extends React.Component {

  state = {
    cityData: {},
    currentIndex: 0
  }

  // 创建一个List组件的引用
  listRef = React.createRef()

  loadCitys = async () => {
    // 数据开始加载时进行提示
    Toast.loading('正在加载...', 0)
    // 判断本地缓存是否有城市列表数据
    const cityList = window.localStorage.getItem('city_List')
    if (cityList == null) {
      // 获取城市列表的原始数据
      const res = await request({ url: 'area/city', params: { level: 1 } })
      // 把原始城市列表数据进行分组
      if (res.status === 200) {
        console.log(res.body)
        const cityData = this.formatCityList(res.body)

        // 获取热门城市数据
        const hotCity = await request({ url: 'area/hot' })
        if (hotCity.status === 200) {
          cityData.cityObj['hot'] = hotCity.body
          cityData.cityIndex.unshift('hot')
        }

        // 当前城市数据处理（当前城市信息通过地理定位获取）
        // 基于浏览器定位，优先调用浏览器H5定位接口，如果失败会调用IP定位

        const city = await getCurrentCity()
        cityData.cityObj['#'] = [city]
        cityData.cityIndex.unshift('#')
        // 把分好组的城市列表数据更新到状态
        this.setState({
          cityData: cityData
        }, () => {
          // 获取完数据提前计算List索引行的高度，保证可以进准控制滚动位置
          this.listRef.current.measureAllRows()
          // 隐藏提示
          Toast.hide()
          window.localStorage.setItem('city_List', JSON.stringify(this.state.cityData))
          setTimeout(() => {
            window.localStorage.removeItem('city_List')
            console.log("缓存城市列表已清除")
          }, 1000 * 60 * 60)
        })
      }
    } else {
      this.setState({
        cityData: JSON.parse(cityList)
      })
      Toast.hide()
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
      <div
        className="name"
        key={item.value + index}
        onClick={() => {
          // 仅仅允许选择一线城市
          let firstCity = cityObj['hot']
          let flag = firstCity.some(city => {
            return item.label === city.label
          })
          if (flag) {
            window.localStorage.setItem('current_city', JSON.stringify(item))
            this.props.history.push('/home/index')
          } else {
            Toast.info('只允许选择一线热门城市', 1)
          }
        }}
      >{item.label}</div>
    ))
    return (
      <div key={key} style={style} className="city">
        <div className="title">{letter}</div>
        {cityTags}
      </div>
    )
  }

  onRowsRendered = ({ startIndex }) => {
    if (this.state.currentIndex !== startIndex) {
      console.log(startIndex)
      this.setState({
        currentIndex: startIndex
      })
    }
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
            height={height - 45}
            ref={this.listRef}
            scrollToAlignment="start"
            onRowsRendered={this.onRowsRendered}
            rowCount={cityIndex.length}
            rowHeight={this.calcRowHeight}
            rowRenderer={this.rowRenderer}
          />
        }}
      </AutoSizer>
    )
  }

  renderRightIndex = () => {
    // 渲染右侧索引
    const { cityIndex } = this.state.cityData
    const { currentIndex } = this.state
    const indexTags = cityIndex && cityIndex.map((item, index) => (
      <li
        onClick={() => {
          // 控制点击索引时精准定位,通过定时任务让更新动作最后触发
          setTimeout(()=>{
            this.setState({
              currentIndex: index
            })
          },0)
          // 点击右侧索引控制左侧列表的滚动
          // current表示List组件的实例对象
          this.listRef.current.scrollToRow(index)
        }}
        key={index}
        className="city-index-item">
        <span className={currentIndex === index ? 'index-active' : ''}>
          {item === 'hot' ? '热' : item.toUpperCase()}
        </span>
      </li>
    ))
    return (
      <ul className='city-index'>
        {indexTags}
      </ul>
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
        {/* 右侧字符索引 */}
        {this.renderRightIndex()}
      </div>
    )
  }
}

export default City
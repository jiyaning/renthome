// 通用配置

import request from '../utils/request'

// 后台图片的基准地址
export const BASE_IMG_URL = 'http://localhost:8080'

export const getCurrentCity = () => {
  return new Promise((resolve, reject) => {
    // 处理异步任务
    // 先判断缓存中是否已经存在了定位信息，如果已经存在直接获取即可，否则通过定位获取信息
    const city = window.localStorage.getItem('current_city')
    if (city) {
      // 获取缓存数据,并终止后续代码执行
      return resolve(JSON.parse(city))
    }
    const geolocation = new window.BMap.Geolocation();
    geolocation.getCurrentPosition(async function (result) {
      if (this.getStatus() === window.BMAP_STATUS_SUCCESS) {
        // 定位成功
        console.log(result)
        // 根据城市名称获取城市详细信息
        const res = await request({ url: 'area/info', params: { name: result.address.city.substr(0, 2) } })
        if (res.status === 200) {
          // 把定位得到的数据进行缓存
          window.localStorage.setItem('current_city', JSON.stringify(res.body))
          // 返回定位的数据
          resolve(res.body)
        }
      }
      else {
        reject('定位失败')
      }
    });
  })
}
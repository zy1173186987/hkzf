import React, { Component } from 'react'

import { NavBar } from 'antd-mobile'

import axios from 'axios'

import './index.css'

import { getCurrentCity } from '../utils/index'

// 数据格式化的方法
const formatCityData = (list) => {
    const cityList = {}
    // const cityIndex = []

    list.forEach(item => {
        const first = item.short.substr(0, 1)
        if (cityList[first]) {
            cityList[first].push(item)
        } else {
            cityList[first] = [item]
        }
    })

    // 获取索引数据
    const cityIndex = Object.keys(cityList).sort()

    return {
        cityList,
        cityIndex
    }
}

export default class CityList extends Component {
    componentDidMount() {
        this.getCityList()
    }

    // 获取城市列表数据
    async getCityList() {
        const res = await axios.get(`http://localhost:8080/area/city?level=1`)
        // console.log(res)
        const { cityList, cityIndex } = formatCityData(res.data.body)

        const hotRes = await axios.get(`http://localhost:8080/area/hot`)
        // 将热门城市数据添加到 cityList 中
        cityList['hot'] = hotRes.data.body
        // 将热门城市索引添加到 cityIndex 中
        cityIndex.unshift('hot')

        // 获取当前定位城市
        const curCity = await getCurrentCity()
        
        console.log(cityList, cityIndex, curCity)
    }

    render() {
        return (
            <div className="citylist">
                {/* 顶部导航栏 */}
                <NavBar
                    className="navbar"
                    mode="light"
                    icon={<i className="iconfont icon-back" />}
                    onLeftClick={() => this.props.history.go(-1)}
                >城市选择</NavBar>
            </div>
        )
    }
}

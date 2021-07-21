import React, { Component } from 'react'

import { NavBar } from 'antd-mobile'

import axios from 'axios'

import { List, AutoSizer } from 'react-virtualized'

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

// const list = Array(100).fill('react-virtualized')

// 索引的高度
const TITLE_HEIGHT = 36
// 每个城市名称的高度
const NAME_HEIGHT = 50

const formatCityIndex = (letter) => {
    switch (letter) {
        case '#':
            return '当前定位'
        case 'hot':
            return '热门城市'
        default:
            return letter.toUpperCase()
    }
}

export default class CityList extends Component {
    state = {
        cityList: {},
        cityIndex: []
    }
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

        // 1.将当前定位城市添加到 cityList 中
        // 2.将当前定位城市的索引添加到 cityIndex 中
        cityList['#'] = [curCity]
        cityIndex.unshift('#')
        
        // console.log(cityList, cityIndex, curCity)
        this.setState({
            cityList,
            cityIndex
        })
    }
  
    rowRenderer = ({
        key,
        index, // 索引项
        isScrolling,
        isVisible,
        style
    }) => {
        // 获取每一行的字母索引
        const { cityIndex, cityList } = this.state
        const letter = cityIndex[index]
        // 获取指定字符索引下的城市列表数据
        // cityList[letter]

        return (
            <div
                key={key}
                style={style}
                className="city"
            >
                <div className="title">{formatCityIndex(letter)}</div>
                {
                    cityList[letter].map(item => <div className="name" key={item.value}>
                        {item.label}
                    </div>)
                }
            </div>
        )
    }

    getRowHeight = ({ index }) => {
        const { cityList, cityIndex } = this.state
        return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
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

                {/* 城市列表 */}
                <AutoSizer>
                    {
                        ({ width, height }) => (
                            <List
                                width={width}
                                height={height}
                                rowCount={this.state.cityIndex.length}
                                rowHeight={this.getRowHeight}
                                rowRenderer={this.rowRenderer}
                            />
                        )
                    }
                </AutoSizer>
            </div>
        )
    }
}

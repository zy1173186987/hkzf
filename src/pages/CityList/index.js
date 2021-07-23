import React, { Component } from 'react'

import { Toast } from 'antd-mobile'

import axios from 'axios'

import { List, AutoSizer } from 'react-virtualized'

import './index.css'

import NavHeader from '../../components/NavHeader'

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

// 有房源的城市
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

export default class CityList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cityList: {},
            cityIndex: [],
            // 高亮
            activeIndex: 0
        }

        // 创建ref对象
        this.cityListComponent = React.createRef()
    }
    
    async componentDidMount() {
        await this.getCityList()
        // 调用measureAllRows，提前计算list中的每一行高度，实现索引的精确跳转
        this.cityListComponent.current.measureAllRows()
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

    changeCity({ label, value}) {
        if (HOUSE_CITY.indexOf(label) > -1) {
            localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
            this.props.history.go(-1)
        } else {
            Toast.info('该城市暂无房源数据', 1)
        }
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
            <div key={key} style={style} className="city">
                <div className="title">{formatCityIndex(letter)}</div>
                {cityList[letter].map(item => (
                    <div className="name" key={item.value} onClick={() => this.changeCity(item)}>
                        {item.label}
                    </div>)
                )}
            </div>
        )
    }

    getRowHeight = ({ index }) => {
        const { cityList, cityIndex } = this.state
        return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    }

    // 封装渲染右侧索引列表的方法
    renderCityIndex() {
        const { cityIndex, activeIndex } = this.state
        // 获取到 cityIndex,并遍历实现渲染
        return cityIndex.map((item, index) => (
            <li className="city-index-item" key={item} onClick={() => {
                this.cityListComponent.current.scrollToRow(index)
             }}>
                <span
                    className={activeIndex === index ? 'index-active' : ''}>
                    {item === 'hot' ? '热' : item.toUpperCase()}
                </span>
            </li>
        ))
    }

    onRowsRendered = ({ startIndex }) => {
        if (this.state.activeIndex !== startIndex) {
            this.setState({
                activeIndex: startIndex
            })
        }
    }

    render() {
        return (
            <div className="citylist">
                {/* 顶部导航栏 */}
                {/* <NavBar
                    className="navbar"
                    mode="light"
                    icon={<i className="iconfont icon-back" />}
                    onLeftClick={() => this.props.history.go(-1)}
                >城市选择</NavBar> */}
                <NavHeader>
                    城市选择 
                </NavHeader>

                {/* 城市列表 */}
                <AutoSizer>
                    {
                        ({ width, height }) => (
                            <List
                                ref={this.cityListComponent}
                                width={width}
                                height={height}
                                rowCount={this.state.cityIndex.length}
                                rowHeight={this.getRowHeight}
                                rowRenderer={this.rowRenderer}
                                onRowsRendered={this.onRowsRendered}
                                scrollToAlignment="start"
                            />
                        )
                    }
                </AutoSizer>

                {/* 右侧索引列表 */}
                <ul className="city-index">
                    {this.renderCityIndex()}
                </ul>
            </div>
        )
    }
}

import React, { Component } from 'react'

import './index.css'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

import axios from 'axios'
import { Link } from 'react-router-dom'

const BMap = window.BMapGL

const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontsize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
}

export default class Map extends Component {
    state = {
        // 小区下的房源列表
        houseList: [],
        // 是否展示房源列表
        isShowList: false
    }
    componentDidMount() {
        this.initMap()
    }

    // 初始化地图
    initMap() {
        // 获取当前定位城市
        const { label, value} = JSON.parse(localStorage.getItem('hkzf_city'))
        // 初始化地图实例
        const map = new BMap.Map('container')
        // 能够在其他方法中通过 this 来获取到地图对象
        this.map = map
        // 设置中心点坐标
        // const point = new window.BMapGL.Point(116.404, 39.91)
        
        // 创建地址解析器实例
        const myGeo = new BMap.Geocoder();
        myGeo.getPoint(label, async (point) => {
            if (point) {
                // 初始化地图 
                map.centerAndZoom(point, 11);
                // map.addOverlay(new BMap.Marker(point));

                // 添加常用组件
                map.addControl(new BMap.ScaleControl())
                map.addControl(new BMap.ZoomControl())

                // 调用 renderOverlays 方法
                this.renderOverlays(value)

                // const res = await axios.get(
                //     `http://localhost:8080/area/map?id=${value}`
                // )
                // // console.log(res)
                // res.data.body.forEach(item => {
                //     // 为每一条数据创建覆盖物
                //     const { coord: { longitude, latitude }, label: areaName, count, value } = item
                //     // 创建覆盖物
                //     const areaPoint = new BMap.Point(longitude, latitude)
                //     // 设置 setContent 后，第一个参数中设置的文本内容就失效了，因此可以填''
                //     const label = new BMap.Label('', {
                //         position: areaPoint ,
                //         offset: new BMap.Size(-35, -35)
                //     })

                //     // 给 label 对象添加一个唯一标识
                //     label.id = value

                //     // 设置房源覆盖物内容
                //     label.setContent(`
                //         <div class="${styles.bubble}">
                //             <p class="${styles.name}">${areaName}</p>
                //             <p>${count}套</p>
                //         </div>
                //     `)
                    
                //     // 设置样式
                //     label.setStyle(labelStyle)

                //     // 添加单击事件
                //     label.addEventListener('click', () => {
                //         console.log('click', label.id)

                //         // 放大地图，以当前点击的覆盖物为中心放大地图
                //         // 第一个参数是 坐标对象
                //         // 第二个参数是 放大级别
                //         map.centerAndZoom(areaPoint, 13)

                //         // 解决清除覆盖物时，百度地图API的JS文件自身报错
                //         setTimeout(() => {
                //             // 清除当前覆盖物信息
                //             map.clearOverlays()
                //         }, 0)
                //     })

                //     // 添加覆盖物到地图中
                //     map.addOverlay(label)
                // }) 
            }
        }, label)
        // 初始化地图 
        // map.centerAndZoom(point, 15)
    }

    // 渲染覆盖物入口
    // 1 接收区域 id 参数,获取该区域下的房源数据
    // 2 获取房源数据类型以及下级地图缩放级别
    async renderOverlays(id) {
        const res = await axios.get(`http://localhost:8080/area/map?id=${id}`)
        // console.log(res)
        const data = res.data.body

        // 调用 getTypeAndZoom 方法获取级别和类型
        const { nextZoom, type} = this.getTypeAndZoom()

        // 遍历数据
        data.forEach(item => {
            // 创建覆盖物
            this.createOverlays(item, nextZoom, type)
        })
    }

    // 计算要绘制的覆盖物类型和下一个缩放级别
    // 区 > 镇 > 小区
    getTypeAndZoom() {
        // 调用地图的 getZoom() 方法，获取当前缩放级别
        const zoom = this.map.getZoom()
        let nextZoom, type
        // console.log(zoom)
        if (zoom >= 10 && zoom < 12) {
            // 区
            // 下一个缩放级别
            nextZoom = 13
            type = 'circle'
        } else if (zoom >= 12 && zoom <14){
            // 镇
            nextZoom = 15
            type = 'circle'
        } else if (zoom >= 14 && zoom <16) {
            // 小区
            type = 'rect'
        } return {
            nextZoom,
            type
        }
    }

    // 创建覆盖物
    createOverlays(data, zoom, type) {
        const {
            coord: { longitude, latitude },
            label: areaName,
            count,
            value
        } = data

        // 创建坐标对象
        const areaPoint = new BMap.Point(longitude, latitude)

        if (type === 'circle') {
            // 此时为区和镇
            this.createCircle(areaPoint, areaName, count, zoom, value)
        } else {
            // 小区
            this.createRect(areaPoint, areaName, count, value)
        }
    }

    // 区镇
    createCircle(point, name, count, zoom, id) {
        // 创建覆盖物
        const label = new BMap.Label('', {
            position: point ,
            offset: new BMap.Size(-35, -35)
        })

        // 给 label 对象添加一个唯一标识
        label.id = id

        // 设置房源覆盖物内容
        label.setContent(`
            <div class="${styles.bubble}">
                <p class="${styles.name}">${name}</p>
                <p>${count}套</p>
            </div>
        `)
                    
        // 设置样式
        label.setStyle(labelStyle)

        // 添加单击事件
        label.addEventListener('click', () => {
            // 调用 renderOverlays 方法，获取该区域下的房源数据
            this.renderOverlays(id)

            // 放大地图，以当前点击的覆盖物为中心放大地图
            this.map.centerAndZoom(point, zoom)

            // 解决清除覆盖物时，百度地图API的JS文件自身报错
            setTimeout(() => {
                // 清除当前覆盖物信息
                this.map.clearOverlays()
                }, 0)
            })

        // 添加覆盖物到地图中
        this.map.addOverlay(label)
    }
    
    
    // 小区
    createRect(point, name, count, id) {
        // 创建覆盖物
        const label = new BMap.Label('', {
            position: point ,
            offset: new BMap.Size(-50, -28)
        })
        
        // 给 label 对象添加一个唯一标识
        label.id = id
        
        // 设置房源覆盖物内容
        label.setContent(`
            <div class="${styles.rect}">
                <span class="${styles.housename}">${name}</span>
                <span class="${styles.housenum}">${count}套</span>
                <i class="${styles.arrow}"></i>
            </div>
        `)
                            
        // 设置样式
        label.setStyle(labelStyle)
        
        // 添加单击事件
        label.addEventListener('click', () => {
            // console.log('bei dian ji')

            this.getHouseList(id)
        })
        
        // 添加覆盖物到地图中
        this.map.addOverlay(label)
    }

    // 获取小区房源数据
    async getHouseList(id) {
        const res =  await axios.get(`http://localhost:8080/houses?cityId=${id}`)
        // console.log('小区的房源数据：', res)
        this.setState({
            houseList: res.data.body.list,

            // 展示房源列表
            isShowList: true
        })
    }

    // 封装渲染房屋列表
    renderHouseList() {
        return this.state.houseList.map(item =>
            <div className={styles.house} key={item.houseCode}>
                <div className={styles.imgWrap}>
                    <img
                        className={styles.img}
                        src={`http://localhost:8080${item.houseImg}`}
                        alt=""
                    />
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title}>{item.title}</h3>
                    <div className={styles.desc}>{item.desc}</div>
                    <div>
                        {/* [近地铁], [随时看房] */}
                        {item.tags.map((tag, index) => {
                            const tagClass = 'tag' + (index + 1)
                            return (
                                <span className={[styles.tag, styles[tagClass]].join(' ')} key={tag}>
                                    {tag}
                                </span>
                            )
                        })}
                    </div>
                    <div className={styles.price}>
                        <span className={styles.priceNum}>{item.price}</span> 元/月
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className={styles.map}>
                <NavHeader>
                    地图找房
                </NavHeader>
                <div id="container" className={styles.container}></div>

                {/* 房源数据 */}
                {/* 添加 styles.show 展示房屋列表 */}
                <div className={[
                    styles.houseList,
                    this.state.isShowList ? styles.show : ' '
                    ].join(' ')}
                >
                    <div className={styles.titleWrap}>
                        <h1 className={styles.listTitle}>房屋列表</h1>
                        <Link className={styles.titleMore} to="/home/list">
                            更多房源
                        </Link>
                    </div>

                    <div className={styles.houseItems}>
                        {/* 房屋结构 */}
                        {this.renderHouseList()}
                    </div>
                </div>
            </div>
        )
    }
}

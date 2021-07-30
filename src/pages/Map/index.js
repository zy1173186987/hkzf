import React, { Component } from 'react'

import './index.css'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

import axios from 'axios'

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
    componentDidMount() {
        this.initMap()
    }

    // 初始化地图
    initMap() {
        // 获取当前定位城市
        const { label, value} = JSON.parse(localStorage.getItem('hkzf_city'))
        // 初始化地图实例
        const map = new BMap.Map('container')
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

                const res = await axios.get(
                    `http://localhost:8080/area/map?id=${value}`
                )
                // console.log(res)
                res.data.body.forEach(item => {
                    // 为每一条数据创建覆盖物
                    const { coord: { longitude, latitude }, label: areaName, count } = item
                    // 创建覆盖物
                    const areaPoint = new BMap.Point(longitude, latitude)
                    // 设置 setContent 后，第一个参数中设置的文本内容就失效了，因此可以填''
                    const label = new BMap.Label('', {
                        position: areaPoint ,
                        offset: new BMap.Size(-35, -35)
                    })

                    // 给 label 对象添加一个唯一标识
                    label.id = value

                    // 设置房源覆盖物内容
                    label.setContent(`
                        <div class="${styles.bubble}">
                            <p class="${styles.name}">${areaName}</p>
                            <p>${count}套</p>
                        </div>
                    `)
                    
                    // 设置样式
                    label.setStyle(labelStyle)

                    // 添加单击事件
                    label.addEventListener('click', () => {
                        console.log('click', label.id)

                        // 放大地图，以当前点击的覆盖物为中心放大地图
                        // 第一个参数是 坐标对象
                        // 第二个参数是 放大级别
                        map.centerAndZoom(areaPoint, 13)

                        // 解决清除覆盖物时，百度地图API的JS文件自身报错
                        setTimeout(() => {
                            // 清除当前覆盖物信息
                            map.clearOverlays()
                        }, 0)
                    })

                    // 添加覆盖物到地图中
                    map.addOverlay(label)
                }) 
            }
        }, label)
        // 初始化地图 
        // map.centerAndZoom(point, 15)
    }

    // 区镇
    createCircle() { }
    
    // 小区
    createRect() { }

    render() {
        return (
            <div className={styles.map}>
                <NavHeader>
                    地图找房
                </NavHeader>
                <div id="container" className={styles.container}></div>
            </div>
        )
    }
}

import React, { Component } from 'react'

import './index.css'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

const BMap = window.BMapGL

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
        myGeo.getPoint(label, (point) => {
            if (point) {
                // 初始化地图 
                map.centerAndZoom(point, 11);
                // map.addOverlay(new BMap.Marker(point));

                // 添加常用组件
                map.addControl(new BMap.ScaleControl())
                map.addControl(new BMap.ZoomControl())
                
                const opts = {
                    position: point
                    // offset: new BMap.Size(-30, 30)
                }
                
                const label = new BMap.Label('文本覆盖物', opts)
                
                label.setStyle({
                    color: 'red'
                })

                // 添加覆盖物到地图中
                map.addOverlay(label)
            }
        }, label)
        // 初始化地图 
        // map.centerAndZoom(point, 15)
    }

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

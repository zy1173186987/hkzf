import React, { Component } from 'react'

import './index.css'

import NavHeader from '../../components/NavHeader'

export default class Map extends Component {
    componentDidMount() {
        const map = new window.BMapGL.Map('container')
        const point = new window.BMapGL.Point(116.404, 39.91)
        map.centerAndZoom(point, 15)
    }
    render() {
        return (
            <div className="map">
                <NavHeader>
                    地图找房
                </NavHeader>
                <div id="container"></div>
            </div>
        )
    }
}

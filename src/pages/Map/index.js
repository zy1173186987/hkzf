import React, { Component } from 'react'

import './index.css'

export default class Map extends Component {
    componentDidMount() {
        const map = new window.BMapGL.Map('container')
        const point = new window.BMapGL.Point(116.404, 39.91)
        map.centerAndZoom(point, 15)
    }
    render() {
        return (
            <div className="map">
                <div id="container"></div>
            </div>
        )
    }
}

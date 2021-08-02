import React, { Component } from 'react'

import SearchHeader from '../../components/SearchHeader'

// 获取当前定位城市信息
localStorage.getItem('hkzf_city')
export default class HouseList extends Component {
    render() {
        return (
            <div>
                <SearchHeader />
            </div>
        )
    }
}

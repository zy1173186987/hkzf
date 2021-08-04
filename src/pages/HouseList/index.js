import React, { Component } from 'react'

import { Flex } from 'antd-mobile'

import SearchHeader from '../../components/SearchHeader'
import Filter from './components/Filter'

import styles from './index.module.css'

// 获取当前定位城市信息
const { label } = JSON.parse(localStorage.getItem('hkzf_city')) 
export default class HouseList extends Component {
    render() {
        return (
            <div className={styles.root}>
                <Flex className={styles.header}>
                    <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)} />
                    <SearchHeader cityName={label} className={styles.searchHeader} />
                </Flex>

                {/* 条件筛选栏 */}
                <Filter />
            </div>
        )
    }
}

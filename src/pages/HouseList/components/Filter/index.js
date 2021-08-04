import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

import { API } from '../../../../utils/api'

const titleSelectedStatus = {
    area: false,
    mode: false,
    price: false,
    more: false
}

export default class Filter extends Component {
    state = {
        titleSelectedStatus,
        // 控制FilterPicker或FilterMore组件的展示或隐藏
        openType: '',
        // 所有筛选条件数据
        filtersData: {}
    }

    componentDidMount() {
        this.getFiltersData()
    }

    // 封装获取所有筛选条件的方法
    async getFiltersData() {
        // 获取当前定位城市id
        const { value } = JSON.parse(localStorage.getItem('hkzf_city')) 
        const res = await API.get(`/houses/condition?id=${value}`)

        console.log(res)
        this.setState({
            filtersData: res.data.body
        })
    }

    
    // 点击标题菜单实现高亮
    // 注意this指向的问题
    onTitleClick = type => {
        this.setState(prevState => {
            return {
                titleSelectedStatus: {
                        ...prevState.titleSelectedStatus,
                    [type]: true
                },
                // 展示对话框
                openType: type
            }
        })
    }

    // 取消隐藏对话框
    onCancel = () => {
        this.setState({
            openType: false
        })
    }

    // 确定
    onSave = () => {
        this.setState({
            openType: false
        })
    }

    // 渲染FilterPicker组件的方法
    renderFilterPicker() {
        const { openType } = this.state

        if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
            return null
        } 
        return <FilterPicker onCancel={this.onCancel} onSave={this.onSave} />
    }

    render() {
        const { titleSelectedStatus, openType } = this.state

        return (
            <div className={styles.root}>
                {
                    (openType === 'area' || openType === 'mode' || openType === 'price')
                        ? <div className={styles.mask} onClick={this.onCancel} />
                        : null
                }

                <div className={styles.content}>
                    {/* 标题栏 */}
                    <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick} />

                    {
                        this.renderFilterPicker()
                    }

                    {/* <FilterMore /> */}
                </div>
            </div>
        )
    }
}
 
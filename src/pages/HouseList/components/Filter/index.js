import React, { Component } from 'react'

import { Spring } from 'react-spring'

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

const selectedValues = {
    area: ['area', 'null'],
    mode: ['null'],
    price: ['null'],
    more: []
}
export default class Filter extends Component {
    state = {
        titleSelectedStatus,
        // 控制FilterPicker或FilterMore组件的展示或隐藏
        openType: '',
        // 所有筛选条件数据
        filtersData: {},
        // 筛选条件选中值
        selectedValues,
    }

    componentDidMount() {
        this.getFiltersData()
    }

    // 封装获取所有筛选条件的方法
    async getFiltersData() {
        // 获取当前定位城市id
        const { value } = JSON.parse(localStorage.getItem('hkzf_city')) 
        const res = await API.get(`/houses/condition?id=${value}`)

        this.setState({
            filtersData: res.data.body
        })
    }

    
    // 点击标题菜单实现高亮
    // 注意this指向的问题
    onTitleClick = type => {
        const { selectedValues, titleSelectedStatus } = this.state
        // 创建新的标题选中状态对象
        const newTitleSelectedStatus = { ...titleSelectedStatus }
        
        // 遍历标题选中状态对象
        Object.keys(titleSelectedStatus).forEach(key => {
            if (key === type) {
                newTitleSelectedStatus[type] = true
                return
            }

            const selectedVal = selectedValues[key]
            if (key === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
                // 高亮
                newTitleSelectedStatus[key] = true
            } else if (key === 'mode' && selectedVal[0] !== 'null') {
                // 高亮
                newTitleSelectedStatus[key] = true
            } else if (key === 'price' && selectedVal[0] !== 'null') {
                // 高亮
                newTitleSelectedStatus[key] = true
            } else if (key === 'more' && selectedVal.length !== 0) {
                // 更多选择项FilterMore
                newTitleSelectedStatus[key] = true
            } else {
                newTitleSelectedStatus[key] = false
            }
        })

        this.setState({
            openType: type,
            titleSelectedStatus: newTitleSelectedStatus
        })

        // this.setState(prevState => {
        //     return {
        //         titleSelectedStatus: {
        //                 ...prevState.titleSelectedStatus,
        //             [type]: true
        //         },
        //         // 展示对话框
        //         openType: type,
        //         titleSelectedStatus: newTitleSelectedStatus
        //     }
        // })
    }

    // 取消隐藏对话框
    onCancel = (type) => {
        const { titleSelectedStatus, selectedValues } = this.state
        // 创建新的标题选中状态对象
        const newTitleSelectedStatus = { ...titleSelectedStatus }
        // 菜单高亮逻辑处理
        const selectedVal = selectedValues[type]
        if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
            // 高亮
            newTitleSelectedStatus[type] = true
        } else if (type === 'mode' && selectedVal[0] !== 'null') {
            // 高亮
            newTitleSelectedStatus[type] = true
        } else if (type === 'price' && selectedVal[0] !== 'null') {
            // 高亮
            newTitleSelectedStatus[type] = true
        } else if (type === 'more' && selectedVal.length !== 0) {
            // 更多选择项FilterMore
            newTitleSelectedStatus[type] = true
        } else {
            newTitleSelectedStatus[type] = false
        }
     
        this.setState({
            openType: '',

            titleSelectedStatus: newTitleSelectedStatus
        })
    }

    // 确定
    onSave = (type, value) => {
        console.log(type, value)
        const { titleSelectedStatus } = this.state
        // 创建新的标题选中状态对象
        const newTitleSelectedStatus = { ...titleSelectedStatus }
        // 菜单高亮逻辑处理
        const selectedVal = value
        if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
            // 高亮
            newTitleSelectedStatus[type] = true
        } else if (type === 'mode' && selectedVal[0] !== 'null') {
            // 高亮
            newTitleSelectedStatus[type] = true
        } else if (type === 'price' && selectedVal[0] !== 'null') {
            // 高亮
            newTitleSelectedStatus[type] = true
        } else if (type === 'more' && selectedVal.length !== 0) {
            // 更多选择项FilterMore
            newTitleSelectedStatus[type] = true
        } else {
            newTitleSelectedStatus[type] = false
        }

        // 隐藏对话框
        this.setState({
            openType: '',

            // 更新菜单高亮状态数据
            titleSelectedStatus: newTitleSelectedStatus,

            selectedValues: {
                ...this.state.selectedValues,
                // 更新当前 type 对应的选中值
                [type]: value
            }
        })
    }

    // 渲染FilterPicker组件的方法
    renderFilterPicker() {
        const {
            openType,
            filtersData: { area, subway, rentType, price },
            selectedValues
        } = this.state

        if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
            return null
        }

        // 根据 openType 来拿到当前筛选条件数据
        let data = []
        let cols = 3
        let defaultValue = selectedValues[openType]
        switch (openType) {
            case 'area':
                // 获取到区域数据
                data = [area, subway]
                cols = 3
                break;
            
            case 'mode':
                data = rentType
                cols = 1
                break;
            
            case 'price':
                data = price
                cols = 1
                break;
        
            default:
                break;
        }

        return <FilterPicker
            key={openType}
            onCancel={this.onCancel}
            onSave={this.onSave}
            data={data}
            cols={cols}
            type={openType}
            defaultValue={defaultValue}
        />
    }

    renderFilterMore() {
        const {
            openType,
            selectedValues,
            filtersData: { roomType, oriented, floor, characteristic }
        } =this.state
        if (openType !== 'more') {
            return null
        }

        const data = {
            roomType, oriented, floor, characteristic
        }

        const defaultValue = selectedValues.more

        return (
            <FilterMore
                data={data}
                type={openType}
                onSave={this.onSave}
                onCancel={this.onCancel}
                defaultValue={defaultValue}
            />
        )
    }

    // 渲染遮罩层 div
    renderMask() {
        const { openType } = this.state
        if (openType === 'area' || openType === 'mode' || openType === 'price') {
            <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
                {props => {
                    return (
                        <div
                        style={props}
                        className={styles.mask}
                        onClick={() => { this.onCancel(openType) }}
                        />
                    )}
                }
            </Spring>
        } else {
            return null
        }
            
    }

    render() {
        const { titleSelectedStatus } = this.state

        return (
            <div className={styles.root}>
                {this.renderMask()}

                <div className={styles.content}>
                    {/* 标题栏 */}
                    <FilterTitle
                        titleSelectedStatus={titleSelectedStatus}
                        onClick={this.onTitleClick} />

                    {
                        this.renderFilterPicker()
                    }

                    {this.renderFilterMore()}
                </div>
            </div>
        )
    }
}
 
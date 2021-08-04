import React from 'react'

import { Flex } from 'antd-mobile'

import { withRouter } from 'react-router-dom'

import PropTypes from 'prop-types'

import './index.css'

function SearchHeader({ cityName, history, className }){
    return (
        <div>
            {/* 搜索框 */}
            <Flex className={["search-box", className || ''].join(' ')}>
                {/* 左侧白色区域 */}
                <Flex className="search">
                    {/* 位置 */}
                    <div className="location" onClick={() => history.push('/cityList')}>
                        <span className="name">{cityName}</span>
                        <i className="iconfont icon-arrow" />
                    </div>
                    {/* 搜索表单 */}
                    <div className="form" onClick={() => history.push('/search')}>
                        <i className="iconfont icon-seach" />
                        <span className="text">请输入小区或地址</span>
                    </div>
                </Flex>
                {/* 右侧地图区域 */}
                <i className="iconfont icon-map" onClick={() => history.push('/map')}/>
            </Flex>
        </div>
    )
}

// 添加属性校验
SearchHeader.propTypes = {
    cityName: PropTypes.string.isRequired,
    className: PropTypes.string
}

export default withRouter(SearchHeader)

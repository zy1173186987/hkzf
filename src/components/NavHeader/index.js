import React from 'react'

import { NavBar } from 'antd-mobile'

import PropTypes from 'prop-types'

import './index.css'
import { withRouter } from 'react-router-dom'

import styles from './index.module.css'

function NavHeader({ children, history, onLeftClick }) {
    // 默认点击行为
    const defaultHandler= () => history.go(-1)
    return (
        <NavBar
            className={styles.navBar}
            mode="light"
            icon={<i className="iconfont icon-back" />}
            onLeftClick={onLeftClick || defaultHandler}
        >
            {children}
        </NavBar>
    )
}

// 添加props校验
NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onLeftClick: PropTypes.func
}

export default withRouter(NavHeader) 
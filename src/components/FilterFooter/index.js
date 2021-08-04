import React from 'react';

import { Flex } from 'antd-mobile';
import PropsTypes from 'prop-types';

import styles from './index.module.css'

function FilterFooter({
    cancelText = '取消',
    okText = '确定',
    onCancel,
    onOk,
    className
}) {
    return (
        <Flex className={[styles.root, className || ''].join(' ')}>
            {/* 取消按钮 */}
            <span
                className={[styles.btn, styles.cancel].join(' ')}
                onClick={onCancel}
            >
                {cancelText}
            </span>

            {/* 确认按钮 */}
            <span className={[styles.btn, styles.ok].join(' ')} onClick={onOk}>
                {okText}
            </span>
        </Flex>
    )
}

// props校验
FilterFooter.propTypes = {
    cancelText: PropsTypes.string,
    okText: PropsTypes.string,
    oncancel: PropsTypes.func,
    onOk: PropsTypes.func,
    className: PropsTypes.string
}

export default FilterFooter
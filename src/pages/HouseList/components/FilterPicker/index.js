import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'
export default class FilterPicker extends Component {
  state = {
    value: this.props.defaultValue
  }
  // constructor(props) {
  //   super(props)
  //   console.log('创建了')
  //   this.state = {
  //     value: this.props.defaultValue
  //   }
  // }

  render() {
    const { onCancel, onSave, data, cols, type } = this.props
    const { value } = this.state

    return (
      <>
        {/* 选择器组件： */}
        <PickerView
          data={data}
          value={value}
          cols={cols}
          onChange={val => {
            this.setState({
              value: val
            })
          }}
        />

        {/* 底部按钮 */}
        <FilterFooter
          onCancel={() => onCancel(type)}
          onOk={() => onSave(type, value)}
        />
      </>
   )
  }
}

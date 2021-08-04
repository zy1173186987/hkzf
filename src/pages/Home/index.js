import React, { Component } from 'react'

//导入路由
import { Route } from 'react-router-dom'

//导入TarBar
import { TabBar }  from 'antd-mobile'

//导入组件自己的样式文件
import './index.css'

//导入News组件
import News from '../News'
import Index from '../Index'
import HouseList from '../HouseList'
import Profile from '../Profile'

//TabBar数据
const tabItems = [
    {
        title: '首页',
        icon: 'icon-ind',
        path: '/home'
    },
    {
        title: '找房',
        icon: 'icon-findHouse',
        path: '/home/list'
    },
    {
        title: '资讯',
        icon: 'icon-infom',
        path: '/home/news'
    },
    {
        title: '我的',
        icon: 'icon-my',
        path: '/home/profile'
    }
]

/*
    问题：点击首页导航菜单，导航到 找房列表 页面时，找房菜单没有高亮

    原因：原来我们实现该功能的时候，只考虑了“点击以及第一次加载 Home 组件的情况，但是没考虑不重新加载 Home 组件时的路由切换”

    解决：在路由切换时也执行菜单高亮的逻辑代码
    1.添加componentDidUpdate钩子函数
    2.在钩子函数中判断路由地址是否切换
    3.在路由地址切换时。让菜单高亮
*/

export default class Home extends Component {
    state = {
        //默认选中的TabBar菜单项
        selectedTab: this.props.location.pathname
        //用于控制TarBar的展示和隐藏，这个值应该是false，也就是不隐藏
        // hidden: false,
        //全屏
        // fullScreen: false,
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            // 此时说明路由发生切换
            this.setState({
                selectedTab: this.props.location.pathname
            })
        }
    }

    //渲染TabBar.Item
    renderTabBarItem() {
        return tabItems.map(item => <TabBar.Item
            title={item.title}
            key={item.title}
            icon={
                <i className={`iconfont ${item.icon}`}/>
            }
            selectedIcon={
                <i className={`iconfont ${item.icon}`} />
            }
            selected={this.state.selectedTab === item.path}
            onPress={() => {
                this.setState({
                    selectedTab: item.path,
                })
                //路由切换
                this.props.history.push(item.path)
            }}
        />)
    }
 
    render() {
        return (
            <div className='home'>        
                {/* 渲染子路由 */}
                <Route path='/home/news' component={News} />
                <Route exact path='/home' component={Index}/>
                <Route path='/home/list' component={HouseList}/>
                <Route path='/home/profile' component={Profile}/>

                
                {/* TarBar */}
                
                    <TabBar
                        tintColor="#21b97a"
                        barTintColor="white"
                        noRenderContent={true}
                    >
                       {this.renderTabBarItem()}
                </TabBar>
            </div>
        )
    }
}

import React, { Component } from 'react'
//导入组件
import { Carousel, Flex, Grid } from 'antd-mobile';

import axios from 'axios';

import Nav1 from '../../assets/images/nav1.jpg'
import Nav2 from '../../assets/images/nav2.jpg'
import Nav3 from '../../assets/images/nav3.jpg'
import Nav4 from '../../assets/images/nav4.jpg'

import './index.css'

const navs = [
  {
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list'
  },
  {
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list'
  },
  {
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/home/map'
  },
  {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/home/profile'
  }
]

const data = Array.from(new Array(4)).map((_val, i) => ({
  icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
  text: `name${i}`,
}));

/*
  轮播图存在的两个问题：
  1.不会自动播放
  2.从其他路由返回的时候，高度不够
  原因：轮播图数据是动态加载的，加载完成前后轮播图数量不一致
  解决：
  1.在state中添加表示轮播图加载完成的数据
  2.在轮播图数据加载完成时，修改该数据状态值为true
  3.只有在轮播图数据加载完成的情况下，才渲染轮播图组件
*/
export default class Index extends Component{
  state = {
    // 轮播图状态数据
    swipers: [],
    isSwiperLoaded: false,
    // 租房小组数据
    groups: []
  }

  // 获取租房小组数据的方法
  async getGroups() {
    const res = await axios.get(`http://localhost:8080/home/groups?area-AREA%7C88cff55c-aaa4-e2e0`) 
    this.setState(() => {
      return {
        groups: res.data.body
      }
    })
  }
  
  // 获取轮播图数据
  async getSwipers() {
    const res = await axios.get(`http://localhost:8080/home/swiper`)
    this.setState(() => {
      return {
        swipers: res.data.body,
        isSwiperLoaded: true
      }
    })
  }

  componentDidMount() {
    this.getSwipers()
    this.getGroups()
  }

  // 渲染轮播图结构
  renderSwipers() {
    return this.state.swipers.map(item => (
      <a
        key={item.id}
        href="http://itcast.cn"
        style={{ display: 'inline-block', width: '100%', height: 212 }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
        />
      </a>
    ))
  }

  // 渲染导航菜单
  renderNavs() {
    return navs.map(item => 
      <Flex.Item key={item.id} onClick={() => 
      this.props.history.push(item.path)} >
       <img src={item.img} alt="" />
       <h2>{item.title}</h2>
      </Flex.Item>
    )
  }

  render() {
    return (
      <div className='index'>
        {/* 轮播图 */}
        <div className="swiper">
          {
            this.state.isSwiperLoaded ? (
            <Carousel autoplay infinite autoplayInterval={2000}>
              {this.renderSwipers()}
            </Carousel>
            ) : (
              ''
            )
          }
        </div>

        {/* 导航菜单 */}
        <Flex className="nav">
            {this.renderNavs()}
        </Flex>

        {/* 租房小组 */}
        <div className="group">
          <h3 className="title">
            租房小组<span className="more">更多</span>
          </h3>
          {/* 宫格组件 */}
          <Grid data={data} columnNum={2} hasLine={false} square={false} renderItem={() => (
            <Flex className="group-item" justify="around">
              <div className="desc">
                <p className="title">家住回龙观</p>
                <span className="info">归属的感觉</span>
              </div>
              <img
                src="http://localhost:3000/static/media/group-1.263b84b0.png"
                alt=""
              />
            </Flex>
            )}
          />
        </div>
      </div>
    );
  }
}
import React, { Component } from 'react'
//导入组件
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';

import axios from 'axios';

import Nav1 from '../../assets/images/nav1.jpg'
import Nav2 from '../../assets/images/nav2.jpg'
import Nav3 from '../../assets/images/nav3.jpg'
import Nav4 from '../../assets/images/nav4.jpg'

import './index.css'

import { getCurrentCity } from '../utils/index'

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
    path: '/map'
  },
  {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/home/profile'
  }
]

// 获取地理位置信息
navigator.geolocation.getCurrentPosition(position => {
  console.log(position)
})

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
    groups: [],
    news: [],
    // 当前城市名称
    curCityName: '上海'
  }

  async getNews() {
    const res = await axios.get(`http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0`)
    this.setState({
      news: res.data.body
    })
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

  async componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getNews()

    // // 通过IP定位获取到当前城市名称
    // const curCity = new window.BMapGL.LocalCity()
    // curCity.get(async res => {
    //   const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
    //   this.setState({
    //     curCityName: result.data.body.label
    //   })
    // })
    const curCity = await getCurrentCity()
    this.setState({
      curCityName: curCity.label
    })
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

  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
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

        {/* 搜索框 */}
        <Flex className="search-box">
          {/* 左侧白色区域 */}
          <Flex className="search">
            {/* 位置 */}
            <div className="lcoation" onClick={() => this.props.history.push('/cityList')}>
              <span className="name">{this.state.curCityName}</span>
              <i className="iconfont icon-arrow" />
            </div>
            {/* 搜索表单 */}
            <div className="form" onClick={() => this.props.history.push('/search')}>
              <i className="iconfont icon-seach" />
              <span className="text">请输入小区或地址</span>
            </div>
          </Flex>
          {/* 右侧地图区域 */}
          <i className="iconfont icon-map" onClick={() => this.props.history.push('/map')}/>
        </Flex>
      </div>


        {/* 导航菜单 */}
        <Flex className="nav">
            {this.renderNavs()}
        </Flex>

        {/* 租房小组 */}
        <div className="group">
          <h3 className="group-title">
            租房小组<span className="more">更多</span>
          </h3>
          {/* 宫格组件 */}
          <Grid
            data={this.state.groups}
            columnNum={2} hasLine={false}
            square={false}
            renderItem={(item) => (
            <Flex className="group-item" justify="around" key={item.id}>
              <div className="desc">
              <p className="title">{item.title}</p>
                <span className="info">{item.desc}</span>
              </div>
              <img
                src={`http://localhost:8080${item.imgSrc}`}
                alt=""
              />
            </Flex>
            )}
          />
        </div>

        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    );
  }
}
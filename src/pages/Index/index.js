import React, { Component } from 'react'
//导入组件
import { Carousel } from 'antd-mobile';

export default class Index extends Component{
    state = {
        data: ['1', '2', '3']
    }
    componentDidMount() {
        // simulate img loading
        setTimeout(() => {
          this.setState({
            data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
          });
        }, 100);
    }
    render() {
        return (
          <div className='index'>
            <Carousel autoplay infinite>
              {this.state.data.map(val => (
                <a
                  key={val}
                  href="http://www.alipay.com"
                  style={{ display: 'inline-block', width: '100%', height: 212 }}
                >
                  <img
                    src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top' }}
                  />
                </a>
              ))}
            </Carousel>
          </div>
        );
      }
}
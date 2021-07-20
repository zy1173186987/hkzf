import React from 'react'

import { BrowserRouter as Router, Route, Redirect} from 'react-router-dom'

//导入首页和城市选择两个组件
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'

function App() {
  return (
    <Router>
      <div className="App">
        {/* 默认路由匹配时，跳转到/home实现路由重定向到首页*/}
        <Route path='/' exact render={() => <Redirect to='/home'/>}></Route>
        
        {/* 配置路由 */}
        <Route path='/home' component={Home} />
        <Route path='/citylist' component={CityList} />
        <Route path='/map' component={Map} />
      </div>
    </Router>
  )
}

export default App;

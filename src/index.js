import React from 'react';
import ReactDOM from 'react-dom';

//导入antd-mobile的样式
import 'antd-mobile/dist/antd-mobile.css'

import 'react-virtualized/styles.css'

//导入字体图标库的样式文件
import './assets/fonts/iconfont.css'

//注意：我们自己写的全局样式需要放在组件库样式的后面导入，这样样式才会生效！
//因为后面的样式会覆盖前面同名的样式
import './index.css';

import App from './App';

ReactDOM.render(
    <App />,
  document.getElementById('root')
);
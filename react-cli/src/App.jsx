import React, { Suspense, lazy } from "react";
import { Link, Route, Routes } from 'react-router-dom'
import About from './pages/About'
// 魔法命名
/*webpackChunkName:true*/
const Home = lazy(() => import(/*webpackChunkName:'home'*/'./pages/Home')) // 路由懒加载
function App() {
    return <div>
        <h1>App</h1>
        <ul>
            <li><Link to="/about">about</Link></li>
            <li><Link to="/home">home</Link></li>
        </ul>
        <Suspense fallback={<div>...Loading</div>}>
            {/* 路由懒加载必须包裹在Suspense中，加载未完成展示fallback={<div>...Loading</div>} */}
            <Routes>
                <Route path="/about" element={<About />}></Route>
                <Route path="/home" element={<Home />}></Route>
            </Routes>
        </Suspense>

    </div>
}
export default App;
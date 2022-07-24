import "core-js";
import count from './js/count'
// import sum from './js/sum'
import './css/index.css'
import './less/index.less'
import './stylus/index.styl'
import Cookies from 'js-cookie'
console.log(count(3, 4))
// console.log(sum(1,2,3,4))
// let name = '123'
if (Cookies.get('name')) {
    require('./sass/test1.sass')
} else {
    require('./sass/test2.scss')
}

document.getElementById("btn").onClick = function () {
    // eslint会对动态导入语法报错，需要修改eslint配置文件
    // webpackChunkName: "math"：这是webpack动态导入模块命名的方式
    // "math"将来就会作为[name]的值显示。
    import(/* webpackChunkName: "math" */ "./js/sum.js").then(({ sum }) => {
        console.log(sum(2, 1));
    });
};
// 添加promise代码
const promise = Promise.resolve();
promise.then(() => {
    console.log("hello promise");
});
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then((registration) => {
                console.log("SW registered: ", registration);
            })
            .catch((registrationError) => {
                console.log("SW registration failed: ", registrationError);
            });
    });
}
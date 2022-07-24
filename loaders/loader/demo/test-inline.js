// module.exports = function (content, map, meta) {
//     return content;
//   };
module.exports = function (content, map, meta) {
    // 传递map，让source-map不中断
    // 传递meta，让下一个loader接收到其他参数
    
    // setTimeout(()=>{
    //   // 同步 loader，同步loader中不能执行异步操作，否则会报错，执行异步操作需在异步loader中执行
    //   console.log('test-inline ')
    //   this.callback(null, content, map, meta);
    // })
    console.log('test-inline ')
    this.callback(null, content, map, meta);
    return; // 当调用 callback() 函数时，总是返回 undefined
  };
  
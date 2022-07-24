module.exports = function (content) {
  console.log("2");
    return content;
  };
  module.exports.pitch = function (remainingRequest, precedingRequest, data) {
    console.log("pitch2");
    
    // return 'res' 返回值会阻断loader传播，在这个过程中如果任何 pitch 有返回值，则 loader 链被阻断。webpack 会跳过后面所有的的 pitch 和 loader，直接进入上一个 loader 。
  };

//   picth会优先执行
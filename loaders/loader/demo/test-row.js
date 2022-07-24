// Raw Loader
// 默认情况下，资源文件会被转化为 UTF-8 字符串，然后传给 loader。通过设置 raw 为 true，loader 可以接收原始的 Buffer(二进制数据)。
// 只要针对图片，字体图标等buffer文件

module.exports = function (content) {
    // content是一个Buffer数据
    console.log(content)
    return content;
  };
  module.exports.raw = true; // 开启 Raw Loader
  


module.exports= function (content) {
  const script = `
    const styleEl = document.createElement('style')
    styleEl.innerHTML = ${JSON.stringify(content)}
    document.head.appendChild(styleEl)
  `;

  // style-loader是第一个loader, 由于return导致熔断，所以其他loader不执行了（不管是normal还是pitch）
  return script;
}


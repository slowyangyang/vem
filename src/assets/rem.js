;(function(designWidth, maxWidth) {
  var doc = document;
  var win = window;
  var docEl = doc.documentElement;
  var resizeFlag = false; // 标志位，用于控制何时重新计算font-size（仅在窗口大小变化时）

  function updateRem(force) {
    // 如果force为true，或者resizeFlag为true，则重新计算font-size
    if (!force && !resizeFlag) return;
    resizeFlag = false; // 重置标志位（仅当非强制计算时）
    var width = docEl.clientWidth;
    if (width > maxWidth) width = maxWidth;
    var rem = width * 100 / designWidth;
    docEl.style.fontSize = rem + 'px';
  }

  function onResize() {
    resizeFlag = true; // 设置标志位，表示需要重新计算font-size
    win.requestAnimationFrame(updateRem); // 在下一次重绘之前调用updateRem
  }

  win.addEventListener('resize', onResize);
  win.addEventListener('pageshow', function(e) {
    if (e.persisted) updateRem(true); // 强制重新计算font-size
  });

  doc.addEventListener('DOMContentLoaded', function() {
    updateRem(true); // 强制在DOM内容加载完成后重新计算font-size
    doc.body.style.fontSize = '16px';
  });

  win.onload = function() {
    updateRem(true); // 强制在页面完全加载后重新计算font-size
  };
})(750, 750);

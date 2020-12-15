//获取页面参数
export function GetUrlParam(name){
  //构造一个含有目标参数的正则表达式对象
  let reg = new RegExp('(^|&)'+name+'=([^&]*)(&\$)')
  //匹配目标参数
  let r = window.location.search.substr(1).match(reg)
  if(r != null) return unescape(r[2])
  return null
}
export function setCookie(cname,cvalue,exdays){
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname+"="+cvalue+"; "+expires;
}
export function getCookie(cname){
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}


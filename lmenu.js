var activeTabId

function init(){
  window.expandCallback=null
  window.pullit=null
  window.drawit=null
  refreshRate = 20
  var tabId=getCookie('tabId')
  var s = new Array()
  for(var i=0;i<tabs.length;i++)
	s[i]=Slide(i,-140,locs[i],tabs[i],words[i],linx[i],i==tabId)
}

window.onmouseover=function(){
  window.expandCallback = null;
  collapseActiveTab()
}
function setCallback(newFunction){window.expandCallback=newFunction}
function collapseActiveTab(){
  cpi();cdi()
  if(activeTabId)drawit=setInterval(collapse,refreshRate)
}
function collapse(){
  cpi()
  if (activeTabId){
    var d1 = document.getElementById("t" + activeTabId + "d1")
    var d2 = document.getElementById("t" + activeTabId + "d2")
    if(d1&&d2){
      var s1 = d1.style
      var s2 = d2.style
      if (parseInt(s1.left)>d1.starteff){
        s1.left=parseInt(s1.left)-10+'px'
        s2.left=parseInt(s2.left)-10+'px'
      }
      else if (cdi()){
        activeTabId = null
        s2.zIndex=0
        if (window.expandCallback) expandCallback()
      }
    }
  }
}
function cpi(){
  if(window.pullit){
    clearInterval(window.pullit)
    window.pullit=null
    return true}
  else
    return false
}
function cdi(){
  if(window.drawit){
    clearInterval(window.drawit)
    window.drawit=null
    return true}
  else
    return false
}

function Slide(id,left,tabTop,tabText,words,linx,expanded){
  var d1 = document.createElement("div")
  d1.setAttribute("class", "s")
  d1.id = 't' + id + 'd1'
  for(var i=0;i<words.length;i++){
    var a = document.createElement("a")
    a.href = linx[i]
    a.appendChild(document.createTextNode(words[i]))
    a.onclick=function(e){
      setCookie('tabId',id)
  var tabId=getCookie('tabId')
  o.innerHTML=tabId
//      e.preventDefault()
    }
    d1.appendChild(a)
    if(words.length!=i)d1.appendChild(document.createElement("br"))}
  var s1 = d1.style
  s1.top = "20px"
  s1.left = parseInt(left) + "px"
  s1.width = "120px"
  s1.zIndex = 10
  var starteff = parseInt(s1.left)
  d1.starteff = starteff
  var endeff = starteff + 10 + parseInt(s1.width) 
  var d2 = document.createElement("div")
  d2.id = 't' + id + 'd2'
  d2.setAttribute("class", "t")
  d2.appendChild(document.createTextNode(tabText))
  var s2 = d2.style
  s2.top = parseInt(s1.top) + tabTop + "px"
  s2.left = endeff + 3 + "px"
  s2.width = "60px"
  if(expanded){
    s1.left = endeff + "px"
    s2.left = endeff + parseInt(s1.width) + 13 + "px"
    s2.zIndex=100
  }

  function expand(){
    if (activeTabId==null||activeTabId==id){
      if (parseInt(s1.left)<endeff){
        cdi()
        s1.left=parseInt(s1.left)+10+"px"
        s2.left=parseInt(s2.left)+10+"px"
        s2.zIndex=100
      }
      else cpi()
    }
  }
  
  function expandTab(){
    window.expandCallback=null
    if(activeTabId&&activeTabId!=id){
      window.expandCallback=expandTab
      collapseActiveTab() 
    }
    else if(window.pullit==null){
      activeTabId = id;
      pullit = setInterval(expand,refreshRate)
    }
  }
    
  d1.onmouseover = d2.onmouseover = function(e){
    expandTab();
    e.stopPropagation()
  }

  document.body.appendChild(d1)
  document.body.appendChild(d2)
}

function getCookie(c_name)
{
if (document.cookie.length>0)
  {
  c_start=document.cookie.indexOf(c_name + "=");
  if (c_start!=-1)
    {
    c_start=c_start + c_name.length+1;
    c_end=document.cookie.indexOf(";",c_start);
    if (c_end==-1) c_end=document.cookie.length;
    return unescape(document.cookie.substring(c_start,c_end));
    }
  }
return -1;
}

function setCookie(c_name,value,expiredays)
{
  var exdate=new Date();
  exdate.setSeconds(exdate.getSeconds()+2);
  document.cookie=c_name+ "=" +escape(value) + ";path=/;expires="+exdate.toGMTString()
}

s = new Array()
words = [
  ['document.write','textarea.onfocus','alert',
  'event handler','keycode','popup window',
  'background flash','image caching','icaching(jQuery)','planets'],
  ['paragraphs','tables','centering','fonts'],
  ['ERC','Storage','Gatwick','Music','Canada'],
  ['Server Variables','','','','','']]
linx = [
  ['../js/document_write.htm','../js/textarea_onfocus.htm','../js/alert.htm',
  '../js/ehandler.htm','../js/keycode.htm','../js/popup.htm',
  '../js/flash.htm','../js/image_caching.htm','../js/icaching.htm','../js/planets.htm'],
  ['../css/paragraphs.htm','../css/tables.htm','../css/center.htm','../css/fonts.htm'],
  ['../m/erc.htm','../m/storage.htm','../m/gatwick.htm','../m/music.htm','../m/cdn.htm'],
  ['../dotnet/servervariables.htm','','','','','']]
tabs = ['JScript','CSS','Maps','.NET']
locs = [0,30,60,90]
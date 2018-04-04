var settingPageHtml="<div class='setting'> <div class='textSett'><p class='title'>Paramètres</p><div id='list_item'><input type='checkbox' class='checkbox' checked>set1<br /><input type='checkbox' class='checkbox'>set2</div></div><button class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent'>Valider</button></div>";
var indexPageHtml = "<div class='coucou'><h1>Super</h1></div>"
$(".content").append(indexPageHtml);
function setCookie(sName, sValue) {
		var today = new Date(), expires = new Date();
		expires.setTime(today.getTime() + (365*24*60*60*1000));
		document.cookie = sName + "=" + sValue + ";expires=" + expires.toGMTString();
}

$(function(){
  var name  = "user";
  var value = "getUser";
  setCookie(name, value);

  $(".settingsPage").on("click",function(){
    $(".coucou").remove();
    $(".setting").remove();
    $(".content").append(settingPageHtml);
  })
  $(".indexPage").on("click",function(){
    $(".setting").remove();
    $(".coucou").remove();
    $(".content").append(indexPageHtml);
  })

});

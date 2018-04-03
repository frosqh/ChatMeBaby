document.cookie = "name=oeschger";
function alertCookie() {
  alert(document.cookie);
}

// function setCookie(sName, sValue) {
// 		var today = new Date(), expires = new Date();
// 		expires.setTime(today.getTime() + (365*24*60*60*1000));
// 		document.cookie = sName + "=" + sValue + ";expires=" + expires.toGMTString();
// }
//
// $(function(){
//   $(".buttonCookie").on("click",function(){
//     var name  = $(".textarea1").text();
//     var value = $(".textarea2").text();
//     setCookie(name, value);
//   });
// });

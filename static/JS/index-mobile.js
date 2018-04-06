$(function(){
  $('#menu').on("click",function(){
    if ($('.topnav').css("display") == "block"){
      $('.topnav').css("display","none");
    }
    else{
      $('.topnav').css("display","block");
    }
  });
  $('#homelink').on("click",function(){
    window.location.href = "/";
    });
  $('#channelbutton').on("click",function(){
    window.location.href = "/channel";
  });
  $('.facebook').on("click",function(){
    window.open('https://www.facebook.com/Chat-Me-Baby-130671114443167/', '_blank');
    });
  $('.twitter').on("click",function(){
    window.open('https://twitter.com/JeremyHynes4', '_blank');
    });
  $('.linkedin').on("click",function(){
    window.open('http://www.linkedin.com/in/jeremy-hynes-6bab77146', '_blank');
    });
});

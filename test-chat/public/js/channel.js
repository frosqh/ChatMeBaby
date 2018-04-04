$('.channel').on( "click", function() {
  $('.active_channel').removeClass("active_channel");
  $(this).toggleClass("active_channel");
  $('.channelName p b').html($('.active_channel').text());
});

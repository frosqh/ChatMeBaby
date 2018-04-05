$('.channel').on( "click", function() {
  var oldChannelName = $('.active_channel').text();
  $('.active_channel').removeClass("active_channel");
  $(this).toggleClass("active_channel");
  var newChannelName = $('.active_channel').text();
  $('.channelName p b').html(newChannelName);
  socket.emit('room',newChannelName);
  console.log("channel.js",newChannelName);
});

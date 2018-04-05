$('.channel').on( "click", function() {
  var oldChannelName = $('.active_channel').text();
  $('.active_channel').removeClass("active_channel");
  $(this).toggleClass("active_channel");
  var newChannelName = $('.active_channel').text();
  date= new Date();
  $('.channelName p b').html(newChannelName);
  socket.emit('getUser');
  socket.on('user', function(user) {
    socket.emit('message', {
      content :newChannelName,
      user    :user.username,
      hour    :date.getHours(),
      minute  :date.getMinutes()
    });
    console.log("channel.js",newChannelName);
  });


});

$('.channel').on( "click", function() {
  var oldChannelName = $('.active_channel').text();
  $('.active_channel').removeClass("active_channel");
  $(this).toggleClass("active_channel");
  var newChannelName = $('.active_channel').text();
  date= new Date();
  $('.channelNam p b').html(newChannelName);
  socket.emit('getMessages', {
      channel: newChannelName
    });
  socket.on('messages', function(messages){
	  console.log(messages);
    $('#zone_chat').html('');
   for (i in messages){
	   m=messages[i];
     $('#zone_chat').append("<p>"+m.UserName+"--"+m.Txt+"</p>");
     time = m.SendDate.split(' ')[1];
     minute= time[1];
     hour = time[0];
     if(lastMsg != message.user){
          $('#zone_chat').append('<div class="sender-name"><img class="avatar" src="https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/29792871_130672044443074_3886540281580134733_n.png?_nc_cat=0&oh=ba0d45495f5506030849de77f27b16b6&oe=5B73A591" width="32" height="32"/><div class="sender">'+m.UserName+'</div><div class="time">'+hour+':'+minute+'</div><div class="message_content"><div class="message_body">  <strong>|</strong> ' + m.Txt + '</div></div></div>');
          lastMsg = message.user;
      } else {
          $('#zone_chat').append('<div class="message_content"><div class="time">'+hour+':'+minute+'</div><div class="message_body">  <strong>|</strong> ' + m.Txt + '</div></div>');
          $('.content').animate({scrollTop : $('.content').prop('scrollHeight')},500);
      }
   }
  })
  //socket.emit('getUser');
  //socket.on('user', function(user) {
  //  socket.emit('message', {
  //    content :newChannelName,
  //    user    :user.username,
  //    hour    :date.getHours(),
  //   minute  :date.getMinutes()
  //  });
  //  console.log("channel.js",newChannelName);
  //});


});

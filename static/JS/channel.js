$('.channel').on( "click", function() {
  var oldChannelName = $('.active_channel').text();
  $('.active_channel').removeClass("active_channel");
  $(this).toggleClass("active_channel");
  var newChannelName = $('.active_channel').text();
  date= new Date();
  $('.channelNam p b').html(newChannelName);
  refresh(newChannelName)
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

function refresh(newChannelName){
    socket.emit('getMessages', {
      channel: newChannelName
    });
  socket.on('messages', function(messages){
    $('#zone_chat').html('');
    lastMsg="";
   for (i in messages){
     m=messages[i];
     time = m.SendDate.split(' ')[1];
     minute= time.split(':')[1];
     hour = time.split(':')[0];
     if(lastMsg != m.UserName){
          m.Txt = m.Txt.replace(RegExp("(:)(((\\w)|-)+)(:)",'g'),function(p1,p2,p3,p4){
            return '<i class="em em-'+p3+'"></i>'});
          $('#zone_chat').append('<div class="sender-name"><img class="avatar" src="'+m.Image+'" width="32" height="32"/><div class="sender">'+m.UserName+'</div><div class="time">'+hour+':'+minute+'</div><div class="message_content"><div class="message_body">  <strong>|</strong> ' + m.Txt + '</div></div></div>');
          lastMsg = m.UserName;
      } else {
	               m.Txt = m.Txt.replace(RegExp("(:)(((\\w)|-)+)(:)",'g'),function(p1,p2,p3,p4){
            return '<i class="em em-'+p3+'"></i>'});  
         $('#zone_chat').append('<div class="message_content"><div class="time">'+hour+':'+minute+'</div><div class="message_body">  <strong>|</strong> ' + m.Txt + '</div></div>');

      }
   }
});
}

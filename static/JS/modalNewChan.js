var counter = 1;

function addInput(myButton){
  /* Increment the counter */
  counter++;
  /* Create a new input */
  var newdiv = document.createElement('div');
  newdiv.innerHTML = "<input type='text' id="+"'inp"+counter+"'"+" class='inNewChan' name='member"+counter+"' title='New member..' placeholder='New member..'/>";
  document.getElementById("memberInputs").appendChild(newdiv);

  /* Create a new button */
  var newdiv2 = document.createElement('div');
  newdiv2.innerHTML = "<button type='button' class='add' id='"+counter+"' onclick='addInput(this)'></button>";
  document.getElementById("buttonInputs").appendChild(newdiv2);

  /* Change the button type */
  myButton.className = "rm";
  myButton.setAttribute("onClick", "rmInput(this);" );
}

function rmInput(myButton){
  var buttonInputs = document.getElementById("buttonInputs");
  var id = myButton.id;

  /* Remove the input */
  var myInput = document.getElementById("inp"+id);
  myDiv = myInput.parentNode;
  myDiv.parentNode.removeChild(myDiv);

  /* Remove the button */
  var myDiv = myButton.parentNode;
  myDiv.parentNode.removeChild(myDiv);

  /* Change the last button to add */
  var lastBtn = buttonInputs.lastChild;
  var lastId = lastBtn.firstChild.id;
  lastBtn.innerHTML = "<button type='button' class='add' id='"+lastId+"' onclick='addInput(this)'></button>";
}

function sendForm() {
  var chanName = document.getElementById("channelname");
  var pub = document.getElementById("public");
  var priv = document.getElementById("private");
  var addUser = [$('.username:eq(1)').text()];
  console.log($('.username:eq(1)').text());
  if (chanName.checkValidity() && (pub.checked || priv.checked)) {
    //document.getElementById("myForm").submit();
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
      for(var k=0;k<=counter;k++){
        if($("#inp" + k).length != 0) {
          addUser.push($('#inp'+k).val());
          //console.log($('#inp'+k).val());
          //$('#inp'+k).val('');
        }
      }

      var stat = "public";
      if (priv.checked){
        console.log("private");
        stat = "private";
      }

      chanName = $('#channelname').val();
      socket.emit('checkName', chanName);

      socket.on('nameDispo',function(isDispo){
        if(isDispo){
          // Envoie le channel a la BD
          socket.emit('newChannel', {
            name    :chanName,
            status  :stat,
            users   :addUser
          });

          clearAndHide();
        } else {
            //Souligner le nom du channel en rouge
        }
    	});
      //$('.channel_sidebar').append('<p class="channel">'+chanName+'</p>');



  }
};

/*$('#myForm').submit(function (e) {
  e.preventDefault();
  $('channel_sidebar').append('<p class="channel">'+$('.channelname').text()+'</p>');
  console.log("Submit ");
});*/
var Mcounter = 1;

function MaddInput(myButton){
  /* Increment the counter */
  Mcounter++;

  /* Create a new input */
  var newdiv = document.createElement('div');
  newdiv.innerHTML = "<input type='text' id='M"+Mcounter+"inp'"+" class='inNewChan' name='members[]' title='New member..' placeholder='New member..'/>";
  document.getElementById("MmemberInputs").appendChild(newdiv);

  /* Create a new button */
  var newdiv2 = document.createElement('div');
  newdiv2.innerHTML = "<button type='button' class='add' id='M"+Mcounter+"' onclick='MaddInput(this)'></button>";
  document.getElementById("MbuttonInputs").appendChild(newdiv2);

  /* Change the button type */
  myButton.className = "rm";
  myButton.setAttribute("onClick", "MrmInput(this);" );
}

function MrmInput(myButton){
  var buttonInputs = document.getElementById("MbuttonInputs");
  var id = myButton.id;

  /* Remove the input */
  var myInput = document.getElementById(id+"inp");
  var myDiv = myInput.parentNode;
  myDiv.parentNode.removeChild(myDiv);

  /* Remove the button */
  myDiv = myButton.parentNode;
  myDiv.parentNode.removeChild(myDiv);

  /* Change the last button to add */
  var lastBtn = buttonInputs.lastChild;
  var lastId = lastBtn.firstChild.id;
  lastBtn.innerHTML = "<button type='button' class='add' id='"+lastId+"' onclick='MaddInput(this)'></button>";
}

function sendFormMembers() {
  var chanName = document.getElementById("channelnameMembers");
  if (chanName.checkValidity() ) {
    //document.getElementById("myForm").submit();
    var modal = document.getElementById('myModalMembers');
    modal.style.display = "none";
      for(var k=0;k<=counter;k++){
        if($("#M1inp" + k).length != 0) {
          addUser.push($('#M1inp'+k).val());
          //console.log($('#inp'+k).val());
          //$('#inp'+k).val('');
        }
      }

      chanName = $('#channelnameMembers').val();
      socket.emit('addUser', {
        name: chanName,
        users: addUser
      });
      //socket.emit('checkName', chanName);

     /* socket.on('nameDispo',function(isDispo){
        if(isDispo){
          // Envoie le channel a la BD
          socket.emit('newChannel', {
            name    :chanName,
            status  :stat,
            users   :addUser
          });

          clearAndHide();
        } else {
            //Souligner le nom du channel en rouge
        }
      });**/
      //$('.channel_sidebar').append('<p class="channel">'+chanName+'</p>');


}

function checkAllValidate() {

}

function clearAndHide(){
  for(var k=0;k<=counter;k++){
    if($("#inp" + k).length != 0) {
      $('#inp'+k).val('');
    }
  }
  for(var k=0;k<=counter;k++){
    if($("#" + k).length != 0) {
      if($('#'+k).hasClass("rs")){
        $('#'+k).click();
        console.log($('#'+k)+" is clicked");
      }
    }
  }
  counter = 1;
  $('#channelname').val('');
}

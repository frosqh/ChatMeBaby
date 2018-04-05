var counter = 1;
var limit = 6;

function addInput(myButton){
  /* Increment the counter */
  counter++;

  /* Create a new input */
  var newdiv = document.createElement('div');
  newdiv.innerHTML = "<input type='text' id="+"'inp"+counter+"'"+" class='inNewChan' name='members[]' title='New member..' placeholder='New member..'/>";
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
  if (chanName.checkValidity() && (pub.checked || priv.checked)) {
    document.getElementById("myForm").submit();
  }
}

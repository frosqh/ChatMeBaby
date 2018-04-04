/* Check if the password is confirmed */
function validatePassword() {
  var password = document.getElementById("password");
  var confirm_password = document.getElementById("confirm-password");

  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords don't match");
  } else {
    confirm_password.setCustomValidity('');
  }
}

function checkAllValidate() {
  var username = document.getElementById("username");
  var email = document.getElementById("email");
  var password = document.getElementById("confirm-password");
  var terms = document.getElementById("myonoffswitch");

  if (username.checkValidity() && email.checkValidity() &&
      password.checkValidity() && terms.checked) {
    //alert("OK");
    document.getElementById("myForm").submit();
}

/* Check if the password is confirmed */
function validatePassword() {
  var new_password = document.getElementById("new-password");
  var confirm_password = document.getElementById("confirm-password");

  if(new_password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords don't match");
  } else {
    confirm_password.setCustomValidity('');
  }
}

/* Check if the new email is correct */
function validateEmail() {
  var new_email = document.getElementById("new-email");
  var confirm_email = document.getElementById("confirm-email");

  if(new_email.value != confirm_email.value) {
    confirm_email.setCustomValidity("Emails don't match");
  } else {
    confirm_email.setCustomValidity('');
  }

}

function checkAllValidate() {
  var username = document.getElementById("username");
  var new_email = document.getElementById("new-email");
  var confirm_email = document.getElementById("confirm-email");
  var new_password = document.getElementById("new-password");

  var email_empty = !(new_email.value.localeCompare(""));
  var password_empty = !(new_password.value.localeCompare(""));

  if (email_empty || confirm_email.checkValidity()) {
    var confirm_password = document.getElementById("confirm-password");
    if (password_empty || confirm_password.checkValidity()) {
        alert("OK");
        if (email_empty) {
          confirm_email.removeAttribute('name');
        }
        if (password_empty) {
          confirm_password.removeAttribute('name');
        }
        current_email.removeAttribute('name');
        new_email.removeAttribute('name');
        current_password.removeAttribute('name');
        new_password.removeAttribute('name');

        document.getElementById("myForm").submit();
    } else {
      alert ("Passwords don't match.");
    }
  } else {
    alert("Emails don't match.")
  }
}

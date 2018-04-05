function ageMini(myAgeMin) {
  var valMin = document.getElementById("valMin");
  valMin.innerHTML = myAgeMin.value;

  var ageMax = document.getElementById("ageMax");
  ageMax.min = myAgeMin.value;

  ageMaxi(ageMax);
}

function ageMaxi(myAgeMax) {
  var valMax = document.getElementById("valMax");
  valMax.innerHTML = myAgeMax.value;
}

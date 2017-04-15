let speed = $("#speed");
let updatedSpeed 

speed.keyup(function() {
  updatedSpeed = Math.round(speed.val()*180/100)-45;

  $("#speedbox-score").css("transform","rotate("+updatedSpeed+"deg)");
  console.log(updatedSpeed);
});

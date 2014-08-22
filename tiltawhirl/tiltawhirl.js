mapboxgl.accessToken = 'pk.eyJ1Ijoid3BlYXJzIiwiYSI6IkxubGE1VzAifQ.MvM1hTtyi5biYJ6r0dsllg';


var whirl = document.getElementById("whirl");
var stop = document.getElementById("stop");
var fact = document.getElementById("factor");
var mvFact = document.getElementById("mvFactor");

var widthThird = window.innerWidth/3;
var heightThird= window.innerHeight/3;
var center = [38.5,-121];
var mouseX;
var mouseY;
var movementFactor = 0.01;


var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'style.json', //stylesheet location
  center: center, // starting position
  zoom: 9 // starting zoom
});


function makeTimer(factor){
  var reqId;
  var rotation = map.getBearing();
  var ready = 1;

  if(!factor) factor = 0.25;

  function rotate (){
    ready = 1; 
    var bearing = (rotation++)*factor;
    center = makeCenter(bearing);
    map.setCenter(center);
    map.setBearing(bearing)
    run();
  }

  function run(){
    if(ready){
      reqId = requestAnimationFrame(rotate)
      ready = 0;
    }
  }

  function setSpin(spinFactor){
    if(isNaN(spinFactor))spinFactor = factor;
    if(spinFactor===0){
      rotation = rotation*factor/0.25;
      factor = 0.25;
      return this.stop();
    }else{
      rotation = rotation*factor/spinFactor; 
    }
    factor = spinFactor;
    run();
  }    

  function setMovement(mvFactor){
    if(!isNaN(mvFactor))movementFactor=0.01*mvFactor;
      
  }


  function stop (){
    cancelAnimationFrame(reqId);
    ready = 1;
  }

  return {run:run, stop:stop, setSpin:setSpin, setMovement : setMovement}
}


function updatePosition(e){
  mouseX = e.pageX;
  mouseY = e.pageY;
}


makeCenter.arr = new Array(2);
function makeCenter(bearing){
  var arr = makeCenter.arr;
  var longAngle = Math.sin(bearing/180*Math.PI)*movementFactor;
  var latAngle = (Math.cos(bearing/180*Math.PI) - 1)*movementFactor;
  var latOffset =  movementFactor * ((mouseY/heightThird>>0) - 1) * -1;
  var longOffset = movementFactor * ((mouseX/widthThird>>0) -1);
  
  console.log(latOffset,longOffset,bearing,latAngle,longAngle);
  if(latOffset||longOffset){
    latOffset += latAngle;
    longOffset += longAngle;
  }
  console.log("combined",latOffset,longOffset);
  arr[0] = center[0] + latOffset;
  arr[1] = center[1] + longOffset;
  return arr;
}
//currently off at 90 bearing left middle


var timer = makeTimer();
var getSpin = function(){
  timer.setSpin(parseFloat(this.value))
};

var getMovement = function(){
  timer.setMovement(parseFloat(this.value));
};


whirl.addEventListener('mousedown', timer.run);
stop.addEventListener('mousedown', timer.stop);
fact.addEventListener('keyup', getSpin);
mvFact.addEventListener('keyup', getMovement);
window.addEventListener('mousemove', updatePosition);



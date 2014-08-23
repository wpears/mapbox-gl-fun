mapboxgl.accessToken = 'pk.eyJ1Ijoid3BlYXJzIiwiYSI6IkxubGE1VzAifQ.MvM1hTtyi5biYJ6r0dsllg';


var whirl = document.getElementById("whirl");
var stop = document.getElementById("stop");
var fact = document.getElementById("factor");
var mvFact = document.getElementById("mvFactor");

var widthThird = window.innerWidth/3 + 1;
var heightThird= window.innerHeight/3 + 1;
var center = [38.5,-121.7];
var mouseX;
var mouseY;
var movementFactor = 0.01;


var map = new mapboxgl.Map({
  container: 'map', 
  style: 'style.json', 
  center: center, 
  zoom: 9 
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



/*
 * array of fn's key'd by mouse pos
 * corners are the sum of the two directions
 * top: cos(x) -1
 * lft: sin(x)
 * rgt: -sin(x)
 * bot: -(cos(x) -1)
 *to lat @  00... top: 00, tl: 00, left: 00, bl: 00, tr: 00, rgt: 00, rb: 00, bot: 00
 *to lat @  90... top: -1, tl: 00, left: +1, bl: +2, tr: -2, rgt: -1, rb: 00, bot: +1
 *to lat @ 180... top: -2, tl: -2, left: 00, bl: +2, tr: -2, rgt: 00, rb: +2, bot: +2
 *to lat @ 270... top: -1, tl: -2, left: -1, bl: 00, tr: 00, rgt: +1, rb: +2, bot: +1
 *
 *to lng @ 90... top: 
 *
 *
 * */


makeCenter.arr = new Array(2);
function makeCenter(bearing){
  var arr = makeCenter.arr;
  var latAngle = Math.sin(bearing/180*Math.PI)*movementFactor;
  var longAngle = (Math.cos(bearing/180*Math.PI) - 1)*movementFactor;
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
//correct at 0 bearing
//


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



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


  function rotate (){
    ready = 1; 
    var bearing;
    if(factor)
      bearing  = (rotation++)*factor;
    else bearing = map.getBearing();
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
    if(isNaN(spinFactor)||spinFactor==='')spinFactor = factor;
    rotation = rotation*factor/spinFactor; 
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



/*to lat @  00... top: 00, tl: 00, left: 00, bl: 00, tr: 00, rgt: 00, rb: 00, bot: 00
 *to lat @  90... top: -1, tl: 00, left: +1, bl: +2, tr: -2, rgt: -1, rb: 00, bot: +1
 *to lat @ 180... top: -2, tl: -2, left: 00, bl: +2, tr: -2, rgt: 00, rb: +2, bot: +2
 *to lat @ 270... top: -1, tl: -2, left: -1, bl: 00, tr: 00, rgt: +1, rb: +2, bot: +1

 *to lng @  00... top: 00, tl:  , left: 00, bl: , tr: , rgt: 00, rb: , bot: 00
 *to lng @  90... top: +1, tl: 00 left: +1, rgt: -1, bot: -1  
 *to lng @ 180... top: 00, left: +2, rgt: -2, bot: 00
 *to lng @ 270... top: -1, left: +1, rgt: -1, bot: +1 
 *
 *
 * array of fn's key'd by mouse pos
 * corners are the sum of the two directions in both planes
 *
 * Latitude functions
 * top: cos(x) -1
 * lft: sin(x)
 * rgt: -sin(x)
 * bot: -(cos(x) -1)
 * mid: 0
 *
 *
 * Longitude functions
 * top: sin(x)
 * lft: -(cos(x) -1)
 * rgt: cos(x) -1
 * bot: -sin(x)
 * mid: 0
 *
 *
 * find which sector we're in and return appropriate function
 * apply this fn to provide offset to 
 * */
function cosMin(deg){
  return Math.cos(toRad(deg)) - 1;
}
function sin(deg){
  return Math.sin(toRad(deg));
}
function negSin(deg){
  return -sin(deg);
}
function negCosMin(deg){
  return -cosMin(deg);
}
function nil(){return 0;}

   
function getLatAdjustment(x,y,bearing){
  return latX[x](bearing)+latY[y](bearing);
}


function getLngAdjustment(x,y,bearing){
  return lngX[x](bearing)+lngY[y](bearing);
}


function toRad(degrees){
  return degrees/180 * Math.PI;
}


var latX, latY, lngX, lngY;
latX = lngY = [sin,nil,negSin];
latY = lngX = [cosMin,nil,negCosMin];


makeCenter.arr = new Array(2);
function makeCenter(bearing){
  var arr = makeCenter.arr;
  var x = mouseX/widthThird>>0;
  var y = mouseY/heightThird>>0;
console.log("x,y",x,y);
  var latOffset =  -(y - 1);
  var lngOffset = x -1;
 console.log("raw offset",latOffset,lngOffset);
 var latAdjustment = getLatAdjustment(x,y,bearing);
 var lngAdjustment = getLngAdjustment(x,y,bearing);

 console.log("adjustments",latAdjustment,lngAdjustment);
  latOffset += latAdjustment;
  lngOffset += lngAdjustment;
console.log("post adjustment",latOffset,lngOffset); 

  arr[0] = center[0] + movementFactor*latOffset;
  arr[1] = center[1] + movementFactor*lngOffset;
  console.log(arr);
  return arr;
}
//right and left are correct at first and move to be completely wrong at 180

var timer = makeTimer(0.25);


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



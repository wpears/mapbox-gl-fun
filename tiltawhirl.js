mapboxgl.accessToken = 'pk.eyJ1Ijoid3BlYXJzIiwiYSI6IkxubGE1VzAifQ.MvM1hTtyi5biYJ6r0dsllg';

var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'style.json', //stylesheet location
  center: [40, -74.50], // starting position
  zoom: 9 // starting zoom
});

var whirl = document.getElementById("whirl");
var stop = document.getElementById("stop");
var fact = document.getElementById("factor");

function makeTimer(factor){
  var reqId;
  var rotation = map.getBearing();
  var ready = 1;

  if(!factor) factor = 0.25;

  function rotate (){
    ready = 1;
    var bearing = (rotation++)*factor;
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
    if(isNaN(spinFactor))spinFactor = 0.25;
    if(spinFactor===0){
      rotation = map.getBearing();
    }else{
      rotation = rotation*factor/spinFactor; 
    }
    factor = spinFactor;
    run();
  }    


  function stop (){
    cancelAnimationFrame(reqId);
    ready = 1;
  }

  return {run:run, stop:stop, setSpin:setSpin}
}


var timer = makeTimer();
var getSpin = function(){
  timer.setSpin(parseFloat(this.value))
}

whirl.addEventListener('mousedown',timer.run);
stop.addEventListener('mousedown',timer.stop);
fact.addEventListener('keyup',getSpin);




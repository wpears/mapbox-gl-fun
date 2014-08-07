function makeTimer(time,rot){
  var init = Date.now()/1000;
  var timer;

  function runTimer (){
    var numb = Date.now()/1000;
    var bear = (numb - init)*rot;
    map.setBearing(bear)
    timer = setTimeout(runTimer,time)
  }

  function stop (){
    clearTimeout(timer);
  }

  return {run:runTimer, stop:stop}
}

function makeTimer(factor){
  var reqId;
  var rotation = map.getBearing();

  if(!factor) factor = 1;

  function rotate (){
    var bearing = (rotation++)*factor;
    map.setBearing(bearing)
    run();
  }

  function run(){
    reqId = requestAnimationFrame(rotate)
  }

  function setSpin(spinFactor){
    if(spinFactor){
      rotation = rotation*factor/spinFactor;
    }else{
      rotation = map.getBearing();
    }
    factor = spinFactor;
    run();
  }



  function stop (){
    cancelAnimationFrame(reqId);
  }

  return {run:run, stop:stop, setSpin:setSpin}
}
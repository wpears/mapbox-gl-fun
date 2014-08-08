var widthThird = window.innerWidth/3;
var heightThird= window.innerHeight/3;
var center = map.getCenter();
var mouseX;
var mouseY;
var movementFactor = 1;



center = makeCenter();
map.setCenter(center);





makeCenter.arr = new Array(2);
function makeCenter(){
  var arr = makeCenter.arr;
  arr[0] = center.lat + movementFactor * 0.05 * ((mouseY/heightThird>>0) - 1);
  arr[1] = center.long + movementFactor * 0.05 * ((mouseX/widthThird>>0) - 1) * -1;
  return arr;
}

document.addEventListener('mousemove',function(e){
  mouseX = e.pageX;
  mouseY = e.pageY;
})
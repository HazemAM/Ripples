/**** VARIABLES & CONSTANTS ***/

const animationTick = 20;
const defaultOpacity = '0.60';
var tempPressedButton = null; //Used in global mouseUp listener.
var initialSize = 18;



/**** LISTENERS ***/

/*** mouseDown or keyDown for every ripple element **/
function down(elem, e, x, y){
	var container = elem.getElementsByClassName('circles')[0];
	
	var transX = x;
	var transY = y;

	var circle = document.createElement('div');
	circle.className = 'circle';
	circle.style.background = elem.dataset.rippleColor || 'white';
	circle.style.opacity = elem.dataset.rippleOpacity || defaultOpacity;
	circle.style.height = initialSize+'px';
	circle.style.width = initialSize+'px';

	circle.style.left = transX+'px';
	circle.style.top  = transY+'px';

	container.insertBefore(circle, container.firstChild); //Insert top.
	tempPressedButton = elem;

	/*** Scale Animation **/
	circle.scale = 1;
	requestAnimationFrame(function(){ scale(circle,0.4,7) }, animationTick);
}

function mouseDownListen(e){
	var x = e.pageX - this.offsetLeft - (initialSize/2),
		y = e.pageY - this.offsetTop  - (initialSize/2)
	
	down(this, e, x, y);
}

function keyDownListen(e){
	if(e.which != 32 && e.which != 13)
		return;
	else if(this.active)
		return;
	
	var x = (this.clientWidth/2)  - (initialSize/2),
		y = (this.clientHeight/2) - (initialSize/2) * 2;
	
	down(this, e, x, y);
	
	this.active = true;
}


/*** mouseUp global document listener for all ripple elements **/
function upListen(e){
	if(tempPressedButton == null) return;
	var circle = tempPressedButton.getElementsByClassName('circles')[0].firstChild;

	if(circle && !circle.done){
		var opacityStep =
			(parseFloat(tempPressedButton.dataset.rippleOpacity||defaultOpacity)/2) / 10;
		circle.done = true;
		
		requestAnimationFrame(function(){ scale(circle,0.05,8) }, animationTick);
		requestAnimationFrame(function(){ fadeOut(circle,opacityStep) }, animationTick);
	}
	
	this.active = false;
}



/**** FUNCTIONS ***/

/*** Scale animation function **/
function scale(item, step, final){
	item.style.transform = 'scale('+(item.scale+=step)+')';

	if(item.scale >= final) //Done scaling.
		return;
	
	requestAnimationFrame(function(){ scale(item,step,final) }, animationTick);
}


/*** Fade-out animation function **/
function fadeOut(item, step){
	var opacity = parseFloat(item.style.opacity);
	item.style.opacity = (opacity-=step);

	if(opacity <= 0){ //Done fading & done everything; delete.
		item.parentNode.removeChild(item);
		return;
	}
	
	requestAnimationFrame(function(){ fadeOut(item, step) }, animationTick);
}


/*** Adding ripples **/
function addRipples(item){
	var container = document.createElement('div');

	container.className = 'circles';
	item.insertBefore(container, item.firstChild);

	item.addEventListener('mousedown', mouseDownListen);
	item.addEventListener('keydown', keyDownListen);
	item.addEventListener('blur', function(e){
		if(e.target !== tempPressedButton)
			return;
		upListen(e);
	});
}


/**** INITIALIZATIONS ***/

//Assigning global up listener:
document.addEventListener('mouseup', upListen);
document.addEventListener('keyup', function(e){
	if(e.which != 32 && e.which != 13)
		return;
	upListen(e);
	e.target.active = false;
});

//Assigning down listener for each ripple elements:
var items = document.getElementsByClassName('ripple');
for(i=0; i<items.length; i++)
	addRipples(items[i]);
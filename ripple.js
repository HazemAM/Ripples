/**** VARIABLES & CONSTANTS ***/

const animationTick = 20;
const defaultOpacity = '0.60';
var tempPressedButton = null; //Used in global mouseUp listener.



/**** LISTENERS ***/

/*** mouseDown for every ripple element **/
var downListen = function(e){
	var container = this.getElementsByClassName('circles')[0];
	
	var initialSize = 18;
	var transX = e.pageX - this.offsetLeft - (initialSize/2);
	var transY = e.pageY - this.offsetTop  - (initialSize/2);

	var circle = document.createElement('div');
	circle.className = 'circle';
	circle.style.background = this.dataset.rippleColor || 'white';
	circle.style.opacity = this.dataset.rippleOpacity || defaultOpacity;
	circle.style.height = initialSize+'px';
	circle.style.width = initialSize+'px';

	circle.style.left = transX+'px';
	circle.style.top  = transY+'px';

	container.insertBefore(circle, container.firstChild); //Insert top.
	tempPressedButton = this;

	/*** Scale Animation **/
	circle.scale = 1;
	requestAnimationFrame(function(){ scale(circle,0.4,7) }, animationTick);
}


/*** mouseUp global document listener for all ripple elements **/
var upListen = function(e){
	if(tempPressedButton == null) return;
	var circle = tempPressedButton.getElementsByClassName('circles')[0].firstChild;

	if(circle && !circle.done){
		var opacityStep =
			(parseFloat(tempPressedButton.dataset.rippleOpacity||defaultOpacity)/2) / 10;
		circle.done = true;
		
		requestAnimationFrame(function(){ scale(circle,0.05,8) }, animationTick);
		requestAnimationFrame(function(){ fadeOut(circle,opacityStep) }, animationTick);
	}
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

	item.addEventListener('mousedown', downListen);
}


/**** INITIALIZATIONS ***/

//Assigning global up listener:
document.addEventListener('mouseup', upListen);

//Assigning down listener for each ripple elements:
var items = document.getElementsByClassName('ripple');
for(i=0; i<items.length; i++)
	addRipples(items[i]);
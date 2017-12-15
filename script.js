/*
* Ripples
* -------
* 
* Version 2.0, 2017-12-15
*
* (c) Copyright 2017 Hazem AbuMostafa.
* This project is subject to the Apache License, Version 2.0
* <http://apache.org/licenses/LICENSE-2.0.html>.
*/

var Ripples = function(){};

/**** VARIABLES & CONSTANTS ***/
Ripples.defaultOpacity = '0.5';
Ripples.tempPressedButton = null; //Used in global mouseUp listener.
Ripples.scaleDuration = 750;
Ripples.fadeDuration = 400;

/**** LISTENERS ***/
/*** mouseDown or keyDown for every ripple element **/
Ripples.down = function(elem, e, x, y, w, h){
	//Do not run if element is disabled:
	if(elem.disabled)
		return;
	
	var initialSize = Math.max(w, h) / 3;

	//Preparing a ripple circle:
	var circle = document.createElement('div');
	circle.className = 'circle';
	circle.style.background = elem.dataset.rippleColor || 'white';
	circle.style.opacity = elem.dataset.rippleOpacity || Ripples.defaultOpacity;
	circle.style.height = initialSize + 'px';
	circle.style.width = initialSize + 'px';

	circle.style.left = (x - initialSize / 2) + 'px';
	circle.style.top  = (y - initialSize / 2) + 'px';

	//Adding the ripple circle:
	var container = elem.getElementsByClassName('circles')[0];
	container.insertBefore(circle, container.firstChild); //Insert top.
	Ripples.tempPressedButton = elem;

	//Scale animation:
	var scaleGoal = Math.max(w, h) * 2,
		scaleRatio = scaleGoal / initialSize;
	circle.scale = 1;
	Ripples.scale(circle, scaleRatio);
};

Ripples.mouseDownListen = function(e){
	var rect = this.getBoundingClientRect(),
		x = e.pageX - rect.left,
		y = e.pageY - rect.top;
	
	Ripples.down(this, e, x, y, rect.width, rect.height);
};

Ripples.keyDownListen = function(e){
	if(!Ripples.isSpacebarOrEnter(e))
		return;
	else if(this.active)
		return;
	
	var rect = this.getBoundingClientRect(),
		x = rect.width / 2,
		y = rect.height / 3;
	
	Ripples.down(this, e, x, y, rect.width, rect.height);
	
	this.active = true;
};


/*** mouseUp global document listener for all ripple elements **/
Ripples.upListen = function(e){
	if(Ripples.tempPressedButton == null) return;
	var circle = Ripples.tempPressedButton.getElementsByClassName('circles')[0].firstChild;

	if(circle && !circle.done){
		circle.done = true;
		Ripples.fadeOut(circle);
	}
	
	Ripples.tempPressedButton.active = false;
};



/**** FUNCTIONS ***/

/*** Scale animation function **/
Ripples.scale = function(item, ratio){
	var startTime = Ripples.now(),
		timePassed,
		progress,
		animationID;
	
	(function doScale(){
		timePassed = Ripples.now() - startTime;
		progress = Math.min(timePassed / Ripples.scaleDuration, 1);

		item.scale = ratio * Ripples.ease(progress);
		item.style.webkitTransform = 'scale(' + item.scale + ')';
		item.style.transform = 'scale3d(' + item.scale + ',' + item.scale + ',1)';

		if(progress === 1){ //Done scaling.
			window.cancelAnimationFrame(animationID);
			animationID = null;
			return;
		}

		animationID = window.requestAnimationFrame(doScale);
	})();
};


/*** Fade-out animation function **/
Ripples.fadeOut = function(item){
	var startTime = Ripples.now(),
		timePassed,
		progress,
		animationID;

	var initialOpacity = parseFloat(item.style.opacity),
		opacity;

	(function doFadeOut(){
		timePassed = Ripples.now() - startTime;
		progress = Math.min(timePassed / Ripples.fadeDuration, 1);
		
		opacity = initialOpacity - (initialOpacity * progress);
		item.style.opacity = Math.max(opacity, 0);

		if(opacity === 0){ //Done fading & done everything; delete.
			item.parentNode.removeChild(item);
			window.cancelAnimationFrame(animationID);
			animationID = null;
			return;
		}
		
		animationID = window.requestAnimationFrame(doFadeOut);
	})();
};


/*** Adding ripples **/
Ripples.addRipples = function(item){
	var container = document.createElement('div');

	container.className = 'circles';
	item.insertBefore(container, item.firstChild);

	item.addEventListener('mousedown', Ripples.mouseDownListen);
	item.addEventListener('keydown', Ripples.keyDownListen);
	item.addEventListener('blur', function(e){
		if(e.target !== Ripples.tempPressedButton)
			return;
		Ripples.upListen(e);
	});
};


/*** Easing function (exponential out easing) **/
/*** (Source: Tween.js) **/
Ripples.ease = function(k){
	return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);
};


/*** Getting time now **/
Ripples.now = (window.performance && window.performance.now)
    ? window.performance.now.bind(window.performance)
    : Date.now;


/*** Key events helper **/
Ripples.isSpacebarOrEnter = function(e){
	return e.key === ' ' || e.key === 'Spacebar' ||
		   e.key === 'Enter' ||
		   e.keyCode === 13 || e.keyCode === 32;
};


/**** INITIALIZATIONS ***/

Ripples.init = function(){
	//Assigning global up listener:
	document.addEventListener('mouseup', Ripples.upListen);
	document.addEventListener('keyup', function(e){
		if(!Ripples.isSpacebarOrEnter(e))
			return;
			
		Ripples.upListen(e);
		e.target.active = false;
	});

	//Assigning down listener for each ripple element:
	var rippleElements = document.getElementsByClassName('ripple');
	for(var elemIndex = 0; elemIndex < rippleElements.length; elemIndex++)
		Ripples.addRipples(rippleElements[elemIndex]);
};


/*** Module export **/
if(typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
	module.exports = Ripples;
} else if(typeof define === 'function' && define.amd){
	define(function(){
		return Ripples;
	});
} else if(window){
	window.Ripples = Ripples;
}

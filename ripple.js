(function(){
	var Ripple = function(){};

	/**** VARIABLES & CONSTANTS ***/
	Ripple.animationTick = 20;
	Ripple.defaultOpacity = '0.60';
	Ripple.tempPressedButton = null; //Used in global mouseUp listener.
	Ripple.initialSize = 18;

	/**** LISTENERS ***/
	/*** mouseDown or keyDown for every ripple element **/
	Ripple.down = function(elem, e, x, y){
		var container = elem.getElementsByClassName('circles')[0];
		
		var transX = x;
		var transY = y;

		var circle = document.createElement('div');
		circle.className = 'circle';
		circle.style.background = elem.dataset.rippleColor || 'white';
		circle.style.opacity = elem.dataset.rippleOpacity || Ripple.defaultOpacity;
		circle.style.height = Ripple.initialSize+'px';
		circle.style.width = Ripple.initialSize+'px';

		circle.style.left = transX+'px';
		circle.style.top  = transY+'px';

		container.insertBefore(circle, container.firstChild); //Insert top.
		Ripple.tempPressedButton = elem;

		/*** Scale Animation **/
		circle.scale = 1;
		requestAnimationFrame(function(){ Ripple.scale(circle,0.4,7) }, Ripple.animationTick);
	}

	Ripple.mouseDownListen = function(e){
		var x = e.pageX - this.offsetLeft - (Ripple.initialSize/2),
			y = e.pageY - this.offsetTop  - (Ripple.initialSize/2)
		
		Ripple.down(this, e, x, y);
	}

	Ripple.keyDownListen = function(e){
		if(e.which != 32 && e.which != 13)
			return;
		else if(this.active)
			return;
		
		var x = (this.clientWidth/2)  - (Ripple.initialSize/2),
			y = (this.clientHeight/2) - (Ripple.initialSize/2) * 2;
		
		Ripple.down(this, e, x, y);
		
		this.active = true;
	}


	/*** mouseUp global document listener for all ripple elements **/
	Ripple.upListen = function(e){
		if(Ripple.tempPressedButton == null) return;
		var circle = Ripple.tempPressedButton.getElementsByClassName('circles')[0].firstChild;

		if(circle && !circle.done){
			var opacityStep =
				(parseFloat(Ripple.tempPressedButton.dataset.rippleOpacity||Ripple.defaultOpacity)/2) / 10;
			circle.done = true;
			
			requestAnimationFrame(function(){ Ripple.scale(circle,0.05,8) }, Ripple.animationTick);
			requestAnimationFrame(function(){ Ripple.fadeOut(circle,opacityStep) }, Ripple.animationTick);
		}
		
		this.active = false;
	}



	/**** FUNCTIONS ***/

	/*** Scale animation function **/
	Ripple.scale = function(item, step, final){
		item.style.transform = 'scale('+(item.scale+=step)+')';

		if(item.scale >= final) //Done scaling.
			return;
		
		requestAnimationFrame(function(){ Ripple.scale(item,step,final) }, Ripple.animationTick);
	}


	/*** Fade-out animation function **/
	Ripple.fadeOut = function(item, step){
		var opacity = parseFloat(item.style.opacity);
		item.style.opacity = (opacity-=step);

		if(opacity <= 0){ //Done fading & done everything; delete.
			item.parentNode.removeChild(item);
			return;
		}
		
		requestAnimationFrame(function(){ Ripple.fadeOut(item, step) }, Ripple.animationTick);
	}


	/*** Adding ripples **/
	Ripple.addRipples = function(item){
		var container = document.createElement('div');

		container.className = 'circles';
		item.insertBefore(container, item.firstChild);

		item.addEventListener('mousedown', Ripple.mouseDownListen);
		item.addEventListener('keydown', Ripple.keyDownListen);
		item.addEventListener('blur', function(e){
			if(e.target !== Ripple.tempPressedButton)
				return;
			Ripple.upListen(e);
		});
	}


	/*** Easing function (exponential out easing) **/
	/*** (Source: Tween.js) **/
	Ripple.ease = function(k){
		return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);
	}


	/**** INITIALIZATIONS ***/

	//Assigning global up listener:
	document.addEventListener('mouseup', Ripple.upListen);
	document.addEventListener('keyup', function(e){
		if(e.which != 32 && e.which != 13)
			return;
		Ripple.upListen(e);
		e.target.active = false;
	});

	//Assigning down listener for each ripple elements:
	var rippleElements = document.getElementsByClassName('ripple');
	for(i=0; i<rippleElements.length; i++)
		Ripple.addRipples(rippleElements[i]);
})();

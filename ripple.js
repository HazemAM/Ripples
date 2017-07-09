(function(){
	var Ripple = function(){};

	/**** VARIABLES & CONSTANTS ***/
	Ripple.defaultOpacity = '0.60';
	Ripple.tempPressedButton = null; //Used in global mouseUp listener.
	Ripple.initialSize = 18;
	Ripple.scaleDuration = 750;
	Ripple.fadeDuration = 400;
	Ripple.maxScale = 7;

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
		Ripple.scale(circle);
	}

	Ripple.mouseDownListen = function(e){
		var rect = this.getBoundingClientRect(),
			x = e.pageX - rect.left - (Ripple.initialSize/2),
			y = e.pageY - rect.top  - (Ripple.initialSize/2);
		
		Ripple.down(this, e, x, y);
	}

	Ripple.keyDownListen = function(e){
		if(e.key != ' ' && e.key != 'Spacebar'
			&& e.key != 'Enter'
			&& e.keyCode != 13 && e.keyCode != 32)
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
			
			Ripple.fadeOut(circle);
		}
		
		this.active = false;
	}



	/**** FUNCTIONS ***/

	/*** Scale animation function **/
	Ripple.scale = function(item){
		var startTime = Ripple.now(),
			timePassed,
			progress,
			animationID;
		
		(function doScale(){
			timePassed = Ripple.now() - startTime;
			progress = Math.min(timePassed / Ripple.scaleDuration, 1);

			item.scale = Ripple.maxScale * Ripple.ease(progress);
			item.style.webkitTransform = 'scale(' + item.scale + ')';
			item.style.transform = 'scale3d(' + item.scale + ',' + item.scale + ',1)';

			if(progress === 1){ //Done scaling.
				window.cancelAnimationFrame(animationID);
				animationID = null;
				return;
			}

			animationID = window.requestAnimationFrame(doScale);
		})();
	}


	/*** Fade-out animation function **/
	Ripple.fadeOut = function(item){
		var startTime = Ripple.now(),
			timePassed,
			progress,
			animationID;

		var initialOpacity = parseFloat(item.style.opacity),
			opacity;

		(function doFadeOut(){
			timePassed = Ripple.now() - startTime;
			progress = Math.min(timePassed / Ripple.fadeDuration, 1);
			
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


	/*** Getting time now **/
	Ripple.now = (window.performance && window.performance.now)
		? window.performance.now.bind(window.performance)
		: Date.now;


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

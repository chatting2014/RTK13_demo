
function Game(canvas,context){	
	var _map;
	var _controlpanel;
	var _keyStates = {};
	var _running = false;
	var _images;
	
	var self = this;
	function clear() {
		context.clearRect(0, 0, canvas.width, canvas.height);
	};
	this.init = function() {
		
		window.requestAnimationFrame = 
						window.webkitRequestAnimationFrame	||
						window.mozRequestAnimationFrame 	||
						window.oRequestAnimationFrame 		||
						window.msRequestAnimationFrame 		||
						function(callback, element ) 
						{
							window.setTimeout( callback, 1000/FPS );
						};
		canvas.onclick = function(e){
			var x = e.pageX - canvas.offsetLeft;
			var y = e.pageY - canvas.offsetTop;
			//console.log("click: ",x,y);

		};
		canvas.onmousemove = function(e){
			var x = e.pageX - canvas.offsetLeft;
			var y = e.pageY - canvas.offsetTop;
			if(x <= WIDTH && y <= HEIGHT && _map.onmousemove)			
				_map.onmousemove(x, y);
			else if(_controlpanel.onmousemove)
				_controlpanel.onmousemove(x, y);
		};
		canvas.onmousedown = function(e){
			var x = e.pageX - canvas.offsetLeft;
			var y = e.pageY - canvas.offsetTop;
			
			if(x <= WIDTH && y <= HEIGHT && _map.onmousedown)
			{
				_map.onmousedown(x, y);			
			}
			else if(_controlpanel.onmousedown)
				_controlpanel.onmousedown(x, y);
		};
		//new key
		canvas.onkeydown = function(e){
			_controlpanel.onkeydown(e);
		}
		canvas.onkeyup = function(e){
			_controlpanel.onkeyup(e);
		}
		//end new	
		
		context.textAlign = "left";
		
		_map = new Map(canvas.width, canvas.height);
		_map.onFinishedGame = function() {
			_running = false;			
			setup();
		};
		_controlpanel = new ControlPanel(WIDTH, 0, PANEL_WIDTH, HEIGHT, _map, context);
		
		this.newGame();
	};
	
	this.newGame = function(){
		_map.reset();
		
		draw();
		//_timer = window.setInterval(update,1000/FPS);	
		_running = true;
		requestAnimationFrame(update);
	};
	
	function draw() {
		
		clear();
		_map.draw(context);
		_controlpanel.draw(context);
	}	
	function update() {
		if(!_running)
			return;
		_map.update();		
		_controlpanel.update();	
			
		draw();
		
		requestAnimationFrame(update);
	}
}

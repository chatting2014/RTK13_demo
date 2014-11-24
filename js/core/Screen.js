function Screen(canvas){
	var timer;
	var width = canvas.width;
	var height = canvas.height;
	var context = canvas.getContext("2d");
	
	this.items = [];
	// this method/event is actived in the end of draw() method
	this.afterDraw = null;
	this.beforeDraw = null;
	
	this.update = function(){		
		
		for(var i=0;i<this.items.length;i++){
			this.items[i].update();
		}
	};
	this.draw = function(){

		context.fillStyle = "black";
		context.fillRect(0,0,width,height);
		
		if(this.beforeDraw)
			this.beforeDraw(context);
		
			
		for(var i=0;i<this.items.length;i++){
			this.items[i].draw(context);
		}				
		
		if(this.afterDraw)
			this.afterDraw(context);
	};
	this.start = function(){
		this.stop();
		var self = this;
		// register events
		canvas.onclick = function(e){
			// raise the onclick event of each MenuItem when it is clicked
			var x = e.pageX - this.offsetLeft;
			var y = e.pageY - this.offsetTop;
			for(var i=0;i<self.items.length;i++){
				if(self.items[i].onclick && self.items[i].contain(x,y))
					self.items[i].onclick(x,y);
			}
		};
		canvas.onmousemove = function(e){
			// change the isMouseOver property of each MenuItem
			var x = e.pageX - this.offsetLeft;
			var y = e.pageY - this.offsetTop;
			canvas.style.cursor = 'default';
			for(var i=0;i<self.items.length;i++){
				self.items[i].isMouseOver = self.items[i].contain(x,y);
				// change the cursor type to hand
				if(self.items[i].isMouseOver)
					canvas.style.cursor = 'pointer';
			}
		};
		timer = setInterval(function(){
			self.update();
			self.draw();
		},1000/FPS);
	};
	this.stop = function(){
		if(timer)
			clearInterval(timer);
		timer = null;
		canvas.style.cursor = 'default';
		canvas.onmousemove = null;
		canvas.onclick = null;
	};
	this.addItem = function(item){
		this.items.push(item);
	};
}
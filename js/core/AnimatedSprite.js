function AnimatedSprite(data) {
	this.init(data);
	this.isFinished = false;
	this.currentSprite = null;
	this.currentFrame = 0;
	this.lastTick = 0;
};

AnimatedSprite.prototype = {
	start: function(){
		this.isFinished = false;
		this.currentFrame = 0;
	},
	init: function(data)
	{
		if(data){
		
			this.isLooping = data.isLooping;
			if(typeof this.isLooping!="boolean")
				this.isLooping = true;

			this.image = data.image;
			this.frameWidth = data.frameWidth;
			this.frameHeight = data.frameHeight || this.frameWidth;
			this.framesPerRow = Math.floor(this.image.width/this.frameWidth),
			this.sprites = [];
			this.interval = data.interval;
			
			
			this.onCompleted = data.onCompleted;						
		}
		
	},
	addSprite: function(data){
		this.sprites[data.name]={
			// name : data.name,
			startFrame : data.startFrame || 0,
			framesCount : data.framesCount || 1,
			
			marginLeft : data.marginLeft || 0,
			marginTop : data.marginTop || 0,
			marginRight : data.marginRight || 0,
			marginBottom : data.marginBottom || 0
		};

		this.currentSprite = this.currentSprite || this.sprites[data.name];
		
	},
	setSprite: function(name){
		if(this.currentSprite != this.sprites[name])
		{
			this.currentSprite = this.sprites[name];
			this.currentFrame = 0;
		}
	},
	update: function(){
		if(this.isFinished)
			return;
		var newTick = (new Date()).getTime();

		if(newTick-this.lastTick>=this.interval)
		{
		
			this.currentFrame++;
			
			if(this.currentFrame==this.currentSprite.framesCount)
			{
				if(this.isLooping)
					this.currentFrame=0;
				else
				{
					this.isFinished = true;
					if(this.onCompleted)
						this.onCompleted();
				}
			}
			
			this.lastTick = newTick;
		}

	},
	draw: function(context, rotation){
				
			
		if(this.isFinished)
			return;
		var realIndex = this.currentSprite.startFrame+this.currentFrame;
		var row = Math.floor(realIndex/this.framesPerRow);
		var col = realIndex % this.framesPerRow;
		
		var sx = col*this.frameWidth+this.currentSprite.marginLeft;
		var sy = row*this.frameHeight+this.currentSprite.marginTop;
		var sw = this.frameWidth-this.currentSprite.marginRight;
		var sh = this.frameHeight-this.currentSprite.marginBottom;
		
		if(rotation)
		{
			context.save();
			context.translate(this.cx, this.cy);
			context.rotate(rotation);
			context.drawImage(this.image,sx,sy,sw,sh,-this.width/2,-this.height/2,this.width,this.height);	
			context.restore();
		}else
			context.drawImage(this.image,sx,sy,sw,sh,this.left,this.top,this.width,this.height);	

	}
}
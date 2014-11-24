function StaticSprite(data) {
	this.init(data);		
};

StaticSprite.prototype = {
	
	init: function(data)
	{
		if(data){
			this.image = data.image;
			this.frameWidth = data.frameWidth;
			this.frameHeight = data.frameHeight || this.frameWidth;
			this.framesPerRow = Math.floor(this.image.width/this.frameWidth);
			this.sprites = [];
		}
	},
	addSprite: function(data){
		
		data = {
			name: data.name || "NoName",
			frameIndex : data.frameIndex || 0,
			marginLeft : data.marginLeft || 0,
			marginTop : data.marginTop || 0,
			marginRight : data.marginRight || 0,
			marginBottom : data.marginBottom || 0			
		};
		var self = this;			
		
		var row = Math.floor(data.frameIndex/this.framesPerRow);
		var col = data.frameIndex % this.framesPerRow;
				
		
		this.sprites[data.name]={
			sx : col * self.frameWidth + data.marginLeft,
			sy : row * self.frameHeight + data.marginTop,
			sw : self.frameWidth - data.marginRight,
			sh : self.frameHeight - data.marginBottom,
			draw: function(context,x,y,width,height){											
				context.drawImage(self.image,this.sx,this.sy,this.sw,this.sh,x,y,width,height);					
				
				//console.log();
			}									
		};
		
		
	},
	
}
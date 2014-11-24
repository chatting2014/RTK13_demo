function MenuItem(data){
	this.left = data.left || 0;
	this.top = data.top || 0;
	this.width = data.width || 100;
	this.height = data.height || 30;
	this.text = data.text || "Menu Item";
	this.onclick = data.onclick;

	this.right = this.left+this.width;
	this.bottom = this.top+this.height;
	this.centerX = this.left+this.width/2;
	this.centerY = this.top+this.height/2;

	this.isMouseOver = false;

	this.update = function(){

	};
	this.draw = function(context){
		context.font = "16px Arial";
		context.textAlign = "center";
		if(this.isMouseOver)
			context.fillStyle = "rgba(255,255,255,0.7)";
		else
			context.fillStyle = "rgba(255,255,255,0.2)";

		context.fillRect(this.left,this.top,this.width,this.height);

		context.fillStyle = "white";
		context.fillText(this.text,this.centerX,this.centerY);
		context.strokeRect(this.left,this.top,this.width,this.height);
	};
	this.contain = function(x,y){
		return !(x<this.left || x>this.right || y<this.top || y>this.bottom);
	};
}
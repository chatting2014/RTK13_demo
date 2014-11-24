var ONE_RAD = Math.PI / 180;
var ANGLE_EPSILON = ONE_RAD * 30;

function Officer(sprite,left,top){	

	


	this.Name;
	this.Lead;	
	this.War;
	this.Int;
	this.Pol;
	this.Charm;
	this.Horse;
	this.Spear;
	this.Bow;

	this.HP=100;
	
	this.angle = 0;
	this.sprite = sprite;

	
		
};
Officer.prototype.draw = function(context){
	
	
	context.save();
	 // translate context to center of Unit
	context.translate(this.cx,this.cy);
	
	context.rotate(this.angle);// + Math.PI/2);
//	context.rotate(this.angle + Math.PI/2);
	this.sprite.draw(context, -HALF_UNIT_SIZE, -HALF_UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
	context.restore();
	//ve so hieu cua unit
	if(this.isPlaced){
		if(this.team==1)	context.fillStyle = "rgba(0,0,255,0.5)";
		else	context.fillStyle = "rgba(255,0,0,0.5)";
		context.fillRect(this.right-2, this.bottom-11, 12, 14);
		context.fillStyle = "rgba(255,255,255,1)";
		context.font = "14px Calibri";
		context.fillText(this.number, this.right, this.bottom);
		
	}
}
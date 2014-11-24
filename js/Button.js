function Button() {
  this.isSelected = false;
  this.x = 0;
  this.y = 0;
  this.width = 1;
  this.height = 1;
  this.onclick;
  this.text;
  this.color;
  this.appear=1;
  this.enable=1;
}
Button.prototype.contain = function(x,y){
	var right = this.x + this.width;
	var bottom = this.y + this.height;
	return x > this.x && x < right &&
		 y > this.y && y < bottom;
}
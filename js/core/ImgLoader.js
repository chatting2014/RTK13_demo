function ImgLoader(sources,onProgressChanged,onCompleted) {
	this.images = {};
	var loadedImages = 0;
	var totalImages = 0;
	// get num of sources
	if(onProgressChanged || onCompleted)
		for(var src in sources) {
			  totalImages++;
		}
        var self = this;
	for(var src in sources) {
	  this.images[src] = new Image();
	  this.images[src].onload = function() {
		loadedImages++;
		if(onProgressChanged)
		{
			var percent = Math.floor((loadedImages/totalImages)*100);
			onProgressChanged(this,percent);
		}
		if(onCompleted && loadedImages >= totalImages)
			onCompleted(self.images);
	  };
	  this.images[src].onerror = function(e) {
		console.log(src);
	  };
	  this.images[src].src = sources[src];
	}
}
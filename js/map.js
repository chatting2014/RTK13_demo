
function Map(){		

	this.level = 0;	
	
	
	// land buffer
	this.land_buffer = document.createElement("canvas");
	this.land_buffer.width = WIDTH;
	this.land_buffer.height = HEIGHT;
	
	this.land_context = this.land_buffer.getContext("2d");
	this.land_bufferData;
	
	// towers buffer
	this.towers_buffer = document.createElement("canvas");
	this.towers_buffer.width = WIDTH;
	this.towers_buffer.height = HEIGHT;
	
	this.towers_context = this.towers_buffer.getContext("2d");
	this.towers_bufferData;

	this.enemies;
	this.towers;
	this.lastAddEnemy = 0;
	this.addEnemyDelay = 5000;
	
	
	// event
	this.onReset;
	this.onSelect;
	
	// show message function
	this.message;
	this.messageStartTime;
	this.messageDelay = 3000;
	this.onMessageClosed;
	this.messageUnit1x;
	this.messageUnit1y;
	this.messageUnit2x;
	this.messageUnit2y;
	this.messageCode =0;
	this.messageUnit3x=0;
	this.messageUnit3y=0;
	this.messageUnit1Killed = 0;
	this.messageUnit2Killed = 0;
	

	//new
	this.selectedUnit = new Unit(0,0);
	this.masterUnit = null;
	
	//new unit buffer
	this.units_buffer = document.createElement("canvas");
	this.units_buffer.width = WIDTH;
	this.units_buffer.height = HEIGHT;
	
	this.units_context = this.towers_buffer.getContext("2d");
	this.units_bufferData;

	this.skip = function(){
		PLAYTIME =1;
	};
	
}
Map.prototype.showMessage = function(message, onMessageClosed, unit1,unit2,code){
	this.messageUnit1x = unit1.cx;
	this.messageUnit1y = unit1.cy;
	this.messageUnit2x = unit2.cx;
	this.messageUnit2y = unit2.cy;
	this.messageCode = code;
	this.messageUnit1Killed = unit1.killedFight;
	this.messageUnit2Killed = unit2.killedFight;
	unit1.killedFight=0;
	unit2.killedFight=0;
	//code =0, 1 unit tan cong
	//code =1 , 2 unit doi dau
	//code =2 ; 2 unit vao cung 1 o
	this.messageDelay = MSGDelay;
	if(code==2)
	{
		this.messageUnit3x = this.xFrom(unit1.movePathX[STEPCOUNT],unit1.movePathY[STEPCOUNT]);
		this.messageUnit3y = this.yFrom(unit1.movePathX[STEPCOUNT],unit1.movePathY[STEPCOUNT]);
	}

	this.message = message;
	this.messageStartTime = (new Date()).getTime();	
	this.onMessageClosed = onMessageClosed;
}
Map.prototype.displayMessage = function(message, onMessageClosed, code){
	
	this.messageCode = code;
	if(code==5)	this.messageDelay = 500;
	else if(code==6) this.messageDelay = 500;

	this.message = message;
	this.messageStartTime = (new Date()).getTime();	
	this.onMessageClosed = onMessageClosed;
}

Map.prototype.containUnit = function(x, y){
	if(PLAYER!=2)
	{
		for(var i in this.team1)
		{		
			if(this.team1[i].contain(x, y))
			{
				this.selectedUnit = this.team1[i];
				return true;
			}
		}
	}
	if(PLAYER!=1)
	{
		for(var i in this.team2)
		{		
			if(this.team2[i].contain(x, y))
			{
				this.selectedUnit = this.team2[i];
				return true;
			}
		}
	}
	return false;
}
Map.prototype.buttonDone =function(){
	if(this.masterUnit && this.selectedUnit)
	{
			this.masterUnit.supplyHorse=this.masterUnit.supplyHorseTmp;
			this.masterUnit.supplySpear=this.masterUnit.supplySpearTmp;
			this.masterUnit.supplyBow=this.masterUnit.supplyBowTmp;
			this.masterUnit.troop=this.masterUnit.troopTmp;
			this.masterUnit.food=this.masterUnit.foodTmp;  
			this.selectedUnit.supplyHorse=this.selectedUnit.supplyHorseTmp;
			this.selectedUnit.supplySpear=this.selectedUnit.supplySpearTmp;
			this.selectedUnit.supplyBow=this.selectedUnit.supplyBowTmp;
			this.selectedUnit.troop=this.selectedUnit.troopTmp;
			this.selectedUnit.food=this.selectedUnit.foodTmp;
	}
};
Map.prototype.onmousemove = function(x, y){
	//toa do moi
	xCell = Math.floor((y+0.5*x+15)/30);
	yCell = Math.floor((y-0.5*x+15)/30);
//	this.xyFrom(xCell,yCell,xGrid,yGrid);
	//xGrid = (xCell-yCell)*30;
	//yGrid = (xCell+yCell)*15;
	xGrid = this.xFrom(xCell,yCell);
	yGrid = this.yFrom(xCell,yCell);

//	xG = Math.floor((y+0.5*x+15)/30);
//	yG = Math.floor((y-0.5*x+15)/30);
//	xCell = Math.floor(x/GRID_SIZE);
//	yCell = Math.floor(y/GRID_SIZE);
//	xGrid = xCell*GRID_SIZE;
//	yGrid = yCell*GRID_SIZE;
	// if selected tower wasn't placed on the map, change it's position
	if(this.selectedUnit && !this.selectedUnit.isPlaced){
		this.selectedUnit.initPosition(xCell, yCell, 0);		
	}

}
Map.prototype.onmousedown = function(x, y){
	//neu koo move type thi mouse chi vao Unit thi chon unit	
	if(!this.selectedUnit || this.selectedUnit && this.selectedUnit.isPlaced && this.selectedUnit.moveSelect == 0)
	{
		if(this.containUnit(x, y))
		{
			//neu vua co master vua co select unit mean supply
			if(this.masterUnit)
			{
				if( Math.abs(this.masterUnit.cxCell - xCell)==1 
					&& Math.abs(this.masterUnit.cyCell - yCell)==0
					|| Math.abs(this.masterUnit.cxCell - xCell)==0 
					&& Math.abs(this.masterUnit.cyCell - yCell)==1 )
				{
							this.selectedUnit.supplyHorseTmp=this.selectedUnit.supplyHorse;
							this.selectedUnit.supplySpearTmp=this.selectedUnit.supplySpear;
							this.selectedUnit.supplyBowTmp=this.selectedUnit.supplyBow;
							this.selectedUnit.troopTmp=this.selectedUnit.troop;
							this.selectedUnit.foodTmp=this.selectedUnit.food;
				}
				else	this.selectedUnit = null;
			} 
		}
		else
				this.selectedUnit = null;
	}
	else if(this.selectedUnit && !this.selectedUnit.isPlaced)	
	{
		//check neu pointer around master unit for create
		if(Math.abs(this.masterUnit.cxCell - xCell)==1 
			&& Math.abs(this.masterUnit.cyCell - yCell)==0
			|| Math.abs(this.masterUnit.cxCell - xCell)==0 
			&& Math.abs(this.masterUnit.cyCell - yCell)==1
				)
		{
			if(!this.inPosTeam(xCell,yCell,this.team1) && !this.inPosTeam(xCell,yCell,this.team2) && !this.inList(xback1,yback1,BLOCK[MAP]))
			{
				this.selectedUnit.isPlaced = true;
				this.buttonDone();
				if(this.masterUnit.team==1){
					this.selectedUnit.number=this.team1.length+1;
					this.team1.push(this.selectedUnit);
				}
				if(this.masterUnit.team==2){
					this.selectedUnit.number=this.team2.length+1;
					this.team2.push(this.selectedUnit);
				}
				this.masterUnit=null;
			}
		}
	}
	//check if in move action or not
	else if(this.selectedUnit && this.selectedUnit.isPlaced && this.selectedUnit.moveSelect == 1)
	{
		if(this.selectedUnit.rotateRequest[this.selectedUnit.moveCount]==1 && this.selectedUnit.rotateX[this.selectedUnit.moveCount]==-1)
		{
			if( Math.abs(this.selectedUnit.movePathX[this.selectedUnit.moveCount] - xCell)==1 
								&& Math.abs(this.selectedUnit.movePathY[this.selectedUnit.moveCount] - yCell)==0
								|| Math.abs(this.selectedUnit.movePathX[this.selectedUnit.moveCount] - xCell)==0 
								&& Math.abs(this.selectedUnit.movePathY[this.selectedUnit.moveCount] - yCell)==1 )
			{
				this.selectedUnit.rotateX[this.selectedUnit.moveCount]=xCell;
				this.selectedUnit.rotateY[this.selectedUnit.moveCount]=yCell;
				//this.selectedUnit.rotateRequest[this.selectedUnit.moveCount]=0;
			}
		}
		else
		{
				if(this.selectedUnit.moveCount<=this.selectedUnit.moveRange)
				{
					if(this.selectedUnit.typeName=="Spear" || this.selectedUnit.typeName=="Bow")
					{	//check neu pointer in step range for unit spear va bow
						var xMC=this.selectedUnit.movePathX[this.selectedUnit.moveCount];
						var yMC=this.selectedUnit.movePathY[this.selectedUnit.moveCount];
						//neu unit dang dung o lad der thi di phia nao cung dc
						if(this.inList(xMC,yMC,LADDER[MAP]))
						{
							if( (!this.inList(xCell,yCell,BLOCK[MAP]) || (this.inList(xCell,yCell,BLOCK[MAP]) && this.inList(xCell,yCell,LADDER[MAP])) || this.inList(xCell,yCell,TOPWALL[MAP]) ) 
								&&( Math.abs(this.selectedUnit.movePathX[this.selectedUnit.moveCount] - xCell)==1 
								&& Math.abs(this.selectedUnit.movePathY[this.selectedUnit.moveCount] - yCell)==0
								|| Math.abs(this.selectedUnit.movePathX[this.selectedUnit.moveCount] - xCell)==0 
								&& Math.abs(this.selectedUnit.movePathY[this.selectedUnit.moveCount] - yCell)==1
								|| Math.abs(this.selectedUnit.movePathX[this.selectedUnit.moveCount] - xCell)==0 
								&& Math.abs(this.selectedUnit.movePathY[this.selectedUnit.moveCount] - yCell)==0 ) )
							{
								if(this.inList(xCell,yCell,TOPWALL[MAP]))		this.selectedUnit.mOnTop=2;
								else if(this.inList(xCell,yCell,LADDER[MAP]))	this.selectedUnit.mOnTop=1;
								else											this.selectedUnit.mOnTop=0;
								this.selectedUnit.moveCount ++;
								this.selectedUnit.movePathX[this.selectedUnit.moveCount] = xCell;
								this.selectedUnit.movePathY[this.selectedUnit.moveCount] = yCell;	
							}
							else
							{
								if(this.inList(xCell,yCell,TOPWALL[MAP]))
									this.findPath(this.selectedUnit,2);
								else
									this.findPath(this.selectedUnit,1);
							}
						}
						else if(this.inList(xMC,yMC,TOPWALL[MAP]) && this.selectedUnit.mOnTop==2)
						{	//neu unit dang dung o top wall thi di top wall va lad der
							if( (this.inList(xCell,yCell,TOPWALL[MAP]) || this.inList(xCell,yCell,LADDER[MAP]) ) 
								&&( Math.abs(this.selectedUnit.movePathX[this.selectedUnit.moveCount] - xCell)==1 
								&& Math.abs(this.selectedUnit.movePathY[this.selectedUnit.moveCount] - yCell)==0
								|| Math.abs(this.selectedUnit.movePathX[this.selectedUnit.moveCount] - xCell)==0 
								&& Math.abs(this.selectedUnit.movePathY[this.selectedUnit.moveCount] - yCell)==1
								|| Math.abs(this.selectedUnit.movePathX[this.selectedUnit.moveCount] - xCell)==0 
								&& Math.abs(this.selectedUnit.movePathY[this.selectedUnit.moveCount] - yCell)==0 ) )
							{
								if(this.inList(xCell,yCell,TOPWALL[MAP]))		this.selectedUnit.mOnTop=2;
								else if(this.inList(xCell,yCell,LADDER[MAP]))	this.selectedUnit.mOnTop=1;
								
								this.selectedUnit.moveCount ++;
								this.selectedUnit.movePathX[this.selectedUnit.moveCount] = xCell;
								this.selectedUnit.movePathY[this.selectedUnit.moveCount] = yCell;	
							}
							else
							{
								this.findPath(this.selectedUnit,2);
							}
						}
						else
						{	//neu unit dang dung o duoi dat thi di duoi dat va ladder
							if( (!this.inList(xCell,yCell,BLOCK[MAP]) || (this.inList(xCell,yCell,BLOCK[MAP]) && this.inList(xCell,yCell,LADDER[MAP]))) 
								&&( Math.abs(this.selectedUnit.movePathX[this.selectedUnit.moveCount] - xCell)==1 
								&& Math.abs(this.selectedUnit.movePathY[this.selectedUnit.moveCount] - yCell)==0
								|| Math.abs(this.selectedUnit.movePathX[this.selectedUnit.moveCount] - xCell)==0 
								&& Math.abs(this.selectedUnit.movePathY[this.selectedUnit.moveCount] - yCell)==1
								|| Math.abs(this.selectedUnit.movePathX[this.selectedUnit.moveCount] - xCell)==0 
								&& Math.abs(this.selectedUnit.movePathY[this.selectedUnit.moveCount] - yCell)==0 ) )
							{
								if(this.inList(xCell,yCell,LADDER[MAP]))	this.selectedUnit.mOnTop=1;
								else											this.selectedUnit.mOnTop=0;
								this.selectedUnit.moveCount ++;
								this.selectedUnit.movePathX[this.selectedUnit.moveCount] = xCell;
								this.selectedUnit.movePathY[this.selectedUnit.moveCount] = yCell;	
							}
							else
							{
								this.findPath(this.selectedUnit,1);
							}
						}
					}
					else
					{	//check neu pointer in step range for unit khac
						if( !this.inList(xCell,yCell,BLOCK[MAP]) 
							&&( Math.abs(this.selectedUnit.movePathX[this.selectedUnit.moveCount] - xCell)==1 
							&& Math.abs(this.selectedUnit.movePathY[this.selectedUnit.moveCount] - yCell)==0
							|| Math.abs(this.selectedUnit.movePathX[this.selectedUnit.moveCount] - xCell)==0 
							&& Math.abs(this.selectedUnit.movePathY[this.selectedUnit.moveCount] - yCell)==1
							|| Math.abs(this.selectedUnit.movePathX[this.selectedUnit.moveCount] - xCell)==0 
							&& Math.abs(this.selectedUnit.movePathY[this.selectedUnit.moveCount] - yCell)==0 ) )
						{

							this.selectedUnit.moveCount ++;
							this.selectedUnit.movePathX[this.selectedUnit.moveCount] = xCell;
							this.selectedUnit.movePathY[this.selectedUnit.moveCount] = yCell;	
						}
						else
						{
							this.findPath(this.selectedUnit,0);
						}
					}
					//neu count bang range, set cac step extra bang step at move range
					if(this.selectedUnit.moveCount>this.selectedUnit.moveRange)
					{
						for(var i = this.selectedUnit.moveRange; i<=STEPMAX; i++ )
							{
								this.selectedUnit.movePathX[i+1] = this.selectedUnit.movePathX[i];
								this.selectedUnit.movePathY[i+1] = this.selectedUnit.movePathY[i];
							}
						this.selectedUnit.moveSelect = 0;
					}
				}
				else
					{
						
						
						this.selectedUnit = null;	
					}

			this.findPathAuto(this.selectedUnit,xCell,yCell,0);
		}
	}
	//neu click on map thi control panel thay doi theo
	this.onSelect();
				
}
Map.prototype.trendWind = function(){
	//tinh toan huong gio
					if(WIND==0)	{dxWIND= 0;dyWIND= 0;}
					if(WIND==1)	{dxWIND= 1;dyWIND= 0;}
					if(WIND==2)	{dxWIND=-1;dyWIND= 0;}
					if(WIND==3)	{dxWIND= 0;dyWIND= 1;}
					if(WIND==4)	{dxWIND= 0;dyWIND=-1;}
}
Map.prototype.drawWeatherWind = function(context){
	context.save();
	//ve thoi tiet
					context.fillStyle = "white";
					context.font = "15px Calibri";
					context.fillText("Weather:" , 810, 15);
					context.fillText("Wind Trend:" , 810, 33);
	
					context.textAlign = "center";
					context.fillText(WEATHERTEXT[WEATHER] , 900, 15);
	//ve huong gio
				//	this.trendWind();
					//tinh toan toa do tam va huong gio
					var x0,y0,xP,yP;
					x0 = this.xFrom(16,-14);
					y0 = this.yFrom(16,-14);
					xP = this.xFrom(16+dxWIND,dyWIND-14);
					yP = this.yFrom(16+dxWIND,dyWIND-14);
					//tam gio
					context.fillStyle = "yellow";
					context.arc(x0, y0, 7, 0 , 2 * Math.PI, false);
					context.fill();
					//huong gio
					context.strokeStyle = "yellow";
					context.lineWidth = 2;
					context.beginPath();
					context.moveTo(x0, y0);
					context.lineTo(xP, yP);	
					context.stroke();
	context.restore();
}
Map.prototype.draw = function(context){
	context.drawImage(this.land_buffer,0,0);
	//ve thoi tiet va gio
	this.drawWeatherWind(context);
	//ve mouse pointer
		context.fillStyle = "rgba(255,255,255,0.3)";
		context.beginPath();
		context.arc(xGrid, yGrid, yGRID_SIZE/2, 0 , 2 * Math.PI, false);
		context.fill();
	
//============================================================================OKOKOKOK

	for(x in this.team1){
	//	if(this.team1[x].destroyed==0)// && (this.team1[x].status!="Ambush" || PLAYER==1) && (x==this.unitNo-1 || PLAYER!=2 || this.inViewTeam(this.team1[x].cxCell, this.team1[x].cyCell, this.team2)  ) )
			this.team1[x].draw(context);
	}
		//ve cac unit va thogn so fight team1

	for(x in this.team2){
		//OK//==============hien thi CPU Unit  hoac KHONG============================================================================
	//	if(this.team2[x].destroyed==0)// && (this.team2[x].status!="Ambush" || PLAYER==2) && (x==this.unitNo-1 || PLAYER!=1 ||this.inViewTeam(this.team2[x].cxCell, this.team2[x].cyCell, this.team1) ) )
			this.team2[x].draw(context);
	}

//============================================================================OKOKOKOK
//============================================================================OKOKOKOK
//neu master unit dc select thi fill 4 o xung quanh
	if(this.masterUnit )	
	{
		var x=	this.masterUnit.cxCell ;
		var y=	this.masterUnit.cyCell;	
			context.fillStyle = "rgba(0,255,0,0.2)";
			context.strokeStyle = "rgba(0,255,0,0.3)";;
			this.fillCell(context,x,y);
			this.fillCell(context,x+1,y);
			this.fillCell(context,x-1,y);
			this.fillCell(context,x,y-1);
			this.fillCell(context,x,y+1);
	}
// neu 1 Unit duoc selected	
	if( this.selectedUnit )//&& this.selectedUnit.team==PLAYER)
	{
			
		
		//OK draw // move range
		if( this.selectedUnit.moveSelect == 1)
		{		
				var x=	this.selectedUnit.movePathX[this.selectedUnit.moveCount] ;
				var y=	this.selectedUnit.movePathY[this.selectedUnit.moveCount] ;	
			if( this.selectedUnit.rotateRequest[this.selectedUnit.moveCount] == 1 && this.selectedUnit.rotateX[this.selectedUnit.moveCount]==-1)
			{	//neu dang o che do ratate thi ve 4 huong
				var x1 =this.xFrom( x+1,y );
				var y1 =this.yFrom( x+1,y );
				var x2 =this.xFrom( x-1,y );
				var y2 =this.yFrom( x-1,y );
				var x3 =this.xFrom( x,y-1 );
				var y3 =this.yFrom( x,y-1 );
				var x4 =this.xFrom( x,y+1 );
				var y4 =this.yFrom( x,y+1 );
				context.fillStyle = "rgba(255,0,0,0.5)";
				context.beginPath();
				context.arc(x1, y1, 7, 0 , 2 * Math.PI, false);
				context.fill();
				context.beginPath();
				context.arc(x2, y2, 7, 0 , 2 * Math.PI, false);
				context.fill();
				context.beginPath();
				context.arc(x3, y3, 7, 0 , 2 * Math.PI, false);
				context.fill();
				context.beginPath();
				context.arc(x4, y4, 7, 0 , 2 * Math.PI, false);
				context.fill();
			}
					//neu count bang range, set cac step extra bang step at move range
				
			context.fillStyle = "rgba(0,255,0,0.2)";
			context.strokeStyle = "rgba(0,255,0,0.3)";
			this.fillCell(context,x,y);
			if(this.selectedUnit.typeName=="Spear" || this.selectedUnit.typeName=="Bow")
			{
				//neu unit dang dung o lad der thi di phia nao cung dc
				if(this.inList(x,y,LADDER[MAP]))
				{
					if(!this.inList(x+1,y,BLOCK[MAP]) || (this.inList(x+1,y,BLOCK[MAP]) && this.inList(x+1,y,LADDER[MAP])) || this.inList(x+1,y,TOPWALL[MAP]) )	this.fillCell(context,x+1,y);
					if(!this.inList(x-1,y,BLOCK[MAP]) || (this.inList(x-1,y,BLOCK[MAP]) && this.inList(x-1,y,LADDER[MAP])) || this.inList(x-1,y,TOPWALL[MAP]) )	this.fillCell(context,x-1,y);
					if(!this.inList(x,y-1,BLOCK[MAP]) || (this.inList(x,y-1,BLOCK[MAP]) && this.inList(x,y-1,LADDER[MAP])) || this.inList(x,y-1,TOPWALL[MAP]) )	this.fillCell(context,x,y-1);
					if(!this.inList(x,y+1,BLOCK[MAP]) || (this.inList(x,y+1,BLOCK[MAP]) && this.inList(x,y+1,LADDER[MAP])) || this.inList(x,y+1,TOPWALL[MAP]) )	this.fillCell(context,x,y+1);			
				}
				else if(this.inList(x,y,TOPWALL[MAP]) && this.selectedUnit.mOnTop==2)
				{	//neu unit dang dung o top wall thi di top wall va lad der
					if(this.inList(x+1,y,TOPWALL[MAP]) || this.inList(x+1,y,LADDER[MAP]) )	this.fillCell(context,x+1,y);
					if(this.inList(x-1,y,TOPWALL[MAP]) || this.inList(x-1,y,LADDER[MAP]) )	this.fillCell(context,x-1,y);
					if(this.inList(x,y-1,TOPWALL[MAP]) || this.inList(x,y-1,LADDER[MAP]) )	this.fillCell(context,x,y-1);
					if(this.inList(x,y+1,TOPWALL[MAP]) || this.inList(x,y+1,LADDER[MAP]) )	this.fillCell(context,x,y+1);	
				}
				else
				{	//neu unit dang dung o duoi dat thi di duoi dat va ladder
					if(!this.inList(x+1,y,BLOCK[MAP]) || (this.inList(x+1,y,BLOCK[MAP]) && this.inList(x+1,y,LADDER[MAP])) )	this.fillCell(context,x+1,y);
					if(!this.inList(x-1,y,BLOCK[MAP]) || (this.inList(x-1,y,BLOCK[MAP]) && this.inList(x-1,y,LADDER[MAP])) )	this.fillCell(context,x-1,y);
					if(!this.inList(x,y-1,BLOCK[MAP]) || (this.inList(x,y-1,BLOCK[MAP]) && this.inList(x,y-1,LADDER[MAP])) )	this.fillCell(context,x,y-1);
					if(!this.inList(x,y+1,BLOCK[MAP]) || (this.inList(x,y+1,BLOCK[MAP]) && this.inList(x,y+1,LADDER[MAP])) )	this.fillCell(context,x,y+1);
				}

			}
			else
			{
				if(!this.inList(x+1,y,BLOCK[MAP]))	this.fillCell(context,x+1,y);
				if(!this.inList(x-1,y,BLOCK[MAP]))	this.fillCell(context,x-1,y);
				if(!this.inList(x,y-1,BLOCK[MAP]))	this.fillCell(context,x,y-1);
				if(!this.inList(x,y+1,BLOCK[MAP]))	this.fillCell(context,x,y+1);
			}
		}
	
	//new ve duong di cua select context
		if(this.selectedUnit.moveCount>0)
		{
					context.fillStyle = "white";
					context.font = "15px Calibri";
					context.strokeStyle = "yellow";
					context.lineWidth = 2;
					context.beginPath();
					var xP,yP;
						xP = this.xFrom(this.selectedUnit.movePathX[0],this.selectedUnit.movePathY[0]);
						yP = this.yFrom(this.selectedUnit.movePathX[0],this.selectedUnit.movePathY[0]);
						context.moveTo(xP, yP);
					for(var imoveCount=1; imoveCount <=this.selectedUnit.moveCount; imoveCount++ )
					{
						xP = this.xFrom(this.selectedUnit.movePathX[imoveCount],this.selectedUnit.movePathY[imoveCount]);
						yP = this.yFrom(this.selectedUnit.movePathX[imoveCount],this.selectedUnit.movePathY[imoveCount]);
						context.lineTo(xP, yP);
						context.fillText(imoveCount , xP, yP);
						
					}
					context.stroke();
					//ve goc quay cho moi step neu co

					for(var imoveCount=1; imoveCount <=this.selectedUnit.moveCount; imoveCount++ )
					{
						if(this.selectedUnit.rotateX[imoveCount]>-1)
						{
							xP = this.xFrom(this.selectedUnit.movePathX[imoveCount],this.selectedUnit.movePathY[imoveCount]);
							yP = this.yFrom(this.selectedUnit.movePathX[imoveCount],this.selectedUnit.movePathY[imoveCount]);
							var xr = this.xFrom(this.selectedUnit.rotateX[imoveCount],this.selectedUnit.rotateY[imoveCount]);
							var yr = this.yFrom(this.selectedUnit.rotateX[imoveCount],this.selectedUnit.rotateY[imoveCount]);
							context.fillStyle = "rgba(255,0,0,0.5)";
							context.strokeStyle = "rgba(255,0,0,0.5)";
							context.lineWidth = 3;
							context.beginPath();
							context.moveTo(xP, yP);
							context.lineTo((xr+xP)/2, (yr+yP)/2);
							context.stroke();
							context.arc(xP, yP, 7, 0 , 2 * Math.PI, false);
							context.fill();
						}
					}
		}

	//ve hightlight unit va atackcua Unit
		var cxCellAttack =this.xFrom( this.selectedUnit.cxAttack , this.selectedUnit.cyAttack);
		var cyCellAttack =this.yFrom( this.selectedUnit.cxAttack , this.selectedUnit.cyAttack);
		var cxCellFront1 =this.xFrom( this.selectedUnit.cxFront1 , this.selectedUnit.cyFront1);
		var cyCellFront1 =this.yFrom( this.selectedUnit.cxFront1 , this.selectedUnit.cyFront1);
		//new ve highlight vi tri ,attack va front and hientai
		context.fillStyle = "rgba(0,255,0,0.4)";
		context.strokeStyle = "rgba(0,255,0,0.5)";
		this.fillCell(context,this.selectedUnit.cxCell,this.selectedUnit.cyCell);
		context.fillStyle = "rgba(255,255,0,0.3)";
		context.beginPath();
		context.arc(cxCellAttack, cyCellAttack, yGRID_SIZE/2, 0 , 2 * Math.PI, false);
		context.fill();
		context.fillStyle = "rgba(0,0,255,0.3)";
		context.fillRect(cxCellFront1-10  ,  cyCellFront1-10,20   ,20);
	//	context.beginPath();
	//	context.arc(cxCellFront1, cyCellFront1, yGRID_SIZE/2, 0 , 2 * Math.PI, false);
	//	context.fill();
	//neu la camp va Supply thi ve effect range
		context.fillStyle = "rgba(255,255,255,0.1)";
		context.strokeStyle = "rgba(255,255,255,0.3)";
		if(this.selectedUnit.typeName=="Camp" || this.selectedUnit.typeName=="Supply")
		{
			for(var x=this.selectedUnit.cxCell-3; x<=this.selectedUnit.cxCell+3;x++)
				for(var y=this.selectedUnit.cyCell-3;y<=this.selectedUnit.cyCell+3;y++)
					this.fillCell(context,x,y);

		}
	}

//OK	// phu suong toan bo man hinh
	//
		//ve mo xung quanh 2 unit can xem
		context.fillStyle = "rgba(255,255,255,0)";
		context.strokeStyle = "rgba(255,255,255,0.3)";
		var x1,x2,y1,y2;
		//scan toan bo man hinh
	if(PLAYER==1)
	{		
		for(var x=1; x<36;x++){
			for(var y=-15;y<20;y++){
				//ke o vung trong viewrange
				if(this.inViewTeam(x,y,this.team1))
				{
					this.fillCell(context,x,y);
				}
			}
		}
	}
	if(PLAYER==2)
	{		
		for(var x=1; x<36;x++){
			for(var y=-15;y<20;y++){
				//ke o vung trong viewrange
				if(this.inViewTeam(x,y,this.team2))
				{
					this.fillCell(context,x,y);
				}
			}
		}
	}
	//ve lua o nhung o co lua
	if(this.cxCellFire)
		{
			context.fillStyle = "rgba(255,0,0,0.5)";
			for(var i in this.cxCellFire)
			{
				var x = this.xFrom(this.cxCellFire[i],this.cyCellFire[i]);
				var y = this.yFrom(this.cxCellFire[i],this.cyCellFire[i]);
				
			//	context.beginPath();
			//	context.arc(x, y, yGRID_SIZE/2-3, 0 , 2 * Math.PI, false);
			//	context.fill();	
				context.fillRect(x-10  ,  y-10,20   ,20); //x1
			}
		}

//ko dc xoaaaaaaaaaaaaaaaaaaaaaaaaaaa
	// drawmessage
	if(this.message && this.messageCode==6)
	{
		context.save();
		context.fillStyle = "rgba(255,255,255,1)";
		//message here
		context.fillRect(0  ,  0,960   ,600); //x1
		context.fillStyle = "rgba(255,0,0,1)";
		context.font = "40px Calibri";
		context.textAlign = "center";
		context.fillText(this.message, 480 , 300);
		//////
		context.restore();
	}
	if(this.message && this.messageCode==5)
	{
		context.save();
		context.fillStyle = "rgba(255,255,255,0.5)";
		//message here
		context.fillRect(350  ,  0,260   ,50); //x1
		context.fillStyle = "rgba(255,0,0,1)";
		context.font = "20px Calibri";
		context.textAlign = "center";
		context.fillText("STEP: "+STEPCOUNT, 480 , 20);
		context.fillText(this.message, 480 , 40);
		//////
		context.restore();
	}
	if(this.message && this.messageCode<5)
	{
		//ve mo xung quanh 2 unit can xem
		context.save();
		context.fillStyle = "rgba(255,255,255,0.7)";
		var x1,x2,y1,y2;
		if(this.messageUnit1x<this.messageUnit2x){
			x1=this.messageUnit1x-UNIT_SIZE;
			x2=this.messageUnit2x+UNIT_SIZE;
		}
		else{ //dao vi tri
			x1=this.messageUnit2x-UNIT_SIZE;
			x2=this.messageUnit1x+UNIT_SIZE;	
		}
		if(this.messageUnit1y<this.messageUnit2y){
			y1=this.messageUnit1y-UNIT_SIZE;
			y2=this.messageUnit2y+UNIT_SIZE;
		}
		else{ //dao vi tri
			y1=this.messageUnit2y-UNIT_SIZE;
			y2=this.messageUnit1y+UNIT_SIZE;	
		}
		context.fillRect(0  ,  0,x1   ,HEIGHT); //x1
		context.fillRect(x1 ,  0,x2-x1,    y1);    //y1
		context.fillRect(x2 ,  0,WIDTH,HEIGHT); //x2
		context.fillRect(x1 , y2,x2-x1,HEIGHT); //y2
		var yoffset,yoffset1;
		if(y1<150)	{yoffset=90;yoffset1=y2-y1+150;}
		else		{yoffset=-70;yoffset1=-110;}
		//ve mui ten chi huong attack
		context.strokeStyle = "red";
		context.lineWidth = 2;
		context.beginPath();  //bat dau 1 chuoi moi
		context.moveTo(this.messageUnit1x,this.messageUnit1y);   //diem bat dau
		if(this.messageCode<2)
		{	//chi ve 1 duong
			context.lineTo(this.messageUnit2x,this.messageUnit2y);	//diem tiep theo
		}
		else
		{// code=2 ve 2 duong 
			context.lineTo(this.messageUnit3x,this.messageUnit3y);	//diem tiep theo
			context.lineTo(this.messageUnit2x,this.messageUnit2y);	//diem tiep theo

		}
		context.stroke();

	/*	//to mau 2 doi
		if(this.messageCode==1)
			context.fillStyle = "rgba(255,0,0,0.3)";	//neu 2 unit doi dau nhau, ca 2 to mau do
		else
			context.fillStyle = "rgba(0,255,0,0.3)";	//neu 1 doi	tan cong thi no mau xanh
		context.fillRect(this.messageUnit1x-10,this.messageUnit1y-10,20  ,20); //doi tan cong se  to mau green
		context.fillStyle = "rgba(255,0,0,0.3)";
		context.fillRect(this.messageUnit2x-10,this.messageUnit2y-10,20  ,20); //doi bi danh se bi to mau do
	*/
		//message 
		context.fillStyle = "rgba(255,0,0,1)";
		context.font = "20px Calibri";
		context.textAlign = "center";
		context.fillText("STEP: "+STEPCOUNT, (this.messageUnit1x+this.messageUnit2x)/2 , y1+yoffset1-20);
		context.fillText(this.message, (this.messageUnit1x+this.messageUnit2x)/2 , y1+yoffset1);
		
		//neu la truong hop splash
		if(this.messageAroundKilled)
		{
			for(var i in this.messageAroundKilled)
			{
				context.moveTo(this.messageUnit2x,this.messageUnit2y);   //diem bat dau
				context.lineTo(this.messageAroundx[i],this.messageAroundy[i]);	//diem tiep theo
				context.stroke();
			}
			for(var i in this.messageAroundKilled)
			{
				context.fillStyle = "rgba(255,0,0,1)";
				context.fillText(this.messageAroundKilled[i], this.messageAroundx[i] , this.messageAroundy[i]+yoffset) ;
			}
		}
		//hien so quan bi killed
		context.fillStyle = "rgba(255,0,0,1)";
		context.fillText(this.messageUnit1Killed, this.messageUnit1x , this.messageUnit1y+yoffset) ;
		context.fillText(this.messageUnit2Killed, this.messageUnit2x , this.messageUnit2y+yoffset) ;

		context.restore();
	}
	//newwwwwwwwwwwwwwwwwwwww
	//ve findpath
	context.fillStyle = "rgba(255,255,0,0.7)";
	context.font = "20px Calibri";
	context.fillText("Result: "+result.length , 810, 50);
	if(result.length>0)
	{
				for(var i =0;i<result.length;i++ )
				{
							var cx=this.xFrom(result[i].x,result[i].y-16);
							var cy=this.yFrom(result[i].x,result[i].y-16);
							context.beginPath();
							context.arc(cx, cy, 3, 0 , 2 * Math.PI, false);
							context.fill();
				}						
	}
}
Map.prototype.teamLost = function(team){
	var lost=1;
	for(var i in team)
		if(team[i].destroyed==0)
			lost=0;
	return lost;
};
Map.prototype.update = function(){
	//check if 1 team win lost
		if(this.teamLost(this.team1) == 1)
		{
			alert("Ban da thua tran nay!");
			this.reset(true);
			//this.showMessage(" Ban da thua tran nay "+unit1.attackText,this.skip() ,unit1,unit2,0);
		}
		if(this.teamLost(this.team2) == 1)
		{
			alert("Ban da thang tran nay!");
			this.reset(true);
			//this.showMessage(" Ban da thua tran nay "+unit1.attackText,this.skip() ,unit1,unit2,0);
		}	
	// check to close the message popup
	var tick = (new Date()).getTime();
	if(this.message && tick - this.messageStartTime >= this.messageDelay)
	{
		this.message = null;
		PLAYTIME=0;
		if(PLAYTIME==0){
				this.messageAroundKilled=[];
				this.messageAroundx=[];
				this.messageAroundy=[];
		}
			
		if(this.onMessageClosed)
			this.onMessageClosed();
	}
	//update vitri cua Unit khi di chuyen cham
	//if(PLAYTIME==1)
	{
		for(var i in this.team1)
			this.team1[i].update();
		for(var i in this.team2)
			this.team2[i].update();
	}
}
Map.prototype.contain = function(imageData, x, y){

	if(!imageData)
		return false;
	var index = Math.floor((x+y*WIDTH)*4+3);
	return imageData.data[index]!=0;
}
Map.prototype.attackCalc = function(unit1,unit2,code,tactic){
	var aF=1; //he so cua goc danh
//	if(code<=1) aF=1;	
	if(code==2) aF=0.8;
	if(code==3) aF=0.6;
	var bF1=1,bF2=1; //bonus cua loai quan
	if(code<4)
	{
		if(unit1.typeName=="Spear" && unit2.typeName=="Horse")	bF2=0.8;
		if(unit1.typeName=="Horse" && unit2.typeName=="Bow"  )	bF2=0.8;
		if(unit1.typeName=="Horse" && unit2.typeName=="Spear")	bF1=0.8;
		if(unit1.typeName==  "Bow" && unit2.typeName=="Horse")	bF1=0.8;
	}
	else
		if(unit1.typeName=="Bow" && unit2.typeName=="Spear"  )	bF2=0.6;
		
		var dA= bF1*(unit1.attack+unit1.attackBonus) - bF2*aF*(unit2.attack+unit2.attackBonus);
		//neu la shooting
		if(code==4)
			dA= unit1.shootingPower+unit1.shootingPowerBonus ;
		var dF= bF1*(unit1.defend+unit1.defendBonus) - bF2*aF*(unit2.defend+unit2.defendBonus);
		//var dT= unit1.train  - unit2.train;
		var dM= unit1.morale - unit2.morale;
		var dTr;	//% cua troop chech lech
		if(unit1.troop  > unit2.troop)
			dTr=(unit1.troop  - unit2.troop)/unit1.troop*100 ;
		else
			dTr=(unit1.troop  - unit2.troop)/unit2.troop*100 ;
		var dTotal= Math.round(dA*0.5+dF*0.5+dM*0.2+dTr*0.3);
	//neu la attack thi so nho
	//neu la tactic thi so to va att def tang
	
	if(tactic==0)
	{
		var kill1=300-2*dTotal;
		var kill2=300+2*dTotal;
		if(kill1<0 || code==4 || unit2.status=="Confuse" || unit2.status=="Retreat" || unit2.status=="Stun")
			unit1.killedTroop(0);
		else	unit1.killedTroop(kill1);
		if(kill2<0)
			unit2.killedTroop(0);
		else
			unit2.killedTroop(kill2);
	}
	else
	{
			
		var dW= tactic*unit1.officer.War/(aF*100);
		var kill1=200*(2-dW);
		var kill2=1000*dW;
		if(kill1<0 || code==4 || unit2.status=="Confuse" || unit2.status=="Retreat" || unit2.status=="Stun")
			unit1.killedTroop(0);
		else	unit1.killedTroop(Math.round(kill1));
		
			unit2.killedTroop(Math.round(kill2));
	}
	
};
Map.prototype.splashCalc = function(unit1,unit2,code,tactic){
	//4 o xung quanh
					this.attackCalc(unit1,unit2,code,tactic);
						for(var i in this.team2)
						{
							if(this.team2[i].destroyed==0)
							{
								if((Math.abs( this.team2[i].cxCell-unit2.cxCell)==1 && Math.abs( this.team2[i].cyCell-unit2.cyCell)==0)
									|| (Math.abs( this.team2[i].cxCell-unit2.cxCell)==0 && Math.abs( this.team2[i].cyCell-unit2.cyCell)==1))
								{
									this.attackCalc(unit1,this.team2[i],code,tactic);
									this.messageAroundKilled.push(this.team2[i].killedFight);
									this.messageAroundx.push(this.team2[i].cx);
									this.messageAroundy.push(this.team2[i].cy);
								}
							}
						}
					
						for(var i in this.team1)
						{
							if(this.team1[i].destroyed==0)
							{
								if( (Math.abs( this.team1[i].cxCell-unit2.cxCell)==1 && Math.abs( this.team1[i].cyCell-unit2.cyCell)==0) 
									|| (Math.abs( this.team1[i].cxCell-unit2.cxCell)==0 && Math.abs( this.team1[i].cyCell-unit2.cyCell)==1) )
								{
									this.attackCalc(unit1,this.team1[i],code,tactic);
									this.messageAroundKilled.push(this.team1[i].killedFight);
									this.messageAroundx.push(this.team1[i].cx);
									this.messageAroundy.push(this.team1[i].cy);
								}
							}
						}
					
};
Map.prototype.muddleCalc = function(unit1,unit2,code,tactic){
	//4 o xung quanh
				//	this.attackCalc(unit1,unit2,code,tactic);
		var total=0;
				if(unit2.team==2)
				{
						for(var i in this.team2)
						{
							if(this.team2[i].destroyed==0)
							{
								if((Math.abs( this.team2[i].cxCell-unit2.cxCell)==1 && Math.abs( this.team2[i].cyCell-unit2.cyCell)==0)
									|| (Math.abs( this.team2[i].cxCell-unit2.cxCell)==0 && Math.abs( this.team2[i].cyCell-unit2.cyCell)==1))
								{
									this.attackCalc(unit2,this.team2[i],code,tactic);
									total+=unit2.killedFight;
									this.messageAroundKilled.push(this.team2[i].killedFight);
									this.messageAroundx.push(this.team2[i].cx);
									this.messageAroundy.push(this.team2[i].cy);
								}
							}
						}
				}
				else
				{	
						for(var i in this.team1)
						{
							if(this.team1[i].destroyed==0)
							{
								if( (Math.abs( this.team1[i].cxCell-unit2.cxCell)==1 && Math.abs( this.team1[i].cyCell-unit2.cyCell)==0) 
									|| (Math.abs( this.team1[i].cxCell-unit2.cxCell)==0 && Math.abs( this.team1[i].cyCell-unit2.cyCell)==1) )
								{
									this.attackCalc(unit2,this.team1[i],code,tactic);
									total+=unit2.killedFight;
									this.messageAroundKilled.push(this.team1[i].killedFight);
									this.messageAroundx.push(this.team1[i].cx);
									this.messageAroundy.push(this.team1[i].cy);
								}
							}
						}
				}
		unit2.killedFight=total;	
};
Map.prototype.illusionCalc = function(unit1,unit2){
	var random = Math.floor(Math.random() * 2) ; //code =0 to 1
	if(random==1)	unit2.status="Confuse";
	else			unit2.status="Retreat";
	unit2.attackRequest=0;
	unit2.endMove(STEPCOUNT+1,1,1);
	//4 o xung quanh
				if(unit2.team==2)
				{
						for(var i in this.team2)
						{
							if(this.team2[i].destroyed==0)
							{
								if((Math.abs( this.team2[i].cxCell-unit2.cxCell)==1 && Math.abs( this.team2[i].cyCell-unit2.cyCell)==0)
									|| (Math.abs( this.team2[i].cxCell-unit2.cxCell)==0 && Math.abs( this.team2[i].cyCell-unit2.cyCell)==1))
								{
									if(this.team2[i].typeName!="Camp" && this.team2[i].typeName!="Fence")
									{
										random = Math.floor(Math.random() * 2) ; //code =0 to 1
										if(random==1)
										{
											random = Math.floor(Math.random() * 2) ; //code =0 to 1
											if(random==1)	this.team2[i].status="Confuse";
											else			this.team2[i].status="Retreat";
											this.team2[i].attackRequest=0;
											this.team2[i].endMove(STEPCOUNT+1,1,1);
										}
									}
									
								}
							}
						}
				}
				else
				{	
						for(var i in this.team1)
						{
							if(this.team1[i].destroyed==0)
							{
								if( (Math.abs( this.team1[i].cxCell-unit2.cxCell)==1 && Math.abs( this.team1[i].cyCell-unit2.cyCell)==0) 
									|| (Math.abs( this.team1[i].cxCell-unit2.cxCell)==0 && Math.abs( this.team1[i].cyCell-unit2.cyCell)==1) )
								{
									if(this.team1[i].typeName!="Camp" && this.team1[i].typeName!="Fence")
									{
										random = Math.floor(Math.random() * 2) ; //code =0 to 1
										if(random==1)
										{
											random = Math.floor(Math.random() * 2) ; //code =0 to 1
											if(random==1)	this.team1[i].status="Confuse";
											else			this.team1[i].status="Retreat";
											this.team1[i].attackRequest=0;
											this.team1[i].endMove(STEPCOUNT+1,1,1);
										}
									}
								}
							}
						}
				}
			
};
Map.prototype.tacticployCalc = function(unit1,unit2,code){
	///check la tactic ko
	if(unit1.attackRequest==3)
	{
		
			/////////////////////////////
			if(unit1.attackText=="Charge")
			{	
				var random = Math.floor(Math.random() * 102) ; //code =0 to 101
				if(unit1.officer.War<random)
				{//tactic false
					this.showMessage(unit1.officer.Name+" that bai voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//tactic success
					this.attackCalc(unit1,unit2,code,1);
						var dx= unit2.movePathX[STEPCOUNT]-unit1.movePathX[STEPCOUNT];
						var dy= unit2.movePathY[STEPCOUNT]-unit1.movePathY[STEPCOUNT];
						var xback1=unit2.movePathX[STEPCOUNT]+dx;
						var yback1=unit2.movePathY[STEPCOUNT]+dy;
						//neu cell phia sau la o trong
						if(!this.inPosTeam(xback1,yback1,this.team1)
							&& !this.inPosTeam(xback1,yback1,this.team2)
							&& !this.inList(xback1,yback1,BLOCK[MAP]))
						{
							unit1.movePathX[STEPCOUNT]=unit2.movePathX[STEPCOUNT];
							unit1.movePathY[STEPCOUNT]=unit2.movePathY[STEPCOUNT];
							unit1.setPosition(unit1.movePathX[STEPCOUNT],unit1.movePathY[STEPCOUNT],0);
							unit2.movePathX[STEPCOUNT]=xback1;
							unit2.movePathY[STEPCOUNT]=yback1;
							unit2.setPosition(xback1,yback1,0);
							unit1.changeMove(STEPCOUNT,1,1);
						}
						
						unit2.endMove(STEPCOUNT+1,1,1);
						unit2.attackRequest=0;
						this.showMessage(unit1.officer.Name+" thanh cong voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
						unit1.actionPoint-=15;	
			}
			//////////////////////////
			if(unit1.attackText=="Charge2")
			{
				var random = Math.floor(Math.random() * 102) ; //code =0 to 101
				if(unit1.officer.War<random)
				{//tactic false
					this.showMessage(unit1.officer.Name+" that bai voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//tactic success
					this.attackCalc(unit1,unit2,code,1.1);
						var dx= unit2.movePathX[STEPCOUNT]-unit1.movePathX[STEPCOUNT];
						var dy= unit2.movePathY[STEPCOUNT]-unit1.movePathY[STEPCOUNT];
						var xback1=unit2.movePathX[STEPCOUNT]+dx;
						var yback1=unit2.movePathY[STEPCOUNT]+dy;
						var xback2=unit2.movePathX[STEPCOUNT]+dx*2;
						var yback2=unit2.movePathY[STEPCOUNT]+dy*2;
						//neu cell phia sau la o trong
						if(!this.inPosTeam(xback1,yback1,this.team1)
							&& !this.inPosTeam(xback1,yback1,this.team2)
							&& !this.inList(xback1,yback1,BLOCK[MAP]))
						{
							unit1.movePathX[STEPCOUNT]=unit2.movePathX[STEPCOUNT];
							unit1.movePathY[STEPCOUNT]=unit2.movePathY[STEPCOUNT];
							unit1.setPosition(unit1.movePathX[STEPCOUNT],unit1.movePathY[STEPCOUNT],0);
							unit2.movePathX[STEPCOUNT]=xback1;
							unit2.movePathY[STEPCOUNT]=yback1;
							unit2.setPosition(xback1,yback1,0);
							//unit1.changeMove(STEPCOUNT,1,1);
							if(!this.inPosTeam(xback2,yback2,this.team1)
							&& !this.inPosTeam(xback2,yback2,this.team2)
							&& !this.inList(xback2,yback2,BLOCK[MAP]))
							{
								unit1.movePathX[STEPCOUNT]=unit2.movePathX[STEPCOUNT];
								unit1.movePathY[STEPCOUNT]=unit2.movePathY[STEPCOUNT];
								unit1.setPosition(unit1.movePathX[STEPCOUNT],unit1.movePathY[STEPCOUNT],0);
								unit2.movePathX[STEPCOUNT]=xback2;
								unit2.movePathY[STEPCOUNT]=yback2;
								unit2.setPosition(xback2,yback2,0);
								
							}
							unit1.changeMove(STEPCOUNT,1,1);
						}
						unit2.endMove(STEPCOUNT+1,1,1);
						unit2.attackRequest=0;
						this.showMessage(unit1.officer.Name+" thanh cong voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
						unit1.actionPoint-=20;	
			}
			///////////////////////////
			if(unit1.attackText=="Break")
			{
				var random = Math.floor(Math.random() * 102) ; //code =0 to 101
				if(unit1.officer.War<random)
				{//tactic false
					this.showMessage(unit1.officer.Name+" that bai voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//tactic success
					this.attackCalc(unit1,unit2,code,1.2);
						var dx= unit2.movePathX[STEPCOUNT]-unit1.movePathX[STEPCOUNT];
						var dy= unit2.movePathY[STEPCOUNT]-unit1.movePathY[STEPCOUNT];
						var xback1=unit2.movePathX[STEPCOUNT]+dx;
						var yback1=unit2.movePathY[STEPCOUNT]+dy;
						//neu cell phia sau la o trong
						if(!this.inPosTeam(xback1,yback1,this.team1)
							&& !this.inPosTeam(xback1,yback1,this.team2)
							&& !this.inList(xback1,yback1,BLOCK[MAP]))
						{
							unit1.movePathX[STEPCOUNT]=xback1;
							unit1.movePathY[STEPCOUNT]=yback1;
							unit1.setPosition(unit1.movePathX[STEPCOUNT],unit1.movePathY[STEPCOUNT],0);
							unit1.changeMove(STEPCOUNT,1,1);
						}
						unit2.endMove(STEPCOUNT+1,1,1);
						unit2.attackRequest=0;
					//50% co hoi gay Stun
					var dWar=unit1.officer.War-50;
					var random2 = Math.floor(Math.random() * 102) ; //code =0 to 101
					if(random2<dWar){	
						unit2.status="Stun";
						unit2.statusTime=0;
						this.showMessage(unit1.officer.Name+" thanh cong voi Tactic "+unit1.attackText+" va gay choang",this.skip() ,unit1,unit2,0);
					}
					else	this.showMessage(unit1.officer.Name+" thanh cong voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
						
				}
						unit1.actionPoint-=25;	
			}
			/////////////////////////////
			if(unit1.attackText=="Push")
			{
				var random = Math.floor(Math.random() * 102) ; //code =0 to 101
				if(unit1.officer.War<random)
				{//tactic false
					this.showMessage(unit1.officer.Name+" that bai voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//tactic success
					this.attackCalc(unit1,unit2,code,1);
						var dx= unit2.movePathX[STEPCOUNT]-unit1.movePathX[STEPCOUNT];
						var dy= unit2.movePathY[STEPCOUNT]-unit1.movePathY[STEPCOUNT];
						var xback1=unit2.movePathX[STEPCOUNT]+dx;
						var yback1=unit2.movePathY[STEPCOUNT]+dy;
						//neu cell phia sau la o trong
						if(!this.inPosTeam(xback1,yback1,this.team1)
							&& !this.inPosTeam(xback1,yback1,this.team2)
							&& !this.inList(xback1,yback1,BLOCK[MAP]))
						{
							unit2.movePathX[STEPCOUNT]=xback1;
							unit2.movePathY[STEPCOUNT]=yback1;
							unit2.setPosition(xback1,yback1,0);
						}
						unit2.endMove(STEPCOUNT+1,1,1);
						unit2.attackRequest=0;
						this.showMessage(unit1.officer.Name+" thanh cong voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
						unit1.actionPoint-=15;	
			}
			//////////////////////////
			if(unit1.attackText=="Push2")
			{
				var random = Math.floor(Math.random() * 102) ; //code =0 to 101
				if(unit1.officer.War<random)
				{//tactic false
					this.showMessage(unit1.officer.Name+" that bai voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//tactic success
					this.attackCalc(unit1,unit2,code,1.1);
						var dx= unit2.movePathX[STEPCOUNT]-unit1.movePathX[STEPCOUNT];
						var dy= unit2.movePathY[STEPCOUNT]-unit1.movePathY[STEPCOUNT];
						var xback1=unit2.movePathX[STEPCOUNT]+dx;
						var yback1=unit2.movePathY[STEPCOUNT]+dy;
						var xback2=unit2.movePathX[STEPCOUNT]+dx*2;
						var yback2=unit2.movePathY[STEPCOUNT]+dy*2;
						//neu cell phia sau la o trong
						if(!this.inPosTeam(xback1,yback1,this.team1)
							&& !this.inPosTeam(xback1,yback1,this.team2)
							&& !this.inList(xback1,yback1,BLOCK[MAP]))
						{
							unit2.movePathX[STEPCOUNT]=xback1;
							unit2.movePathY[STEPCOUNT]=yback1;
							unit2.setPosition(xback1,yback1,0);
							//neu cell phia sau la o trong
							if(!this.inPosTeam(xback2,yback2,this.team1)
								&& !this.inPosTeam(xback2,yback2,this.team2)
							&& !this.inList(xback2,yback2,BLOCK[MAP]))
							{
								unit2.movePathX[STEPCOUNT]+=dx;
								unit2.movePathY[STEPCOUNT]+=dy;
								unit2.setPosition(xback2,yback2,0);
							}
						}
						unit2.endMove(STEPCOUNT+1,1,1);
						unit2.attackRequest=0;
						this.showMessage(unit1.officer.Name+" thanh cong voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
						unit1.actionPoint-=20;	
			}
			///////////////////////////
			if(unit1.attackText=="Dash")
			{
				var random = Math.floor(Math.random() * 102) ; //code =0 to 101
				if(unit1.officer.War<random)
				{//tactic false
					this.showMessage(unit1.officer.Name+" that bai voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//tactic success
					this.attackCalc(unit1,unit2,code,1.2);
					unit2.endMove(STEPCOUNT+1,1,1);
					unit2.attackRequest=0;
					//50% co hoi gay Stun
					var dWar=unit1.officer.War-50;
					var random2 = Math.floor(Math.random() * 102) ; //code =0 to 101
					if(random2<dWar){	
						unit2.status="Stun";
						unit2.statusTime=0;
						this.showMessage(unit1.officer.Name+" thanh cong voi Tactic "+unit1.attackText+" va gay choang",this.skip() ,unit1,unit2,0);
					}
					else	this.showMessage(unit1.officer.Name+" thanh cong voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
						unit1.actionPoint-=25;	
			}
			//////////////////////////
			if(unit1.attackText=="FierceB")
			{
				var random = Math.floor(Math.random() * 102) ; //code =0 to 101
				if(unit1.officer.War<random)
				{//tactic false
					this.showMessage(unit1.officer.Name+" that bai voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//tactic success
					this.attackCalc(unit1,unit2,code,1);
					this.showMessage(unit1.officer.Name+" thanh cong voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
					unit1.actionPoint-=15;	
			}
			//////////////////////////
			if(unit1.attackText=="FireBow")
			{
				var random = Math.floor(Math.random() * 102) ; //code =0 to 101
				if(unit1.officer.War<random)
				{//tactic false
					this.showMessage(unit1.officer.Name+" that bai voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//tactic success
					this.attackCalc(unit1,unit2,code,1.1);
					this.cxCellFire.push(unit2.cxCell);
					this.cyCellFire.push(unit2.cyCell);
					this.showMessage(unit1.officer.Name+" thanh cong voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
					unit1.actionPoint-=20;	
			}
			//////////////////////////
			if(unit1.attackText=="SplashB")
			{
				var random = Math.floor(Math.random() * 102) ; //code =0 to 101
				if(unit1.officer.War<random)
				{//tactic false
					this.showMessage(unit1.officer.Name+" that bai voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//tactic success
					this.splashCalc(unit1,unit2,code,1);
					this.showMessage(unit1.officer.Name+" thanh cong voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
					unit1.actionPoint-=25;	
			}
			//////////////////////////
			if(unit1.attackText=="Ram")
			{
				var random = Math.floor(Math.random() * 102) ; //code =0 to 101
				if(unit1.officer.War<random)
				{//tactic false
					this.showMessage(unit1.officer.Name+" that bai voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//tactic success
					this.attackCalc(unit1,unit2,code,1);
					this.showMessage(unit1.officer.Name+" thanh cong voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
					unit1.actionPoint-=10;	
			}
			//////////////////////////
			if(unit1.attackText=="Eradiate")
			{
				var random = Math.floor(Math.random() * 102) ; //code =0 to 101
				if(unit1.officer.War<random)
				{//tactic false
					this.showMessage(unit1.officer.Name+" that bai voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//tactic success
					this.attackCalc(unit1,unit2,code,1);
					this.cxCellFire.push(unit2.cxCell);
					this.cyCellFire.push(unit2.cyCell);
					this.showMessage(unit1.officer.Name+" thanh cong voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
					unit1.actionPoint-=10;	
			}
			//////////////////////////
			if(unit1.attackText=="FierceA")
			{
				var random = Math.floor(Math.random() * 102) ; //code =0 to 101
				if(unit1.officer.War<random)
				{//tactic false
					this.showMessage(unit1.officer.Name+" that bai voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//tactic success
					this.attackCalc(unit1,unit2,code,1);
					this.showMessage(unit1.officer.Name+" thanh cong voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
					unit1.actionPoint-=15;	
			}
			//////////////////////////
			if(unit1.attackText=="FireArc")
			{
				var random = Math.floor(Math.random() * 102) ; //code =0 to 101
				if(unit1.officer.War<random)
				{//tactic false
					this.showMessage(unit1.officer.Name+" that bai voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//tactic success
					this.attackCalc(unit1,unit2,code,1.1);
					this.cxCellFire.push(unit2.cxCell);
					this.cyCellFire.push(unit2.cyCell);
					this.showMessage(unit1.officer.Name+" thanh cong voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
					unit1.actionPoint-=20;	
			}
			//////////////////////////
			if(unit1.attackText=="SplashA")
			{
				var random = Math.floor(Math.random() * 102) ; //code =0 to 101
				if(unit1.officer.War<random)
				{//tactic false
					this.showMessage(unit1.officer.Name+" that bai voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//tactic success
					this.splashCalc(unit1,unit2,code,1);
					this.showMessage(unit1.officer.Name+" thanh cong voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
					unit1.actionPoint-=25;	
			}
			//////////////////////////
			if(unit1.attackText=="FierceS")
			{
				var random = Math.floor(Math.random() * 102) ; //code =0 to 101
				if(unit1.officer.War<random)
				{//tactic false
					this.showMessage(unit1.officer.Name+" that bai voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//tactic success
					this.attackCalc(unit1,unit2,code,1.0);
					this.showMessage(unit1.officer.Name+" thanh cong voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
					unit1.actionPoint-=15;	
			}
			//////////////////////////
			if(unit1.attackText=="FireStone")
			{
				var random = Math.floor(Math.random() * 102) ; //code =0 to 101
				if(unit1.officer.War<random)
				{//tactic false
					this.showMessage(unit1.officer.Name+" that bai voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//tactic success
					this.attackCalc(unit1,unit2,code,1.1);
					this.cxCellFire.push(unit2.cxCell);
					this.cyCellFire.push(unit2.cyCell);
					this.showMessage(unit1.officer.Name+" thanh cong voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
					unit1.actionPoint-=20;	
			}
			//////////////////////////
			if(unit1.attackText=="SplashS")
			{
				var random = Math.floor(Math.random() * 102) ; //code =0 to 101
				if(unit1.officer.War<random)
				{//tactic false
					this.showMessage(unit1.officer.Name+" that bai voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//tactic success
					this.splashCalc(unit1,unit2,code,1);
					this.showMessage(unit1.officer.Name+" thanh cong voi Tactic "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}					
					unit1.actionPoint-=25;	
			}

			///////////////////////////////////////////
					
		
	}		
	///check ploy co success ko			
	if(unit1.attackRequest==2)
	{
				
			//////////////////////////
			if(unit1.attackText=="Fire")
			{
				var random = Math.floor(Math.random() * 100) ; //code =0 to 99
				if(unit1.officer.Int<=unit2.officer.Int || unit1.officer.Int-unit2.officer.Int+40<random )
				{//Ploy false
					this.showMessage(unit1.officer.Name+" that bai voi Ploy "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//Ploy success
					this.cxCellFire.push(unit2.cxCell);
					this.cyCellFire.push(unit2.cyCell);
					unit2.killedTroop(300+5*unit1.officer.Int);
					this.showMessage(unit1.officer.Name+" thanh cong voi Ploy "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
				unit1.actionPoint-=10;	
			}
			//////////////////////////
			if(unit1.attackText=="Confuse")
			{
				var random = Math.floor(Math.random() * 100) ; //code =0 to 99
				if(unit1.officer.Int<=unit2.officer.Int || unit1.officer.Int-unit2.officer.Int+40<random )
				{//Ploy false
					this.showMessage(unit1.officer.Name+" that bai voi Ploy "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//Ploy success
					unit2.status=unit1.attackText;
					unit2.statusTime=0;
					unit2.attackRequest=0;
					unit2.endMove(STEPCOUNT+1,0,0);
					this.showMessage(unit1.officer.Name+" thanh cong voi Ploy "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
				unit1.actionPoint-=15;	
			}	
			//////////////////////////
			if(unit1.attackText=="Retreat")
			{
				var random = Math.floor(Math.random() * 100) ; //code =0 to 99
				if(unit1.officer.Int<=unit2.officer.Int || unit1.officer.Int-unit2.officer.Int+40<random )
				{//Ploy false
					this.showMessage(unit1.officer.Name+" that bai voi Ploy "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//Ploy success
					unit2.status=unit1.attackText;
					unit2.statusTime=0;
					unit2.attackRequest=0;
					unit2.endMove(STEPCOUNT+1,0,0);
					this.showMessage(unit1.officer.Name+" thanh cong voi Ploy "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
				unit1.actionPoint-=15;	
			}	
			//////////////////////////
			if(unit1.attackText=="Taunt")
			{
				var random = Math.floor(Math.random() * 100) ; //code =0 to 99
				if(unit1.officer.Int<=unit2.officer.Int || unit1.officer.Int-unit2.officer.Int+40<random )
				{//Ploy false
					this.showMessage(unit1.officer.Name+" that bai voi Ploy "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//Ploy success
					unit2.status=unit1.attackText;
					unit2.statusTime=0;
					unit2.attackRequest=0;
					unit2.persuit(unit1);
					this.showMessage(unit1.officer.Name+" thanh cong voi Ploy "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
				unit1.actionPoint-=15;	
			}	
			//////////////////////////
			if(unit1.attackText=="Muddle")
			{
				var random = Math.floor(Math.random() * 100) ; //code =0 to 99
				if(unit1.officer.Int<=unit2.officer.Int || unit1.officer.Int-unit2.officer.Int+40<random )
				{//Ploy false
					this.showMessage(unit1.officer.Name+" that bai voi Ploy "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//Ploy success
					unit2.attackRequest=0;
					this.muddleCalc(unit1,unit2,1,0);
					this.showMessage(unit1.officer.Name+" thanh cong voi Ploy "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
				unit1.actionPoint-=20;	
			}
			//////////////////////////
			if(unit1.attackText=="Illusion")
			{
				var random = Math.floor(Math.random() * 100) ; //code =0 to 99
				if(unit1.officer.Int<=unit2.officer.Int || unit1.officer.Int-unit2.officer.Int+40<random )
				{//Ploy false
					this.showMessage(unit1.officer.Name+" that bai voi Ploy "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}	
				else
				{//Ploy success
					unit2.attackRequest=0;
					this.illusionCalc(unit1,unit2);
					this.showMessage(unit1.officer.Name+" thanh cong voi Ploy "+unit1.attackText,this.skip() ,unit1,unit2,0);
				}
				unit1.actionPoint-=30;	
			}	
			//////////////////////////////////////////
			

		
	}		

	
	unit1.attackRequest=0;
	
}
Map.prototype.xFrom =function(xc,yc){
	
	return (xc-yc)*30;
	
}
Map.prototype.yFrom =function(xc,yc){
	
	return (xc+yc)*15;
	
}
Map.prototype.fillCell =function(context,xc,yc){
	var x = this.xFrom(xc,yc);
	var y = this.yFrom(xc,yc);
	context.beginPath();
    context.moveTo(x, y-yGRID_SIZE/2);
    context.lineTo(x-xGRID_SIZE/2, y);
    context.lineTo(x, y+yGRID_SIZE/2);
    context.lineTo(x+xGRID_SIZE/2, y);
    context.closePath();
    context.lineWidth = 1;
    
  //  context.fillStyle = "rgba(255,255,255,0.1)";
    context.fill();
//   context.strokeStyle = 'blue';
    context.stroke();
}
Map.prototype.inViewTeam =function(xc,yc,team1){
	var inView=0;
				for(var i in team1){

					if( team1[i].destroyed==0 && xc<=(team1[i].cxCell+3) && yc<=(team1[i].cyCell+3) && xc>=(team1[i].cxCell-3) && yc>=(team1[i].cyCell-3) ) 
					{
						inView=1;
					}
				}
			if(team1[0].team==1)
			{
		
				for(var j in TOPWALL[MAP].x)
				{	//check if cell thuoc list thi set bit
					if(xc<=(TOPWALL[MAP].x[j]+3) && yc<=(TOPWALL[MAP].y[j]+3) && xc>=(TOPWALL[MAP].x[j]-3) && yc>=(TOPWALL[MAP].y[j]-3)  )
						inView=1;
				}
			}
	return inView;
}
Map.prototype.inPosTeam =function(xc,yc,team){
	var inPos=0;
				for(var i in team){
				
					if(  xc==(team[i].cxCell) && yc==(team[i].cyCell)  ) 
					{
						inPos=1;
					}
					////ko thuoc block list
					//ko can vi da co o singleinPos=this.inList(xc,yc,BLOCK[MAP]);
					//ko thuoc vien xung quanh la wall
	   				if(yc>=xc || yc<=0-xc || yc<=xc-32 || yc>=40-xc)	inPos=1;
				}
	return inPos;
}
Map.prototype.inPosTeamView =function(unit1,team,code){
	//tim 1 unit co trong tactic or ploy range cua team kia ko
	//neu code=2 la ploy ko can xet den uOntop
	//neu code=3 la tactic can xet den uontop cac cac dao quan tru cata va tower 
	//&& Math.abs(team1[i].uOnTop-team1[j].uOnTop)<2
	var inPos=0;
	for(var i in team){
		if(code==2)
		{
			if( team[i].status!="Ambush" && unit1.cxFront1==team[i].cxCell && unit1.cyFront1==team[i].cyCell
				&& Math.abs(unit1.ployTop-team[i].uOnTop)<=1  ) 
			{
				inPos=1;
			}
		}
		else if(code==3)
		{
			if( team[i].status!="Ambush" && unit1.cxAttack==team[i].cxCell && unit1.cyAttack==team[i].cyCell 
				&& (  (unit1.uOnTop-team[i].uOnTop>=-1 && unit1.typeName!="Catapult" && unit1.typeName!="Tower" ) 
					  || ( (unit1.typeName=="Catapult" || unit1.typeName=="Tower") && Math.abs(unit1.shotTop-team[i].uOnTop)<=1 ) )  ) 			
			{
				inPos=1;
			}
		}
	}
	return inPos;
}
Map.prototype.initTeam = function(){
	var idArray= [0,1,2,3,4,5,6,7,8,9,10,11,12]
	this.team1 = [];
	this.team2 = [];
	if(MAP==1)
	{
		for(var i=0;i<this.unitNo;i++)
		{	//team111111111111111111111111111111111111
			//if(i==3)			this.selectedUnit = UnitFactory.createUnit(i+3);
			//	else 
			if(i==this.unitNo-1)	this.selectedUnit = UnitFactory.createUnit(8);	//unit cuoi la camp
			//	else if(i>3)	this.selectedUnit = UnitFactory.createUnit(0);	
				else			this.selectedUnit = UnitFactory.createUnit(0);
			
			if(this.selectedUnit.typeName!="Camp" && this.selectedUnit.typeName!="Fence")
			{
				//create officer normal
				//this.selectedUnit.officer = OfficerFactory.createOfficer(i)	;
				//create officer random
				var id= Math.floor(Math.random()*(idArray.length));
				this.selectedUnit.officer = OfficerFactory.createOfficer(idArray[id])	;
				idArray.splice(id,1);
			}
			this.selectedUnit.initPosition(15+i,-9,1);  //26,-2+i,1);
			//this.selectedUnit.initPosition(14+i,-5,1);

			if(this.selectedUnit.typeName=="Camp" || this.selectedUnit.typeName=="Fence")
			{
				this.selectedUnit.angle = 0;//Math.PI/3;//(19,i-6);
				this.selectedUnit.troop = P1CampTroop;
				this.selectedUnit.food = P1CampFood;
			}
			else
			{
				this.selectedUnit.rotateAngle(15+i,-8); //25,-2+i);
				//this.selectedUnit.rotateAngle(14+i,-4);
				this.selectedUnit.troop = P1Troop;
				this.selectedUnit.food = P1Food;
			}
			this.selectedUnit.number = i+1;
			this.selectedUnit.team=1;
			this.selectedUnit.isPlaced = true;	
			this.selectedUnit.actionPoint = P1AP;	
			this.selectedUnit.morale = P1Morale;
			this.team1.push(this.selectedUnit);
		}
		
		for(var i=0;i<this.unitNo;i++)
		{	//team2222222222222222222222222
			 //tao unit type
			if(i==this.unitNo-1)	this.selectedUnit = UnitFactory.createUnit(8);	//unit cuoi la camp
			//	else if(i>3)	this.selectedUnit = UnitFactory.createUnit(0);	
				else			this.selectedUnit = UnitFactory.createUnit(i+2);
			//set vi tri,goc quay, troop,food			
			this.selectedUnit.initPosition(15+i,-11,1);
			if(this.selectedUnit.typeName=="Camp" || this.selectedUnit.typeName=="Fence")
			{
				this.selectedUnit.angle = 0;//Math.PI/3;//(19,i-6);
				this.selectedUnit.troop=P2CampTroop;
				this.selectedUnit.food=P2CampFood;
			}
			else
			{
				this.selectedUnit.rotateAngle(15+i,-10);
				this.selectedUnit.troop = P2Troop;
				this.selectedUnit.food = P2Food;
			}

			//test
			if(i<3)
			{
				this.selectedUnit = UnitFactory.createUnit(1);
				this.selectedUnit.initPosition(13+i,-5,1);
				this.selectedUnit.rotateAngle(13+i,-4);
			}
			else if(i<this.unitNo-1)
			{
				this.selectedUnit = UnitFactory.createUnit(2);
				this.selectedUnit.initPosition(13+i,-5,1);
				this.selectedUnit.rotateAngle(13+i,-4);
			}			
			
			//this.selectedUnit.uOntop=2;
			//tao tuong
			if(this.selectedUnit.typeName!="Camp" && this.selectedUnit.typeName!="Fence")
			{
				//create officer normal
				//this.selectedUnit.officer = OfficerFactory.createOfficer(i+5);
				//create officer random
				var id= Math.floor(Math.random()*(idArray.length));
				this.selectedUnit.officer = OfficerFactory.createOfficer(idArray[id])	;
				idArray.splice(id,1);
			}
			//unit number and assign
			this.selectedUnit.number = i+1;
			this.selectedUnit.team=2;
			this.selectedUnit.isPlaced = true;	
			this.selectedUnit.actionPoint = P2AP;	
			this.selectedUnit.morale = P2Morale;	
			this.team2.push(this.selectedUnit);
		}

	}
	if(MAP==3)
	{
		if(localPlayer.host)
		{
			this.team1 = localPlayer.myTeam;
			this.team2 = localPlayer.enemyTeam;
		}
		else
		{
			this.team2 = localPlayer.myTeam;
			this.team1 = localPlayer.enemyTeam;
		}
		

		for(var i=0;i<this.unitNo;i++)
		{
			this.team1[i].initPosition(15+i,-5,1);
			this.team1[i].rotateAngle(15+i,-4,1);
			this.team1[i].team=1;
			this.team1[i].number=i+1;
			this.team1[i].isPlaced = true;
			this.team1[i].actionPoint = P1AP;	
			this.team1[i].morale = P1Morale;

			this.team2[i].initPosition(15+i,8,1);
			this.team2[i].rotateAngle(15+i,7,1);
			this.team2[i].team=2;
			this.team2[i].number=i+1;
			this.team2[i].isPlaced = true;
			this.team2[i].actionPoint = P1AP;	
			this.team2[i].morale = P1Morale;
		}
		/*

		for(var i=0;i<this.unitNo;i++)
		{	//team111111111111111111111111111111111111
			//if(i==3)			this.selectedUnit = UnitFactory.createUnit(i+3);
			//	else 
			if(i==this.unitNo-1)	this.selectedUnit = UnitFactory.createUnit(8);	//unit cuoi la camp
			//	else if(i>3)	this.selectedUnit = UnitFactory.createUnit(0);	
				else			this.selectedUnit = UnitFactory.createUnit(1);
			
			if(this.selectedUnit.typeName!="Camp" && this.selectedUnit.typeName!="Fence")
			{
				//create officer normal
				//this.selectedUnit.officer = OfficerFactory.createOfficer(i)	;
				//create officer random
			//	var id= Math.floor(Math.random()*(idArray.length));
			//	this.selectedUnit.officer = OfficerFactory.createOfficer(idArray[id])	;
			//	idArray.splice(id,1);
				if(localPlayer.host)
					this.selectedUnit.officer = OfficerFactory.createOfficer(localPlayer.myTeam[i].officer.Number)	;
				else
					this.selectedUnit.officer = OfficerFactory.createOfficer(localPlayer.enemyTeam[i].officer.Number)	;
			}
			this.selectedUnit.initPosition(15+i,-9,1);  //26,-2+i,1);
			//this.selectedUnit.initPosition(14+i,-5,1);

			if(this.selectedUnit.typeName=="Camp" || this.selectedUnit.typeName=="Fence")
			{
				this.selectedUnit.angle = 0;//Math.PI/3;//(19,i-6);
				this.selectedUnit.troop = P1CampTroop;
				this.selectedUnit.food = P1CampFood;
			}
			else
			{
				this.selectedUnit.rotateAngle(15+i,-8); //25,-2+i);
				//this.selectedUnit.rotateAngle(14+i,-4);
				this.selectedUnit.troop = P1Troop;
				this.selectedUnit.food = P1Food;
			}
			this.selectedUnit.number = i+1;
			this.selectedUnit.team=1;
			this.selectedUnit.isPlaced = true;	
			this.selectedUnit.actionPoint = P1AP;	
			this.selectedUnit.morale = P1Morale;
			this.team1.push(this.selectedUnit);
		}
			this.team1[0].initPosition(16,3,1);
		for(var i=0;i<this.unitNo;i++)
		{	//team2222222222222222222222222
			 //tao unit type
			if(i==this.unitNo-1)	this.selectedUnit = UnitFactory.createUnit(8);	//unit cuoi la camp
			//	else if(i>3)	this.selectedUnit = UnitFactory.createUnit(0);	
				else			this.selectedUnit = UnitFactory.createUnit(i+2);
			//set vi tri,goc quay, troop,food			
			this.selectedUnit.initPosition(15+i,-11,1);
			if(this.selectedUnit.typeName=="Camp" || this.selectedUnit.typeName=="Fence")
			{
				this.selectedUnit.angle = 0;//Math.PI/3;//(19,i-6);
				this.selectedUnit.troop=P2CampTroop;
				this.selectedUnit.food=P2CampFood;
			}
			else
			{
				this.selectedUnit.rotateAngle(15+i,-10);
				this.selectedUnit.troop = P2Troop;
				this.selectedUnit.food = P2Food;
			}

			//test
			if(i<3)
			{
				this.selectedUnit = UnitFactory.createUnit(2);
				this.selectedUnit.initPosition(15+i,-1,1);
				this.selectedUnit.rotateAngle(15+i,-2);
			}
			else if(i<this.unitNo-1)
			{
				this.selectedUnit = UnitFactory.createUnit(0);
				this.selectedUnit.initPosition(15+i,0,1);
				this.selectedUnit.rotateAngle(15+i,-1);
			}			
			
			//this.selectedUnit.uOntop=2;
			//tao tuong
			if(this.selectedUnit.typeName!="Camp" && this.selectedUnit.typeName!="Fence")
			{
				//create officer normal
				//this.selectedUnit.officer = OfficerFactory.createOfficer(i+5);
				//create officer random
			//	var id= Math.floor(Math.random()*(idArray.length));
			//	this.selectedUnit.officer = OfficerFactory.createOfficer(idArray[id])	;
			//	idArray.splice(id,1);
				if(!localPlayer.host)
					this.selectedUnit.officer = OfficerFactory.createOfficer(localPlayer.myTeam[i].officer.Number)	;
				else
					this.selectedUnit.officer = OfficerFactory.createOfficer(localPlayer.enemyTeam[i].officer.Number)	;
			}
			//unit number and assign
			this.selectedUnit.number = i+1;
			this.selectedUnit.team=2;
			this.selectedUnit.isPlaced = true;	
			this.selectedUnit.actionPoint = P2AP;	
			this.selectedUnit.morale = P2Morale;	
			this.team2.push(this.selectedUnit);
		}
		//*/
	}
	if(MAP==2)
	{
		if(localPlayer.host)
		{
			this.team1 = localPlayer.myTeam;
			this.team2 = localPlayer.enemyTeam;
		}
		else
		{
			this.team2 = localPlayer.myTeam;
			this.team1 = localPlayer.enemyTeam;
		}
		

		for(var i=0;i<this.unitNo;i++)
		{
			this.team1[i].initPosition(15+i,-5,1);
			this.team1[i].rotateAngle(15+i,-4,1);
			this.team1[i].team=1;
			this.team1[i].number=i+1;
			this.team1[i].isPlaced = true;
			this.team1[i].actionPoint = P1AP;	
			this.team1[i].morale = P1Morale;

			this.team2[i].initPosition(15+i,8,1);
			this.team2[i].rotateAngle(15+i,7,1);
			this.team2[i].team=2;
			this.team2[i].number=i+1;
			this.team2[i].isPlaced = true;
			this.team2[i].actionPoint = P1AP;	
			this.team2[i].morale = P1Morale;
		}

/*
		for(var i=0;i<this.unitNo;i++)
		{
			if(i==3)			this.selectedUnit = UnitFactory.createUnit(i+3);
				else if(i==this.unitNo-1)	this.selectedUnit = UnitFactory.createUnit(8);	//unit cuoi la camp
				else if(i>3)	this.selectedUnit = UnitFactory.createUnit(0);	
				else			this.selectedUnit = UnitFactory.createUnit(i);
			
			if(this.selectedUnit.typeName!="Camp" && this.selectedUnit.typeName!="Fence")
			{
				//create officer normal
				//this.selectedUnit.officer = OfficerFactory.createOfficer(i)	;
				//create officer random
				var id= Math.floor(Math.random()*(idArray.length));
				this.selectedUnit.officer = OfficerFactory.createOfficer(idArray[id])	;
				idArray.splice(id,1);
			}
			//this.selectedUnit.initPosition(26,-2+i,1);
			this.selectedUnit.initPosition(14+i,-5,1);

			if(this.selectedUnit.typeName=="Camp" || this.selectedUnit.typeName=="Fence")
			{
				this.selectedUnit.angle = 0;//Math.PI/3;//(19,i-6);
				this.selectedUnit.troop = P1CampTroop;
				this.selectedUnit.food = P1CampFood;
			}
			else
			{
				//this.selectedUnit.rotateAngle(25,-2+i);
				this.selectedUnit.rotateAngle(14+i,-4);
				this.selectedUnit.troop = P1Troop;
				this.selectedUnit.food = P1Food;
			}
			this.selectedUnit.number = i+1;
			this.selectedUnit.team=1;
			this.selectedUnit.isPlaced = true;	
			this.selectedUnit.actionPoint = P1AP;	
			this.selectedUnit.morale = P1Morale;
			this.team1.push(this.selectedUnit);
		}
		for(var i=0;i<this.unitNo;i++)
		{
			if(i==3)	this.selectedUnit = UnitFactory.createUnit(i+3);
				else if(i==this.unitNo-1)	this.selectedUnit = UnitFactory.createUnit(8);		//unit cuoi la camp
				else if(i>3)	this.selectedUnit = UnitFactory.createUnit(0);	
				else	this.selectedUnit = UnitFactory.createUnit(i);

			if(this.selectedUnit.typeName!="Camp" && this.selectedUnit.typeName!="Fence")
			{
				//create officer normal
				//this.selectedUnit.officer = OfficerFactory.createOfficer(i+5);
				//create officer random
				var id= Math.floor(Math.random()*(idArray.length));
				this.selectedUnit.officer = OfficerFactory.createOfficer(idArray[id])	;
				idArray.splice(id,1);
			}
			//this.selectedUnit.initPosition(18,-2+i,1);
			this.selectedUnit.initPosition(14+i,11,1);
			if(this.selectedUnit.typeName=="Camp" || this.selectedUnit.typeName=="Fence")
			{
				this.selectedUnit.angle = 0;//Math.PI/3;//(19,i-6);
				this.selectedUnit.troop=P2CampTroop;
				this.selectedUnit.food=P2CampFood;
			}
			else
			{
				//this.selectedUnit.rotateAngle(19,-2+i);
				this.selectedUnit.rotateAngle(14+i,10);
				this.selectedUnit.troop = P2Troop;
				this.selectedUnit.food = P2Food;
			}
			this.selectedUnit.number = i+1;
			this.selectedUnit.team=2;
			this.selectedUnit.isPlaced = true;	
			this.selectedUnit.actionPoint = P2AP;	
			this.selectedUnit.morale = P2Morale;	
			this.team2.push(this.selectedUnit);
		}
		*/
	}
	this.selectedUnit = null;	
}
Map.prototype.reset = function(ignoreEvent){
	this.messageAroundKilled =[];
	this.messageAroundx =[];
	this.messageAroundy =[];
	this.cxCellFire =[];
	this.cyCellFire =[];
	this.unitNo=5;	
	this.initTeam();
	this.team1Troop=(this.unitNo-1)*P1Troop+P1CampTroop;
	this.team2Troop=(this.unitNo-1)*P2Troop+P2CampTroop;
	this.team1Food=(this.unitNo-1)*P1Food+P1CampFood;
	this.team2Food=(this.unitNo-1)*P2Food+P2CampFood;;
	

	this.towers_context.clearRect(0, 0, WIDTH, HEIGHT);	
	this.towers_bufferData = this.towers_context.getImageData(0,0,WIDTH,HEIGHT);
	
	//this.land_context.fillStyle = "white";
	//this.land_context.fillRect(0, 0, WIDTH, HEIGHT);
	//this.land_context.drawImage(_images.stone_texture,0,0);
	if(MAP==1)	this.land_context.drawImage(_images.map001,0,0);
	if(MAP==2)	this.land_context.drawImage(_images.map002,0,0);
	if(MAP==3)	this.land_context.drawImage(_images.map003,0,0);
	this.land_context.save();
	//this.land_context.strokeStyle = "rgba(0,0,0,255)";
	//this.land_context.strokeStyle = "Green";
	//this.land_context.globalCompositeOperation = "destination-out";

/*//ve duong di
	//this.land_context.lineWidth = UNIT_SIZE * 2;
	this.land_context.lineWidth = 0;
	this.land_context.lineJoin = "round";
	
	for(var i = 0; i < this.levelData.roadsX.length; i++)
	{
		this.land_context.beginPath();
		
		var roadX = this.levelData.roadsX[i];
		var roadY = this.levelData.roadsY[i];
		this.land_context.moveTo(roadX[0], roadY[0]);
		for(var j = 1;j < roadX.length; j++)
		{
			this.land_context.lineTo(roadX[j],roadY[j]);	
		}
		
		this.land_context.stroke();
	}
*/
//new
/*
//end new
	//ve grid nghieng
	this.land_context.strokeStyle = "white";
	this.land_context.lineWidth = 1;
	this.land_context.beginPath();
	for(var iGridCount=1; iGridCount <=1200/xGRID_SIZE; iGridCount++)
	{
		this.land_context.moveTo(0, iGridCount*yGRID_SIZE- yGRID_SIZE/2);
		this.land_context.lineTo(1200 - iGridCount*xGRID_SIZE+ xGRID_SIZE/2,HEIGHT);
		this.land_context.lineTo(1200, HEIGHT- iGridCount*yGRID_SIZE+ yGRID_SIZE/2);
		this.land_context.lineTo( iGridCount*xGRID_SIZE- xGRID_SIZE/2,0);
		this.land_context.lineTo(0, iGridCount*yGRID_SIZE- yGRID_SIZE/2);
	}
	this.land_context.stroke();

//ve cac vi tri cua b lock
	this.land_context.fillStyle = "rgba(255,255,0,0.2)";
	for(var i =0;i<34;i++ )
	{
		for(var j =-15;j<15;j++ )
		{
			if(this.inList(i,j,BLOCK[MAP]))
			{
				var cx=this.xFrom(i,j);
				var cy=this.yFrom(i,j);
				this.land_context.beginPath();
				this.land_context.arc(cx, cy, 15, 0 , 2 * Math.PI, false);
				this.land_context.fill();
			}
		}
	}
	//ve cac vi tri cua top wall
	this.land_context.fillStyle = "rgba(0,0,255,0.2)";
	for(var i =0;i<34;i++ )
	{
		for(var j =-15;j<15;j++ )
		{
			if(this.inList(i,j,TOPWALL[MAP]))
			{
				var cx=this.xFrom(i,j);
				var cy=this.yFrom(i,j);
				this.land_context.beginPath();
				this.land_context.arc(cx, cy, 20, 0 , 2 * Math.PI, false);
				this.land_context.fill();
			}
		}
	}
	//ve cac vi tri cua lad der
	this.land_context.fillStyle = "rgba(255,0,255,0.2)";
	for(var i =0;i<34;i++ )
	{
		for(var j =-15;j<15;j++ )
		{
			if(this.inList(i,j,LADDER[MAP]))
			{
				var cx=this.xFrom(i,j);
				var cy=this.yFrom(i,j);
				this.land_context.beginPath();
				this.land_context.arc(cx, cy, 20, 0 , 2 * Math.PI, false);
				this.land_context.fill();
			}
		}
	}
	//ve cac vi tri cua gate
/*	this.land_context.fillStyle = "rgba(255,0,0,8)";
	for(var i =0;i<34;i++ )
	{
		for(var j =-15;j<15;j++ )
		{
			if(this.inList(i,j,POSGATE[MAP]))
			{
				var cx=this.xFrom(i,j);
				var cy=this.yFrom(i,j);
				this.land_context.beginPath();
				this.land_context.arc(cx, cy, 20, 0 , 2 * Math.PI, false);
				this.land_context.fill();
			}
		}
	}
	//ve cac vi tri cua pos1
	this.land_context.fillStyle = "rgba(255,0,0,0.2)";
	for(var i =0;i<34;i++ )
	{
		for(var j =-15;j<15;j++ )
		{
			if(this.inList(i,j,POS1[MAP]))
			{
				var cx=this.xFrom(i,j);
				var cy=this.yFrom(i,j);
				this.land_context.beginPath();
				this.land_context.arc(cx, cy, 20, 0 , 2 * Math.PI, false);
				this.land_context.fill();
			}
		}
	}
	//ve cac vi tri cua pos2
	this.land_context.fillStyle = "rgba(0,0,255,0.2)";
	for(var i =0;i<34;i++ )
	{
		for(var j =-15;j<15;j++ )
		{
			if(this.inList(i,j,POS2[MAP]))
			{
				var cx=this.xFrom(i,j);
				var cy=this.yFrom(i,j);
				this.land_context.beginPath();
				this.land_context.arc(cx, cy, 20, 0 , 2 * Math.PI, false);
				this.land_context.fill();
			}
		}
	}
	//ve cac vi tri cua pos3
	this.land_context.fillStyle = "rgba(255,0,255,0.2)";
	for(var i =0;i<34;i++ )
	{
		for(var j =-15;j<15;j++ )
		{
			if(this.inList(i,j,POS3[MAP]))
			{
				var cx=this.xFrom(i,j);
				var cy=this.yFrom(i,j);
				this.land_context.beginPath();
				this.land_context.arc(cx, cy, 20, 0 , 2 * Math.PI, false);
				this.land_context.fill();
			}
		}
	}
//end new */



//////////////////////////////////
	this.land_context.restore();	
//ko can thiet ,bi loi voi Chrome//	this.land_bufferData = this.land_context.getImageData(0,0,WIDTH,HEIGHT);
	
	this.onReset();
	if(MODE==2){
		if(PLAYER==1)
			this.displayMessage("Player 1 chuan bi",this.skip(),6 );	
		else
			this.displayMessage("Player 2 chuan bi",this.skip(),6 );	
	}


	
				
}

Map.prototype.inList = function(dx,dy,list){
			var inList=0;
			for(var j in list.x)
			{	//check if cell thuoc list thi set bit
				if(list.x[j]==dx && list.y[j]==dy)
					inList=1;
			}
			return inList;
}
var WALL = 0;
var OPEN = 1;
var graph = [];
var start = [];
var end = [];
var result = [];
Map.prototype.findPathAuto = function(unit1,xReq,yReq,code){
	//if(unit2.movePathX[unit2.moveRange]==endX && unit2.movePathY[unit2.moveRange]==endY )
		
	//else
	//	graph = this.generateRandom(36,36,code,unit2);
	//xet  endX endY thuoc lv nao, neu 
	if(code==0)
	{
		var endLevel=0;
		if(this.inList(xReq,yReq,LADDER[MAP]))	endLevel=1;
		if(this.inList(xReq,yReq,TOPWALL[MAP]))	endLevel=2;
		//unit1.uOnTop=1; //this.mOnTop
		//so sanh unit1 lv va Req lv
		if( (unit1.typeName=="Spear"||unit1.typeName=="Bow") && Math.abs(endLevel-unit1.uOnTop) ==2   )
		{	//thi dung code mix
			var result1 = [];
			var result2 = [];
			var lengthMin = 10000;
			result =[];
			if(this.inList(unit1.cxCell,unit1.cyCell,TOPWALL[MAP]) )
			{
				for(var i in LADDER[MAP].x)
				{
					graph = this.generateRandom(36,36,2,0);
					var xLadder=LADDER[MAP].x[i];
					var yLadder=LADDER[MAP].y[i];

					start = graph.nodes[unit1.cxCell][unit1.cyCell+16];		
		 			end = graph.nodes[xLadder][yLadder+16];
		 			
		 			result1 = astar.search(graph.nodes, start, end);

		 			graph = this.generateRandom(36,36,1,0);
		 			start = graph.nodes[xLadder][yLadder+16];		
		 			end = graph.nodes[xReq][yReq+16];
		 			
		 			result2 = astar.search(graph.nodes, start, end);

		 			if(result1.length+result2.length < lengthMin)
		 			{
						result=result1.concat(result2);
						lengthMin =result1.length+result2.length ;
					}
				}

			}
			else
			{
				for(var i in LADDER[MAP].x)
				{
					graph = this.generateRandom(36,36,1,0);
					var xLadder=LADDER[MAP].x[i];
					var yLadder=LADDER[MAP].y[i];

					start = graph.nodes[unit1.cxCell][unit1.cyCell+16];		
		 			end = graph.nodes[xLadder][yLadder+16];
		 			
		 			result1 = astar.search(graph.nodes, start, end);

		 			graph = this.generateRandom(36,36,2,0);
		 			start = graph.nodes[xLadder][yLadder+16];		
		 			end = graph.nodes[xReq][yReq+16];
		 			
		 			result2 = astar.search(graph.nodes, start, end);

		 			if(result1.length+result2.length < lengthMin)
		 			{
						result=result1.concat(result2);
						lengthMin =result1.length+result2.length ;
					}
				}
			}
				
				
		}
		else if ( (unit1.typeName=="Spear"||unit1.typeName=="Bow") && Math.abs(endLevel-unit1.uOnTop) <=1) 
		{	//thi phai dung code 1 hoac 2
			if(this.inList(unit1.cxCell,unit1.cyCell,TOPWALL[MAP]) || this.inList(xReq,yReq,TOPWALL[MAP]))
			{
				graph = this.generateRandom(36,36,2,0);
				start = graph.nodes[unit1.cxCell][unit1.cyCell+16];		
	 			end = graph.nodes[xReq][yReq+16];
	 			result = astar.search(graph.nodes, start, end);
	 		}
	 		else
	 		{
	 			graph = this.generateRandom(36,36,1,0);
				start = graph.nodes[unit1.cxCell][unit1.cyCell+16];		
	 			end = graph.nodes[xReq][yReq+16];
	 			result = astar.search(graph.nodes, start, end);	
	 		}
		}
		else
		{	//thi chi dung code 0
			graph = this.generateRandom(36,36,0,0);
				start = graph.nodes[unit1.cxCell][unit1.cyCell+16];		
	 			end = graph.nodes[xReq][yReq+16];
	 			result = astar.search(graph.nodes, start, end);
		}
	}
	else 
	{
				graph = this.generateRandom(36,36,2,0);
				start = graph.nodes[unit1.cxCell][unit1.cyCell+16];		
	 			end = graph.nodes[xReq][yReq+16];
	 			result = astar.search(graph.nodes, start, end);
	}
			
}
Map.prototype.findPath = function(unit,code){
			//				graph = this.generateRandom(36,36,code,0);
			//				start = graph.nodes[unit.cxCell][unit.cyCell+16];
 			//				end = graph.nodes[xCell][yCell+16];
 			//				result = astar.search(graph.nodes, start, end);
}
Map.prototype.posBlock = function(xReq,yReq,unit1){
//	code=2;
//	if(code==0)
//		if(this.inList(xReq,yReq,BLOCK[MAP]))	return true;						
	if(unit1.uOnTop==2)
		if(!this.inList(xReq,yReq,TOPWALL[MAP]) && !this.inList(xReq,yReq,LADDER[MAP]))		return true;
	else 
		if(this.inList(xReq,yReq,BLOCK[MAP]) )		return true;

	return false;
}
Map.prototype.generateRandom = function (width, height,code,unit2) {

	var nodes = [];

    for (var x=0; x <= width; x++) 
    {
    	var nodeRow = [];
    	var gridRow = [];

    	for(var y=0; y <= height; y++) 
    	{
	   		var isWall=OPEN;
	   		//vien xung quan la wall
	   		if(y-16>=x || y-16<=0-x || y-16<=x-32 || y-16>=40-x)	isWall=WALL;
	   		//check code de lap wall khac nhau
	   		if (code==2) {	//dang dung o ladder or wall va muon di (ladder va wall)
	   			if(!this.inList(x,y-16,LADDER[MAP]) && !this.inList(x,y-16,TOPWALL[MAP])  )	isWall=WALL;
	   		}
	   		else if (code==1) {  //dang dung o ladder va muon di (ladder va land
	   			if(this.inList(x,y-16,BLOCK[MAP]) && !this.inList(x,y-16,LADDER[MAP]) )	isWall=WALL;
	   		}
	   		else			//code =0 dang dung o alnd va chi di (land)
	   		{
	    		if(this.inList(x,y-16,BLOCK[MAP]) )	isWall=WALL;
	    	}
	    	//xet target unit pos, coi do la wall
	    	if(unit2!=0)
	    	{
	    		if(x==unit2.movePathX[unit2.moveRange] && y-16==unit2.movePathY[unit2.moveRange])
	    			isWall=WALL;
	    	}
	    	//assign wall or open to notes
    		if(isWall == 0) {
    			nodeRow.push(WALL);
    		}
    		else  {
    			nodeRow.push(OPEN);
    		}

    	}
    	nodes.push(nodeRow);
    }


    return new Graph(nodes);
};
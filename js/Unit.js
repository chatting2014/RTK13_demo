var ONE_RAD = Math.PI / 180;
var ANGLE_EPSILON = ONE_RAD * 30;

function Unit(sprite,left,top){	

	this.cellAround =function(){
			this.cxFront = this.cxCell + this.dx;
			this.cyFront = this.cyCell + this.dy;
			this.cxFront1 = this.cxCell + this.dx;
			this.cyFront1 = this.cyCell + this.dy;
			this.cxFront2 = this.cxCell + this.dx*2;
			this.cyFront2 = this.cyCell + this.dy*2;
			this.cxFront3 = this.cxCell + this.dx*3;
			this.cyFront3 = this.cyCell + this.dy*3;
			this.cxBack  = this.cxCell - this.dx;
			this.cyBack  = this.cyCell - this.dy;
			this.cxBack2  = this.cxCell - this.dx*2;
			this.cyBack2  = this.cyCell - this.dy*2;
			this.cxBack3  = this.cxCell - this.dx*3;
			this.cyBack3  = this.cyCell - this.dy*3;
			this.cxLeft  = this.cxCell + this.dy;
			this.cyLeft  = this.cyCell - this.dx;
			this.cxLeft2  = this.cxCell + this.dy*2;
			this.cyLeft2  = this.cyCell - this.dx*2;
			this.cxLeft3  = this.cxCell + this.dy*3;
			this.cyLeft3  = this.cyCell - this.dx*3;
			this.cxRight  = this.cxCell - this.dy;
			this.cyRight  = this.cyCell + this.dx;
			this.cxRight2  = this.cxCell - this.dy*2;
			this.cyRight2  = this.cyCell + this.dx*2;
			this.cxRight3  = this.cxCell - this.dy*3;
			this.cyRight3  = this.cyCell + this.dx*3;
			this.cxFront4 = this.cxCell + this.dx*4;
			this.cyFront4 = this.cyCell + this.dy*4;
			this.cxBack4  = this.cxCell - this.dx*4;
			this.cyBack4  = this.cyCell - this.dy*4;
			this.cxLeft4  = this.cxCell + this.dy*4;
			this.cyLeft4  = this.cyCell - this.dx*4;
			this.cxRight4  = this.cxCell - this.dy*4;
			this.cyRight4  = this.cyCell + this.dx*4;
			if(this.shootingRange>0)
			{
				this.cxAttack = this.cxCell + this.shootingRange*this.dx;
				this.cyAttack = this.cyCell + this.shootingRange*this.dy;
			}
			else
			{
				this.cxAttack = this.cxCell + this.dx;
				this.cyAttack = this.cyCell + this.dy;
			}
/*			//neu unit dang dung tren tuong va cell attack nam trong pvi b lock thi doi vi tri attack cell
			if(this.uOnTop==2 
				&& (this.inList(this.cxFront,this.cyFront,BLOCK[MAP]) || this.inList(this.cxFront,this.cyFront,POSGATE[MAP]) )
				&& !this.inList(this.cxFront,this.cyFront,TOPWALL[MAP]))
			{
				if(!this.inList(this.cxFront+2,this.cyFront+2,BLOCK[MAP]))
				{
					this.cxAttack +=2;
					this.cyAttack +=2;
					this.cxFront1 +=2;
					this.cyFront1 +=2;
					this.cxFront2 +=2;
					this.cyFront2 +=2;
					this.cxFront3 +=2;
					this.cyFront3 +=2;
					this.cxFront4 +=2;
					this.cyFront4 +=2;
				}
			}
			/*
			//neu unit la catapult va vi tri dung thuoc POS catapult thi doi vi tri attack cell
			if(this.typeName=="Catapult")
			{
				if( ( this.inList(this.cxAttack,this.cyAttack,BLOCK[MAP]) && this.inList(this.cxCell,this.cyCell,POS3[MAP]) ) 
					|| ( this.inList(this.cxAttack,this.cyAttack,POSGATE[MAP]) && this.inList(this.cxCell,this.cyCell,POS3[MAP]) && this.priorTB==2  )  )
				{
					this.cxAttack -=2;
					this.cyAttack -=2;
					
				}
			}
			else if(this.typeName=="Tower")
			{
				if( ( this.inList(this.cxAttack,this.cyAttack,BLOCK[MAP]) && this.inList(this.cxCell,this.cyCell,POS2[MAP]) ) 
					|| ( this.inList(this.cxAttack,this.cyAttack,POSGATE[MAP]) && this.inList(this.cxCell,this.cyCell,POS2[MAP]) && this.priorTB==2  )  )
				{
					this.cxAttack -=2;
					this.cyAttack -=2;
					
				}
			}
			//neu 1 unit bat ki dung o pos1 thi doi vi tri front  cho ploy
				if( ( this.inList(this.cxFront,this.cyFront,BLOCK[MAP]) && this.inList(this.cxCell,this.cyCell,POS1[MAP]) ) 
					|| ( this.inList(this.cxFront,this.cyFront,POSGATE[MAP]) && this.inList(this.cxCell,this.cyCell,POS1[MAP]) && this.priorTB==2  )  )
				{
					this.cxFront1 -=2;
					this.cyFront1 -=2;
					
				}
			*/
			//sau khi doi vi tri attack va ploy cho vi tri dac biet thi xet vi tri attack hoac ploy xem no thuoc onwall ko.
			//binh thuong se la tan cong bottom
			this.shotTop=0;
			this.ployTop=0;
			//neu thuoc onwall va ko thuoc gate thi ep ontop.
			if( (this.typeName=="Catapult" || this.typeName=="Tower") && this.inList(this.cxAttack,this.cyAttack,TOPWALL[MAP]) )
			{
				if(this.inList(this.cxAttack,this.cyAttack,BLOCK[MAP]) )
					this.shotTop=2;
				else
				{	//neu thuoc topwall ma ko thuoc block thi theo prior
					if(this.priorTB==2)	this.shotTop=2;
					else				this.shotTop=0;
				}
			}
			if( this.inList(this.cxFront,this.cyFront,TOPWALL[MAP]) )
			{
				if(this.inList(this.cxFront,this.cyFront,BLOCK[MAP]) )
					this.ployTop=2;
				else
				{
					if(this.priorTB==2)	this.ployTop=2;
					else				this.ployTop=0;
				}
			}
	};

	this.shotTopBottom = function(code){
		//neu cos su thay doi ve top or bottom
		if(code != this.priorTB)
		{
			this.priorTB=code;
			this.shotTop=code;
			this.ployTop=code;
			//neu unit la catapult va vi tri dung thuoc POS catapult thi doi vi tri attack cell
			/*
				if( this.typeName=="Catapult" && this.inList(this.cxFront3,this.cyFront3,POSGATE[MAP]) && this.inList(this.cxCell,this.cyCell,POS3[MAP]) )
				{
					if(this.shotTop==2)
					{	this.cxAttack -=2;
						this.cyAttack -=2;
					}
					else
					{
						this.cxAttack +=2;
						this.cyAttack +=2;
					}
				}
				if( this.typeName=="Tower" && this.inList(this.cxFront2,this.cyFront2,POSGATE[MAP]) && this.inList(this.cxCell,this.cyCell,POS2[MAP]) )
				{
					if(this.shotTop==2)
					{	this.cxAttack -=2;
						this.cyAttack -=2;
					}
					else
					{
						this.cxAttack +=2;
						this.cyAttack +=2;
					}
				}
				//neu 1 unit bat ki dung o pos1 thi doi vi tri front  cho ploy
				if( this.inList(this.cxFront,this.cyFront,POSGATE[MAP]) && this.inList(this.cxCell,this.cyCell,POS1[MAP]) )
				{
					if(this.ployTop==2)
					{	this.cxFront1 -=2;
						this.cyFront1 -=2;
					}
					else
					{
						this.cxFront1 +=2;
						this.cyFront1 +=2;
					}
				}
			*/
			
			
		}
	};

	this.rotateAngle = function(x,y){
		this.dx = x - this.cxCell;
		this.dy = y - this.cyCell;
		if(this.dx != 0)	this.dx/=Math.abs( this.dx);
		if(this.dy != 0)	this.dy/=Math.abs( this.dy);

		if(this.dx != 0 || this.dy != 0)
		{
			this.cellAround();

			if(this.dx==-1)  this.angle =  -Math.PI/3
			if(this.dx==1)	this.angle =  2*Math.PI/3;
			if(this.dy==-1)   this.angle =  Math.PI/3 
			if(this.dy==+1)   this.angle = -2*Math.PI/3 
		}

	};	
	this.setPosition = function(x, y, hold){

		
		//rotate
	
		if(hold == 0)
		{
			this.rotateAngle(x,y);	
		}
		else
		{
			this.dx = this.cxCell-x;
			this.dy = this.cyCell-y;
			
		}

		

		if(this.dx != 0)	this.dx/=Math.abs( this.dx);
		if(this.dy != 0)	this.dy/=Math.abs( this.dy);
	//	if(this.dx != 0 || this.dy !=0 ){
	//		if(this.status=="Fire")		
	//			this.status="Normal";
	//	}

		this.cxCell=x;
		this.cyCell=y;
		//cap nhat vi tri
		if(!this.inList(this.cxCell,this.cyCell,BLOCK[MAP]) && !this.inList(this.cxCell,this.cyCell,TOPWALL[MAP]))	this.uOnTop=0;
		if(this.inList(this.cxCell,this.cyCell,LADDER[MAP]))	this.uOnTop=1;
		if(this.uOnTop==1 && this.inList(this.cxCell,this.cyCell,TOPWALL[MAP]))	this.uOnTop=2;
		if(this.uOnTop==1 && !this.inList(this.cxCell,this.cyCell,BLOCK[MAP]))	this.uOnTop=0;
		this.mOnTop=this.uOnTop;

		if(this.dx != 0 || this.dy != 0)
		{
			this.cellAround();
		}
		this.cxTarget = (x-y)*30;	//Target
		this.cyTarget = (x+y)*15; //Target
	
		this.left = this.cx - HALF_UNIT_SIZE;
		this.top = this.cy - HALF_UNIT_SIZE
		this.right = this.left + UNIT_SIZE;
		this.bottom = this.top + UNIT_SIZE;

		
	};

	this.initPosition = function(x, y, hold){
		this.cx= (x-y)*30;
		this.cy= (x+y)*15;
		this.setPosition(x,y,hold);
		for(var i=0; i <= STEPMAX; i++)
		{
			this.movePathX[i] = this.cxCell;
			this.movePathY[i] = this.cyCell;
		}
		//calculate att deff cua unit dua tren officer
		if(this.officer!=0 && this.destroyed==0)
		{
			this.attack=Math.round(this.attack*this.officer.Lead/100);
			this.defend=Math.round(this.defend*this.officer.Lead/100);
			this.shootingPower=Math.round(this.shootingPower*this.officer.Lead/100);
		}
	};
	this.killedTroop = function(killed){
		this.killedFight = killed;
		if(killed>=0)
		{
			this.killedStep +=killed;
		}
	};
	this.updateTroop = function(){
		this.troop -= this.killedStep;
		this.killedFight = 0;
		this.killedStep = 0;
		if(this.troop <=0 )
		{
			this.troop = 0;
			this.food = 0;
			this.actionPoint=0;
			this.morale=0;
			this.destroyed =1; 
			if(this.team==1)
				this.initPosition(16,-15,1);
			else	this.initPosition(20,19,1);
		}
	};

	this.setPosition(left,top,0);
	this.officer=0;

	this.typeName;
	this.attack;	
	this.defend;
	this.wallDamage;
	this.shootingRange;
	this.shootingPower;
	this.moveRange;
	this.actionPoint;
	this.morale;
	
	this.attackBonus=0;
	this.defendBonus=0;
	this.shootingPowerBonus=0;
	this.targetUnit=null;
	
	this.killedFight =0;
	this.killedStep =0;
	this.attackRequest =0;
	this.attackText="Attack";
	this.attackIndex=0;
	this.destroyed =0; 
	this.team=1;
	this.isPlaced = false;
	this.number =1;

	this.supplyHorse=0;
	this.supplySpear=0;
	this.supplyBow=0;
	this.troop=3000;
	this.food=3000;
	
	this.supplyHorseTmp;
	this.supplySpearTmp;
	this.supplyBowTmp;
	this.troopTmp;
	this.foodTmp;

	this.angle = 0;
	this.sprite = sprite;
	this.status = "Normal";
	this.statusCheck=0;
	this.statusTime=0;
	this.needFood=0;
	//new 
	this.plan=0;
	this.plan1=0;
	this.moveSelect = 0;
	this.moveCount = 0;
	this.movePathX = [];
	this.movePathY = [];
	this.movePathX[0] = this.cxCell;
	this.movePathY[0] = this.cyCell;	
	this.mOnTop=0;
	this.uOnTop=0;
	this.shotTop=0;
	this.ployTop=0;
	this.priorTB=0;
	this.rotateRequest = [0,0,0,0,0,0,0,0];
	this.rotateX = [-1,-1,-1,-1,-1,-1,-1,-1];
	this.rotateY = [-1,-1,-1,-1,-1,-1,-1,-1];
		
};

Unit.prototype.update = function(){
	if(this.cx!=this.cxTarget || this.cy!=this.cyTarget)
	{
		var dx = this.cxTarget - this.cx;
		var dy = this.cyTarget - this.cy;
		if(dx != 0)	dx/=Math.abs( dx);
		if(dy != 0)	dy/=Math.abs( dy);
		dx= dx * xGRID_SIZE/yGRID_SIZE ;
		this.cx+=dx;
		this.cy+=dy;
		this.left = this.cx - HALF_UNIT_SIZE;
		this.top = this.cy - HALF_UNIT_SIZE
		this.right = this.left + UNIT_SIZE;
		this.bottom = this.top + UNIT_SIZE;
	}
	
}
Unit.prototype.draw = function(context){
	
	
	context.save();
	 // translate context to center of Unit
	context.translate(this.cx,this.cy);
	
	context.rotate(this.angle);// + Math.PI/2);
				
		//portrait = _portrait.sprites["officer"+this.map.team2[j].officer.Number];
		//var unit = new Unit(_sprites.sprites["unit"+index]);	
		//context.fillStyle = button.color;
		//context.fillRect(button.x, button.y, button.width, button.height);
		//portrait.draw(context, button.x, button.y, button.height, button.height);
	var unitSprite = _sprites.sprites["unit"+this.index];
	unitSprite.draw(context, -HALF_UNIT_SIZE, -HALF_UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
	context.restore();
	//ve so hieu cua unit
	if(this.isPlaced)
	{
		if(this.team==1)	context.fillStyle = "rgba(0,0,255,0.5)";
		else	context.fillStyle = "rgba(255,0,0,0.5)";
		context.fillRect(this.right-2, this.bottom-11, 12, 14);
		context.fillStyle = "rgba(255,255,255,1)";
		context.font = "14px Calibri";
		context.fillText(this.number, this.right, this.bottom);

		//ve status cua unit
		context.fillStyle = "rgba(255,255,255,0)";
		//pink 255-192-203
		
		
		if(this.status=="Ambush")	context.fillStyle = "rgba(255,255,255,0.5)";
		if(this.status=="Confuse")	context.fillStyle = "rgba(0,255,0,0.5)";
		if(this.status=="Retreat")	context.fillStyle = "rgba(0,0,255,0.5)";
		if(this.status=="Stun")		context.fillStyle = "rgba(128,0,128,0.5)";//Purple	#800080	(128,0,128)
		if(this.status=="Taunt")	context.fillStyle = "rgba(255,165,0,0.5)";//Orange	255-165-0
		context.beginPath();
		context.arc(this.cx, this.cy, yGRID_SIZE/2, 0 , 2 * Math.PI, false);
		context.fill();	

		//ve ladder khi leo tuong
		if(this.attackText=="Climb")
		{
			context.fillStyle = "rgba(255,255,255,1)";
			context.beginPath();
		    context.moveTo(this.cx, this.cy-15);
		    context.lineTo(this.cx, this.cy-15-STEPCOUNT*10);
		    context.lineWidth = 4;
		    context.stroke();
		}
	}
		
};
Unit.prototype.contain = function(x, y){
	return this.left <= x && this.right >= x && this.top <= y && this.bottom >= y;
};
Unit.prototype.endMove = function(iStep,back,hold){
	for(var i=iStep; i<= STEPMAX;i++)
		{
			this.movePathX[i]=this.movePathX[i-1];
			this.movePathY[i]=this.movePathY[i-1];
			
			this.rotateX[i] = this.rotateX[i-1];
			this.rotateY[i] = this.rotateY[i-1];
			this.rotateRequest[i] = this.rotateRequest[i-1];
		}
	//	if( back == 1 )
	//	 	this.setPosition(this.movePathX[iStep],this.movePathY[iStep],hold);
		 	//this.setPosition(this.movePathX[iStep]*GRID_SIZE,this.movePathY[iStep]*GRID_SIZE,hold);
};
Unit.prototype.delayMove = function(iStep,back,hold){
	if(this.movePathX[iStep]==this.movePathX[iStep+1] && this.movePathY[iStep]==this.movePathY[iStep+1])
	{
				this.movePathX[iStep]=this.movePathX[iStep-1];
				this.movePathY[iStep]=this.movePathY[iStep-1];
				this.rotateX[iStep] = this.rotateX[iStep-1];
				this.rotateY[iStep] = this.rotateY[iStep-1];
				this.rotateRequest[iStep] = this.rotateRequest[iStep-1];
	}
	else
	{
		for(var i=STEPMAX; i>=iStep;i--)
			{
				this.movePathX[i]=this.movePathX[i-1];
				this.movePathY[i]=this.movePathY[i-1];
				this.rotateX[i] = this.rotateX[i-1];
				this.rotateY[i] = this.rotateY[i-1];
				this.rotateRequest[i] = this.rotateRequest[i-1];
			}

		for(var i = this.moveRange; i<=STEPMAX; i++ )
			{
				this.movePathX[i+1] = this.movePathX[i];
				this.movePathY[i+1] = this.movePathY[i];
				this.rotateX[i+1] = this.rotateX[i];
				this.rotateY[i+1] = this.rotateY[i];
				this.rotateRequest[i+1] = this.rotateRequest[i];
			}
	}		
	//	if( back == 1 )
	//	 	this.setPosition(this.movePathX[iStep],this.movePathY[iStep],hold);
		 //this.setPosition(this.movePathX[iStep]*GRID_SIZE,this.movePathY[iStep]*GRID_SIZE,hold);
};
Unit.prototype.changeMove = function(iStep,back,hold){
	var bit=0;
	//LOOP:
	for(var i=iStep+1; i<= STEPMAX;i++)
	{
			if(this.movePathX[iStep]==this.movePathX[i] && this.movePathY[iStep]==this.movePathY[i])
			{
				for(var j=iStep;j<i;j++)
				{
					this.movePathX[j+1] = this.movePathX[j];
					this.movePathY[j+1] = this.movePathY[j];
					this.rotateX[j+1] = this.rotateX[j];
					this.rotateY[j+1] = this.rotateY[j];
					this.rotateRequest[j+1] = this.rotateRequest[j];
				}
				bit=1;
	//			break LOOP;
			}
			
			
	}
	//if ko co step nao trung
	if(bit==0)
		this.endMove(iStep+1,1,1);
};
Unit.prototype.inViewOf = function(unit2){
	var inView=0;
				
	if( unit2.destroyed==0 && this.cxCell<=(unit2.cxCell+3) && this.cyCell<=(unit2.cyCell+3) && this.cxCell>=(unit2.cxCell-3) && this.cyCell>=(unit2.cyCell-3) ) 
					{
						inView=1;
					}
				
	return inView;
};
Unit.prototype.persuit = function(unit2){
	this.targetUnit=unit2;
	for(var i=STEPCOUNT; i<= STEPMAX;i++)
		{
			this.movePathX[i+1]=unit2.movePathX[i];
			this.movePathY[i+1]=unit2.movePathY[i];
			this.rotateX[i+1] = -1;
			this.rotateY[i+1] = -1;
			this.rotateRequest[i+1] = 0;
		}
};

Unit.prototype.inList = function(dx,dy,list){
			var inList=0;
			for(var j in list.x)
			{	//check if cell thuoc list thi set bit
				if(list.x[j]==dx && list.y[j]==dy)
					inList=1;
			}
			return inList;
};
var COUNTDOWN_SECS = 120;
var COLORS = ["Wheat", "Green", "Blue", "Indigo"];
var STEPCOUNT = 0;
var STEPMAX = 7;
var STEPDELAY = 2;
var PLAYTIME = 0;
var TURN=1;



function ControlPanel(left, top, width, height, map){	
	this.map = map;
	this.unitButtons = [];
	this.actionButtons = [];
	this.selectedItem = null;
	this.left = left || 0;
	this.top = top || 0;	
	this.width = width;
	this.height = height;
	this.countDownSeconds = COUNTDOWN_SECS;
	
	this.moveDone=0;
	this.stepDone = 1;
	this.stepDelayCount = 0;
	this.init=0;
	this.updateDelay = 1000;
	this.lastUpdate = 0;

	var reset = function(){
		self.countDownSeconds = COUNTDOWN_SECS;	
		STEPCOUNT=0;
		TURN=1;	
	};
	var self = this;
	// action buttons
	this.map.onReset = function(){	
		reset();
	};
	this.map.onSelect = function(){	
		if(self.selectedItem)
			self.selectedItem.isSelected = false;
		self.selectedItem = null;
		if(map.selectedUnit)
		{
			if(map.selectedUnit.team==1 && map.selectedUnit.number<map.unitNo )
		 	{
		 		self.selectedItem = self.unitButtons[map.selectedUnit.number-1];			
				self.selectedItem.isSelected = true;
			}
			else if(map.selectedUnit.team==2 && map.selectedUnit.number<map.unitNo )
			{
		 		self.selectedItem = self.unitButtons[map.unitNo-1 +map.selectedUnit.number-1];			
				self.selectedItem.isSelected = true;
			}

			
		}
	};
	this.skip = function(){
		PLAYTIME =1;
	};
	
	
	//new
	this.cellCheck = function(team1, team2){
		var sameCell = 1;
		STEPLOOP:
		if(PLAYTIME==0)
		{
			while(sameCell == 1)
			{
				sameCell = 0;
				//check team1 vs team1
				for(i in team1)
				{
					if(team1[i].destroyed==0)
					{
						for(j in team1)
						{
							if(team1[j].destroyed==0 && Math.abs(team1[i].uOnTop-team1[j].uOnTop)<2)
							{
								if(i<j)
								{	
									if( this.pathCheck(team1[i], STEPCOUNT, team1[j], STEPCOUNT) )	
									{ 	//2 unit vao cung 1 o
										sameCell = 1;
										if(this.pathCheck(team1[i], STEPCOUNT, team1[i], STEPCOUNT-1))
										{	//neu unit 1 dung do tu truoc
											//Unit 2 quay dau theo huong du dinh di
											team1[j].rotateAngle( team1[j].movePathX[STEPCOUNT] , team1[j].movePathY[STEPCOUNT]  );

											//unit 2 dung cho  delaymove, cac vi tri du dinh tiep theo bi lui lai 1
											team1[j].delayMove(STEPCOUNT,1,1);
										}
										//else if(cx_Unit2==team1[j].movePathX[STEPCOUNT-1] && cy_Unit2==team1[j].movePathY[STEPCOUNT-1]) 
										else if(this.pathCheck(team1[j], STEPCOUNT, team1[j], STEPCOUNT-1))
										{	//neu unit2 dung do tu truoc
											//Unit 1 quay dau theo huong du dinh di
											team1[i].rotateAngle(team1[i].movePathX[STEPCOUNT],team1[i].movePathY[STEPCOUNT]);
											//unit 1 dung cho  delaymove, cac vi tri du dinh tiep theo bi lui lai 1
											team1[i].delayMove(STEPCOUNT,1,1);
										}
										else
										{	//ko unit nao dung do tu truoc
											//this unit nao co Lead cao hon se vao truoc, neu bang nhau thi random
											//call ham so sanh lead cua 2 unit
											var bit = self.compare(team1[i],team1[j],"Lead");
											if(bit==1)
											{//unit 1 hon
												//Unit 2 quay dau theo huong du dinh di
												team1[j].rotateAngle(team1[j].movePathX[STEPCOUNT],team1[j].movePathY[STEPCOUNT]);
												//unit 2 dung cho  delaymove, cac vi tri du dinh tiep theo bi lui lai 1									
												team1[j].delayMove(STEPCOUNT,1,1);
											}
											else
											{
												//Unit 2 quay dau theo huong du dinh di
												team1[i].rotateAngle(team1[i].movePathX[STEPCOUNT],team1[i].movePathY[STEPCOUNT]);
												//unit 2 dung cho  delaymove, cac vi tri du dinh tiep theo bi lui lai 1									
												team1[i].delayMove(STEPCOUNT,1,1);
											}
										}
									}
								}
							}
						}
						//check team 1 vs team 2
						for(j in team2)
						{
							if(team2[j].destroyed==0 && Math.abs(team1[i].uOnTop-team2[j].uOnTop)<2)
							{
								if( this.pathCheck(team1[i], STEPCOUNT, team2[j], STEPCOUNT) )	
								{ 	//2 unit vao cung 1 o
									sameCell = 1;
									if(this.pathCheck(team1[i], STEPCOUNT, team1[i], STEPCOUNT-1))
									{	//neu unit 1 dung do tu truoc
										//call function so 2 unit tactic, ploy, attack+location+angle
										//??????tam thoi mac dinh la unit co thu tu cao hon dc uu tien
										//Unit 2 quay dau theo huong du dinh di
										team2[j].rotateAngle( team2[j].movePathX[STEPCOUNT], team2[j].movePathY[STEPCOUNT]);
										//unit 2 bi danh bat  tro lai va end move, vi tri du dinh di lan nay bi thay the bang vi tri step truoc
										team2[j].delayMove(STEPCOUNT,1,1);
										//ko danh gi dc nua(nen co them bitnay)
									}
									//else if(cx_Unit2==units[j].movePathX[STEPCOUNT-1] && cy_Unit2==units[j].movePathY[STEPCOUNT-1]) 
									else if(this.pathCheck(team2[j], STEPCOUNT, team2[j], STEPCOUNT-1))
									{	//neu unit2 dung do tu truoc
										//call function so 2 unit tactic, ploy, attack+location+angle
										//??????tam thoi mac dinh la unit co thu tu cao hon dc uu tien
										//Unit 1 quay dau theo huong du dinh di
										team1[i].rotateAngle( team1[i].movePathX[STEPCOUNT], team1[i].movePathY[STEPCOUNT]);
										//1 unit bi danh bat  tro lai va end move, vi tri du dinh di lan nay bi thay the bang vi tri step truoc
										team1[i].delayMove(STEPCOUNT,1,1);
										//ko danh gi dc nua(nen co them bitnay)
									}
									else
									{	//ko unit nao dung do tu truoc
										map.attackCalc(team1[i],team2[j],0,0);
										//this unit nao co Lead cao hon se vao truoc, neu bang nhau thi random
										//call ham so sanh lead cua 2 unit
										var bit = self.compare(team1[i],team2[j],"Lead");
										if(bit==1)
										{//unit 1 hon
											//Unit thua quay dau theo huong du dinh di
											team2[j].rotateAngle(team2[j].movePathX[STEPCOUNT],team2[j].movePathY[STEPCOUNT]);
											// unit thua bi danh bat  tro lai va end move, vi tri du dinh di lan nay bi thay the bang vi tri step truoc
											team2[j].endMove(STEPCOUNT,1,1);
											team2[j].attackRequest = 0;
											if(team2[j].typeName=="Supply")
												map.showMessage("Unit "+team1[i].officer.Name+" day lui Unit Supply khi vao cung 1 o.",this.skip(),team1[i],team2[j],2 );
											else
												map.showMessage("Unit "+team1[i].officer.Name+" day lui Unit "+team2[j].officer.Name+" khi vao cung 1 o.",this.skip(),team1[i],team2[j],2 );
											break STEPLOOP;
										}
										else
										{
											//Unit thua quay dau theo huong du dinh di
											team1[i].rotateAngle(team1[i].movePathX[STEPCOUNT],team1[i].movePathY[STEPCOUNT]);
											// unit thua bi danh bat  tro lai va end move, vi tri du dinh di lan nay bi thay the bang vi tri step truoc
											team1[i].endMove(STEPCOUNT,1,1);
											team1[i].attackRequest = 0;
											if(team1[i].typeName=="Supply")
												map.showMessage("Unit "+team2[j].officer.Name+" day lui Unit Supply khi vao cung 1 o.",this.skip(),team2[j],team1[i],2 );
											else
												map.showMessage("Unit "+team2[j].officer.Name+" day lui Unit "+team1[i].officer.Name+" khi vao cung 1 o.",this.skip(),team2[j],team1[i],2 );
											break STEPLOOP;
										}
									}
								}
								if( this.pathCheck(team1[i], STEPCOUNT, team2[j], STEPCOUNT-1) && this.pathCheck(team1[i], STEPCOUNT-1, team2[j], STEPCOUNT))	
								{ 	//neu unit 1 vao vi tri step truoc cua Unit 2 va unit 2 vao vitri step trc cua unit 1
									//thi 2 unit dung tai cho, ko di chuyen nua, va fight
									//call function so 2 unit tactic, ploy, attack+location+angle
										//2 Unit  quay dau theo huong du dinh di
										team1[i].rotateAngle(team1[i].movePathX[STEPCOUNT],team1[i].movePathY[STEPCOUNT]);
										team2[j].rotateAngle(team2[j].movePathX[STEPCOUNT],team2[j].movePathY[STEPCOUNT]);
										// 2 unit bi danh bat  tro lai va end move, vi tri du dinh di lan nay bi thay the bang vi tri step truoc
										team1[i].delayMove(STEPCOUNT,1,1);
										team2[j].delayMove(STEPCOUNT,1,1);
									//	map.showMessage("Unit "+team1[i].officer.Name+" va Unit "+team2[j].officer.Name+" di ngc chieu nhau",this.skip(),team1[i],team2[j],1 );
									//	break STEPLOOP;
								}
							}
						}
					}
				}
				

				//check team2 vs team2
				for(i in team2)
				{
					if(team2[i].destroyed==0 )
					{
						for(j in team2)
						{
							if(team2[j].destroyed==0 && Math.abs(team2[i].uOnTop-team2[j].uOnTop)<2)
							{
								if(i<j)
								{	
									if( this.pathCheck(team2[i], STEPCOUNT, team2[j], STEPCOUNT) )	
									{ 	//2 unit vao cung 1 o
										sameCell = 1;
										if(this.pathCheck(team2[i], STEPCOUNT, team2[i], STEPCOUNT-1))
										{	//neu unit 1 dung do tu truoc
											//Unit 2 quay dau theo huong du dinh di
											team2[j].rotateAngle( team2[j].movePathX[STEPCOUNT] , team2[j].movePathY[STEPCOUNT]  );

											//unit 2 dung cho  delaymove, cac vi tri du dinh tiep theo bi lui lai 1
											team2[j].delayMove(STEPCOUNT,1,1);
										}
										//else if(cx_Unit2==team2[j].movePathX[STEPCOUNT-1] && cy_Unit2==team2[j].movePathY[STEPCOUNT-1]) 
										else if(this.pathCheck(team2[j], STEPCOUNT, team2[j], STEPCOUNT-1))
										{	//neu unit2 dung do tu truoc
											//Unit 1 quay dau theo huong du dinh di
											team2[i].rotateAngle(team2[i].movePathX[STEPCOUNT],team2[i].movePathY[STEPCOUNT]);
											//unit 1 dung cho  delaymove, cac vi tri du dinh tiep theo bi lui lai 1
											team2[i].delayMove(STEPCOUNT,1,1);
										}
										else
										{	//ko unit nao dung do tu truoc
											//this unit nao co Lead cao hon se vao truoc, neu bang nhau thi random
											//call ham so sanh lead cua 2 unit
											var bit = self.compare(team2[i],team2[j],"Lead");
											if(bit==1)
											{//unit 1 hon
												//Unit 2 quay dau theo huong du dinh di
												team2[j].rotateAngle(team2[j].movePathX[STEPCOUNT],team2[j].movePathY[STEPCOUNT]);
												//unit 2 dung cho  delaymove, cac vi tri du dinh tiep theo bi lui lai 1									
												team2[j].delayMove(STEPCOUNT,1,1);
											}
											else
											{
												//Unit 2 quay dau theo huong du dinh di
												team2[i].rotateAngle(team2[i].movePathX[STEPCOUNT],team2[i].movePathY[STEPCOUNT]);
												//unit 2 dung cho  delaymove, cac vi tri du dinh tiep theo bi lui lai 1									
												team2[i].delayMove(STEPCOUNT,1,1);
											}
										}
									}
								}
							}
						}
					}
				}


			}
		}
	}
	this.cellCheck1 = function(units){
		// xet cac unit co toa do moi trung nhau cua cung 1 team
		//lap lai cho den khi het cac truong hop vao cung vi tri
		var sameCell = 1;
		while(sameCell == 1)
		{
			sameCell = 0;
			for(i in units)
			{
				if(units[i].destroyed==0)
				{
					for(j in units)
					{
						if(units[j].destroyed==0)
						{
							if(i<j)
							{	
								if( this.pathCheck(units[i], STEPCOUNT, units[j], STEPCOUNT) )	
								{ 	//2 unit vao cung 1 o
									sameCell = 1;
									if(this.pathCheck(units[i], STEPCOUNT, units[i], STEPCOUNT-1))
									{	//neu unit 1 dung do tu truoc
										//Unit 2 quay dau theo huong du dinh di
										units[j].rotateAngle( units[j].movePathX[STEPCOUNT] , units[j].movePathY[STEPCOUNT]  );

										//unit 2 dung cho  delaymove, cac vi tri du dinh tiep theo bi lui lai 1
										units[j].delayMove(STEPCOUNT,1,1);
									}
									//else if(cx_Unit2==units[j].movePathX[STEPCOUNT-1] && cy_Unit2==units[j].movePathY[STEPCOUNT-1]) 
									else if(this.pathCheck(units[j], STEPCOUNT, units[j], STEPCOUNT-1))
									{	//neu unit2 dung do tu truoc
										//Unit 1 quay dau theo huong du dinh di
										units[i].rotateAngle(units[i].movePathX[STEPCOUNT],units[i].movePathY[STEPCOUNT]);
										//unit 1 dung cho  delaymove, cac vi tri du dinh tiep theo bi lui lai 1
										units[i].delayMove(STEPCOUNT,1,1);
									}
									else
									{	//ko unit nao dung do tu truoc
										//this unit nao co Lead cao hon se vao truoc, neu bang nhau thi random
										//call ham so sanh lead cua 2 unit
										var bit = self.compare(units[i],units[j],"Lead");
										if(bit==1)
										{//unit 1 hon
											//Unit 2 quay dau theo huong du dinh di
											units[j].rotateAngle(units[j].movePathX[STEPCOUNT],units[j].movePathY[STEPCOUNT]);
											//unit 2 dung cho  delaymove, cac vi tri du dinh tiep theo bi lui lai 1									
											units[j].delayMove(STEPCOUNT,1,1);
										}
										else
										{
											//Unit 2 quay dau theo huong du dinh di
											units[i].rotateAngle(units[i].movePathX[STEPCOUNT],units[i].movePathY[STEPCOUNT]);
											//unit 2 dung cho  delaymove, cac vi tri du dinh tiep theo bi lui lai 1									
											units[i].delayMove(STEPCOUNT,1,1);
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};

	this.cellCheck2 = function(team1, team2){
		// xet cac unit co toa do moi trung nhau cua cung 1 team
		//lap lai cho den khi het cac truong hop vao cung vi tri
		var sameCell = 1;
		STEPLOOP:
		if(PLAYTIME==0)
		{
			while(sameCell == 1)
			{
				sameCell = 0;
				for(i in team1)
				{
					if(team1[i].destroyed==0)
					{
						for(j in team2)
						{
							if(team2[j].destroyed==0)
							{
								if( this.pathCheck(team1[i], STEPCOUNT, team2[j], STEPCOUNT) )	
								{ 	//2 unit vao cung 1 o
									sameCell = 1;
									if(this.pathCheck(team1[i], STEPCOUNT, team1[i], STEPCOUNT-1))
									{	//neu unit 1 dung do tu truoc
										//call function so 2 unit tactic, ploy, attack+location+angle
										//??????tam thoi mac dinh la unit co thu tu cao hon dc uu tien
										//Unit 2 quay dau theo huong du dinh di
										team2[j].rotateAngle( team2[j].movePathX[STEPCOUNT], team2[j].movePathY[STEPCOUNT]);
										//unit 2 bi danh bat  tro lai va end move, vi tri du dinh di lan nay bi thay the bang vi tri step truoc
										team2[j].delayMove(STEPCOUNT,1,1);
										//ko danh gi dc nua(nen co them bitnay)
									}
									//else if(cx_Unit2==units[j].movePathX[STEPCOUNT-1] && cy_Unit2==units[j].movePathY[STEPCOUNT-1]) 
									else if(this.pathCheck(team2[j], STEPCOUNT, team2[j], STEPCOUNT-1))
									{	//neu unit2 dung do tu truoc
										//call function so 2 unit tactic, ploy, attack+location+angle
										//??????tam thoi mac dinh la unit co thu tu cao hon dc uu tien
										//Unit 1 quay dau theo huong du dinh di
										team1[i].rotateAngle( team1[i].movePathX[STEPCOUNT], team1[i].movePathY[STEPCOUNT]);
										//1 unit bi danh bat  tro lai va end move, vi tri du dinh di lan nay bi thay the bang vi tri step truoc
										team1[i].delayMove(STEPCOUNT,1,1);
										//ko danh gi dc nua(nen co them bitnay)
									}
									else
									{	//ko unit nao dung do tu truoc
										map.attackCalc(team1[i],team2[j],0,0);
										//this unit nao co Lead cao hon se vao truoc, neu bang nhau thi random
										//call ham so sanh lead cua 2 unit
										var bit = self.compare(team1[i],team2[j],"Lead");
										if(bit==1)
										{//unit 1 hon
											//Unit thua quay dau theo huong du dinh di
											team2[j].rotateAngle(team2[j].movePathX[STEPCOUNT],team2[j].movePathY[STEPCOUNT]);
											// unit thua bi danh bat  tro lai va end move, vi tri du dinh di lan nay bi thay the bang vi tri step truoc
											team2[j].endMove(STEPCOUNT,1,1);
											team2[j].attackRequest = 0;
											map.showMessage("Unit "+team1[i].officer.Name+" day lui Unit "+team2[j].officer.Name+" khi vao cung 1 o.",this.skip(),team1[i],team2[j],2 );
											break STEPLOOP;
										}
										else
										{
											//Unit thua quay dau theo huong du dinh di
											team1[i].rotateAngle(team1[i].movePathX[STEPCOUNT],team1[i].movePathY[STEPCOUNT]);
											// unit thua bi danh bat  tro lai va end move, vi tri du dinh di lan nay bi thay the bang vi tri step truoc
											team1[i].endMove(STEPCOUNT,1,1);
											team1[i].attackRequest = 0;
											map.showMessage("Unit "+team2[j].officer.Name+" day lui Unit "+team1[i].officer.Name+" khi vao cung 1 o.",this.skip(),team2[j],team1[i],2 );
											break STEPLOOP;
										}
									}
								}
								if( this.pathCheck(team1[i], STEPCOUNT, team2[j], STEPCOUNT-1) && this.pathCheck(team1[i], STEPCOUNT-1, team2[j], STEPCOUNT))	
								{ 	//neu unit 1 vao vi tri step truoc cua Unit 2 va unit 2 vao vitri step trc cua unit 1
									//thi 2 unit dung tai cho, ko di chuyen nua, va fight
									//call function so 2 unit tactic, ploy, attack+location+angle
										//2 Unit  quay dau theo huong du dinh di
										team1[i].rotateAngle(team1[i].movePathX[STEPCOUNT],team1[i].movePathY[STEPCOUNT]);
										team2[j].rotateAngle(team2[j].movePathX[STEPCOUNT],team2[j].movePathY[STEPCOUNT]);
										// 2 unit bi danh bat  tro lai va end move, vi tri du dinh di lan nay bi thay the bang vi tri step truoc
										team1[i].delayMove(STEPCOUNT,1,1);
										team2[j].delayMove(STEPCOUNT,1,1);
									//	map.showMessage("Unit "+team1[i].officer.Name+" va Unit "+team2[j].officer.Name+" di ngc chieu nhau",this.skip(),team1[i],team2[j],1 );
									//	break STEPLOOP;
								}
							}
						}
					}
				}
			}
		}
	};

	this.moveUnits = function(units){
			//ham de di chuyen cac unit cua 1 doi, sau kho check samecell
		STEPLOOP:
		if(PLAYTIME==0)
		{
			for(var i in units)
			{
					if(units[i].destroyed==0 && units[i].cxCell != units[i].movePathX[STEPCOUNT] || units[i].cyCell != units[i].movePathY[STEPCOUNT])
					{
						units[i].setPosition(units[i].movePathX[STEPCOUNT],units[i].movePathY[STEPCOUNT],0);
					}
					if(units[i].destroyed==0 && units[i].typeName!="Camp")
					{
					//sau khi di chuyen, can xem vitri hien tai co trong viewrange cua Camp ko de bonus att def
								units[i].attackBonus=0;
								units[i].defendBonus=0;
								units[i].shootingPowerBonus=0;
						for(var j in units)
						{
							if( units[j].typeName=="Camp" && units[i].inViewOf(units[j]))
							{
								units[i].attackBonus=30;
								units[i].defendBonus=30;
								if(units[i].shootingRange>0)
									units[i].shootingPowerBonus=30;
							}
						}
					}
					//xoay huong
					if(units[i].rotateRequest[STEPCOUNT]==1)
					{
						units[i].rotateAngle(units[i].rotateX[STEPCOUNT],units[i].rotateY[STEPCOUNT]);
						units[i].rotateRequest[STEPCOUNT]=0;
						units[i].rotateX[STEPCOUNT]=-1;
						units[i].rotateY[STEPCOUNT]=-1;
					}
					else if(STEPCOUNT==1)
					{
						units[i].rotateAngle(units[i].cxFront,units[i].cyFront);
					}
			}
		}
	};

	this.attackUnits = function(team1, team2){
		//scan all attack cell
		STEPLOOP:
		if(PLAYTIME==0)
		{
			for(i in team1)
			{
				if(team1[i].destroyed==0)
				{
					if(team1[i].attackRequest == 1)
					{
						var cx_Unit1 			=  team1[i].cxCell  ;
						var cy_Unit1 			=  team1[i].cyCell  ;
						var cx_Unit1_Attack		=  team1[i].cxAttack  ;
						var cy_Unit1_Attack		=  team1[i].cyAttack  ;
						var cx_Unit1_Front    	=  team1[i].cxFront  ;
						var cy_Unit1_Front    	=  team1[i].cyFront  ;
						var cx_Unit1_Back    	=  team1[i].cxBack ;
						var cy_Unit1_Back    	=  team1[i].cyBack  ;
						for(j in team2)
						{
							if( team2[j].destroyed==0 
								&& team2[j].status!="Ambush" 
								&& (  (team1[i].uOnTop-team2[j].uOnTop>=-1 && team1[i].typeName!="Catapult" && team1[i].typeName!="Tower" ) 
									  || ( (team1[i].typeName=="Catapult" || team1[i].typeName=="Tower") && Math.abs(team1[i].shotTop-team2[j].uOnTop)<=1 ) )  ) 	
							{
								var cx_Unit2 		=  team2[j].cxCell   ;
								var cy_Unit2		=  team2[j].cyCell   ;
								var cx_Unit2_Front	=  team2[j].cxFront  ;
								var cy_Unit2_Front	=  team2[j].cyFront  ;
								var cx_Unit2_Back	=  team2[j].cxBack;
								var cy_Unit2_Back	=  team2[j].cyBack;
								//xet goc do attack
								if(cx_Unit1==cx_Unit2 && cy_Unit1==cy_Unit2)
								{ 	//2 unit vao cung 1 o tru khi co loi, neu ko se ko xay ra o day,vi da check cell
									team1[i].killedTroop(10);
									team2[j].killedTroop(10);
								}
								else if( cx_Unit1_Attack==cx_Unit2 && cy_Unit1_Attack==cy_Unit2 )
								{	//Unit 1 tan cong Unit 2
									if(team1[i].shootingRange==0)
									{	//neu unit 1 ko phai la unit shooting
										if(  cx_Unit1==cx_Unit2_Front && cy_Unit1==cy_Unit2_Front )
										{	//va Unit 2 cung tan cong suy ra Unit 1 va 2 doi dau
											map.attackCalc(team1[i],team2[j],1,0);
											team1[i].attackRequest = 0;
											if(team2[j].attackRequest == 1)	team2[j].attackRequest = 0;
											map.showMessage("Unit "+team1[i].officer.Name+" va Unit "+team2[j].officer.Name+" doi dau:",this.skip(),team1[i],team2[j],1 );
											break STEPLOOP;
										}
										else if( cx_Unit1==cx_Unit2_Back && cy_Unit1==cy_Unit2_Back )
										{	//Unit 1 tan cong dang sau Unit 2
											map.attackCalc(team1[i],team2[j],3,0);
											team1[i].attackRequest = 0;
											map.showMessage("Unit "+team1[i].officer.Name+" tan cong vao dang sau Unit "+team2[j].officer.Name+" :",this.skip(),team1[i],team2[j],0 );
											break STEPLOOP;
										}
										else
										{	//con lai la Unit 1 tan cong ben canh Unit 2
											map.attackCalc(team1[i],team2[j],2,0);
											team1[i].attackRequest = 0;
											if(team2[j].typeName=="Camp" || team2[j].typeName=="Supply")
												map.showMessage("Unit "+team1[i].officer.Name+" tan cong vao "+team2[j].typeName,this.skip() ,team1[i],team2[j],0);
											else
												map.showMessage("Unit "+team1[i].officer.Name+" tan cong vao ben canh Unit "+team2[j].officer.Name+" :",this.skip() ,team1[i],team2[j],0);
											break STEPLOOP;
										}
									}
									else
									{	//neu unit 1 is shooting
											map.attackCalc(team1[i],team2[j],4,0);
											team1[i].attackRequest = 0;
											if(team2[j].typeName=="Camp")
												map.showMessage("Unit "+team1[i].officer.Name+" shooting vao "+team2[j].typeName+" :",this.skip() ,team1[i],team2[j],0);
											else
												map.showMessage("Unit "+team1[i].officer.Name+" shooting vao Unit "+team2[j].officer.Name+" :",this.skip() ,team1[i],team2[j],0);
											break STEPLOOP;
									}
								}
								else 
								{

								}
							}
						}
					}
				}
			}	
		}
	};
	this.runFight = function(){
		if(STEPCOUNT==0)
		{
			this.startTurn(map.team1);
			this.startTurn(map.team2);
		}
		STEPLOOP:
		if(STEPCOUNT < STEPMAX )
		{
				if(this.stepDone == 1)
				{
					STEPCOUNT ++;
					this.stepDone = 0;
					this.startStep(map.team1);
					this.startStep(map.team2);
				}
				// xet cac unit co toa do moi trung nhau
				//this.cellCheck1(map.team1);
				//this.cellCheck1(map.team2);
				this.cellCheck(map.team1, map.team2);
				//di chuyen cac unit con lai in this step
				this.moveUnits(map.team1);
				this.moveUnits(map.team2);
				
				//step 7 chi co di chuyen, ko danh nhau
				if(STEPCOUNT >= STEPMAX)
				{
					this.stepDone = 1;
					break STEPLOOP;
				}
				//tao message  khi move
				if(PLAYTIME==0 && this.moveDone==0)
				{
					this.moveDone=1;
					this.map.displayMessage("Tat ca cac Unit cung di chuyen",this.skip(),5 );
				//	break STEPLOOP;
				}
				//scan for support ploy
				this.supportPloy(map.team1,map.team2);
				this.supportPloy(map.team2,map.team1);
				//scan all attackcell
				//check for tactic or ploy
				this.scanTacticPloy(map.team1, map.team2);
				//check for remain attack
				this.attackUnits(map.team1, map.team2);
				this.attackUnits(map.team2, map.team1);
				//check for status
				this.statusUnits(map.team1);
				this.statusUnits(map.team2);
				//end step
				this.endStep(map.team1);
				this.endStep(map.team2);

		}
		if(STEPCOUNT >= STEPMAX )
		{
				//xoa cac move cua unit
				this.countDownSeconds = COUNTDOWN_SECS; //chuyen sang trang thai turn select
				this.endTurn(map.team1);
				this.endTurn(map.team2);
				STEPCOUNT=0;
				TURN++;
				this.changeTurn();
				
		}
	}; 

	var yOffset=275;
	var xOffset=150;
	var width =  60;
	var xOffsetp=215;
	var widthp =  70;
	var mColor = "rgba(0,0,255,0.8)";
	//Move button 0
	this.addItem(xOffset, yOffset+0, width, 20, mColor, "Move", function(){
		self.buttonMove();
	});
	// Attack button 1
	this.addItem(xOffset, yOffset+25, width, 20, mColor, "Attack", function(){
		if(map.selectedUnit)
		{
		 	map.selectedUnit.attackText="Attack";
			map.selectedUnit.attackRequest=1;
		}
	});
	// tactic button 2
	this.addItem(xOffset, yOffset+50, width, 20, mColor, "Tactic", function(){
		 
	});
	// ploy button 3
	this.addItem(xOffset, yOffset+75, width, 20, mColor, "Ploy", function(){
		 
	});
	// built button 4
	this.addItem(xOffset, yOffset+100, width, 20, mColor, "Built", function(){
		 alert("Not yet implemented!");
	});
	// repair button 5
	this.addItem(xOffset, yOffset+125, width, 20, mColor, "Repair", function(){
		 alert("Not yet implemented!");
	});
	// rotate button 6
	this.addItem(xOffset, yOffset+150, width, 20, mColor, "Rotate", function(){
		 //map.selectedUnit.rotateRequest[map.selectedUnit.moveCount]=1;
		 self.buttonRotate();
	});
	// Climb button 7
	this.addItem(xOffset, yOffset+175, width, 20, mColor, "Climb", function(){
		 self.buttonClimb();
	});
	// create supply unit button 8
	this.addItem(xOffset, yOffset+200, width, 20, mColor, "Create", function(){
		 self.buttonCreate();
	});
	// supply button 9
	this.addItem(xOffset, yOffset+225, width, 20, mColor, "Supply", function(){
		 self.buttonSupply();
	});
	// spare button 10
	this.addItem(xOffset, yOffset+250, width, 20, mColor, "spare", function(){
		 alert("Not yet implemented!");
	});
	///////////////////////////////
	// ploy: Fire button 11
	this.addItem(xOffsetp, yOffset+0, widthp, 20, mColor, "Fire", function(){
		self.actionSelect(2,self.selectedItem.text,10);
	});
	// ploy: Douse button 12
	this.addItem(xOffsetp, yOffset+25, widthp, 20, mColor, "Douse", function(){
		self.actionSelect(2,self.selectedItem.text,10);
	});
	// ploy: confuse button 13
	this.addItem(xOffsetp, yOffset+50, widthp, 20, mColor, "Confuse", function(){
		self.actionSelect(2,self.selectedItem.text,15);
	});
	// ploy: Retreat button 14
	this.addItem(xOffsetp, yOffset+75, widthp, 20, mColor, "Retreat", function(){
		self.actionSelect(2,self.selectedItem.text,15);
	});
	// ploy: Muddle button 15
	this.addItem(xOffsetp, yOffset+100, widthp, 20, mColor, "Muddle", function(){
		self.actionSelect(2,self.selectedItem.text,20);
	});
	// ploy: Taunt button 16
	this.addItem(xOffsetp, yOffset+125, widthp, 20, mColor, "Taunt", function(){
		self.actionSelect(2,self.selectedItem.text,10);
	});
	// ploy: Calm button 17
	this.addItem(xOffsetp, yOffset+150, widthp, 20, mColor, "Calm", function(){
		self.actionSelect(2,self.selectedItem.text,10);
	});
	// ploy: Ambush button 18
	this.addItem(xOffsetp, yOffset+175, widthp, 20, mColor, "Ambush", function(){
		if(map.selectedUnit)
		{
			if(map.selectedUnit.team==1 && !map.inViewTeam(map.selectedUnit.cxCell, map.selectedUnit.cyCell, map.team2) 
				|| map.selectedUnit.team==2 && !map.inViewTeam(map.selectedUnit.cxCell, map.selectedUnit.cyCell, map.team1) 
				|| map.selectedUnit.status=="Ambush")
				self.actionSelect(2,self.selectedItem.text,20);
			else alert("Phai dung ngoai viewrange cua quan dich!");
		}
	});
	// ploy: Scout button 19
	this.addItem(xOffsetp, yOffset+200, widthp, 20, mColor, "Scout", function(){
		self.actionSelect(2,self.selectedItem.text,10);
	});
	// ploy: Illusion button 20
	this.addItem(xOffsetp, yOffset+225, widthp, 20, mColor, "Illusion", function(){
		self.actionSelect(2,self.selectedItem.text,30);
	});
	// ploy: Weather button 21
	this.addItem(xOffsetp, yOffset+250, widthp, 20, mColor, "Weather", function(){
		self.actionSelect(2,self.selectedItem.text,30);
	});
	// ploy: Wind button 22
	this.addItem(xOffsetp, yOffset+275, widthp, 20, mColor, "Wind", function(){
		self.actionSelect(2,self.selectedItem.text,30);
	});
	///////////////////////////////
	// tactic horse: Charge button 23
	this.addItem(xOffsetp, yOffset+50, widthp, 20, mColor, "Charge", function(){
		self.actionSelect(3,self.selectedItem.text,15);
	});
	// tactic horse: Charge2 button 24
	this.addItem(xOffsetp, yOffset+75, widthp, 20, mColor, "Charge2", function(){
		self.actionSelect(3,self.selectedItem.text,20);
	});
	// tactic horse: Break button 25
	this.addItem(xOffsetp, yOffset+100, widthp, 20, mColor, "Break", function(){
		self.actionSelect(3,self.selectedItem.text,25);
	});
	// tactic horse: spare button 26
	this.addItem(xOffsetp, yOffset+125, widthp, 20, mColor, "spare", function(){
		self.actionSelect(3,self.selectedItem.text,30);
	});
	///////////////////////////////
	// tactic spear: Push button 27
	this.addItem(xOffsetp, yOffset+50, widthp, 20, mColor, "Push", function(){
		self.actionSelect(3,self.selectedItem.text,15);
	});
	// tactic spear: Push2 button 29
	this.addItem(xOffsetp, yOffset+75, widthp, 20, mColor, "Push2", function(){
		self.actionSelect(3,self.selectedItem.text,20);
	});
	// tactic spear: Dash button 28
	this.addItem(xOffsetp, yOffset+100, widthp, 20, mColor, "Dash", function(){
		self.actionSelect(3,self.selectedItem.text,25);
	});
	// tactic spear: spare button 30
	this.addItem(xOffsetp, yOffset+125, widthp, 20, mColor, "spare", function(){
		self.actionSelect(3,self.selectedItem.text,30);
	});
	///////////////////////////////
	// tactic bow: Fierce button 31
	this.addItem(xOffsetp, yOffset+50, widthp, 20, mColor, "FierceB", function(){
		self.actionSelect(3,self.selectedItem.text,15);
	});
	// tactic bow: FireBow button 32
	this.addItem(xOffsetp, yOffset+75, widthp, 20, mColor, "FireBow", function(){
		self.actionSelect(3,self.selectedItem.text,20);
	});
	// tactic bow: Splash button 33
	this.addItem(xOffsetp, yOffset+100, widthp, 20, mColor, "SplashB", function(){
		self.actionSelect(3,self.selectedItem.text,25);
	});
	// tactic bow: spare button 34
	this.addItem(xOffsetp, yOffset+125, widthp, 20, mColor, "spare", function(){
		self.actionSelect(3,self.selectedItem.text,30);
	});
	///////////////////////////////
	// tactic ram: ram button 35
	this.addItem(xOffsetp, yOffset+50, widthp, 20, mColor, "Ram", function(){
		self.actionSelect(3,self.selectedItem.text,10);
	});
	// tactic ram: spare button 36
	this.addItem(xOffsetp, yOffset+75, widthp, 20, mColor, "spare", function(){
		self.actionSelect(3,self.selectedItem.text,15);
	});
	// tactic ram: spare button 37
	this.addItem(xOffsetp, yOffset+100, widthp, 20, mColor, "spare", function(){
		self.actionSelect(3,self.selectedItem.text,15);
	});
	// tactic ram: spare button 38
	this.addItem(xOffsetp, yOffset+125, widthp, 20, mColor, "spare", function(){
		self.actionSelect(3,self.selectedItem.text,15);
	});
	///////////////////////////////
	// tactic FireOx: eradiate button 39
	this.addItem(xOffsetp, yOffset+50, widthp, 20, mColor, "Eradiate", function(){
		self.actionSelect(3,self.selectedItem.text,10);
	});
	// tactic FireOx: spare button 40
	this.addItem(xOffsetp, yOffset+75, widthp, 20, mColor, "spare", function(){
		self.actionSelect(3,self.selectedItem.text,15);
	});
	// tactic FireOx: spare button 41
	this.addItem(xOffsetp, yOffset+100, widthp, 20, mColor, "spare", function(){
		self.actionSelect(3,self.selectedItem.text,15);
	});
	// tactic FireOx: spare button 42
	this.addItem(xOffsetp, yOffset+125, widthp, 20, mColor, "spare", function(){
		self.actionSelect(3,self.selectedItem.text,15);
	});
	///////////////////////////////
	// tactic Tower: Fierce button 43
	this.addItem(xOffsetp, yOffset+50, widthp, 20, mColor, "FierceA", function(){
		self.actionSelect(3,self.selectedItem.text,15);
	});
	// tactic Tower: FireArc button 44
	this.addItem(xOffsetp, yOffset+75, widthp, 20, mColor, "FireArc", function(){
		self.actionSelect(3,self.selectedItem.text,20);
	});
	// tactic Tower: Splash button 45
	this.addItem(xOffsetp, yOffset+100, widthp, 20, mColor, "SplashA", function(){
		self.actionSelect(3,self.selectedItem.text,25);
	});
	// tactic Tower: spare button 46
	this.addItem(xOffsetp, yOffset+125, widthp, 20, mColor, "spare", function(){
		self.actionSelect(3,self.selectedItem.text,30);
	});
	///////////////////////////////
	// tactic Catapult: Fierce button 47
	this.addItem(xOffsetp, yOffset+50, widthp, 20, mColor, "FierceS", function(){
		self.actionSelect(3,self.selectedItem.text,15);
	});
	// tactic Catapult: FireStone button 48
	this.addItem(xOffsetp, yOffset+75, widthp, 20, mColor, "FireStone", function(){
		self.actionSelect(3,self.selectedItem.text,20);
	});
	// tactic Catapult: Splash button 49
	this.addItem(xOffsetp, yOffset+100, widthp, 20, mColor, "SplashS", function(){
		self.actionSelect(3,self.selectedItem.text,25);
	});
	// tactic Catapult: spare button 50
	this.addItem(xOffsetp, yOffset+125, widthp, 20, mColor, "spare", function(){
		self.actionSelect(3,self.selectedItem.text,30);
	});

	//control suppy screen	51->67
	//Horse
	this.addItem(330, 46, 18, 18, mColor, "<", function(){
		 self.suppyCalc("Horse",0);
	});
	this.addItem(348, 46, 18, 18, mColor, ">", function(){
		self.suppyCalc("Horse",1); 
	});
	this.addItem(366, 46, 24, 18, mColor, ">>", function(){
		self.suppyCalc("Horse",2); 
	});
	//Spear
	this.addItem(330, 66, 18, 18, mColor, "<", function(){
		 self.suppyCalc("Spear",0);
	});
	this.addItem(348, 66, 18, 18, mColor, ">", function(){
		 self.suppyCalc("Spear",1);
	});
	this.addItem(366, 66, 24, 18, mColor, ">>", function(){
		 self.suppyCalc("Spear",2);
	});
	//Bow
	this.addItem(330, 86, 18, 18, mColor, "<", function(){
		 self.suppyCalc("Bow",0);
	});
	this.addItem(348, 86, 18, 18, mColor, ">", function(){
		 self.suppyCalc("Bow",1);
	});
	this.addItem(366, 86, 24, 18, mColor, ">>", function(){
		 self.suppyCalc("Bow",2);
	});
	//Troop
	this.addItem(330, 106, 18, 18, mColor, "<", function(){
		 self.suppyCalc("Troop",0);
	});
	this.addItem(348, 106, 18, 18, mColor, ">", function(){
		  self.suppyCalc("Troop",1);
	});
	this.addItem(366, 106, 24, 18, mColor, ">>", function(){
		  self.suppyCalc("Troop",2);
	});
	//Food
	this.addItem(330, 126, 18, 18, mColor, "<", function(){
		 self.suppyCalc("Food",0);
	});
	this.addItem(348, 126, 18, 18, mColor, ">", function(){
		  self.suppyCalc("Food",1);
	});
	this.addItem(366, 126, 24, 18, mColor, ">>", function(){
		  self.suppyCalc("Food",2);
	});
	//done cancel
	this.addItem(247, 150, 60, 20, mColor, "Cancel", function(){
		  map.masterUnit=null;
		  map.selectedUnit=null;
	});
	this.addItem(177, 150, 60, 20, mColor, "Done", function(){
			map.buttonDone();
			map.masterUnit=null;
	});

	//shot top button 68
	this.addItem(xOffset, yOffset+279, width-5, 19, mColor, "Top", function(){
		if(map.selectedUnit)
			map.selectedUnit.shotTopBottom(2);
	});
	//shot top button 69
	this.addItem(xOffset, yOffset+300, width-5, 19, mColor, "Bottom", function(){
		if(map.selectedUnit)
			map.selectedUnit.shotTopBottom(0);
	});

	//control start step//////////////////////////////
	// Start button
	this.addItem(xOffset+150, yOffset, width+10, 30, mColor, "End Turn", function(){
		self.buttonStart();
	});	
//	// step button
//	this.addItem(xOffset+170, yOffset+225, width, 20, mColor, "Step", function(){
//	 	self.buttonStep();
//	});	
	// Reset button
	this.addItem(xOffset+150, yOffset+40, width, 20, mColor, "Reset", function(){
		//self.countDownSeconds = COUNTDOWN_SECS;	
		//reset();
		self.map.reset(true);
	});
	//waiting time change	
	this.addItem(xOffset+220, yOffset+200, 18, 18, mColor, "+", function(){
		COUNTDOWN_SECS+=10;	
	});	
	this.addItem(xOffset+220, yOffset+220, 18, 18, mColor, "-", function(){
		COUNTDOWN_SECS-=10;	
	});	
	//message delay change	
	this.addItem(xOffset+220, yOffset+280, 18, 18, mColor, "+", function(){
		MSGDelay+=500;	
	});	
	this.addItem(xOffset+220, yOffset+300, 18, 18, mColor, "-", function(){
		MSGDelay-=500;	
	});	

};
ControlPanel.prototype.changeTurn = function() {
	//random thoi tiet sau 3 luot
	if(TURN/3 == Math.floor(TURN/3))
	{
					WEATHER = Math.floor(Math.random() * (WEATHERTEXT.length) ) ;
					WIND = Math.floor(Math.random() * 5 ) ;
					this.map.trendWind();
	}
	//thay doi fire
	var dDouse=1;
	if(WEATHERTEXT[WEATHER]=="Sunny")	dDouse=1;
	if(WEATHERTEXT[WEATHER]=="Normal")	dDouse=this.map.cxCellFire.length-1;
	if(WEATHERTEXT[WEATHER]=="Rain")    dDouse=this.map.cxCellFire.length+3;
	if(dDouse<1)	dDouse=1;
	//random lan lua
	if(this.map.cxCellFire)
	{
		for(var i in this.map.cxCellFire)
		{
			var dx=this.map.cxCellFire[i]+dxWIND;
			var dy=this.map.cyCellFire[i]+dyWIND;
			var inList=0;
			for(var j in this.map.cxCellFire)
			{	//check if cell thuoc list thi set bit
				if(this.map.cxCellFire[j]==dx && this.map.cyCellFire[j]==dy)
					inList=1;
			}
			//neu cell moi chua co trong list
			if(inList==0)
			{
				this.map.cxCellFire.push(dx);
				this.map.cyCellFire.push(dy);
			}
		}	
	}
	
	//random tat lua 
	for(var i=0;i<dDouse;i++)
	{
				if(this.map.cxCellFire)
				{
					var random = Math.floor(Math.random() * (this.map.cxCellFire.length) ) ; //tong so+1 o co fire
					if(random< this.map.cxCellFire.length)
					{
						this.map.cxCellFire.splice(random,1);
						this.map.cyCellFire.splice(random,1);
					}
				}
				
	}
	//ket thuc turn 
	if(MODE==2){
					if(PLAYER==1)
						this.map.displayMessage("Player 1 chuan bi",this.skip(),6 );
					else
						this.map.displayMessage("Player 2 chuan bi",this.skip(),6 );
				}
};				
ControlPanel.prototype.compare = function(unit1,unit2,code) {
	if(code=="Lead")
	{
		if(unit1.typeName=="Supply")	return false;
		else if(unit2.typeName=="Supply")	return true;
		else if(unit1.officer.Lead>unit2.officer.Lead)	return true;
		else if(unit1.officer.Lead<unit2.officer.Lead)	return false;
		else
		{
			var random = Math.floor(Math.random() * 2) ; //code =0 to 1
			return random;
		}
	}
	return false;
};
ControlPanel.prototype.actionSelect = function(code,text,ap) {
	if(this.map.selectedUnit.actionPoint>=ap)
	{
			this.map.selectedUnit.attackRequest=code;
			this.map.selectedUnit.attackText=text;
		if(code==2)
			this.map.selectedUnit.attackIndex=this.map.selectedUnit.officer.Int;
		else if(code==3)
			this.map.selectedUnit.attackIndex=this.map.selectedUnit.officer.War;
	}
	else	alert("Not enough ActionPoint: "+ap);
};
ControlPanel.prototype.actionAutoSelect = function(unit,code,text,ap) {
	if(unit.actionPoint>=ap)
	{
		unit.attackRequest=code;
		unit.attackText=text;
		if(code==2)
			unit.attackIndex=unit.officer.Int;
		else if(code==3)
			unit.attackIndex=unit.officer.War;
	}
	//else	alert("Not enough ActionPoint: "+ap);
};
ControlPanel.prototype.suppyCalc = function(type,code) {
	if(this.map.masterUnit && this.map.selectedUnit)
	{
		if(type=="Horse"){
		 		if( code==0 && this.map.selectedUnit.supplyHorseTmp>100){
		 			this.map.masterUnit.supplyHorseTmp   +=100;
			 		this.map.selectedUnit.supplyHorseTmp -=100;		}
		 		if( code==1 && this.map.masterUnit.supplyHorseTmp>100){
		 			this.map.masterUnit.supplyHorseTmp   -=100;
			 		this.map.selectedUnit.supplyHorseTmp +=100;		}
			 	if( code==2 && this.map.masterUnit.supplyHorseTmp>1000){
		 			this.map.masterUnit.supplyHorseTmp   -=1000;
			 		this.map.selectedUnit.supplyHorseTmp +=1000;		}
		}
		if(type=="Spear"){
		 		if( code==0 && this.map.selectedUnit.supplySpearTmp>100){
		 			this.map.masterUnit.supplySpearTmp   +=100;
			 		this.map.selectedUnit.supplySpearTmp -=100;		}
		 		if( code==1 && this.map.masterUnit.supplySpearTmp>100){
		 			this.map.masterUnit.supplySpearTmp   -=100;
			 		this.map.selectedUnit.supplySpearTmp +=100;		}
			 	if( code==2 && this.map.masterUnit.supplySpearTmp>1000){
		 			this.map.masterUnit.supplySpearTmp   -=1000;
			 		this.map.selectedUnit.supplySpearTmp +=1000;		}
		}
		if(type=="Bow"){
		 		if( code==0 && this.map.selectedUnit.supplyBowTmp>100){
		 			this.map.masterUnit.supplyBowTmp   +=100;
			 		this.map.selectedUnit.supplyBowTmp -=100;		}
		 		if( code==1 && this.map.masterUnit.supplyBowTmp>100){
		 			this.map.masterUnit.supplyBowTmp   -=100;
			 		this.map.selectedUnit.supplyBowTmp +=100;		}
			 	if( code==2 && this.map.masterUnit.supplyBowTmp>1000){
		 			this.map.masterUnit.supplyBowTmp   -=1000;
			 		this.map.selectedUnit.supplyBowTmp +=1000;		}
		}
		if(type=="Troop"){
		 		if( code==0 && this.map.selectedUnit.troopTmp>100){
		 			this.map.masterUnit.troopTmp   +=100;
			 		this.map.selectedUnit.troopTmp -=100;		}
		 		if( code==1 && this.map.masterUnit.troopTmp>100){
		 			this.map.masterUnit.troopTmp   -=100;
			 		this.map.selectedUnit.troopTmp +=100;		}
			 	if( code==2 && this.map.masterUnit.troopTmp>1000){
		 			this.map.masterUnit.troopTmp   -=1000;
			 		this.map.selectedUnit.troopTmp +=1000;		}
		}
		if(type=="Food"){
		 		if( code==0 && this.map.selectedUnit.foodTmp>100){
		 			this.map.masterUnit.foodTmp   +=100;
			 		this.map.selectedUnit.foodTmp -=100;		}
		 		if( code==1 && this.map.masterUnit.foodTmp>100){
		 			this.map.masterUnit.foodTmp   -=100;
			 		this.map.selectedUnit.foodTmp +=100;		}
			 	if( code==2 && this.map.masterUnit.foodTmp>1000){
		 			this.map.masterUnit.foodTmp   -=1000;
			 		this.map.selectedUnit.foodTmp +=1000;		}
		}
	}
	
	
};
ControlPanel.prototype.completeMove = function(team1) {
			for(var i in team1)
				{
					if(team1[i].moveSelect == 1)
					{
						team1[i].moveSelect = 0;

						while(team1[i].moveCount<= STEPMAX)
						{
							{
								team1[i].moveCount ++;
								team1[i].movePathX[team1[i].moveCount] = team1[i].movePathX[team1[i].moveCount-1];
								team1[i].movePathY[team1[i].moveCount] = team1[i].movePathY[team1[i].moveCount-1];
							}
						}
						//team1[i].moveCount=0;
					}		
				}
}
ControlPanel.prototype.update = function() {
	if(localPlayer.receiveET==1)
	{
		
		this.countDownSeconds=0;
		localPlayer.receiveET=0;
	}
		
	var tick = (new Date()).getTime();
	if(tick - this.lastUpdate >= this.updateDelay)
	{	//cap nhat thoi gian
		this.lastUpdate = tick;
		if(this.countDownSeconds > 0)
			this.countDownSeconds --;
		else
		{	//every second
			//check if dang o mode 1 hoac mode 2 & player1
			if(MODE==1 )//|| ( MODE==2 && PLAYER==1) )
			{
				//neu het thoi gian wait, start turn, ma van co Unit dang o trang thai moveselect
				//thi ep moveselect=0 va cac step sau bang vi tri cua step last select
				this.completeMove(this.map.team1);
			}
			if( MODE==2 && PLAYER==2) 
			{
				this.completeMove(this.map.team2);
			}

			if(this.map.masterUnit)
			{
				this.map.masterUnit=null;
				this.map.selectedUnit=null;
			}
		//	this.buttonStart();
			if(PLAYTIME==0 ) //&& (MODE==1 || (MODE==2 && PLAYER==0)))
				this.runFight();
			
		}

	}
	//check enable action
	
		this.enableButton(this.map.selectedUnit);
	
};
ControlPanel.prototype.draw = function(context) {	
	context.fillStyle = "LightGray";
	context.fillRect(this.left, this.top, this.width, this.height);
	context.save();
	context.font = "15px Calibri";

//khoi tao icon va group infor
	context.fillStyle = "Blue";
	context.fillRect(this.left, this.top, 149, 39);
	context.fillStyle = "black";
	context.fillText("Team 1: ", this.left + 2, this.top+17);
	context.fillText("Troop: "+this.map.team1Troop, this.left + 53, this.top+17);
	context.fillText("Food:  "+this.map.team1Food, this.left + 53, this.top+36);

	if(this.init==0)
	{
		this.init=1;
		for(var i =0;i<this.map.unitNo-1;i++)
			if(this.map.team1[i].typeName!="Camp")
				this.addItem(2, 50 * i+40 ,  146, 48, COLORS[i], "units");		
		for(var i =0;i<this.map.unitNo-1;i++)
			if(this.map.team2[i].typeName!="Camp")
				this.addItem(2, 50 * i+340 ,  146, 48, COLORS[i], "units");		
	}
	context.fillStyle = "Red";
	context.fillRect(this.left, this.top+300, 149, 39);
	context.fillStyle = "black";
	context.fillText("Team 2: ", this.left + 2, this.top+317);
	context.fillText("Troop: "+this.map.team2Troop, this.left + 53, this.top+317);
	context.fillText("Food:  "+this.map.team2Food, this.left + 53, this.top+336);
	context.font = "15px Calibri";
 	for (var i = 0; i<this.unitButtons.length;  i++)
 	{
		var button = this.unitButtons[i];
		var portrait;
		context.fillStyle = "black";
		if(i<this.map.unitNo-1)
		{
			context.fillText(this.map.team1[i].number+"."+this.map.team1[i].officer.Name, button.x + 52, button.y + 20);
			context.fillText(this.map.team1[i].troop, button.x + 52, button.y + 40);
			context.fillText(this.map.team1[i].actionPoint, button.x + 92, button.y + 40);
			context.fillText(this.map.team1[i].morale, button.x + 120, button.y + 40);
			
			portrait = _portrait.sprites["officer"+this.map.team1[i].officer.Number];
		}
		else
		{
			var j= i - this.map.unitNo+1;
			context.fillText(this.map.team2[j].number+"."+this.map.team2[j].officer.Name, button.x + 52, button.y + 20);
			context.fillText(this.map.team2[j].troop, button.x + 52, button.y + 40);
			context.fillText(this.map.team2[j].actionPoint, button.x + 92, button.y + 40);
			context.fillText(this.map.team2[j].morale, button.x + 120, button.y + 40);
			
			portrait = _portrait.sprites["officer"+this.map.team2[j].officer.Number];
		}
		//context.fillStyle = button.color;
		//context.fillRect(button.x, button.y, button.width, button.height);
		portrait.draw(context, button.x, button.y, button.height, button.height);
		//context.fillText("button.text", button.x + 5, button.y + 10);
		//context.fill();
		if(button.isSelected)
		{
			context.save();
			context.strokeStyle = "Green";
			context.strokeRect(button.x,button.y,button.width,button.height);
			context.restore();
		}
    }
    //action button draw
	for (var i = this.actionButtons.length-1; i>=0; i--) {
		var button = this.actionButtons[i];
		if(button.appear)
		{
			if(button.enable==0)	context.fillStyle = "grey" ;//rgba(0,255,255,0.5)";
			else if(!button.isSelected)		context.fillStyle = button.color;
			else	context.fillStyle = "Green";
			context.fillRect(button.x, button.y, button.width, button.height);
					
			context.beginPath();
			context.font = "15px Calibri";
			context.fillStyle = "white";
			context.fillText(button.text, button.x + 5, button.y + 15);
			context.fill();
		}
    }
	
	//draw selectedunit info
	if(this.map.masterUnit!=null )//&& this.map.selectedUnit)
		this.drawSupplyInfo(context, this.map.masterUnit, this.map.selectedUnit);
	else if(this.map.selectedUnit)
		this.drawUnitInfo(context, this.map.selectedUnit);
	//hien thi thong tin cua tran dau
	context.restore();
	context.font = "15px Calibri";
	context.fillStyle = "black";
	context.fillText("No. Player: " + MODE , this.left + 300, this.top + 360);
	context.fillText("Player: " + PLAYER , this.left + 300, this.top + 380);
	context.fillText("Turn: " + TURN , this.left + 300, this.top + 400);
	context.fillText("Step: " + STEPCOUNT , this.left + 300, this.top + 420);
	if(this.map.selectedUnit)
	{
		context.fillText("Axis: " +this.map.selectedUnit.cxCell+ "  "+this.map.selectedUnit.cyCell , this.left + 300, this.top + 440);
	//	context.fillText("Mx: " +tx[0]+" "+tx[1]+" "+tx[2] , this.left + 200, this.top + 460);
	//	context.fillText("My: " +ty[0]+" "+ty[1]+" "+ty[2] , this.left + 200, this.top + 480);
	}
	context.fillText("Wait time: " , this.left + 300, this.top + 490);
	context.fillText("Set :   " + COUNTDOWN_SECS + " s", this.left + 300, this.top + 510);
	context.fillText("Act :   " + this.countDownSeconds + " s", this.left + 300, this.top + 530);
	context.fillText("Msg. Delay:" , this.left + 300, this.top + 570);
	context.fillText("    " + MSGDelay + " ms", this.left + 300, this.top + 590);
};
ControlPanel.prototype.drawSupplyInfo = function(context, unit, unit2){	
	var left = this.left + 150;
		context.fillStyle = "Green";
		context.fillRect(left, 0, 180, 150);
		context.fillStyle = "black";
		context.fillText("Team: " + unit.team  , left+5, this.top + 20);
		context.fillText("Type:      " + unit.typeName, left+5, this.top + 40);
		context.fillText("Horse:        " + unit.supplyHorseTmp , left+5, this.top + 60);
		context.fillText("Spear:        " + unit.supplySpearTmp , left+5, this.top + 80);
		context.fillText("Bow:          " + unit.supplyBowTmp , left+5, this.top + 100);
		context.fillText("Troop:      " + unit.troopTmp , left+5, this.top + 120);
		context.fillText("Food:        " + unit.foodTmp , left+5, this.top + 140);
	if(this.map.selectedUnit)
	{
		context.fillText(" " + unit2.officer.Name, left+100, this.top + 20);
		context.fillText(" " + unit2.typeName, left+120, this.top + 40);
		context.fillText(" " + unit2.supplyHorseTmp , left+120, this.top + 60);
		context.fillText(" " + unit2.supplySpearTmp , left+120, this.top + 80);
		context.fillText(" " + unit2.supplyBowTmp , left+120, this.top + 100);
		context.fillText(" " + unit2.troopTmp , left+120, this.top + 120);
		context.fillText(" " + unit2.foodTmp , left+120, this.top + 140);
	}
	else	context.fillText("supply to", left+100, this.top + 20);

};
ControlPanel.prototype.drawUnitInfo = function(context, unit){		
	var left = this.left + 150;
	
	if(unit.officer!=0)
	{
		var portrait = _portrait.sprites["officer"+unit.officer.Number];
		portrait.draw(context, left, this.top, 150, 150);

		context.fillStyle = "Blue";	
		context.font = "18px Calibri";
		context.fillText(unit.officer.Name, left+152, this.top + 15);
		context.fillStyle = "black";
		context.font = "15px Calibri";
		context.fillText("LEAD:    " + unit.officer.Lead, left+152, this.top + 30);
		context.fillText("WAR:    " + unit.officer.War, left+152, this.top + 45);
		context.fillText("INT:       " + unit.officer.Int, left+152, this.top + 60);
		context.fillText("POL:      " + unit.officer.Pol, left+152, this.top + 75);
		context.fillText("CHAR:   " + unit.officer.Charm, left+152, this.top + 90);
		context.fillText("HP:       " + unit.officer.HP, left+152, this.top + 105);
		context.fillText(" H  S  B  N  W " , left+152, this.top + 120);
		context.fillText(" " + unit.officer.Horse+"  " + unit.officer.Spear+"  " + unit.officer.Bow+"   "
							 + unit.officer.Navy+"   " + unit.officer.Weapon, left+152, this.top + 135);
		context.fillText("Skill: " + unit.officer.Skill, left+152, this.top + 150);
	}
	else
	{
		context.fillStyle = "lightGreen";
		context.fillRect(left, 0, 180, 150);
		context.fillStyle = "black";
		context.fillText("Team: " + unit.team + " Supply Avaiable" , left+5, this.top + 20);
		context.fillText("Type:   " + unit.typeName, left+5, this.top + 40);
		context.fillText("Horse:        " + unit.supplyHorse , left+5, this.top + 60);
		context.fillText("Spear:        " + unit.supplySpear , left+5, this.top + 80);
		context.fillText("Bow:          " + unit.supplyBow , left+5, this.top + 100);
		context.fillText("Troop:      " + unit.troop , left+5, this.top + 120);
		context.fillText("Food:        " + unit.food , left+5, this.top + 140);
	}
		context.fillStyle = "black";
		context.font = "15px Calibri";
	context.fillText("Type: " + unit.typeName, left, this.top + 170);
	if(unit.attackRequest==0)	unit.attackText="None";
//	if(unit.team!=PLAYER)
//		context.fillText("Action: None" , left+120, this.top + 170);
//	else
		context.fillText("Action: "+ unit.attackRequest+" "+ unit.attackText+" "+unit.attackIndex , left+120, this.top + 170);
	context.fillText("Attack:        " + unit.attack , left, this.top + 185);
	context.fillText("Defend:     " + unit.defend , left+120, this.top + 185);
	context.fillText("WallDamage:   " + unit.wallDamage, left, this.top + 200);
	context.fillText("MoveRange:  " + unit.moveRange, left+120, this.top + 200);
	context.fillText("ArcRange: " + unit.shootingRange, left, this.top + 215);
	context.fillText("ArcPower: " + unit.shootingPower, left+120, this.top + 215);
	context.fillText("ActionPoint:    " + unit.actionPoint, left, this.top + 230);
	context.fillText("Morale:        " + unit.morale, left+120, this.top + 230);
	context.fillText("Troop:        " + unit.troop , left, this.top + 245);
	context.fillText("Food:        " + unit.food , left+120, this.top + 245);
	if(unit.attackText=="Ambush" && unit.team!=PLAYER)
		context.fillText("Status:   Normal" , left, this.top + 260);
	else
		context.fillText("Status:   " + unit.status, left, this.top + 260);
	//////////////////////	
	context.fillText(unit.plan1, left+230, this.top + 200);
	context.fillText(unit.plan, left+230, this.top + 215);
	context.fillText(unit.mOnTop, left+230, this.top + 230);
	context.fillText(unit.uOnTop, left+230, this.top + 245);
	context.fillText(unit.rotateRequest[unit.moveCount], left+220, this.top + 260);
	context.fillText(unit.rotateX[unit.moveCount], left+220, this.top + 275);
	context.fillText(unit.rotateY[unit.moveCount], left+220, this.top + 290);
	///////////////////////
	context.fillStyle = "Red";
	if(unit.needFood==1)	context.fillText("Need Food" , left+140, this.top + 260);
	if(unit.attackBonus>0  && unit.team==PLAYER )
	{
		context.fillStyle = "Green";
		context.fillText(" + " +unit.attackBonus, left+85, this.top + 185);
		context.fillText(" + " +unit.defendBonus, left+205, this.top + 185);
		if(unit.shootingPowerBonus>0)
			context.fillText(" + " +unit.shootingPowerBonus, left+205, this.top + 215);
	
	}

};

ControlPanel.prototype.onmousedown = function(x, y){
	this.selectAt(x, y);			
	
};
ControlPanel.prototype.addItem = function(x, y, width, height, color, text, onclick){
	var button = new Button;
	button.x = x + this.left;
	button.y = y + this.top;
	button.width = width;
	button.height = height;
	button.color = color;
	button.text = text;
	button.onclick = onclick;
	if(onclick)
		this.actionButtons.push(button);
	else
		this.unitButtons.push(button);
};
// select by index
ControlPanel.prototype.select = function(i){

	this.selectedItem = this.unitButtons[i];			
	this.unitButtons[i].isSelected = true;
	
	if(this.unitButtons[i].y>=300)
		this.map.selectedUnit = this.map.team2[i-this.map.unitNo+1];
	else			this.map.selectedUnit = this.map.team1[i];
};
// select by position
ControlPanel.prototype.selectAt = function(x,y){
	if(this.selectedItem)
		this.selectedItem.isSelected = false;
	this.selectedItem = null;
	for (var i = 0; i < this.unitButtons.length; i++) {
		var button = this.unitButtons[i];
		
		if(button.contain(x, y))
		{			
			this.select(i);
			break;
		}
    }
	
	for (var i = 0; i < this.actionButtons.length; i++) {
		var button = this.actionButtons[i];
		if(button.enable)
		{	
			if(button.contain(x, y))
			{
				this.selectedItem = this.actionButtons[i];	
				this.actionButtons[i].isSelected = true;
				if(button.onclick)
					button.onclick();			
				break;
			}
		}
    }
};
ControlPanel.prototype.enableButton =function(unit){
	for(var i=0;i<=50;i++)
				this.actionButtons[i].enable=0;
	for(var i=11;i<=50;i++)
				this.actionButtons[i].appear=0;
	this.actionButtons[68].enable=0;
	this.actionButtons[69].enable=0;
	this.actionButtons[68].appear=0;
	this.actionButtons[69].appear=0;
	
	if(this.countDownSeconds>0 && unit && unit.team==PLAYER && unit.destroyed==0 && unit.status!="Confuse" && unit.status!="Retreat" && unit.status!="Taunt" && unit.status!="Stun")
	{
		if(unit.typeName=="Horse" || unit.typeName=="Spear" || unit.typeName=="Bow" || unit.typeName=="Ram" 
			|| unit.typeName=="FireOx"|| unit.typeName=="Tower" || unit.typeName=="Catapult")	
		{
			for(var i =0; i<=6;i++)
				this.actionButtons[i].enable=1;
		}
		if( unit.typeName=="Spear" || unit.typeName=="Bow")
		{
				this.actionButtons[7].enable=1;	
		}
		if(unit.typeName=="Supply")	
		{
				this.actionButtons[0].enable=1;
				this.actionButtons[1].enable=1;
				this.actionButtons[6].enable=1;
				this.actionButtons[9].enable=1;
		}
		if(unit.typeName=="Camp" )	
		{
			if(unit.troop>100 && unit.food>100)
				this.actionButtons[8].enable=1;
			this.actionButtons[9].enable=1;
		}

		//menu ploy
		if(this.selectedItem && this.selectedItem.text=="Ploy" && unit && unit.destroyed==0)
		{
			for(var i=11;i<=22;i++)
					this.actionButtons[i].appear=1;
			for(var i=11;i<=17;i++)
					this.actionButtons[i].enable=1;
			if(unit.typeName=="Horse" || unit.typeName=="Spear" || unit.typeName=="Bow")
			{
				this.actionButtons[18].enable=1;
				this.actionButtons[19].enable=1;
			}
			if(unit.officer.Name=="Zhang Jiao")
				this.actionButtons[20].enable=1;
			if(unit.officer.Name=="Zhuge Liang" || unit.officer.Name=="Sima Yi")
				this.actionButtons[21].enable=1;
			if(unit.officer.Name=="Zhuge Liang")
				this.actionButtons[22].enable=1;
			
		}
		//menu tactic
		if(this.selectedItem && this.selectedItem.text=="Tactic" && unit && unit.typeName=="Horse")
		{
			this.actionButtons[23].appear=1;
			this.actionButtons[24].appear=1;
			this.actionButtons[25].appear=1;
			this.actionButtons[26].appear=1;
			if(unit.officer.Horse>=1)	this.actionButtons[23].enable=1;
			if(unit.officer.Horse>=2)	this.actionButtons[24].enable=1;
			if(unit.officer.Horse>=3)	this.actionButtons[25].enable=1;
		}
		if(this.selectedItem && this.selectedItem.text=="Tactic" && unit && unit.typeName=="Spear")
		{
			this.actionButtons[27].appear=1;
			this.actionButtons[28].appear=1;
			this.actionButtons[29].appear=1;
			this.actionButtons[30].appear=1;
			if(unit.officer.Spear>=1)	this.actionButtons[27].enable=1;
			if(unit.officer.Spear>=2)	this.actionButtons[28].enable=1;
			if(unit.officer.Spear>=3)	this.actionButtons[29].enable=1;	
		}
		if(this.selectedItem && this.selectedItem.text=="Tactic" && unit && unit.typeName=="Bow")
		{
			this.actionButtons[31].appear=1;
			this.actionButtons[32].appear=1;
			this.actionButtons[33].appear=1;
			this.actionButtons[34].appear=1;	
			if(unit.officer.Bow>=1)	this.actionButtons[31].enable=1;
			if(unit.officer.Bow>=2)	this.actionButtons[32].enable=1;
			if(unit.officer.Bow>=3)	this.actionButtons[33].enable=1;
		}
		if(this.selectedItem && this.selectedItem.text=="Tactic" && unit && unit.typeName=="Ram")
		{
			this.actionButtons[35].appear=1;
			this.actionButtons[36].appear=1;
			this.actionButtons[37].appear=1;
			this.actionButtons[38].appear=1;	
			if(unit.officer.Weapon>=1)	this.actionButtons[35].enable=1;
			//if(unit.officer.Weapon>=2)	this.actionButtons[36].enable=1;
			//if(unit.officer.Weapon>=3)	this.actionButtons[37].enable=1;
		}
		if(this.selectedItem && this.selectedItem.text=="Tactic" && unit && unit.typeName=="FireOx")
		{
			this.actionButtons[39].appear=1;
			this.actionButtons[40].appear=1;
			this.actionButtons[41].appear=1;
			this.actionButtons[42].appear=1;	
			if(unit.officer.Weapon>=1)	this.actionButtons[39].enable=1;
			//if(unit.officer.Weapon>=2)	this.actionButtons[40].enable=1;
			//if(unit.officer.Weapon>=3)	this.actionButtons[41].enable=1;
		}
		if(this.selectedItem && this.selectedItem.text=="Tactic" && unit && unit.typeName=="Tower")
		{
			this.actionButtons[43].appear=1;
			this.actionButtons[44].appear=1;
			this.actionButtons[45].appear=1;
			this.actionButtons[46].appear=1;	
			if(unit.officer.Weapon>=1)	this.actionButtons[43].enable=1;
			if(unit.officer.Weapon>=2)	this.actionButtons[44].enable=1;
			if(unit.officer.Weapon>=3)	this.actionButtons[45].enable=1;
		}
		if(this.selectedItem && this.selectedItem.text=="Tactic" && unit && unit.typeName=="Catapult")
		{
			this.actionButtons[47].appear=1;
			this.actionButtons[48].appear=1;
			this.actionButtons[49].appear=1;
			this.actionButtons[50].appear=1;	
			if(unit.officer.Weapon>=1)	this.actionButtons[47].enable=1;
			if(unit.officer.Weapon>=2)	this.actionButtons[48].enable=1;
			if(unit.officer.Weapon>=3)	this.actionButtons[49].enable=1;
		}	
		//menu shot top or bottom
		this.actionButtons[68].appear=1;
		this.actionButtons[69].appear=1;
		if(this.selectedItem )
		{
			this.actionButtons[68].enable=1;
			this.actionButtons[69].enable=1;
			
			if(unit.priorTB==2)	{this.actionButtons[68].color="Green";this.actionButtons[69].color="grey";}
			else				{this.actionButtons[68].color="grey";this.actionButtons[69].color="Green";}
		}
	}
	//menu supply
	if(this.map.masterUnit==null)
		for(var i=51;i<=67;i++)
				this.actionButtons[i].appear=0;
	else
	{
		for(var i=51;i<=66;i++)
			this.actionButtons[i].appear=1;
		if(this.map.selectedUnit && this.map.selectedUnit.isPlaced)
			this.actionButtons[67].appear=1;
	}

};
ControlPanel.prototype.statusUnits = function(units){
		//scan all unit
		//neu status check =0 this xet neu bi fire thi kill
		
		STEPLOOP:
		if(PLAYTIME==0)
		{
			for(var i in units){
				if(units[i].destroyed==0 && this.map.cxCellFire)
				{
					for(var j in this.map.cxCellFire)
					{
						if(units[i].cxCell==this.map.cxCellFire[j] && units[i].cyCell==this.map.cyCellFire[j])
						{
							//neu unit dung trong cell bi fire
							if(units[i].statusCheck==0 )
							{
								if(units[i].officer!=0)
									units[i].killedTroop(Math.round(100-0.5*units[i].officer.Int));
								else
									units[i].killedTroop(Math.round(100));
								units[i].statusCheck=1;
								//neu unit dang mai phuc se bi mat mai phuc
								if(units[i].status=="Ambush")	units[i].status="Normal";
								if(units[i].typeName=="Camp")
									this.map.showMessage(units[i].typeName+" bi lua chay ",this.skip(),units[i],units[i],1 );
								else
									this.map.showMessage("Unit "+units[i].officer.Name+" bi lua chay ",this.skip(),units[i],units[i],1 );
								break STEPLOOP;
							}
						}
					}

					
				}
			}
		}
};
ControlPanel.prototype.startStep = function(units){
		//khoi tao attack cho cac unit neu no ko bi block, ploy...
		for(var i in units){
				//khoi tao statuscheck cho tung step
			for(var i in units){
				//neu unit dang bi fire
				units[i].statusCheck=0;
				
			}	
				
		}
};
ControlPanel.prototype.endStep = function(units){
		//capnhat troop number		
	if(PLAYTIME==0)
	{
		var total=0;
			for(var i in units){
				if(units[i].destroyed==0)
				{
					units[i].updateTroop();
					total+=units[i].troop;
					//neu sau khi updatetroop, unit bi destroyed thi
					if(units[i].destroyed==1)
					{//tru morale team
						var down=10;
						if(units[i].typeName=="Supply")	down=40;
						if(units[i].typeName=="Camp")	down=60;
						for(var j in units)
						{
							units[j].morale-=down;
							if(	units[j].morale<0)
									units[j].morale=0;
						}
					}
				}
			}
			this.stepDone = 1;
			this.moveDone=0;
			if(units[0].team==1)
				this.map.team1Troop=total;
			else
				this.map.team2Troop=total;
	}
};


ControlPanel.prototype.startTurn = function(units){
		for(var i in units)
		{
				//unit bi retreat thi tu dong chay ve camp
				if(units[i].status=="Retreat") this.autoRetreat(units[i],units);
				//unit bi taunt thi tu dong chay ve theo doi tuong
				if(units[i].status=="Taunt") units[i].persuit(units[i].targetUnit);
				//unit vao che do ambush
				if(units[i].attackRequest==2 && units[i].attackText=="Ambush" && units[i].status=="Normal")
				{
					units[i].status="Ambush";
					units[i].actionPoint-=20;
				}
				//tu bo che do ambush
				if(units[i].attackText!="Ambush" && units[i].status=="Ambush")
					units[i].status="Normal";
				//neu unit o che do ambush
				if(units[i].status=="Ambush")
					units[i].endMove(STEPCOUNT+1,1,1);
				//neu unit  che do Scout
				if(units[i].attackText=="Scout")
					units[i].actionPoint-=10;

				//neu unit chua chon tactic hay ploy, va o trang thai dc phep danh thi tu dong chon attack
				if(units[i].attackRequest==0 && units[i].status!="Confuse" && units[i].status!="Retreat" && units[i].status!="Stun")
				{
					units[i].attackRequest=1;//khoi tao danh cho turn nay neu no dang o trang thai no action
					units[i].attackText="Attack";//khoi tao danh cho turn nay neu no dang o trang thai no action

				}
				
		}
		//neu la team 2 cho tu dong chay 
				if(units[0].team==2)
				{
					if(STEPCOUNT == 0 && MODE==1)
					{
						if(MAP==2)	this.autoRun(this.map.team2,this.map.team1,6);
						if(MAP==3)	this.autoRun(this.map.team2,this.map.team1,7);
					}
				}
};
ControlPanel.prototype.endTurn = function(units){
	//tinh tong so food
	var totalFood=0;
		//xoa cac move cua unit
		//don het cac step bang step cuoi
	for(var i in units)
	{
				units[i].moveCount = 0;
				
				//set final possition before next turn
				for(var j in units[i].movePathX ){
					units[i].movePathX[j] = units[i].movePathX[(units[i].moveRange)];
					units[i].movePathY[j] = units[i].movePathY[(units[i].moveRange)];
				}
				//count the time of status confuse &retreat,taunt stun
				if(units[i].status=="Confuse" || units[i].status=="Retreat"  || units[i].status=="Taunt" )
				{
					units[i].statusTime+=1;
					if(units[i].statusTime>=3){
						units[i].status="Normal";
						units[i].statusTime=0;
					}
				}
				if( units[i].status=="Stun")
				{
					units[i].statusTime+=1;
					if(units[i].statusTime>=2){
						units[i].status="Normal";
						units[i].statusTime=0;
					}
				}
				//neu ket thuc ruen climb active thi set pos
				if( units[i].attackText=="Climb")
				{
					//neu vi tri tren wall ko co ai thi set move 
					if(!this.map.inPosTeam(units[i].cxFront1,units[i].cyFront1,this.map.team2) )
					{
						for(var icount=0;icount<=STEPMAX;icount++)
						{
							units[i].movePathX[icount]=units[i].cxFront1;
							units[i].movePathY[icount]=units[i].cyFront1;
						}
						units[i].uOnTop=2;
						var dx=units[i].cxFront-units[i].cxCell+units[i].cxFront1;
						var dy=units[i].cyFront-units[i].cyCell+units[i].cyFront1;
						
						units[i].setPosition(units[i].cxFront1,units[i].cyFront1,0);
						units[i].rotateAngle(dx,dy);
					}
					units[i].attackRequest=0;
				}
				//reduce food for all unit
				if(units[i].typeName=="Camp" || units[i].typeName=="Supply")
					units[i].food-=Math.round(units[i].troop/20);
				else	
					units[i].food-=Math.round(units[i].troop/10);
				//giam luong va tang AP
				//neu unit ko phai Camp va supply
				STEPLOOP:
				if(units[i].typeName!="Camp" && units[i].typeName!="Supply")
				{
					for(var j in units)
					{//tim Unit la camp hoac supply
						if(units[j].typeName=="Camp" || units[j].typeName=="Supply")
						{
							if(units[i].inViewOf(units[j]) )
							{//neu Unit i nam trong view cua Unit j (camp)
								if(units[j].food > (units[i].troop+units[j].troop)/20)
								{//neu food cua supplu lon hon tong food can thiet cho 2 unit trong 1 luot
									units[i].food+=Math.round(units[i].troop/20);
									units[j].food-=Math.round(units[i].troop/20);
									units[i].actionPoint+=5;
									break STEPLOOP;
								}
							}
						}
					}
				}
				//neu luong ma <0, thi giu o 0 va giam troop
				if(units[i].food<0)
				{
					units[i].food=0;
					units[i].killedTroop( Math.round(300+0.2*units[i].troop) );
					units[i].updateTroop();
				}
				//canh bao neu gan het luong
				if(units[i].food<2*units[i].troop/10)
				{
						units[i].needFood=1;
				}
				else	units[i].needFood=0;
		//tinh tong so food
		totalFood+=units[i].food;
	}
	//gan vao teamfood
	if(units[0].team==1)	this.map.team1Food=totalFood;
	else	this.map.team2Food=totalFood;
};
ControlPanel.prototype.pathCheck = function(unit1, i, unit2, j){
		//ss toa do trong move path cua 2 unit
		if(unit1.movePathX[i] == unit2.movePathX[j] && unit1.movePathY[i] == unit2.movePathY[j])
			return	true
		else
			return	false
};


var _keypressed = {};
//new
ControlPanel.prototype.doKeypress =function(){
    if(_keypressed[Keys.KEY_M])
    {
    	if(this.actionButtons[0].enable==1){
    		
    		this.buttonMove();
    		if(this.selectedItem)
    			this.selectedItem.isSelected=false;
    		this.selectedItem=this.actionButtons[0];
    		this.selectedItem.isSelected=true;
    	}
    }
    if(_keypressed[Keys.KEY_R])
    {
    	if(this.actionButtons[6].enable==1){
    		
    		this.buttonRotate();
    		if(this.selectedItem)
    			this.selectedItem.isSelected=false;
    		this.selectedItem=this.actionButtons[6];
    		this.selectedItem.isSelected=true;
    	}
    }
    if(_keypressed[Keys.KEY_A])
    {
    	if(this.actionButtons[1].enable==1){
    		if(this.selectedItem)
    			this.selectedItem.isSelected=false;
    		this.selectedItem=this.actionButtons[1];
    		this.selectedItem.isSelected=true;
    	}

    }
    if(_keypressed[Keys.KEY_T])
    {
    	if(this.actionButtons[2].enable==1){
    		if(this.selectedItem)
    			this.selectedItem.isSelected=false;
    		this.selectedItem=this.actionButtons[2];
    		this.selectedItem.isSelected=true;
    	}

    }
    if(_keypressed[Keys.KEY_P])
    {
    	if(this.actionButtons[3].enable==1){
    		if(this.selectedItem)
    			this.selectedItem.isSelected=false;
    		this.selectedItem=this.actionButtons[3];
    		this.selectedItem.isSelected=true;
    	}

    }	
    if(_keypressed[Keys.SPACE])
    {
		//this.buttonStep();
    }   
    
    if(_keypressed[Keys.ENTER])
    {
    	this.buttonStart();
    }
    if(_keypressed[Keys.KEY_1])
    	this.map.selectedUnit=this.map.team1[0]; 
    if(_keypressed[Keys.KEY_2])
        this.map.selectedUnit=this.map.team1[1];
    if(_keypressed[Keys.KEY_3])
        this.map.selectedUnit=this.map.team1[2];
    if(_keypressed[Keys.KEY_4])
        this.map.selectedUnit=this.map.team1[3];
    if(_keypressed[Keys.KEY_5])
        this.map.selectedUnit=this.map.team1[4];

    if(_keypressed[Keys.KEY_6])
        this.map.selectedUnit=this.map.team2[0];
    if(_keypressed[Keys.KEY_7])
        this.map.selectedUnit=this.map.team2[1];
    if(_keypressed[Keys.KEY_8])
        this.map.selectedUnit=this.map.team2[2];
    if(_keypressed[Keys.KEY_9])
        this.map.selectedUnit=this.map.team2[3];
    if(_keypressed[Keys.KEY_0])
        this.map.selectedUnit=this.map.team2[4];
};

ControlPanel.prototype.onkeydown =function(e){
	//gioi han cac key ney can
//	if(AVAILABLE_KEYS.indexOf(e.keyCode)!=-1)
//    {
        _keypressed[e.keyCode] = true;
        this.doKeypress();
//    }
};
ControlPanel.prototype.onkeyup =function(e){
	if(_keypressed[e.keyCode])
    {
        _keypressed[e.keyCode] = false;
        
    }
};
ControlPanel.prototype.buttonClimb =function(){
		if(this.map.selectedUnit && this.map.selectedUnit.isPlaced )
		{
			if(this.map.selectedUnit.inList(this.map.selectedUnit.cxCell,this.map.selectedUnit.cyCell,POS1[MAP]))
			{
				this.map.selectedUnit.attackRequest=4;
				this.map.selectedUnit.attackText="Climb";
			}
			else
				alert("Phai dung canh tuong");
	
			
		}
};
ControlPanel.prototype.buttonRotate =function(){
		if(this.map.selectedUnit && this.map.selectedUnit.isPlaced && this.map.selectedUnit.moveSelect==1 )
		{
			if(this.map.selectedUnit.rotateRequest[this.map.selectedUnit.moveCount]==0)
				this.map.selectedUnit.rotateRequest[this.map.selectedUnit.moveCount]=1;
			else
			{
				this.map.selectedUnit.rotateRequest[this.map.selectedUnit.moveCount]=0;
				this.map.selectedUnit.rotateX[this.map.selectedUnit.moveCount]=-1;
				this.map.selectedUnit.rotateY[this.map.selectedUnit.moveCount]=-1;
			}
		}
};
ControlPanel.prototype.buttonMove =function(){
		if(this.map.selectedUnit && this.map.selectedUnit.isPlaced)
		{
			if(this.map.selectedUnit.moveSelect ==0)	
				this.map.selectedUnit.moveSelect = 1;
			this.map.selectedUnit.moveCount=0;
			this.map.selectedUnit.mOnTop= this.map.selectedUnit.uOnTop;
			this.map.selectedUnit.rotateRequest = [0,0,0,0,0,0,0,0];
			this.map.selectedUnit.rotateX = [-1,-1,-1,-1,-1,-1,-1,-1];
			this.map.selectedUnit.rotateY = [-1,-1,-1,-1,-1,-1,-1,-1];
		}
};

ControlPanel.prototype.buttonSupply =function(){
	if(this.map.selectedUnit)
		{
			this.map.masterUnit = this.map.selectedUnit;
			this.map.selectedUnit = null;
			this.map.masterUnit.supplyHorseTmp=this.map.masterUnit.supplyHorse;
			this.map.masterUnit.supplySpearTmp=this.map.masterUnit.supplySpear;
			this.map.masterUnit.supplyBowTmp=this.map.masterUnit.supplyBow;
			this.map.masterUnit.troopTmp=this.map.masterUnit.troop;
			this.map.masterUnit.foodTmp=this.map.masterUnit.food;
		}
			
};
ControlPanel.prototype.buttonCreate =function(){
	if(this.map.selectedUnit && this.map.selectedUnit.typeName=="Camp")
		{
			this.map.masterUnit = this.map.selectedUnit;
			this.map.selectedUnit = UnitFactory.createUnit(7);
			this.map.selectedUnit.team=this.map.masterUnit.team;

			this.map.selectedUnit.supplyHorseTmp=0;
			this.map.selectedUnit.supplySpearTmp=0;
			this.map.selectedUnit.supplyBowTmp=0;
			this.map.selectedUnit.troopTmp=100;
			this.map.selectedUnit.foodTmp=100;

			this.map.masterUnit.supplyHorseTmp=this.map.masterUnit.supplyHorse;
			this.map.masterUnit.supplySpearTmp=this.map.masterUnit.supplySpear;
			this.map.masterUnit.supplyBowTmp=this.map.masterUnit.supplyBow;
			this.map.masterUnit.troopTmp=this.map.masterUnit.troop-100;
			this.map.masterUnit.foodTmp=this.map.masterUnit.food-100;
		}
	else
	{
			this.selectedItem = null;
			alert("Select Camp Unit");
	}	
};
ControlPanel.prototype.buttonStart =function(){

	if(MODE==1 && this.countDownSeconds > 0)
	{
		this.countDownSeconds = 0;
	}	
	else//bat dau automatic path neu dang o step 0
	{
	//	if(MODE==1)
	//	{
	//		if(STEPCOUNT == 0 && MODE==1)
	//			this.autoRun(this.map.team2,this.map.team1,5);
	//	}
		if(MODE==2)
		{
			//send move path to server
			localPlayer.endTurnSend();
		/*	if(PLAYER==1){
				PLAYER=2;
				this.countDownSeconds=COUNTDOWN_SECS;
				this.map.displayMessage("Player 2 chuan bi",this.skip(),6 );
			}
			else{
			 	if(PLAYER==2){	PLAYER=0;
			 		this.map.displayMessage("Luot choi bat dau",this.skip(),6 );
			 	}
			 }
			 */
		}
	}
};
ControlPanel.prototype.buttonStep =function(){
		this.countDownSeconds = COUNTDOWN_SECS-5;
    	//if(STEPCOUNT==0)
    	//	this.autoRun(this.map.team2,this.map.team1,5);
    	this.runFight();	
};
ControlPanel.prototype.ploySelect =function(unit1,unit2){
	//neu gap camp thi chi co dot lua
	if(unit2.typeName=="Camp" || unit2.typeName=="Fence")
		this.actionAutoSelect(unit1,2,"Fire",10);
	else
	{
		var random = Math.floor(Math.random() * 3) ; //tong so ploy available 
		if(random==0)	{this.actionAutoSelect(unit1,2,"Fire",10);}
		if(random==1)	{
			this.actionAutoSelect(unit1,2,"Confuse",15);
			if(unit2.status=="Confuse" || unit2.status=="Retreat")	
				this.actionAutoSelect(unit1,2,"Fire",10);
		}
		if(random==2)	{
			this.actionAutoSelect(unit1,2,"Retreat",15);
			if(unit2.status=="Confuse" || unit2.status=="Retreat")	
				this.actionAutoSelect(unit1,2,"Fire",10);
		}
	}

};
ControlPanel.prototype.tacticSelect =function(unit1,unit2){
	//neu unit 2 o ngoai viewrange thi phai dung do tham
	if(unit1.attackText=="Scout" || (unit1.typeName=="Horse" && !this.map.inViewTeam(unit2.cxCell, unit2.cyCell, this.map.team2)) )
		//&& ( Math.abs(unit1.cxCell-unit2.cxCell)>1 || Math.abs(unit1.cyCell-unit2.cyCell)>1 ) )
	{
		this.actionAutoSelect(unit1,2,"Scout",10);
	}
	else if(unit1.officer.War>=unit1.officer.Int || unit1.officer.Int-unit2.officer.Int<10)
		{	//neu war cao hon int, hoac int thap hon doi thu 

			if(unit1.typeName=="Horse" && unit1.officer.Horse>0)
			{
				if(unit2.typeName=="Camp" || unit2.typeName=="Fence")
					this.actionAutoSelect(unit1,2,"Fire",10);
				else
				{
					var random = Math.floor(Math.random() * (unit1.officer.Horse)) ; //horse =3, -> code =0 to 2
					if(random==0)	{this.actionAutoSelect(unit1,3,"Charge",15);}
					if(random==1)	{this.actionAutoSelect(unit1,3,"Charge2",20);}
					if(random==2)	{this.actionAutoSelect(unit1,3,"Break",25);}
				}
			}
			else if(unit1.typeName=="Horse" && unit1.officer.Horse==0 && unit1.officer.Int-unit2.officer.Int>20)
				this.ploySelect(unit1,unit2);

			if(unit1.typeName=="Spear" && unit1.officer.Spear>0)
			{
				if(unit2.typeName=="Camp" || unit2.typeName=="Fence")
					this.actionAutoSelect(unit1,2,"Fire",10);
				else
				{
					var random = Math.floor(Math.random() * (unit1.officer.Spear)) ; //horse =3, -> code =0 to 2
					if(random==0)	{this.actionAutoSelect(unit1,3,"Push",15);}
					if(random==1)	{this.actionAutoSelect(unit1,3,"Push2",20);}
					if(random==2)	{this.actionAutoSelect(unit1,3,"Dash",25);}
				}
			}
			else if(unit1.typeName=="Spear" && unit1.officer.Spear==0 && unit1.officer.Int-unit2.officer.Int>20)
				this.ploySelect(unit1,unit2);

			if(unit1.typeName=="Bow" && unit1.officer.Bow>0)
			{
				var random = Math.floor(Math.random() * (unit1.officer.Bow)) ; //horse =3, -> code =0 to 2
				if(random==0)	{this.actionAutoSelect(unit1,3,"FierceB",15);}
				if(random==1)	{this.actionAutoSelect(unit1,3,"FireBow",20);}
				if(random==2)	{this.actionAutoSelect(unit1,3,"SplashB",25);}
			}
			else if(unit1.typeName=="Bow" && unit1.officer.Bow==0 && unit1.officer.Int-unit2.officer.Int>20)
				this.ploySelect(unit1,unit2);

			if(unit1.typeName=="Ram" && unit1.officer.Weapon>0 )
			{
				this.actionAutoSelect(unit1,3,"Ram",10);
			}
			else if(unit1.typeName=="Weapon" && unit1.officer.Weapon==0 && unit1.officer.Int-unit2.officer.Int>20)
				this.ploySelect(unit1,unit2);

			if(unit1.typeName=="FireOx" && unit1.officer.Weapon>0 )
			{
				this.actionAutoSelect(unit1,3,"Eradiate",10);
			}
			else if(unit1.typeName=="Weapon" && unit1.officer.Weapon==0 && unit1.officer.Int-unit2.officer.Int>20)
				this.ploySelect(unit1,unit2);


			if(unit1.typeName=="Tower" && unit1.officer.Weapon>0 )
			{
				var random = Math.floor(Math.random() * (unit1.officer.Weapon)) ; //horse =3, -> code =0 to 2
				if(random==0)	{this.actionAutoSelect(unit1,3,"FierceA",15);}
				if(random==1)	{this.actionAutoSelect(unit1,3,"FireArc",20);}
				if(random==2)	{this.actionAutoSelect(unit1,3,"SplashA",25);}
			}
			else if(unit1.typeName=="Weapon" && unit1.officer.Weapon==0 && unit1.officer.Int-unit2.officer.Int>20)
				this.ploySelect(unit1,unit2);

			if(unit1.typeName=="Catapult" && unit1.officer.Weapon>0 )
			{
				var random = Math.floor(Math.random() * (unit1.officer.Weapon)) ; //horse =3, -> code =0 to 2
				if(random==0)	{this.actionAutoSelect(unit1,3,"FierceS",15);}
				if(random==1)	{this.actionAutoSelect(unit1,3,"FireStone",20);}
				if(random==2)	{this.actionAutoSelect(unit1,3,"SplashS",25);}
			}
			else if(unit1.typeName=="Weapon" && unit1.officer.Weapon==0 && unit1.officer.Int-unit2.officer.Int>20)
				this.ploySelect(unit1,unit2);

		}
		else
			this.ploySelect(unit1,unit2);
	
};

ControlPanel.prototype.targetSelect =function(unit1,team2){
//	var i=0;
//	while(team2[i].destroyed==1)
//							i++;
//	return i;
	//tim target theo khang cach ngan nhat
	var iTarget=0;
	var dTmin=20000;
	for(i in team2)
	{
		if(team2[i].destroyed==0 && team2[i].status!="Ambush" )
		{
			dx=unit1.cxCell-team2[i].cxCell;
			dy=unit1.cyCell-team2[i].cyCell;
			dT=dx*dx + dy*dy;
			if(dT<dTmin)
			{
				dTmin=dT;
				iTarget=i;
			}
		}
	}
	return iTarget;
};
ControlPanel.prototype.autoRetreat =function(unit1,team1){
	//tu dong chay ve camp 
	var j=0;
	for(var i in team1)
		if(team1[i].typeName=="Camp")	j=i;
	//neu co camp thi thuc hien auto, neu ko dung yen
	if(j!=0)
	{
		for(var iStep =0; iStep<=STEPMAX; iStep++)
			{
				if(iStep<unit1.moveRange)
				{
					unit1.moveCount ++;
					var dx=0;
					var dy=0;
					var codeMove=0;
					//chon target la unit==camp
			
					var xReq = team1[j].cxCell - unit1.movePathX[iStep];
					var yReq = team1[j].cyCell - unit1.movePathY[iStep];

							//sau khi chon dc toa do dich, di den voi toc do max	
						if(xReq==0 && yReq>0)	codeMove=2;	//neu dx =0, em di thang theo truc x
						if(xReq==0 && yReq<0)	codeMove=4;	//neu dx =0, em di thang theo truc x
						if(yReq==0 && xReq>0)	codeMove=1;//neu dy=0, ep di thang ve phai dich	theo y	
						if(yReq==0 && xReq<0)	codeMove=3;//neu dy=0, ep di thang ve phai dich	theo y	
					
						if(xReq>0 && yReq>0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=1;
							else			codeMove=2;
						}	
						if(xReq>0 && yReq<0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=1;
							else			codeMove=4;
						}	
						if(xReq<0 && yReq>0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=3;
							else			codeMove=2;
						}	
						if(xReq<0 && yReq<0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=3;
							else			codeMove=4;
						}		
					
					//sau khi chonj code move thi assign
						if(codeMove==0){dx=0;dy=0;}
						if(codeMove==1){dx=1;dy=0;}
						if(codeMove==2){dx=0;dy=1;}
						if(codeMove==3){dx=-1;dy=0;}
						if(codeMove==4){dx=0;dy=-1;}
					//done with movepath
					unit1.movePathX[iStep+1]=unit1.movePathX[iStep]+dx;
					unit1.movePathY[iStep+1]=unit1.movePathY[iStep]+dy;
				}
				else	//cac vitri > moverange thi set bang vitri moverange
				{
					unit1.movePathX[iStep+1]=unit1.movePathX[unit1.moveRange];
					unit1.movePathY[iStep+1]=unit1.movePathY[unit1.moveRange];
				}
				
			}
	}
}
ControlPanel.prototype.autoRun =function(team1,team2,code){

	for(var i in team1)
	{
		if(i<5 && team1[i].destroyed==0 && team1[i].status!="Confuse" && team1[i].status!="Retreat" && team1[i].status!="Taunt" && team1[i].status!="Stun")
		{
			//chon move path kieu moi
			if(code==7)
			{	
					//chon plan at step =0 then follow
					team1[i].plan = Math.floor(Math.random() * 5) ; //code 0 to 4
					//chon unit gan nhat
					var j=this.targetSelect(team1[i],team2);
					team1[i].priorTB=team2[j].uOnTop;
					//chon tactic
					this.tacticSelect(team1[i],team2[j]);	
					team1[i].moveCount=team1[i].moveRange;
						//khoi tao la den vi tri dung hien tai
						var xReq = team2[j].cxCell;
						var yReq = team2[j].cyCell;
						var dx=0;
						var dy=0;
						var iTarget=0;
						var dTmin=20000;
				//stategy phong thu trong thanh
				//neu quan dich o ben ngoai thanh thi unit 0,1,2 di ra 3 gate.
				// sau do auto detect
			//	if(team1[i].cxCell==POSGATE[MAP].x[i] && team1[i].cyCell==POSGATE[MAP].y[i] && team1[i].plan1==0 )
			//		team1[i].plan1 =1;
				
			//	if(team1[i].plan1==0 && team1[i].number<=3)
			//	{
			//		xReq=POSGATE[MAP].x[i];
			//		yReq=POSGATE[MAP].y[i];
			//	}
					//neu plan =0 tuc la tim diem chan dau va truy kick
				if(team1[i].plan==0)	
					{
						for(var iMove in team2[j].movePathX)
						{
							
							var	dTx=team1[i].cxCell-team2[j].movePathX[iMove];
							var	dTy=team1[i].cyCell-team2[j].movePathY[iMove];
							var	dTT=dTx*dTx + dTy*dTy;
								if(dTT<dTmin)
								{
									dTmin=dTT;
									iTarget=iMove;
								}
							
						}
						xReq = team2[j].movePathX[iTarget] ;
						yReq = team2[j].movePathY[iTarget] ;

					}
					else
					{	//neu plankhac 0
						//di chuyen ra bat ki vi tri xung quanh nao nhung truoc 1 nhip
						if(team1[i].typeName=="Catapult" && team1[i].attackRequest!=2)
						{	
							var planRound=1;
							while(planRound<=2)
							{
								if(team1[i].plan==1)	
								{
										xReq = team2[j].movePathX[team2[j].moveRange]+3 ;
										yReq = team2[j].movePathY[team2[j].moveRange] ;
										dx=1;dy=0;
										if(this.map.posBlock(xReq,yReq,team1[i]) )
											team1[i].plan=2;
								}
								if(team1[i].plan==2)
								{
										xReq = team2[j].movePathX[team2[j].moveRange]-3 ;
										yReq = team2[j].movePathY[team2[j].moveRange] ;
										dx=-1;dy=0;
										if(this.map.posBlock(xReq,yReq,team1[i]) )
											team1[i].plan=3;
								}
								if(team1[i].plan==3)
								{
									xReq = team2[j].movePathX[team2[j].moveRange] ;
									yReq = team2[j].movePathY[team2[j].moveRange]+3  ;
									dx=0;dy=1;
									if(this.map.posBlock(xReq,yReq,team1[i]) )
											team1[i].plan=4;
								}
								if(team1[i].plan==4)
								{
									xReq = team2[j].movePathX[team2[j].moveRange] ;
									yReq = team2[j].movePathY[team2[j].moveRange]-3  ;
									dx=0;dy=-1;
									if(this.map.posBlock(xReq,yReq,team1[i]) )
											team1[i].plan=1;
								}
								planRound++;
							}
							if(this.map.posBlock(xReq,yReq,team1[i]) )
							{
								xReq = team2[j].movePathX[team2[j].moveRange] ;
								yReq = team2[j].movePathY[team2[j].moveRange] ;
								dx=0;dy=0;
							}
						}
						else if( (team1[i].typeName=="Tower" || team1[i].typeName=="Bow") && team1[i].attackRequest!=2 )
						{	
							var planRound=1;
							while(planRound<=2)
							{
								if(team1[i].plan==1)	
								{
										xReq = team2[j].movePathX[team2[j].moveRange]+2 ;
										yReq = team2[j].movePathY[team2[j].moveRange] ;
										dx=1;dy=0;
										if(this.map.posBlock(xReq,yReq,team1[i]) )
											team1[i].plan=2;
								}
								if(team1[i].plan==2)
								{
										xReq = team2[j].movePathX[team2[j].moveRange]-2 ;
										yReq = team2[j].movePathY[team2[j].moveRange] ;
										dx=-1;dy=0;
										if(this.map.posBlock(xReq,yReq,team1[i]) )
											team1[i].plan=3;
								}
								if(team1[i].plan==3)
								{
									xReq = team2[j].movePathX[team2[j].moveRange] ;
									yReq = team2[j].movePathY[team2[j].moveRange]+2  ;
									dx=0;dy=1;
									if(this.map.posBlock(xReq,yReq,team1[i]) )
											team1[i].plan=4;
								}
								if(team1[i].plan==4)
								{
									xReq = team2[j].movePathX[team2[j].moveRange] ;
									yReq = team2[j].movePathY[team2[j].moveRange]-2  ;
									dx=0;dy=-1;
									if(this.map.posBlock(xReq,yReq,team1[i]) )
											team1[i].plan=1;
								}
								planRound++;
							}
							if(this.map.posBlock(xReq,yReq,team1[i]) )
							{
								xReq = team2[j].movePathX[team2[j].moveRange] ;
								yReq = team2[j].movePathY[team2[j].moveRange] ;
								dx=0;dy=0;
							}
						}
						else
						{	//random 4 vi tri phai va truoc
							var planRound=1;
							while(planRound<=2)
							{
								if(team1[i].plan==1)	
								{
										xReq = team2[j].movePathX[team2[j].moveRange]+1 ;
										yReq = team2[j].movePathY[team2[j].moveRange] ;
										dx=1;dy=0;
										if(this.map.posBlock(xReq,yReq,team1[i]) )
											team1[i].plan=2;
								}
								if(team1[i].plan==2)
								{
										xReq = team2[j].movePathX[team2[j].moveRange]-1 ;
										yReq = team2[j].movePathY[team2[j].moveRange] ;
										dx=-1;dy=0;
										if(this.map.posBlock(xReq,yReq,team1[i]) )
											team1[i].plan=3;
								}
								if(team1[i].plan==3)
								{
									xReq = team2[j].movePathX[team2[j].moveRange] ;
									yReq = team2[j].movePathY[team2[j].moveRange]+1  ;
									dx=0;dy=1;
									if(this.map.posBlock(xReq,yReq,team1[i]) )
											team1[i].plan=4;
								}
								if(team1[i].plan==4)
								{
									xReq = team2[j].movePathX[team2[j].moveRange] ;
									yReq = team2[j].movePathY[team2[j].moveRange]-1  ;
									dx=0;dy=-1;
									if(this.map.posBlock(xReq,yReq,team1[i]) )
											team1[i].plan=1;
								}
								planRound++;
							}
							if(this.map.posBlock(xReq,yReq,team1[i]) )
							{
								xReq = team2[j].movePathX[team2[j].moveRange] ;
								yReq = team2[j].movePathY[team2[j].moveRange] ;
								dx=0;dy=0;
							}
						}
					}	
					if(i>2)
						this.map.findPathAuto(team1[i], xReq, yReq,0);
					else
						this.map.findPathAuto(team1[i], xReq, yReq,0);
					//assign path	
						for(var iStep =1; iStep<=STEPMAX; iStep++)
						{
							if(iStep<=team1[i].moveRange)
							{
								//neu result=0 tuc la dung tai vi tri rui, thi suy ra ko phai la plan 0, thi xoay ve phia doi tuong trong step1
								if(iStep==1 && result.length==0 && team1[i].plan!=0 && this.map.inList(xReq,yReq,BLOCK[MAP]))
								{
									team1[i].rotateRequest[iStep]=1;
									team1[i].rotateX[iStep]=team2[j].movePathX[team2[j].moveRange];
									team1[i].rotateY[iStep]=team2[j].movePathY[team2[j].moveRange];
								}
								//done with movepath
								if(iStep<=result.length)
								{
									team1[i].movePathX[iStep]=result[iStep-1].x;
									team1[i].movePathY[iStep]=result[iStep-1].y-16;
									
									if(iStep==result.length && team1[i].plan!=0 )
									{
										team1[i].rotateRequest[iStep]=1;
										team1[i].rotateX[iStep]=team2[j].movePathX[team2[j].moveRange];
										team1[i].rotateY[iStep]=team2[j].movePathY[team2[j].moveRange];
									}
									else if(iStep==result.length && team1[i].plan==0 && iStep<iTarget)
									{
											team1[i].rotateRequest[iStep]=1;
											team1[i].rotateX[iStep]=team2[j].movePathX[iTarget-1];
											team1[i].rotateY[iStep]=team2[j].movePathY[iTarget-1];
											iTarget=STEPMAX;
									}
								}
								else
								{
									//neu da toi duoc dich
									if(team1[i].plan==0 && result.length>0 )	
									{	//neu la plan =0
										//neu istep<iTarget thi tuc la unit 1 den truoc unit2, can dung yen va xoay ve phia itarger-1
										if(iStep<iTarget)
										{
											team1[i].movePathX[iStep] = team1[i].movePathX[iStep-1] ;
											team1[i].movePathY[iStep] = team1[i].movePathY[iStep-1] ;
											
										}
										else
										{	//neu den sau thi duoi theo
											iTarget++;
											team1[i].movePathX[iStep] = team2[j].movePathX[iTarget] ;
											team1[i].movePathY[iStep] = team2[j].movePathY[iTarget] ;
										}
									}
									else if(team1[i].plan!=0 )
									{	//neu khac plan 0
										var hieu=(iStep-result.length);
										var du = hieu%2;
										if(  du==1 )
										{//neu istep lon hon result.length 1 donvi thi
											if(result.length>=2)
											{
												team1[i].movePathX[iStep]=result[result.length-2].x   ;
												team1[i].movePathY[iStep]=result[result.length-2].y-16;
											}
											else if(result.length>0)
											{
												team1[i].movePathX[iStep]=team1[i].movePathX[0]  ;
												team1[i].movePathY[iStep]=team1[i].movePathY[0]  ;
											}
											
										}
										else
										{//neu istep lon hon result.length 2 donvi thi
											//tro lai vi tri target va xoay
											if(result.length>=1)
											{	//neu resut co it nhat 1 pos
												team1[i].movePathX[iStep]=result[result.length-1].x   ;
												team1[i].movePathY[iStep]=result[result.length-1].y-16;
												team1[i].rotateRequest[iStep]=1;
												team1[i].rotateX[iStep]=team2[j].movePathX[team2[j].moveRange];
												team1[i].rotateY[iStep]=team2[j].movePathY[team2[j].moveRange];
											}
										}
									}
								}
							}
							else	//cac vitri > moverange thi set bang vitri moverange
							{
								team1[i].movePathX[iStep]=team1[i].movePathX[team1[i].moveRange];
								team1[i].movePathY[iStep]=team1[i].movePathY[team1[i].moveRange];
							}
						}
			}
			else if(code==6)
			{
					//chon plan at step =0 then follow
					team1[i].plan = Math.floor(Math.random() * 5) ; //code 0 to 4
					//chon unit gan nhat
					var j=this.targetSelect(team1[i],team2);
					team1[i].priorTB=team2[j].uOnTop;
					//chon tactic
					this.tacticSelect(team1[i],team2[j]);	
					team1[i].moveCount=team1[i].moveRange;
						//khoi tao la den vi tri dung hien tai
						var xReq = team2[j].cxCell;
						var yReq = team2[j].cyCell;
						var dx=0;
						var dy=0;
						var iTarget=0;
						var dTmin=20000;
					//neu plan =0 tuc la tim diem chan dau va truy kick
					if(team1[i].plan==0)	
					{
						for(var iMove in team2[j].movePathX)
						{
							
							var	dTx=team1[i].cxCell-team2[j].movePathX[iMove];
							var	dTy=team1[i].cyCell-team2[j].movePathY[iMove];
							var	dTT=dTx*dTx + dTy*dTy;
								if(dTT<dTmin)
								{
									dTmin=dTT;
									iTarget=iMove;
								}
							
						}
						xReq = team2[j].movePathX[iTarget] ;
						yReq = team2[j].movePathY[iTarget] ;

					}
					else
					{	//neu pankhac 0
						//di chuyen ra bat ki vi tri xung quanh nao nhung truoc 1 nhip
						if(team1[i].typeName=="Catapult" && team1[i].attackRequest!=2)
						{	
							var planRound=1;
							while(planRound<=2)
							{
								if(team1[i].plan==1)	
								{
										xReq = team2[j].movePathX[team2[j].moveRange]+3 ;
										yReq = team2[j].movePathY[team2[j].moveRange] ;
										dx=1;dy=0;
										if(this.map.posBlock(xReq,yReq,team1[i].uOnTop) )
											team1[i].plan=2;
								}
								if(team1[i].plan==2)
								{
										xReq = team2[j].movePathX[team2[j].moveRange]-3 ;
										yReq = team2[j].movePathY[team2[j].moveRange] ;
										dx=-1;dy=0;
										if(this.map.posBlock(xReq,yReq,team1[i].uOnTop) )
											team1[i].plan=3;
								}
								if(team1[i].plan==3)
								{
									xReq = team2[j].movePathX[team2[j].moveRange] ;
									yReq = team2[j].movePathY[team2[j].moveRange]+3  ;
									dx=0;dy=1;
									if(this.map.posBlock(xReq,yReq,team1[i].uOnTop) )
											team1[i].plan=4;
								}
								if(team1[i].plan==4)
								{
									xReq = team2[j].movePathX[team2[j].moveRange] ;
									yReq = team2[j].movePathY[team2[j].moveRange]-3  ;
									dx=0;dy=-1;
									if(this.map.posBlock(xReq,yReq,team1[i].uOnTop) )
											team1[i].plan=1;
								}
								planRound++;
							}
							if(this.map.posBlock(xReq,yReq,team1[i].uOnTop) )
							{
								xReq = team2[j].movePathX[team2[j].moveRange] ;
								yReq = team2[j].movePathY[team2[j].moveRange] ;
								dx=0;dy=0;
							}
						}
						else if( (team1[i].typeName=="Tower" || team1[i].typeName=="Bow") && team1[i].attackRequest!=2 )
						{	
							var planRound=1;
							while(planRound<=2)
							{
								if(team1[i].plan==1)	
								{
										xReq = team2[j].movePathX[team2[j].moveRange]+2 ;
										yReq = team2[j].movePathY[team2[j].moveRange] ;
										dx=1;dy=0;
										if(this.map.posBlock(xReq,yReq,team1[i].uOnTop) )
											team1[i].plan=2;
								}
								if(team1[i].plan==2)
								{
										xReq = team2[j].movePathX[team2[j].moveRange]-2 ;
										yReq = team2[j].movePathY[team2[j].moveRange] ;
										dx=-1;dy=0;
										if(this.map.posBlock(xReq,yReq,team1[i].uOnTop) )
											team1[i].plan=3;
								}
								if(team1[i].plan==3)
								{
									xReq = team2[j].movePathX[team2[j].moveRange] ;
									yReq = team2[j].movePathY[team2[j].moveRange]+2  ;
									dx=0;dy=1;
									if(this.map.posBlock(xReq,yReq,team1[i].uOnTop) )
											team1[i].plan=4;
								}
								if(team1[i].plan==4)
								{
									xReq = team2[j].movePathX[team2[j].moveRange] ;
									yReq = team2[j].movePathY[team2[j].moveRange]-2  ;
									dx=0;dy=-1;
									if(this.map.posBlock(xReq,yReq,team1[i].uOnTop) )
											team1[i].plan=1;
								}
								planRound++;
							}
							if(this.map.posBlock(xReq,yReq,team1[i].uOnTop) )
							{
								xReq = team2[j].movePathX[team2[j].moveRange] ;
								yReq = team2[j].movePathY[team2[j].moveRange] ;
								dx=0;dy=0;
							}
						}
						else
						{	//random 4 vi tri phai va truoc
							var planRound=1;
							while(planRound<=2)
							{
								if(team1[i].plan==1)	
								{
										xReq = team2[j].movePathX[team2[j].moveRange]+1 ;
										yReq = team2[j].movePathY[team2[j].moveRange] ;
										dx=1;dy=0;
										if(this.map.posBlock(xReq,yReq,team1[i].uOnTop) )
											team1[i].plan=2;
								}
								if(team1[i].plan==2)
								{
										xReq = team2[j].movePathX[team2[j].moveRange]-1 ;
										yReq = team2[j].movePathY[team2[j].moveRange] ;
										dx=-1;dy=0;
										if(this.map.posBlock(xReq,yReq,team1[i].uOnTop) )
											team1[i].plan=3;
								}
								if(team1[i].plan==3)
								{
									xReq = team2[j].movePathX[team2[j].moveRange] ;
									yReq = team2[j].movePathY[team2[j].moveRange]+1  ;
									dx=0;dy=1;
									if(this.map.posBlock(xReq,yReq,team1[i].uOnTop) )
											team1[i].plan=4;
								}
								if(team1[i].plan==4)
								{
									xReq = team2[j].movePathX[team2[j].moveRange] ;
									yReq = team2[j].movePathY[team2[j].moveRange]-1  ;
									dx=0;dy=-1;
									if(this.map.posBlock(xReq,yReq,team1[i].uOnTop) )
											team1[i].plan=1;
								}
								planRound++;
							}
							if(this.map.posBlock(xReq,yReq,team1[i].uOnTop) )
							{
								xReq = team2[j].movePathX[team2[j].moveRange] ;
								yReq = team2[j].movePathY[team2[j].moveRange] ;
								dx=0;dy=0;
							}
						}
					}	
					
					this.map.findPathAuto(team1[i], xReq, yReq,0);
					//assign path	
						for(var iStep =1; iStep<=STEPMAX; iStep++)
						{
							if(iStep<=team1[i].moveRange)
							{
								//neu result=0 tuc la dung tai vi tri rui, thi suy ra ko phai la plan 0, thi xoay ve phia doi tuong trong step1
								if(iStep==1 && result.length==0 && team1[i].plan!=0 && this.map.inList(xReq,yReq,BLOCK[MAP]))
								{
									team1[i].rotateRequest[iStep]=1;
									team1[i].rotateX[iStep]=team2[j].movePathX[team2[j].moveRange];
									team1[i].rotateY[iStep]=team2[j].movePathY[team2[j].moveRange];
								}
								//done with movepath
								if(iStep<=result.length)
								{
									team1[i].movePathX[iStep]=result[iStep-1].x;
									team1[i].movePathY[iStep]=result[iStep-1].y-16;
									if(iStep==result.length && team1[i].plan!=0)
									{
										team1[i].rotateRequest[iStep]=1;
										team1[i].rotateX[iStep]=team2[j].movePathX[team2[j].moveRange];
										team1[i].rotateY[iStep]=team2[j].movePathY[team2[j].moveRange];
									}
									else if(iStep==result.length && team1[i].plan==0 && iStep<iTarget)
									{
											team1[i].rotateRequest[iStep]=1;
											team1[i].rotateX[iStep]=team2[j].movePathX[iTarget-1];
											team1[i].rotateY[iStep]=team2[j].movePathY[iTarget-1];
											iTarget=STEPMAX;
									}
								}
								else
								{
									//neu da toi duoc dich
									if(team1[i].plan==0 && result.length>0)	
									{	//neu la plan =0
										//neu istep<iTarget thi tuc la unit 1 den truoc unit2, can dung yen va xoay ve phia itarger-1
										if(iStep<iTarget)
										{
											team1[i].movePathX[iStep] = team1[i].movePathX[iStep-1] ;
											team1[i].movePathY[iStep] = team1[i].movePathY[iStep-1] ;
											
										}
										else
										{	//neu den sau thi duoi theo
											iTarget++;
											team1[i].movePathX[iStep] = team2[j].movePathX[iTarget] ;
											team1[i].movePathY[iStep] = team2[j].movePathY[iTarget] ;
										}
									}
									else if(team1[i].plan!=0)
									{	//neu khac plan 0
										var hieu=(iStep-result.length);
										var du = hieu%2;
										if(  du==1 )
										{//neu istep lon hon result.length 1 donvi thi
											if(result.length>=2)
											{
												team1[i].movePathX[iStep]=result[result.length-2].x   ;
												team1[i].movePathY[iStep]=result[result.length-2].y-16;
											}
											else if(result.length>0)
											{
												team1[i].movePathX[iStep]=team1[i].movePathX[0]  ;
												team1[i].movePathY[iStep]=team1[i].movePathY[0]  ;
											}
											
										}
										else
										{//neu istep lon hon result.length 2 donvi thi
											//tro lai vi tri target va xoay
											if(result.length>=1)
											{	//neu resut co it nhat 1 pos
												team1[i].movePathX[iStep]=result[result.length-1].x   ;
												team1[i].movePathY[iStep]=result[result.length-1].y-16;
												team1[i].rotateRequest[iStep]=1;
												team1[i].rotateX[iStep]=team2[j].movePathX[team2[j].moveRange];
												team1[i].rotateY[iStep]=team2[j].movePathY[team2[j].moveRange];
											}
										}
									}
								}
							}
							else	//cac vitri > moverange thi set bang vitri moverange
							{
								team1[i].movePathX[iStep]=team1[i].movePathX[team1[i].moveRange];
								team1[i].movePathY[iStep]=team1[i].movePathY[team1[i].moveRange];
							}
						}
			}
			else
			{
			//chon movepath kieu cu
			for(var iStep =0; iStep<=STEPMAX; iStep++)
			{
				if(iStep==0)	//chon plan at step =0 then follow
					team1[i].plan = Math.floor(Math.random() * 3) ; //code 0 to 2
							
				
				if(iStep<team1[i].moveRange)
				{
					team1[i].moveCount ++;
					//tao path random ttuy theo code strategy
					var dx=0;
					var dy=0;
					var codeMove=0;
					//binh thuong (code==0)	//hoan toan random
					var random = Math.floor(Math.random() * 5) ; //code =0 to 4
					//chon unit gan nhat
					var j=this.targetSelect(team1[i],team2);
					//chon unit co thu tu dau tien
					//	while(team2[j].destroyed==1)
					//		j++;
					//sau khi chon target thi chon tactic hoac ploy tuy vao tuong cua 2 ben
					//chon tactic
					this.tacticSelect(team1[i],team2[j]);

						var xReq = team2[j].movePathX[iStep] - team1[i].movePathX[iStep];
						var yReq = team2[j].movePathY[iStep] - team1[i].movePathY[iStep];
					if(code==1)	
					{	//range thi den cach 1 o
						if(team1[i].shootingRange==2)
						{
							xReq = team2[j].cxFront3 - team1[i].movePathX[iStep];
							yReq = team2[j].cyFront3 - team1[i].movePathY[iStep];
						}
						//cac unit khac den truc tep vi tri
						
						if(xReq>0 && random==3)	random=0;
						if(xReq<0 && random==1)	random=0;
						if(yReq>0 && random==4)	random=0;
						if(yReq<0 && random==2)	random=0;
						if(xReq==0 && (random==1 || random==3))	random=0;	//neu dx =0, ep di thang theo truc x
						if(yReq==0 && (random==2 || random==4))	random=0;	//neu dy=0, ep di thang ve phai dich	theo y	
				
						codeMove=random;
												
					}
					if(code==2)	
					{
						if(team1[i].shootingRange==2)
						{
							xReq = team2[j].cxFront3 - team1[i].movePathX[iStep];
							yReq = team2[j].cyFront3 - team1[i].movePathY[iStep];
						}
						else
						{
							xReq = team2[j].cxRight2 - team1[i].movePathX[iStep];
							yReq = team2[j].cyRight2 - team1[i].movePathY[iStep];	
						}
						
						if(xReq==0 && yReq==0)
						{
							xReq = team2[j].movePathX[iStep] - team1[i].movePathX[iStep];
							yReq = team2[j].movePathY[iStep] - team1[i].movePathY[iStep];
						}
						//neu persuit , neu b doan nay thi la di chuyen ra 1 vi tri front3& right2
						xReq = team2[j].movePathX[team2[j].moveRange] - team1[i].movePathX[iStep];
						yReq = team2[j].movePathY[team2[j].moveRange] - team1[i].movePathY[iStep];
						//sau khi chon dc toa do dich, di den voi toc do max	
						if(xReq==0 && yReq>0)	codeMove=2;	//neu dx =0, em di thang theo truc x
						if(xReq==0 && yReq<0)	codeMove=4;	//neu dx =0, em di thang theo truc x
						if(yReq==0 && xReq>0)	codeMove=1;//neu dy=0, ep di thang ve phai dich	theo y	
						if(yReq==0 && xReq<0)	codeMove=3;//neu dy=0, ep di thang ve phai dich	theo y	
					
						if(xReq>0 && yReq>0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=1;
							else			codeMove=2;
						}	
						if(xReq>0 && yReq<0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=1;
							else			codeMove=4;
						}	
						if(xReq<0 && yReq>0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=3;
							else			codeMove=2;
						}	
						if(xReq<0 && yReq<0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=3;
							else			codeMove=4;
						}		
					}
					if(code==3)	
					{	//di chuyen ra bat ki vi tri xung quanh nao nhung truoc 1 nhip
						var targetx=[];
						var targety=[];
						var xTargetMin;
						var yTargetMin;
						var distanceMin=10000;
						targetx[0]=team2[j].cxFront3;
						targety[0]=team2[j].cyFront3;
						targetx[1]=team2[j].cxBack3;
						targety[1]=team2[j].cyBack3;
						targetx[2]=team2[j].cxLeft3;
						targety[2]=team2[j].cyLeft3;
						targetx[3]=team2[j].cxRight3;
						targety[3]=team2[j].cyRight3;
						for(var t =0;t<4;t++)
						{
							var distance=(targetx[t]-team1[i].movePathX[iStep])*(targetx[t]-team1[i].movePathX[iStep]) 
							+ (targety[t]-team1[i].movePathY[iStep])*(targety[t]-team1[i].movePathY[iStep]);
							if(distance<distanceMin)
							{
								xTargetMin=targetx[t];
								yTargetMin=targety[t];
								distanceMin=distance;
							}
						}	
							xReq = xTargetMin - team1[i].movePathX[iStep];
							yReq = yTargetMin - team1[i].movePathY[iStep];	
						
						
						if(xReq==0 && yReq==0)
						{
							xReq = team2[j].movePathX[iStep] - team1[i].movePathX[iStep];
							yReq = team2[j].movePathY[iStep] - team1[i].movePathY[iStep];
						}
						//sau khi chon dc toa do dich, di den voi toc do max	
						if(xReq==0 && yReq>0)	codeMove=2;	//neu dx =0, em di thang theo truc x
						if(xReq==0 && yReq<0)	codeMove=4;	//neu dx =0, em di thang theo truc x
						if(yReq==0 && xReq>0)	codeMove=1;//neu dy=0, ep di thang ve phai dich	theo y	
						if(yReq==0 && xReq<0)	codeMove=3;//neu dy=0, ep di thang ve phai dich	theo y	
					
						if(xReq>0 && yReq>0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=1;
							else			codeMove=2;
						}	
						if(xReq>0 && yReq<0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=1;
							else			codeMove=4;
						}	
						if(xReq<0 && yReq>0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=3;
							else			codeMove=2;
						}	
						if(xReq<0 && yReq<0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=3;
							else			codeMove=4;
						}		
					}
					if(code==4)	
					{	//di chuyen ra bat ki vi tri xung quanh nao nhung truoc 1 nhip
						if(i==2)
						{
							xReq = team2[j].movePathX[team2[j].moveRange]-3 - team1[i].movePathX[iStep];
							yReq = team2[j].movePathY[team2[j].moveRange] - team1[i].movePathY[iStep];
						}
						if(i==1)
						{
							xReq = team2[j].movePathX[team2[j].moveRange]-2 - team1[i].movePathX[iStep];
							yReq = team2[j].movePathY[team2[j].moveRange] - team1[i].movePathY[iStep];	
						}
						
						if(i==0)
						{
							xReq = team2[j].movePathX[team2[j].moveRange] - team1[i].movePathX[iStep];
							yReq = team2[j].movePathY[team2[j].moveRange]-2 - team1[i].movePathY[iStep];
						}
						if(xReq==0 && yReq==0)
						{
							xReq = team2[j].movePathX[team2[j].moveRange] - team1[i].movePathX[iStep];
							yReq = team2[j].movePathY[team2[j].moveRange] - team1[i].movePathY[iStep];
						}
						//sau khi chon dc toa do dich, di den voi toc do max	
						if(xReq==0 && yReq>0)	codeMove=2;	//neu dx =0, em di thang theo truc x
						if(xReq==0 && yReq<0)	codeMove=4;	//neu dx =0, em di thang theo truc x
						if(yReq==0 && xReq>0)	codeMove=1;//neu dy=0, ep di thang ve phai dich	theo y	
						if(yReq==0 && xReq<0)	codeMove=3;//neu dy=0, ep di thang ve phai dich	theo y	
					
						if(xReq>0 && yReq>0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=1;
							else			codeMove=2;
						}	
						if(xReq>0 && yReq<0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=1;
							else			codeMove=4;
						}	
						if(xReq<0 && yReq>0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=3;
							else			codeMove=2;
						}	
						if(xReq<0 && yReq<0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=3;
							else			codeMove=4;
						}		
					}
					if(code==5)	
					{	//di chuyen ra bat ki vi tri xung quanh nao nhung truoc 1 nhip
						if(i==3)
						{	
							if(team1[i].attackRequest==2)
							{	//random 2 vi tri truoc va phai
								if(team1[i].plan==1)	
								{
									xReq = team2[j].movePathX[team2[j].moveRange] - team1[i].movePathX[iStep];
									yReq = team2[j].movePathY[team2[j].moveRange]+2 - team1[i].movePathY[iStep];
								}
								else if(team1[i].plan==2)
								{
									xReq = team2[j].movePathX[team2[j].moveRange]+2 - team1[i].movePathX[iStep];
									yReq = team2[j].movePathY[team2[j].moveRange] - team1[i].movePathY[iStep];
								}
							}
							else
							{
								xReq = team2[j].movePathX[team2[j].moveRange] - team1[i].movePathX[iStep];
								yReq = team2[j].movePathY[team2[j].moveRange]+4 - team1[i].movePathY[iStep];
							}
						}
						if(i==2)
						{	
							if(team1[i].attackRequest==2)
							{	//random 2 vi tri truoc va trai
								if(team1[i].plan==1)	
								{
									xReq = team2[j].movePathX[team2[j].moveRange] - team1[i].movePathX[iStep];
									yReq = team2[j].movePathY[team2[j].moveRange]+2 - team1[i].movePathY[iStep];
								}
								else if(team1[i].plan==2)
								{
									xReq = team2[j].movePathX[team2[j].moveRange]-2 - team1[i].movePathX[iStep];
									yReq = team2[j].movePathY[team2[j].moveRange] - team1[i].movePathY[iStep];
								}
							}
							else
							{
								xReq = team2[j].movePathX[team2[j].moveRange] - team1[i].movePathX[iStep];
								yReq = team2[j].movePathY[team2[j].moveRange]+3 - team1[i].movePathY[iStep];
							}
						}
						if(i==1)
						{	//random 2 vi tri phai va truoc
							if(team1[i].plan==1)	
							{
								xReq = team2[j].movePathX[team2[j].moveRange]+2 - team1[i].movePathX[iStep];
								yReq = team2[j].movePathY[team2[j].moveRange] - team1[i].movePathY[iStep];	
							}
							else if(team1[i].plan==2)
							{
								xReq = team2[j].movePathX[team2[j].moveRange]    - team1[i].movePathX[iStep];
								yReq = team2[j].movePathY[team2[j].moveRange] +2 - team1[i].movePathY[iStep];	
							}
						}
						
						if(i==0 || i==4)
						{	//random 2 vitri sau va trai
							if(team1[i].plan==1)	
							{
								xReq = team2[j].movePathX[team2[j].moveRange]    - team1[i].movePathX[iStep];
								yReq = team2[j].movePathY[team2[j].moveRange] -2 - team1[i].movePathY[iStep];
							}
							else if(team1[i].plan==2)
							{
								xReq = team2[j].movePathX[team2[j].moveRange] -2 - team1[i].movePathX[iStep];
								yReq = team2[j].movePathY[team2[j].moveRange]    - team1[i].movePathY[iStep];
							}
						}
						if(xReq==0 && yReq==0)
						{
							xReq = team2[j].movePathX[team2[j].moveRange] - team1[i].movePathX[iStep];
							yReq = team2[j].movePathY[team2[j].moveRange] - team1[i].movePathY[iStep];
						}
						//sau khi chon dc toa do dich, di den voi toc do max	
						if(xReq==0 && yReq>0)	codeMove=2;	//neu dx =0, em di thang theo truc x
						if(xReq==0 && yReq<0)	codeMove=4;	//neu dx =0, em di thang theo truc x
						if(yReq==0 && xReq>0)	codeMove=1;//neu dy=0, ep di thang ve phai dich	theo y	
						if(yReq==0 && xReq<0)	codeMove=3;//neu dy=0, ep di thang ve phai dich	theo y	
					
						if(xReq>0 && yReq>0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=1;
							else			codeMove=2;
						}	
						if(xReq>0 && yReq<0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=1;
							else			codeMove=4;
						}	
						if(xReq<0 && yReq>0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=3;
							else			codeMove=2;
						}	
						if(xReq<0 && yReq<0){
							random = Math.floor(Math.random() * 2) ;
							if(random==1)	codeMove=3;
							else			codeMove=4;
						}		
					}
					//sau khi chonj code move thi assign
						if(codeMove==0){dx=0;dy=0;}
						if(codeMove==1){dx=1;dy=0;}
						if(codeMove==2){dx=0;dy=1;}
						if(codeMove==3){dx=-1;dy=0;}
						if(codeMove==4){dx=0;dy=-1;}
					//done with movepath
					team1[i].movePathX[iStep+1]=team1[i].movePathX[iStep]+dx;
					team1[i].movePathY[iStep+1]=team1[i].movePathY[iStep]+dy;
				}
				else	//cac vitri > moverange thi set bang vitri moverange
				{
					team1[i].movePathX[iStep+1]=team1[i].movePathX[team1[i].moveRange];
					team1[i].movePathY[iStep+1]=team1[i].movePathY[team1[i].moveRange];
				}
			}	
			}
		}
	}
};
ControlPanel.prototype.supportPloy = function(team1,team2){
	//scan all suppprt ploy
	STEPLOOP:
		if(PLAYTIME==0)
		{
			for(var i in team1)
			{
					if(team1[i].destroyed==0 && team1[i].attackRequest==2)
					{
						////////////////////////////
						if(team1[i].attackText=="Weather")
						{
							WEATHER = Math.floor(Math.random() * (WEATHERTEXT.length) ) ;
							this.map.showMessage(team1[i].officer.Name+" thay doi thoi tiet",this.skip() ,team1[i],team1[i],0);
							team1[i].attackRequest=0;
							team1[i].actionPoint-=30;
							break STEPLOOP;
						}
						////////////////////////////
						if(team1[i].attackText=="Wind")
						{
							WIND = Math.floor(Math.random() * 5 ) ;
							this.map.trendWind();
							this.map.showMessage(team1[i].officer.Name+" thay doi huong gio",this.skip() ,team1[i],team1[i],0);
							team1[i].attackRequest=0;
							team1[i].actionPoint-=30;
							break STEPLOOP;
						}
						////////////////////////////
						if(team1[i].attackText=="Calm" )
						{
							for(var j in team1)
							{
								if(team1[j].status!= "Normal" && team1[i].cxFront1==team1[j].cxCell && team1[i].cyFront1==team1[j].cyCell)
								{
									var random = Math.floor(Math.random() * 102) ; //code =0 to 101
									if(team1[i].officer.Int<random)
									{//ploy false
										this.map.showMessage(team1[i].officer.Name+" that bai voi Ploy "+team1[i].attackText,this.skip() ,team1[i],team1[j],0);
										
									}	
									else
									{//tactic success
										team1[j].status= "Normal" ;
										team1[j].endMove(STEPCOUNT+1,1,1);
										this.map.showMessage(team1[i].officer.Name+" thanh cong voi Ploy "+team1[i].attackText,this.skip() ,team1[i],team1[j],0);
										
									}
									team1[i].attackRequest=0;
									team1[i].actionPoint-=10;
									break STEPLOOP;
								}
							}
						}
						////////////////////////////
						if(team1[i].attackText=="Ambush")
						{
							for(var j in team2)
							{
								if(team2[j].destroyed==0 
									&& (	(Math.abs( team2[j].cxCell-team1[i].cxCell)==1 && Math.abs( team2[j].cyCell-team1[i].cyCell)==0)
											|| (Math.abs( team2[j].cxCell-team1[i].cxCell)==0 && Math.abs( team2[j].cyCell-team1[i].cyCell)==1)	) )
								{	
									if(team2[j].attackText=="Scout")
									{
										//neu doi phuong co scout thi bi phat hien
										//team2[j].attackRequest=0;
										team1[i].attackRequest=0;
										team1[i].status="Normal" ;
										this.map.showMessage(team2[j].officer.Name+" dung Ploy Scout phat hien "+team1[i].officer.Name+" dang Ambush",this.skip() ,team2[j],team1[i],0);
										break STEPLOOP;

									}
									else
									{
										//ambush gay damage
										team2[j].killedTroop(300+5*team1[i].officer.War);
										team2[j].attackRequest=0;
										team2[j].endMove(STEPCOUNT+1,1,1);
											
										var random = Math.floor(Math.random() * 102) ; //code =0 to 101
										if(team1[i].officer.Int<random)
										{//ploy false
											this.map.showMessage(team1[i].officer.Name+" thuc hien Ploy "+team1[i].attackText,this.skip() ,team1[i],team2[j],0);
											
										}	
										else
										{//tactic success
											
											team2[j].status="Confuse" ;
											team2[j].statusTime=0;
											this.map.showMessage(team1[i].officer.Name+" thuc hien Ploy "+team1[i].attackText+" va lam Confuse",this.skip() ,team1[i],team2[j],0);
											
										}
										team1[i].attackRequest=0;
										team1[i].status="Normal" ;
										break STEPLOOP;
									}
								}
							}
						}
						////////////////////////////
						if(team1[i].attackText=="Douse" && this.map.cxCellFire)
						{
								for(var j in this.map.cxCellFire)
								{
									//neu unit dung trong cell bi fire
									if(team1[i].cxCell==this.map.cxCellFire[j] && team1[i].cyCell==this.map.cyCellFire[j])
									{
										
										var random = Math.floor(Math.random() * 102) ; //code =0 to 101
										if(team1[i].officer.Int<random)
										{//ploy false
											this.map.showMessage(team1[i].officer.Name+" that bai voi Ploy "+team1[i].attackText,this.skip() ,team1[i],team1[i],0);
										
										}	
										else
										{//tactic success
											this.map.cxCellFire.splice(j,1);
											this.map.cyCellFire.splice(j,1);
											this.map.showMessage(team1[i].officer.Name+" thanh cong voi Ploy "+team1[i].attackText,this.skip() ,team1[i],team1[i],0);
										
										}
										team1[i].attackRequest=0;
										team1[i].actionPoint-=10;
										break STEPLOOP;
									}
									else if(team1[i].cxFront1==this.map.cxCellFire[j] && team1[i].cyFront1==this.map.cyCellFire[j])
									{	//neu o truoc mat co fire
										var random = Math.floor(Math.random() * 102) ; //code =0 to 101
										if(team1[i].officer.Int<random)
										{//ploy false
											this.map.showMessage(team1[i].officer.Name+" that bai voi Ploy "+team1[i].attackText,this.skip() ,team1[i],team1[i],0);
											
										}	
										else
										{//tactic success
											this.map.cxCellFire.splice(j,1);
											this.map.cyCellFire.splice(j,1);
											this.map.showMessage(team1[i].officer.Name+" thanh cong voi Ploy "+team1[i].attackText,this.skip() ,team1[i],team1[i],0);
											
										}
										team1[i].attackRequest=0;
										team1[i].actionPoint-=10;
										break STEPLOOP;
									}

								}
						}
					}
			}
		}
};
ControlPanel.prototype.scanTacticPloy = function(team1, team2){
	
		//scan all attack cell cua ca map
		//neu atack !=attack
		//scan an luot tung team, neu attacktext ... , if atackindex > indexMax, then team=1,or2, unit=i.9IF ==MAX, RANDOM, SELECT. end loop
		//CALL TACTICPLOY CALC.
		//NEU indexMax=0,->END WHILE.
		STEPLOOP:
		if(PLAYTIME==0)
		{
			var indexMax =0;
			var iTeam=0;
			var iUnit=0;
			//while(indexMax!0)
			
			//	indexMax=0;
				//scan team1
				for(var i in team1)
				{

					if(team1[i].destroyed==0 && team1[i].attackRequest>1)
					{
						//neu co quan dich o trong tam ngam
						if( (team1[i].attackRequest==2 && this.map.inPosTeamView(team1[i],team2,2) )
							|| (team1[i].attackRequest==3 && this.map.inPosTeamView(team1[i],team2,3) ) )
						{
							if(team1[i].attackIndex>indexMax)
							{
								indexMax=team1[i].attackIndex;
								iTeam=1;
								iUnit=i;
							}
							else if(team1[i].attackIndex==indexMax)
							{
								var random = Math.floor(Math.random() * 2) ; //code =0 to 1
								if(random==1)
								{
									indexMax=team1[i].attackIndex;
									iTeam=1;
									iUnit=i;
								}
							}
						}
					}
				}	
				//scan team2
				for(var i in team2)
				{

					if(team2[i].destroyed==0 && team2[i].attackRequest>1)
					{

						//neu co quan dich o trong tam ngam
						if( (team2[i].attackRequest==2 && this.map.inPosTeamView( team2[i],team1 , 2 ) )
							|| (team2[i].attackRequest==3 && this.map.inPosTeamView(team2[i],team1, 3)  ) )
						{

							if(team2[i].attackIndex>indexMax)
							{
								
								indexMax=team2[i].attackIndex;
								iTeam=2;
								iUnit=i;
							}
							else if(team2[i].attackIndex==indexMax)
							{
								var random = Math.floor(Math.random() * 2) ; //code =0 to 1
								if(random==1)
								{
									indexMax=team2[i].attackIndex;
									iTeam=2;
									iUnit=i;
								}
							}
						}
					}
				}

				//sau khi chon ra dc unit co index max, then call calc	
				if(indexMax>0)
				{
						if(iTeam==1)	this.callTacticPloy(team1,team2,iUnit);
						else if(iTeam==2)	this.callTacticPloy(team2,team1,iUnit);
				}
	}
};
ControlPanel.prototype.callTacticPloy = function(team1,team2,i){	
	this.map.showMessage(team2[0].officer.Name+" co dung call callTacticPloy "+team2[0].attackText,this.skip() ,team2[0],team2[0],0);
						var cx_Unit1 			=  team1[i].cxCell  ;
						var cy_Unit1 			=  team1[i].cyCell  ;
	if(team1[i].attackRequest==2)
	{
						var cx_Unit1_Attack		=  team1[i].cxFront1  ;
						var cy_Unit1_Attack		=  team1[i].cyFront1  ;
						for(j in team2)
						{
							if(team2[j].destroyed==0 && Math.abs(team1[i].ployTop-team2[j].uOnTop)<=1)
							{
								var cx_Unit2 		=  team2[j].cxCell   ;
								var cy_Unit2		=  team2[j].cyCell   ;
								var cx_Unit2_Front	=  team2[j].cxFront  ;
								var cy_Unit2_Front	=  team2[j].cyFront  ;
								var cx_Unit2_Back	=  team2[j].cxBack;
								var cy_Unit2_Back	=  team2[j].cyBack;
							
								if( cx_Unit1_Attack==cx_Unit2 && cy_Unit1_Attack==cy_Unit2 )
								{	//Unit 1 tan cong Unit 2
									if(team1[i].shootingRange==0)
									{	//neu unit 1 ko phai la unit shooting
										if((team2[j].typeName=="Camp" || team2[j].typeName=="Fence") && team1[i].attackText!="Fire")
										{	//neu unit 2 la camp thi chi danh thuong
											this.map.attackCalc(team1[i],team2[j],1,0);
											team1[i].attackRequest = 0;
											this.map.showMessage("Unit "+team1[i].officer.Name+" danh vao "+team2[j].typeName,this.skip(),team1[i],team2[j],1 );
										}
										else if(  cx_Unit1==cx_Unit2_Front && cy_Unit1==cy_Unit2_Front )
										{	//va Unit 2 cung tan cong suy ra Unit 1 va 2 doi dau
											this.map.tacticployCalc(team1[i],team2[j],1);
										}
										else if( cx_Unit1==cx_Unit2_Back && cy_Unit1==cy_Unit2_Back )
										{	//Unit 1 tan cong dang sau Unit 2
											this.map.tacticployCalc(team1[i],team2[j],3);
										}
										else
										{	//con lai la Unit 1 tan cong ben canh Unit 2
											this.map.tacticployCalc(team1[i],team2[j],2);
										}
									}
									else
									{	//neu unit 1 is shooting
										if((team2[j].typeName=="Camp" || team2[j].typeName=="Fence") && team1[i].attackRequest==2 && team1[i].attackText!="Fire")
										{	//neu unit 2 la camp thi chi danh thuong
											this.map.attackCalc(team1[i],team2[j],1,0);
											team1[i].attackRequest = 0;
											this.map.showMessage("Unit "+team1[i].officer.Name+" danh vao "+team2[j].typeName,this.skip(),team1[i],team2[j],1 );
										}
										else
											this.map.tacticployCalc(team1[i],team2[j],4);
									}
								}
								
							}
						}
	}
	else if(team1[i].attackRequest==3)
	{
						var cx_Unit1_Attack		=  team1[i].cxAttack  ;
						var cy_Unit1_Attack		=  team1[i].cyAttack  ;
	
						
						for(j in team2)
						{
							if(team2[j].destroyed==0 && team2[j].status!="Ambush"  
								&& (  (team1[i].uOnTop-team2[j].uOnTop>=-1 && team1[i].typeName!="Catapult" && team1[i].typeName!="Tower" ) 
					  			|| ( (team1[i].typeName=="Catapult" || team1[i].typeName=="Tower") && Math.abs(team1[i].shotTop-team2[j].uOnTop)<=1 ) )  ) 	
							{
								var cx_Unit2 		=  team2[j].cxCell   ;
								var cy_Unit2		=  team2[j].cyCell   ;
								var cx_Unit2_Front	=  team2[j].cxFront  ;
								var cy_Unit2_Front	=  team2[j].cyFront  ;
								var cx_Unit2_Back	=  team2[j].cxBack;
								var cy_Unit2_Back	=  team2[j].cyBack;
							
								if( cx_Unit1_Attack==cx_Unit2 && cy_Unit1_Attack==cy_Unit2 )
								{	//Unit 1 tan cong Unit 2
									if(team1[i].shootingRange==0)
									{	//neu unit 1 ko phai la unit shooting
										if((team2[j].typeName=="Camp" || team2[j].typeName=="Fence") && team1[i].attackText!="Fire")
										{	//neu unit 2 la camp thi chi danh thuong
											this.map.attackCalc(team1[i],team2[j],1,0);
											team1[i].attackRequest = 0;
											this.map.showMessage("Unit "+team1[i].officer.Name+" danh vao "+team2[j].typeName,this.skip(),team1[i],team2[j],1 );
										}
										else if(  cx_Unit1==cx_Unit2_Front && cy_Unit1==cy_Unit2_Front )
										{	//va Unit 2 cung tan cong suy ra Unit 1 va 2 doi dau
											this.map.tacticployCalc(team1[i],team2[j],1);
										}
										else if( cx_Unit1==cx_Unit2_Back && cy_Unit1==cy_Unit2_Back )
										{	//Unit 1 tan cong dang sau Unit 2
											this.map.tacticployCalc(team1[i],team2[j],3);
										}
										else
										{	//con lai la Unit 1 tan cong ben canh Unit 2
											this.map.tacticployCalc(team1[i],team2[j],2);
										}
									}
									else
									{	//neu unit 1 is shooting
										if((team2[j].typeName=="Camp" || team2[j].typeName=="Fence") && team1[i].attackRequest==2 && team1[i].attackText!="Fire")
										{	//neu unit 2 la camp thi chi danh thuong
											this.map.attackCalc(team1[i],team2[j],1,0);
											team1[i].attackRequest = 0;
											this.map.showMessage("Unit "+team1[i].officer.Name+" danh vao "+team2[j].typeName,this.skip(),team1[i],team2[j],1 );
										}
										else
											this.map.tacticployCalc(team1[i],team2[j],4);
									}
								}
								
							}
						}
	}
	
};
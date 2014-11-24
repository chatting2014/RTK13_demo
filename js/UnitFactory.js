
var UnitTypes = [
	{
		typeName: "Horse",
		attack : 100,	
		defend : 80,
		wallDamage : 30,
		moveRange : 6,
		shootingRange : 0,
		shootingPower : 0,
		actionPoint : 50,
		morale : 50,
	},{
		typeName: "Spear",
		attack : 90,	
		defend : 90,
		wallDamage : 40,
		moveRange : 4,
		shootingRange : 0,
		shootingPower : 0,
		actionPoint : 50,
		morale : 50,
	},{
		
		typeName: "Bow",
		attack : 80,	
		defend : 70,
		wallDamage : 10,
		moveRange : 4,
		shootingRange : 2,
		shootingPower : 80,
		actionPoint : 50,
		morale : 50,
	},{
		typeName: "Ram",
		attack : 30,	
		defend : 40,
		wallDamage : 100,
		moveRange : 3,
		shootingRange : 0,
		shootingPower : 0,
		actionPoint : 50,
		morale : 50,
	},{	
		typeName: "FireOx",
		attack : 30,	
		defend : 40,
		wallDamage : 70,
		moveRange : 3,
		shootingRange : 0,
		shootingPower : 0,
		actionPoint : 50,
		morale : 50,
	},{
	typeName: "Tower",
		attack : 40,	
		defend : 50,
		wallDamage : 60,
		moveRange : 3,
		shootingRange : 2,
		shootingPower : 90,
		actionPoint : 50,
		morale : 50,
	},{
		typeName: "Catapult",
		attack : 30,	
		defend : 40,
		wallDamage : 80,
		moveRange : 3,
		shootingRange : 3,
		shootingPower : 100,
		actionPoint : 50,
		morale : 50,
	},{
		typeName: "Supply",
		attack : 10,	
		defend : 20,
		wallDamage : 5,
		moveRange : 3,
		shootingRange : 0,
		shootingPower : 0,
		actionPoint : 50,
		morale : 50,
	},{
		typeName: "Camp",
		attack : 30,	
		defend : 40,
		wallDamage : 0,
		moveRange : 0,
		shootingRange : 0,
		shootingPower : 0,
		actionPoint : 50,
		morale : 50,
	},{	
		typeName: "Fence",
		attack : 10,	
		defend : 20,
		wallDamage : 0,
		moveRange : 0,
		shootingRange : 0,
		shootingPower : 0,
		actionPoint : 50,
		morale : 50,
	},{	
		typeName: "Gate",
		attack : 10,	
		defend : 20,
		wallDamage : 0,
		moveRange : 0,
		shootingRange : 0,
		shootingPower : 0,
		actionPoint : 50,
		morale : 50,
	}
];
var UnitFactory = {};

UnitFactory.createUnit = function(index){
	//var unit = new Unit(_sprites.sprites["unit"+index]);	
	var unit = new Unit();	
	var data = UnitTypes[index];
	unit.typeName = data.typeName;
	unit.attack = data.attack;
	unit.defend = data.defend
	unit.wallDamage = data.wallDamage;
	unit.moveRange = data.moveRange;
	unit.shootingRange = data.shootingRange;
	unit.shootingPower = data.shootingPower;
	unit.actionPoint = data.actionPoint;
	unit.morale = data.morale;
	unit.index = index;
	
	return unit;
};
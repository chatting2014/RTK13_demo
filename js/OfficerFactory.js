
var OfficerList = [
	{
		Name: "Zhuge Liang",
		Lead : 98,	
		War : 47,
		Int : 100,
		Pol : 97,
		Charm : 91,
		Horse : 0,
		Spear : 1,
		Bow : 3,
		Navy: 2,
		Weapon:4,
		Skill:"Best"
	},{
		Name: "Guo Jia",
		Lead : 58,	
		War : 16,
		Int : 97,
		Pol : 86,
		Charm : 82,
		Horse : 1,
		Spear : 1,
		Bow : 1,
		Navy: 1,
		Weapon:2,
		Skill:"Cunn"
	},{
		Name: "Pang Tong",
		Lead : 82,	
		War : 42,
		Int : 97,
		Pol : 87,
		Charm : 72,
		Horse : 0,
		Spear : 1,
		Bow : 0,
		Navy: 1,
		Weapon:2,
		Skill:"Every"
	},{
		Name: "Zhou Yu",
		Lead : 97,	
		War : 74,
		Int : 97,
		Pol : 86,
		Charm : 93,
		Horse : 0,
		Spear : 2,
		Bow : 3,
		Navy: 3,
		Weapon:1,
		Skill:"Fire"
	},{
		Name: "Sima Yi",
		Lead : 98,	
		War : 67,
		Int : 96,
		Pol : 92,
		Charm : 96,
		Horse : 3,
		Spear : 3,
		Bow : 2,
		Navy: 0,
		Weapon:3,
		Skill:"AllC"
	},{
		Name: "Lu Bu",
		Lead : 90,	
		War : 100,
		Int : 27,
		Pol : 15,
		Charm : 36,
		Horse : 3,
		Spear : 2,
		Bow : 3,
		Navy: 0,
		Weapon:1,
		Skill:"FlyG"
	},{
		Name: "Zhang Fei",
		Lead : 85,	
		War : 99,
		Int : 33,
		Pol : 23,
		Charm : 41,
		Horse : 2,
		Spear : 3,
		Bow : 0,
		Navy: 0,
		Weapon:1,
		Skill:"Spear"
	},{
		Name: "Guan Yu",
		Lead : 96,	
		War : 98,
		Int : 79,
		Pol : 65,
		Charm : 94,
		Horse : 2,
		Spear : 3,
		Bow : 1,
		Navy: 2,
		Weapon:1,
		Skill:"WarAll"
	},{
		Name: "Zhao Yun",
		Lead : 92,	
		War : 96,
		Int : 78,
		Pol : 69,
		Charm : 89,
		Horse : 3,
		Spear : 3,
		Bow : 3,
		Navy: 1,
		Weapon:1,
		Skill:"Insist"
	},{
		Name: "Ma Chao",
		Lead : 89,	
		War : 96,
		Int : 45,
		Pol : 32,
		Charm : 69,
		Horse : 3,
		Spear : 2,
		Bow : 0,
		Navy: 0,
		Weapon:2,
		Skill:"Cava"
	},{
		Name: "Cao Cao",
		Lead : 99,	
		War : 76,
		Int : 92,
		Pol : 95,
		Charm : 97,
		Horse : 2,
		Spear : 3,
		Bow : 2,
		Navy: 0,
		Weapon:2,
		Skill:"IntAll"
	},{
		Name: "Huang Zhong",
		Lead : 89,	
		War : 93,
		Int : 61,
		Pol : 54,
		Charm : 76,
		Horse : 2,
		Spear : 1,
		Bow : 3,
		Navy: 0,
		Weapon:1,
		Skill:"Bow"
	},{
		Name: "Zhang Jiao",
		Lead : 89,	
		War : 36,
		Int : 87,
		Pol : 82,
		Charm : 95,
		Horse : 0,
		Spear : 2,
		Bow : 2,
		Navy: 0,
		Weapon:3,
		Skill:"Heaven"
	}
];
var OfficerFactory = {};

OfficerFactory.createOfficer = function(index){
	//var officer = new Unit(_sprites.sprites["unit"+index]);	
	var officer = new Officer();	
	var data = OfficerList[index];
	officer.Name = data.Name;
	officer.Lead = data.Lead;
	officer.War = data.War
	officer.Int = data.Int;
	officer.Pol = data.Pol;
	officer.Charm = data.Charm;
	officer.Horse = data.Horse;
	officer.Spear = data.Spear;
	officer.Bow = data.Bow;
	officer.Navy = data.Navy;
	officer.Weapon = data.Weapon;
	officer.Skill = data.Skill;

	officer.Number = index;
	officer.HP=100;
	
	return officer;
};
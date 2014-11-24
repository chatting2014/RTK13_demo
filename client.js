/*  Copyright (c) 2012 Sven "FuzzYspo0N" Bergström
    
    written by : http://underscorediscovery.com
    written for : http://buildnewgames.com/real-time-multiplayer/
    
    MIT Licensed.
*/


//newwwwwwwwwwww
var MODE=1;
var PLAYER=1;
var MAP=2;
var P1Troop=3000;
var P1Food=3000;
var P1AP=100;
var P1Morale=100;
var P1CampTroop=5000;
var P1CampFood=20000;
var P2Troop=3000;
var P2Food=3000;
var P2AP=100;
var P2Morale=100;
var P2CampTroop=5000;
var P2CampFood=20000;

   //end new

var TITLE_TEXT = "RTK13 v0.0.2";
var INFO_TEXT = "Copyright @ HungLai 2014"; 
var FPS =  60;
var PANEL_WIDTH = 390;


var _images;
var _sprites;
var _portrait;
function setup(context,canvas)
{

//  var canvas = document.getElementById("canvas");
//  canvas.width = WIDTH + PANEL_WIDTH;
//  canvas.height = HEIGHT;
//  var context = canvas.getContext("2d");
  context.textAlign = "center";
  
  // load images
  var sources = {
  
  //  stone_texture: "img/stone_texture.jpg",
    unit:    "http://i1376.photobucket.com/albums/ah33/chatting2014/unit_zpse3920713.png",
    officer: "http://i1376.photobucket.com/albums/ah33/chatting2014/officer_zps10a30149.png",
    map001:  "http://i1376.photobucket.com/albums/ah33/chatting2014/map001_zpsf5847a8a.jpg",
    map002:  "http://i1376.photobucket.com/albums/ah33/chatting2014/map002_zps335b0545.jpg",
    map003:  "http://i1376.photobucket.com/albums/ah33/chatting2014/map003_zpsb3a1ab0b.jpg"
  };
  var loader = new ImgLoader(sources,
    function(image,percent) { // on progressing     
      context.clearRect(0,0,canvas.width,canvas.height);
      context.fillText("Loading: "+percent+"%",canvas.width/2,canvas.height/2);           
    },
    function(images){     // completed          

      _images = images;
      
      _sprites = new StaticSprite({
        image: _images.unit,
        frameWidth: 58,
        frameHeight: 50
      });
      
      for(var i = 0; i < 11; i++)
      {
        _sprites.addSprite({
          name: "unit" + i, //name: "tower" + i,
          frameIndex: i,
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 6,
          marginRight: 14       
        });
      }

      _portrait = new StaticSprite({
        image: _images.officer,
        frameWidth: 68,
        frameHeight: 68
      });
      
      for(var i = 0; i < 20; i++)
      {
        _portrait.addSprite({
          name: "officer" + i,  //name: "tower" + i,
          frameIndex: i,
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 0,//6,
          marginRight: 0,//14       
        });
      }
      
      // create the help screen
      var helpScreen,welcomeScreen;
      helpScreen = new Screen(canvas);
      helpScreen.beforeDraw = function(context){
        context.font = "24px Arial";
        context.textAlign = "left";
        context.fillStyle = "white";
        context.fillText("Map select",100,40);
        context.fillText("Team 1",400,40);
        context.fillText("Team 2",800,40);
        context.font = "20px Arial";
        context.fillText("Number:  "+MAP,100,100);
        context.fillText("Unit setup:",400,100);
        context.fillText("Troop: "+P1Troop,400,130);
        context.fillText("Food:  "+P1Food,400,160);
        context.fillText("AP       : "+P1AP,400,190);
        context.fillText("Morale:  "+P1Morale,400,220);
        context.fillText("Camp setup:",400,260);
        context.fillText("Troop: "+P1CampTroop,400,290);
        context.fillText("Food:  "+P1CampFood,400,320);
        context.fillText("Unit setup:",800,100);
        context.fillText("Troop: "+P2Troop,800,130);
        context.fillText("Food:  "+P2Food,800,160);
        context.fillText("AP       : "+P2AP,800,190);
        context.fillText("Morale:  "+P2Morale,800,220);
        context.fillText("Camp setup:",800,260);
        context.fillText("Troop: "+P2CampTroop,800,290);
        context.fillText("Food:  "+P2CampFood,800,320);

        context.fillText("Officer:  ",400,360);
        context.fillText("Officer:  ",800,360);
        if(localPlayer.host)  //neu la host player
        {
          context.fillText('YOU Player '+localPlayer.myid,500,40);
          context.fillText('Player '+localPlayer.enemyid,900,40);
          for(var i in localPlayer.myTeam)
              context.fillText(localPlayer.myTeam[i].officer.Name,420,390+i*30);
         
          if(localPlayer.enemyTeam.length>0)
          {
            for(var i in localPlayer.enemyTeam)
              context.fillText(localPlayer.enemyTeam[i].officer.Name,820,390+i*30);
          }
          else
          { context.fillText("N/A:  ",820,390); }
        }
        else  //neu la join player
        {
          context.fillText('YOU Player '+localPlayer.myid,900,40);
          context.fillText('Player '+localPlayer.enemyid,500,40);
          for(var i in localPlayer.myTeam)
              context.fillText(localPlayer.myTeam[i].officer.Name,820,390+i*30);
        
          if(localPlayer.enemyTeam.length>0)
          {
            for(var i in localPlayer.enemyTeam)
              context.fillText(localPlayer.enemyTeam[i].officer.Name,420,390+i*30);
          }
          else
          { context.fillText("N/A:  ",420,390); }
        }


      };

      var cx = canvas.width/2;
      helpScreen.addItem(new MenuItem({
          left: cx-100,
          top: canvas.height-180,
          width: 200,
          height: 40,
          text: "1 Player vs CPU",
          onclick: function(){
            helpScreen.stop();
            // start game 1
            MODE=1;
            new Game(canvas,context).init();
          }
        }));
      helpScreen.addItem(new MenuItem({
          left: cx-100,
          top: canvas.height-120,
          width: 200,
          height: 40,
          text: "2 Players",
          onclick: function(){
            helpScreen.stop();
            // start game 2
            MODE=2;
            new Game(canvas,context).init();
          }
        }));
      helpScreen.addItem(new MenuItem({
          left: cx-100,
          top: canvas.height-60,
          width: 200,
          height: 40,
          text: "Back",
          onclick: function(){
            // back to welcome screen
            localPlayer.endGame();
            helpScreen.stop();
            welcomeScreen.start();
          }
        }));
      //new button
      helpScreen.addItem(new MenuItem({left: 230, top: 80, width: 25, height: 25, text: "-", onclick: function(){if(MAP>1)  MAP-=1;} } ) );
      helpScreen.addItem(new MenuItem({left: 260, top: 80, width: 25, height: 25, text: "+", onclick: function(){if(MAP<3)  MAP+=1;} } ) );

      helpScreen.addItem(new MenuItem({left: 550, top: 110, width: 25, height: 25, text: "-", onclick: function(){P1Troop-=1000;} } ) );
      helpScreen.addItem(new MenuItem({left: 580, top: 110, width: 25, height: 25, text: "+", onclick: function(){P1Troop+=1000;} } ) );
      helpScreen.addItem(new MenuItem({left: 550, top: 140, width: 25, height: 25, text: "-", onclick: function(){P1Food-=1000;} } ) );
      helpScreen.addItem(new MenuItem({left: 580, top: 140, width: 25, height: 25, text: "+", onclick: function(){P1Food+=1000;} } ) );
      helpScreen.addItem(new MenuItem({left: 550, top: 170, width: 25, height: 25, text: "-", onclick: function(){P1AP-=10;} } ) );
      helpScreen.addItem(new MenuItem({left: 580, top: 170, width: 25, height: 25, text: "+", onclick: function(){P1AP+=10;} } ) );
      helpScreen.addItem(new MenuItem({left: 550, top: 200, width: 25, height: 25, text: "-", onclick: function(){P1Morale-=10;} } ) );
      helpScreen.addItem(new MenuItem({left: 580, top: 200, width: 25, height: 25, text: "+", onclick: function(){P1Morale+=10;} } ) );
      helpScreen.addItem(new MenuItem({left: 550, top: 270, width: 25, height: 25, text: "-", onclick: function(){P1CampTroop-=1000;} } ) );
      helpScreen.addItem(new MenuItem({left: 580, top: 270, width: 25, height: 25, text: "+", onclick: function(){P1CampTroop+=1000;} } ) );
      helpScreen.addItem(new MenuItem({left: 550, top: 300, width: 25, height: 25, text: "-", onclick: function(){P1CampFood-=1000;} } ) );
      helpScreen.addItem(new MenuItem({left: 580, top: 300, width: 25, height: 25, text: "+", onclick: function(){P1CampFood+=1000;} } ) );
      
      helpScreen.addItem(new MenuItem({left: 950, top: 110, width: 25, height: 25, text: "-", onclick: function(){P2Troop-=1000;} } ) );
      helpScreen.addItem(new MenuItem({left: 980, top: 110, width: 25, height: 25, text: "+", onclick: function(){P2Troop+=1000;} } ) );
      helpScreen.addItem(new MenuItem({left: 950, top: 140, width: 25, height: 25, text: "-", onclick: function(){P2Food-=1000;} } ) );
      helpScreen.addItem(new MenuItem({left: 980, top: 140, width: 25, height: 25, text: "+", onclick: function(){P2Food+=1000;} } ) );
      helpScreen.addItem(new MenuItem({left: 950, top: 170, width: 25, height: 25, text: "-", onclick: function(){P2AP-=10;} } ) );
      helpScreen.addItem(new MenuItem({left: 980, top: 170, width: 25, height: 25, text: "+", onclick: function(){P2AP+=10;} } ) );
      helpScreen.addItem(new MenuItem({left: 950, top: 200, width: 25, height: 25, text: "-", onclick: function(){P2Morale-=10;} } ) );
      helpScreen.addItem(new MenuItem({left: 980, top: 200, width: 25, height: 25, text: "+", onclick: function(){P2Morale+=10;} } ) );
      helpScreen.addItem(new MenuItem({left: 950, top: 270, width: 25, height: 25, text: "-", onclick: function(){P2CampTroop-=1000;} } ) );
      helpScreen.addItem(new MenuItem({left: 980, top: 270, width: 25, height: 25, text: "+", onclick: function(){P2CampTroop+=1000;} } ) );
      helpScreen.addItem(new MenuItem({left: 950, top: 300, width: 25, height: 25, text: "-", onclick: function(){P2CampFood-=1000;} } ) );
      helpScreen.addItem(new MenuItem({left: 980, top: 300, width: 25, height: 25, text: "+", onclick: function(){P2CampFood+=1000;} } ) );

      // create the welcome screen
      welcomeScreen = new Screen(canvas,true);
      welcomeScreen.beforeDraw = function(context){
        context.font = "24px Arial";
        context.fillStyle = "white";
        context.fillText(TITLE_TEXT,canvas.width/2,40);
        context.font = "10px Arial";        
        context.fillText(INFO_TEXT,canvas.width/2,canvas.height-40);
      };
      
      var titles = ["Host a Game","Join a Game","About"];

      for(var i=0;i<titles.length;i++){
        welcomeScreen.addItem(new MenuItem({
          left: cx-100,
          top: 150+50*i,
          width: 200,
          height: 40,
          text: titles[i]
        }));
      }
      welcomeScreen.items[0].onclick = function(){
        localPlayer.hostGame();
        welcomeScreen.stop();
        helpScreen.start(); 
      };
      welcomeScreen.items[1].onclick = function(){
        localPlayer.joinGame();
        PLAYER=2;
        welcomeScreen.stop();
        helpScreen.start(); 
      };
      welcomeScreen.items[2].onclick = function(){
      //  window.open('http://yinyangit.wordpress.com', '_blank');
        
      };
      welcomeScreen.start();
    }
  );
}


//end newwwwwwwwwwwwwwwwwwwwwwwww

  //A window global for our game root variable.
var game = {};
var localPlayer;
  //When loading, we store references to our
  //drawing canvases, and initiate a game instance.
window.onload = function(){

  localPlayer = new game_player();
    //Create our game client instance.
//  game = new game_core();

      //Fetch the viewport
    game.viewport = document.getElementById('viewport');
      
      //Adjust their size
//    game.viewport.width = game.world.width;
//   game.viewport.height = game.world.height;

      //Fetch the rendering contexts
    game.ctx = game.viewport.getContext('2d');

    //newwwwwwwwwwwwwwwwwww
        game.viewport.width = WIDTH + PANEL_WIDTH;
        game.viewport.height = HEIGHT;

        setup(game.ctx,game.viewport);
  //  game = new game_core();

    //end newwwwwwwwwwwwwww
      //Set the draw style for the font
  //  game.ctx.font = '20px "Helvetica"';

    //Finally, start the loop
  //  game.update( new Date().getTime() );

}; //window.onload
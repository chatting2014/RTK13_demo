/*  Copyright (c) 2012 Sven "FuzzYspo0N" Bergström
    
    written by : http://underscorediscovery.com
    written for : http://buildnewgames.com/real-time-multiplayer/
    
    MIT Licensed.
*/

    var
        game_server = module.exports = { games : {}, game_count:0 },
        UUID        = require('node-uuid'),
        verbose     = true;

        //Since we are sharing code with the browser, we
        //are going to include some values to handle that.
    global.window = global.document = global;

        //Import shared game library code.
    require('./game.core.js');

        //A simple wrapper for logging so we can toggle it,
        //and augment it for clarity.
    game_server.log = function() {
        if(verbose) console.log.apply(this,arguments);
    };

    game_server.fake_latency = 0;
    game_server.local_time = 0;
    game_server._dt = new Date().getTime();
    game_server._dte = new Date().getTime();
        //a local queue of messages we delay if faking latency
    game_server.messages = [];

    setInterval(function(){
        game_server._dt = new Date().getTime() - game_server._dte;
        game_server._dte = new Date().getTime();
        game_server.local_time += game_server._dt/1000.0;
    }, 4);

    game_server.onMessage = function(client,message) {

        if(this.fake_latency && message.split('.')[0].substr(0,1) == 'i') {

                //store all input message
            game_server.messages.push({client:client, message:message});

            setTimeout(function(){
                if(game_server.messages.length) {
                    game_server._onMessage( game_server.messages[0].client, game_server.messages[0].message );
                    game_server.messages.splice(0,1);
                }
            }.bind(this), this.fake_latency);

        } else {
            game_server._onMessage(client, message);
        }
    };
    
    game_server._onMessage = function(client,message) {

            //Cut the message up into sub components
        var message_parts = message.split('.');
            //The first is always the type of message
        var message_type = message_parts[0];
        var message_data = message_parts[1] || null;

    //    var other_client =
    //        (client.game.player_host.userid == client.userid) ?
    //            client.game.player_client : client.game.player_host;

        if(message_type == 'i') {
                //Input handler will forward this
            this.onInput(client, message_parts);
        } else if(message_type == 'p') {
            client.send('s.p.' + message_parts[1]);
        } else if(message_type == 'c') {    //Client changed their color!
            if(other_client)
                other_client.send('s.c.' + message_parts[1]);
        } else if(message_type == 'l') {    //A client is asking for lag simulation
            this.fake_latency = parseFloat(message_parts[1]);
        } else if(message_type == 'h') {    //A client is asking to host a game
            this.createGame(client,message_data);
        } else if(message_type == 'j') {    //A client is asking to join a game
            this.findGame(client,message_data);
        } else if(message_type == 'et') {    //A client send endturn report
            this.endTurn(client,message_data);
        } else if(message_type == 'e') {    //A client is asking to end a game
            this.endGame(client.gameid, client.userid);
        } 

    }; //game_server.onMessage

    game_server.endTurn = function(client, data) {
        var thegame = this.games[client.gameid];

        if(thegame) 
        {
            if(client.userid == thegame.player_host.userid) 
            {
                thegame.team1move=data;
                thegame.team1receiveET=1;
                this.log('game '+client.gameid+ ' player ' + client.userid + ' team1 send move data ');
            }
            else
            {
                thegame.team2move=data;
                thegame.team2receiveET=1;
                this.log('game '+client.gameid+ ' player ' + client.userid + ' team2 send move data ');
            }
            //neu nhan duoc ca 2:
            if(thegame.team1receiveET==1 && thegame.team2receiveET==1)
            {
                //send data to both.

                    

                    //send data to each player
                   
                    thegame.player_client.send('s.et.' + thegame.team1move);     //send other team info
                    
                    
                    thegame.player_host.send('s.et.' + thegame.team2move);     //send other team info
                //send xong thi reset
                thegame.team1move='';
                thegame.team1receiveET=0;
                thegame.team2move='';
                thegame.team2receiveET=0;

                this.log('game '+client.gameid+ ' Server send move data to both player');
            }

        }
    }; //game_server.endTurn

    game_server.onInput = function(client, parts) {
            //The input commands come in like u-l,
            //so we split them up into separate commands,
            //and then update the players
        var input_commands = parts[1].split('-');
        var input_time = parts[2].replace('-','.');
        var input_seq = parts[3];

            //the client should be in a game, so
            //we can tell that game to handle the input
        if(client && client.game && client.game.gamecore) {
            client.game.gamecore.handle_server_input(client, input_commands, input_time, input_seq);
        }

    }; //game_server.onInput
    var idCount=0
        //Define some required functions
    game_server.createGame = function(player,data) {
        idCount++
            //Create a new game instance
        var thegame = {
                id : idCount,  //UUID(),                //generate a new id for the game
                player_host:player,         //so we know who initiated the game
                player_client:null,         //nobody else joined yet, since its new
                player_count:1              //for simple checking of state
            };
        thegame.team1=[];
        thegame.team2=[];
        thegame.team1unit=data;
        thegame.team1move='';
        thegame.team1receiveET=0;
        thegame.team2move='';
        thegame.team2receiveET=0;
            //Store it in the list of game
        this.games[ thegame.id ] = thegame;

            //Keep track
        this.game_count++;

            //Create a new game core instance, this actually runs the
            //game code like collisions and such.
    //    thegame.gamecore = new game_core( thegame );
    //        //Start updating the game loop on the server
    //    thegame.gamecore.update( new Date().getTime() );

            //tell the player that they are now the host
            //s=server message, h=you are hosting

    //    player.send('s.h.'+ String(thegame.gamecore.local_time).replace('.','-'));
    //    console.log('server host at  ' + thegame.gamecore.local_time);
        player.gameid = thegame.id;
        player.hosting = true;
        
        this.log('player ' + player.userid + ' created a game with id ' + thegame.id);
        this.log('We have : ' + this.game_count + ' games' );
            //return it
        return thegame;

    }; //game_server.createGame

        //we are requesting to kill a game in progress.
    game_server.endGame = function(gameid, userid) {

        var thegame = this.games[gameid];

        if(thegame) {

                //stop the game updates immediate
       //     thegame.gamecore.stop_update();

                //if the game has two players, the one is leaving
            if(thegame.player_count > 1) {

                    //send the players the message the game is ending
                if(userid == thegame.player_host.userid) {

                        //the host left, oh snap. Lets try join another game
                    if(thegame.player_client) {
                            //tell them the game is over
                        thegame.player_client.send('s.e');
                            //now look for/create a new game.
                       // this.findGame(thegame.player_client);
                       //should tro lai lobby ??????????????????????????????????????????????
                    }
                    
                } else {
                        //the other player left, we were hosting
                    if(thegame.player_host) {
                            //tell the client the game is ended
                        thegame.player_host.send('s.e');
                            //i am no longer hosting, this game is going down
                        thegame.player_host.hosting = false;
                            //now look for/create a new game.
                    //    this.findGame(thegame.player_host);
                    //should tro lai lobby ??????????????????????????????????????????????
                    }
                }
            }

            delete this.games[gameid];
            this.game_count--;

            this.log('game with id '+gameid+' removed. there are now ' + this.game_count + ' games' );

        } else {
            this.log('that game was not found!');
        }

    }; //game_server.endGame

    game_server.startGame = function(game) {

            //right so a game has 2 players and wants to begin
            //the host already knows they are hosting,
            //tell the other client they are joining a game
            //s=server message, j=you are joining, send them the host id
        game.player_client.send('s.j.' + game.player_host.userid);
        game.player_client.send('s.ot.' + game.player_host.team[0].officer.Name);     //send other team info
        game.player_client.game = game;
            //new tell the host that someone join done, and send the client id to the host
        game.player_host.send('s.jd.' + game.player_client.userid);     //send ID
        game.player_host.send('s.ot.' + game.player_client.team[0].officer.Name);     //send other team info
            //now we tell both that the game is ready to start
            //clients will reset their positions in this case.
        game.player_client.send('s.r.'+ String(game.gamecore.local_time).replace('.','-'));
        game.player_host.send('s.r.'+ String(game.gamecore.local_time).replace('.','-'));
 
            //set this flag, so that the update loop can run it.
        game.active = true;

    }; //game_server.startGame

    game_server.findGame = function(player,data) {

        this.log('looking for a game. We have : ' + this.game_count);

            //so there are games active,
            //lets see if one needs another player
        if(this.game_count) {
                
            var joined_a_game = false;

                //Check the list of games for an open game
            LOOPCHECK:
            for(var gameid in this.games) {
                    //only care about our own properties.
                //if(!this.games.hasOwnProperty(gameid)) continue;
                    //get the game we are checking against
                var game_instance = this.games[gameid];

                    //If the game is a player short
                if(game_instance.player_count < 2) {

                        //someone wants us to join!
                    joined_a_game = true;
                        //increase the player count and store
                        //the player as the client of this game
                    game_instance.player_client = player;
                    game_instance.team2[0]=data;
                //    game_instance.gamecore.players.other.instance = player;
                    game_instance.player_count++;

                    this.log('player ' + player.userid + ' join the game with id ' + gameid);
                    this.log('The game with id ' + gameid+' have : ' + game_instance.player_count + ' players');

                    //send data to each player
                    player.gameid = gameid;

                    game_instance.player_client.send('s.ot.' + game_instance.player_host.userid);     //send other team info
                    game_instance.player_client.send('s.eu.' + game_instance.team1unit);     //send other team info
                    
                    game_instance.player_host.send('s.ot.' + game_instance.player_client.userid);     //send other team info
                    game_instance.player_host.send('s.eu.' + data);     //send other team info
                    break LOOPCHECK;
                        //start running the game on the server,
                        //which will tell them to respawn/start
                //    this.startGame(game_instance);

                } //if less than 2 players
            } //for all games

                //now if we didn't join a game,
                //we must create one
            if(!joined_a_game) {

                this.createGame(player);

            } //if no join already

        } else { //if there are any games at all

                //no games? create one!
            this.createGame(player);
        }

    }; //game_server.findGame

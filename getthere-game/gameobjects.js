
class Achievements{
    constructor(){
        


    }

}

class GameObject{

    renderable;
    moving;

    constructor(){



    }

}

class Player{
   
    constructor(){
        this.renderable = true;
        this.moving = true;
   
        this.position = {X:game.unit*2,Y:game.unit,Z:3};
        this.w = game.unit *1;
        this.h = game.unit * 1.5;
        this.stats = {speed:1, normalSpeed:1, boostSpeed:5, attackSpeed:0, attackDmg:0, distance:0, vSpeed:5, lvl:0, energy:0, maxEnergy:100}
        this.stats.energy = this.stats.maxEnergy;


        this.upgrades = {boost:1, speed:1,}

        this.inventory = new Inventory;

        this.ground = game.unit*2.75;
        this.grounded = false;
        this.jump = false;
        this.jumpClock = 20;

        this.Level;

        this.sprite = new Image();
        this.spriteW = this.w;
        this.spriteH = this.h;
        this.sprite.src = '../sprites/player00.png';
        this.animClock = 0;

        this.boost = {clock:0, time:120, cooldown:0, cooldownTime: 240, boost:false}
        this.boost.clock = this.boost.time;
        this.boost.cooldown = this.boost.cooldownTime;
        
    }
   
    Update(){
        this.Level = gameWorld.levels[gameWorld.currentLevel];

        this.stats.distance += this.stats.speed;
        //this.position.Y += this.stats.vSpeed;
        
        // JUMP //
        if (this.position.Y + this.h < this.ground) {
            this.grounded = false;
        }
        else{
            this.grounded = true
        }


        if (this.grounded == false) {
            this.position.Y += this.stats.vSpeed;
        }

        

        if(this.jump && this.jumpClock > 0){
            this.Jump();

        }
        if (this.jumpClock <= 0 && this.grounded == true) {
            this.jump = false;
            this.jumpClock = 20; 
            
        }

        this.CollisionDetection();

        if (this.animClock > 60) {
            this.animClock = 0;

        }

        // ENERGY //
        if (this.stats.energy > 0) {
            this.stats.energy -= 0.01 * this.stats.speed;;
        }
        
        if (this.stats.energy <= 0) {
            this.stats.speed = 0;

        }

        // BOOST //
        if(this.boost.boost && this.boost.clock > 0){
            this.boost.clock--;
        }
        
        if (this.boost.clock <= 0) {
            this.Boost("stop");
        }

        if (!this.boost.boost) {
            
        }

        if (this.boost.cooldown <= 0) {
            this.boost.clock = this.boost.time;
        }

        if (this.boost.cooldown > 0) {
            this.boost.cooldown--;
        }

        console.log("TIC: " + this.animClock);
        this.animClock++;

    }

    Jump(){
        this.position.Y -= 10*this.jumpClock*0.1;
        this.jumpClock--;

    }

    Move(_dir){
        if (this.stats.energy <= 0) {
            _dir = "";
        }

        if (_dir == "up" && this.position.Z < this.Level.lanes.nr) {
            this.position.Z += 1;
            this.position.Y -= this.Level.lanes.w;
            this.ground -= this.Level.lanes.w;
        }
        else if (_dir == "down" && this.position.Z > 1) {
            this.position.Z -= 1;
            this.position.Y += this.Level.lanes.w;
            this.ground += this.Level.lanes.w;
        }
        
        if(this.stats.speed == 0){
            player.stats.speed = player.stats.normalSpeed;
        }

    }

    Boost(cmd){
        if (player.stats.speed < player.stats.boostSpeed && cmd != "stop" && this.stats.speed != 0 && this.boost.cooldown <= 0) {
            player.stats.speed = player.stats.boostSpeed;
            this.boost.cooldown = this.boost.cooldownTime;
            this.boost.boost = true;
        }
        else if (this.stats.speed != 0){
            player.stats.speed = player.stats.normalSpeed;
            this.boost.clock = this.boost.time;
            this.boost.boost = false;
        }


    }

    CollisionDetection(type){
        // BUFF //
        for (let i = 0; i < this.Level.buffs.length; i++) {
            let go = this.Level.buffs[i];

            if (this.position.X + this.w > go.position.X && this.position.X < go.position.X + go.w) {
                if (this.position.Y + this.h > go.position.Y && this.position.Y < go.position.Y + go.h) {
                    //console.log("Collision: Coin");
                    if (this.position.Z == go.position.Z) {
                        
                        // FILL ENERGY //
                        if (this.stats.energy + go.buffValue < this.stats.maxEnergy) {
                            this.stats.energy += go.buffValue;
                        }
                        else{
                            this.stats.energy = this.stats.maxEnergy

                        }

                        
                        go.Remove();

                    }
                } 
            }
        }

        // COIN //
        for (let i = 0; i < this.Level.coins.length; i++) {
            let go = this.Level.coins[i];

            if (this.position.X + this.w > go.position.X && this.position.X < go.position.X + go.w) {
                if (this.position.Y + this.h > go.position.Y && this.position.Y < go.position.Y + go.h) {
                    //console.log("Collision: Coin");
                    if (this.position.Z == go.position.Z) {

                        this.inventory.coins += go.value;
                        go.Remove();

                    }
                } 
            }
        }

        // ENEMY //
        for (let i = 0; i < this.Level.enemies.length; i++) {
            let e = this.Level.enemies[i];

            if (this.position.X + this.w > e.position.X && this.position.X < e.position.X + e.w) {
                if (this.position.Y + this.h > e.position.Y && this.position.Y < e.position.Y + e.h) {
                    if (this.position.Z == e.position.Z) {
                        this.Boost("stop");
                        if (this.stats.energy - e.attack > 0) {
                            this.stats.energy -= e.attack;
                        }
                        else{
                            this.stats.energy = 0;
                        }
                        console.log("hit enemy");
                        e.Remove();
                    }
                }
            }
        }

        // OBSTICLE //
        for (let i = 0; i < this.Level.obsticles.length; i++) {
            let o = this.Level.obsticles[i];

            if (this.position.X + this.w > o.position.X && this.position.X < o.position.X + o.w) {
                if (this.position.Y + this.h > o.position.Y && this.position.Y < o.position.Y + o.h) {
                    if (this.position.Z == o.position.Z) {
                        this.Boost("stop");
                        this.stats.speed = 0;

                    }
                }
            }
        }



    }

    Upgrade(type){




    }

    async Render(){

        /*
        ctx.strokeStyle = "#FF0000";
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.moveTo(0+this.position.X, 0);
        ctx.lineTo(300+this.position.X, 150);
        ctx.stroke();
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(this.position.X, this.position.Y, this.w, this.h);
        */

        if (this.stats.speed == this.stats.normalSpeed && !this.jump) {
            this.RenderWalkCycle();
        }
        else if(this.stats.speed == this.stats.boostSpeed && !this.jump){
            await this.RenderRunCycle();

        }
        else if(this.jump){
            this.RenderJump();

        }
        else{

            this.RenderIdleCycle();
        }
        

        ctx.drawImage(this.sprite, this.position.X, this.position.Y, this.spriteW, this.spriteH);


        // DEBUG //
        if (game.debug) {
            this.RenderDebug();
        }
        
        
    }

    // ANIM CYCLES //
    RenderWalkCycle(){
        let f = this.animClock;

        if (f < 8) {
            this.sprite.src = '../sprites/player/walkcycle/playerWalkcycle_00000.png';
        }
        else if(f > 8 && f < 16){
            this.sprite.src = '../sprites/player/walkcycle/playerWalkcycle_00001.png';
        }
        else if(f > 16 && f < 24){
            this.sprite.src = '../sprites/player/walkcycle/playerWalkcycle_00002.png';
        }
        else if(f > 24 && f < 32){
            this.sprite.src = '../sprites/player/walkcycle/playerWalkcycle_00003.png';
        }
        else if(f > 32 && f < 40){
            this.sprite.src = '../sprites/player/walkcycle/playerWalkcycle_00004.png';
        }
        else if(f > 40 && f < 48){
            this.sprite.src = '../sprites/player/walkcycle/playerWalkcycle_00005.png';
        }
        else if(f > 48 && f < 56){
            this.sprite.src = '../sprites/player/walkcycle/playerWalkcycle_00006.png';
        }
        else if(f > 56){
            this.sprite.src = '../sprites/player/walkcycle/playerWalkcycle_00007.png';
        }

    }
    RenderRunCycle(){
        let f = this.animClock;
        
        

        if (f < 5) {
            this.sprite.src = '../sprites/player/run/playerRuncycle_00000.png';
        }
        else if(f > 5 && f < 10){
            this.sprite.src = '../sprites/player/run/playerRuncycle_00001.png';
        }
        else if(f > 10 && f < 15){
            this.sprite.src = '../sprites/player/run/playerRuncycle_00002.png';
        }
        else if(f > 15 && f < 20){
            this.sprite.src = '../sprites/player/run/playerRuncycle_00003.png';
        }
        else if(f > 20 && f < 25){
            this.sprite.src = '../sprites/player/run/playerRuncycle_00004.png';
        }
        else if(f > 25 && f < 30){
            this.sprite.src = '../sprites/player/run/playerRuncycle_00005.png';
        }
        else if(f > 35 && f < 40){
            this.sprite.src = '../sprites/player/run/playerRuncycle_00006.png';
        }
        else if(f > 40 && f < 45){
            this.sprite.src = '../sprites/player/run/playerRuncycle_00007.png';
        }
        else if(f > 45 && f < 50){
            this.sprite.src = '../sprites/player/run/playerRuncycle_00008.png';
        }
        else if(f > 50 && f < 55){
            this.sprite.src = '../sprites/player/run/playerRuncycle_00009.png';
        }
        else if(f > 55){
            this.sprite.src = '../sprites/player/run/playerRuncycle_00010.png';
        }
        

    }
    RenderIdleCycle(){
        let f = this.animClock;

        if (f < 15) {
            this.sprite.src = '../sprites/player/player00.png';
        }
        else if(f > 15 && f < 30){
            this.sprite.src = '../sprites/player/player00.png';
        }
        else if(f > 30 && f < 45){
            this.sprite.src = '../sprites/player/player00.png';
        }
        else if(f > 45){
            this.sprite.src = '../sprites/player/player00.png';
        }


    }
    RenderJump(){
        let f = this.jumpClock;

        if (f < 10) {
            this.sprite.src = '../sprites/player/jump/playerJump_00002.png';
        }
        else if(f > 10 && f < 20){
            this.sprite.src = '../sprites/player/jump/playerJump_00003.png';
        }
        else{
            this.sprite.src = '../sprites/player/jump/playerJump_00004.png';
        }


    }

    RenderDebug(){
        ctx.strokeStyle = "#FF0000";
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.moveTo(0, this.ground);
        ctx.lineTo(300, this.ground);
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.textAlign = "left";
        let fSize = game.unit/6;
        ctx.font = fSize + "px Arial";
        let padding = game.unit/18;
        let inc = 1;
        ctx.fillText("Distance: " + Math.round(this.stats.distance) , this.position.X - this.w, this.position.Y + fSize*inc + padding*inc);
        inc++;
        ctx.fillText("X: " + this.position.X, this.position.X - this.w, this.position.Y + fSize*inc + padding*inc);
        inc++;
        ctx.fillText("Y: " + Math.round(this.position.Y), this.position.X - this.w, this.position.Y + fSize*inc + padding*inc);
        inc++;
        ctx.fillText("Z: " + this.position.Z, this.position.X - this.w, this.position.Y + fSize*inc + padding*inc);
        inc++;
        ctx.fillText("Bottom: " + Math.round(this.position.Y + this.h), this.position.X - this.w, this.position.Y + fSize*inc + padding*inc);
        inc++;
        ctx.fillText("G: " + Math.round(this.ground) + ", " + this.grounded, this.position.X - this.w, this.position.Y + fSize*inc + padding*inc);



    }


}

class Inventory{
    constructor(){
        this.size;
        this.objects = new Array;
        this.coins = 0;

    }
    



}

class Enemy{
    
    constructor(_id, _X, _Y, _Z,){
        this.id = _id;
        this.renderable = true;
        this.moving = false;
        this.lvl;
        this.value;
        this.attack = 20;

        this.position = {
            X:_X,
            Y:_Y,
            Z:_Z
        };

        this.w = game.unit /2;
        this.h = game.unit /2;

        this.Level = gameWorld.levels[gameWorld.currentLevel];

        this.sprite = new Image();
        this.sprite.src = '../sprites/' + this.Level.lvl + '/enemy00.png';


        this.anim = {


            die(){



            },

            idle(){



            },



        }
    }

    Update(){
        this.Level = gameWorld.levels[gameWorld.currentLevel];
        this.position.X -= player.stats.speed;
    }
 
    Render(){
        //ctx.fillStyle = "green";
        //ctx.fillRect(this.position.X, this.position.Y, this.w, this.h);

        ctx.drawImage(this.sprite, this.position.X, this.position.Y + game.unit * 0.2, this.w, this.h);
    }

    Remove(){
        this.attack = 0;
        this.anim.die();
        this.Destroy();

    }

    Destroy(){
        for (let i = 0; i < this.Level.enemies.length; i++) {
            let go = this.Level.enemies[i];

            if (this.position.X + this.w > go.position.X && this.position.X < go.position.X + go.w) {
                if (this.position.Y + this.h > go.position.Y && this.position.Y < go.position.Y + go.h) {
                    if (this.id == go.id) {
                        this.Level.enemies.splice(i,1);

                    }
                    
                }
                
            }
        }

    }


    
}

class Obsticle{
    
    constructor(_id, _X, _Y, _Z,){
        this.id = _id;
        this.renderable = true;
        this.moving = false;
        this.lvl;
        this.value;

        this.position = {
            X:_X,
            Y:_Y,
            Z:_Z
        };

        this.w = game.unit;
        this.h = game.unit;

        this.Level = gameWorld.levels[gameWorld.currentLevel];

        this.sprite = new Image();
        this.sprite.src = '../sprites/' + this.Level.lvl + '/obsticle00.png';
    }

    Update(){
        
        this.position.X -= player.stats.speed;
    }
 
    Render(){
        //ctx.fillStyle = "yellow";
        //ctx.fillRect(this.position.X, this.position.Y, this.w, this.h);
        
        ctx.drawImage(this.sprite, this.position.X, this.position.Y, this.w, this.h);
    }
}

class Coin{
    constructor(_id, _X, _Y, _Z,){
        this.id = _id;
        this.renderable = true;
        this.moving = false;
        this.lvl;
        this.value = 1;

        this.position = {
            X:_X,
            Y:_Y,
            Z:_Z,
            oX:0,
            oY:0,
        };

        this.scale = {
            X:1,
            Y:1,

        }

        this.w = game.unit /2;
        this.h = game.unit /2;

        this.sprite = new Image();
        this.sprite.src = '../sprites/items/coin00.png';

        this.animClock = 0;
        this.removeClock = 0;

        this.Level = gameWorld.levels[gameWorld.currentLevel];

        this.anim = {
            die(){
            },
            idle(){
            },

        }


    }

    Update(){
        this.Level = gameWorld.levels[gameWorld.currentLevel];

        this.position.X -= player.stats.speed;

        if (this.animClock > 60) {
            this.animClock = 0;

        }
        this.animClock++;

    }
    
    Render(){
        let f = this.animClock;

        this.RenderIdle(f);
        
        ctx.drawImage(this.sprite, this.position.X + this.position.oX, this.position.Y + this.position.oY + game.unit * 0.2, this.w*this.scale.X, this.h*this.scale.Y);

        /*
        ctx.fillStyle = "black";
        ctx.font = "10px Arial";
        ctx.fillText("X: " + this.position.X, this.position.X, this.position.Y-10);
        */

    }

    RenderIdle(f){

        if (f < 6) {
            this.sprite.src = '../sprites/items/coin/idle/coinIdle_00000.png';
        }
        else if(f > 6 && f < 12){
            this.sprite.src = '../sprites/items/coin/idle/coinIdle_00001.png';
        }
        else if(f > 12 && f < 18){
            this.sprite.src = '../sprites/items/coin/idle/coinIdle_00002.png';
        }
        else if(f > 18 && f < 24){
            this.sprite.src = '../sprites/items/coin/idle/coinIdle_00003.png';
        }
        else if(f > 24 && f < 30){
            this.sprite.src = '../sprites/items/coin/idle/coinIdle_00004.png';
        }
        else if(f > 36 && f < 42){
            this.sprite.src = '../sprites/items/coin/idle/coinIdle_00005.png';
        }
        else if(f > 42 && f < 48){
            this.sprite.src = '../sprites/items/coin/idle/coinIdle_00006.png';
        }
        else if(f > 48 && f < 54){
            this.sprite.src = '../sprites/items/coin/idle/coinIdle_00007.png';
        }
        else{
            this.sprite.src = '../sprites/items/coin/idle/coinIdle_00008.png';

        }

    }

    RenderDie(){
        var sfx = document.createElement("audio");
        sfx.src = "sfx/341695__projectsu012__coins-1.wav";
        sfx.volume = 0.1;
        sfx.play();

        /*
        let sfx = new Audio("sfx/341695__projectsu012__coins-1.wav"); // buffers automatically when created
        sfx.play();
        */

        this.position.oY -=4;
        this.scale.X *= 1.02;
        this.scale.Y *= 1.02;


    }

    Remove(){
        this.value = 0;
        
        this.RenderDie();
        if (this.removeClock == 10) {
            this.Destroy();
        }
        
        this.removeClock++

    }

    Destroy(){
        for (let i = 0; i < this.Level.coins.length; i++) {
            let go = this.Level.coins[i];

            if (this.position.X + this.w > go.position.X && this.position.X < go.position.X + go.w) {
                if (this.position.Y + this.h > go.position.Y && this.position.Y < go.position.Y + go.h) {
                    //console.log("Collision: Coin");
                    if (this.id == go.id) {
                        this.Level.coins.splice(i,1);

                    }
                    
                }
                
            }
        }

    }
}

class Buff{
    constructor(_id, _X, _Y, _Z, _type){
        this.id = _id;
        this.renderable = true;
        this.moving = false;
        this.lvl;
        this.value = 1;
        this.type = _type;
        this.buffValue;

        this.position = {
            X:_X,
            Y:_Y,
            Z:_Z,
            oX:0,
            oY:0,
        };

        this.scale = {
            X:1,
            Y:1,

        }

        this.w = game.unit /2;
        this.h = game.unit /2;

        this.sprite = new Image();

        if (this.type == "coffee") {
            this.sprite.src = '../sprites/items/coffee.png';
            this.buffValue = 10;
        }
        else{
            this.sprite.src = '../sprites/items/energy_drink.png';
            this.buffValue = 20;
        }
        

        this.animClock = 0;
        this.removeClock = 0;

        this.Level = gameWorld.levels[gameWorld.currentLevel];

        this.anim = {
            die(){
            },
            idle(){
            },

        }


    }

    Update(){
        this.Level = gameWorld.levels[gameWorld.currentLevel];

        this.position.X -= player.stats.speed;

        if (this.animClock > 60) {
            this.animClock = 0;

        }
        this.animClock++;

    }

    Render(){
        let f = this.animClock;


        ctx.drawImage(this.sprite, this.position.X + this.position.oX, this.position.Y + this.position.oY + game.unit * 0.2, this.w*this.scale.X, this.h*this.scale.Y);


    }

    RenderDie(){
        
        var sfx = document.createElement("audio");
        sfx.src = "sfx/568043__benken-23__coffee-slurp-5.wav";
        sfx.volume = 0.1;
        sfx.play();
        

        /*
        let sfx = new Audio("sfx/341695__projectsu012__coins-1.wav"); // buffers automatically when created
        sfx.play();
        */

        this.position.oY -=4;
        this.scale.X *= 1.02;
        this.scale.Y *= 1.02;


    }

    Remove(){
        this.value = 0;
        this.buffValue = 0;
        
        this.RenderDie();
        if (this.removeClock == 10) {
            this.Destroy();
        }
        
        this.removeClock++

    }

    Destroy(){
        for (let i = 0; i < this.Level.buffs.length; i++) {
            let go = this.Level.buffs[i];

            if (this.position.X + this.w > go.position.X && this.position.X < go.position.X + go.w) {
                if (this.position.Y + this.h > go.position.Y && this.position.Y < go.position.Y + go.h) {
                    //console.log("Collision: Coin");
                    if (this.id == go.id) {
                        this.Level.buffs.splice(i,1);

                    }
                    
                }
                
            }
        }

    }
}

class Box{
    constructor(_id, _X, _Y, _Z){
        this.id = _id;
        this.renderable = true;
        this.moving = false;
   
        this.position = {
            X:_X,
            Y:_Y,
            Z:_Z
        };

    }

    Update(){
        this.position.X -= player.stats.speed;
    }
 
    Render(){
        


    }

}

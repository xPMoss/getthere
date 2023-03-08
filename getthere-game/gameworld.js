


class Camera{
    constructor(){
        this.position = {
            X:100,Y:0,Z:0
        };

        
    }


    Move(){

    }



    Update(){
       

    }

}

class ColorScheme{
    constructor(){

        this.blue = {
            a:"#404580",
            b:"#B6BAE3",
            c:"#6F78DE",
            d:"#4B4D5E",
            e:"#575EAD",

        }
    
        this.yellowOrange = { 
            a:"#FFE880",
            b:"#E0D8B4",
            c:"#DBC76E",
            d:"#5C5849",
            e:"#A89954",
    
        }


    }
    


}

class Level{

    constructor(_lanes, _lvl){
        

        this.size;
        this.type = "2,5D";
        this.lvl = _lvl;
        this.lanes = {
            nr:_lanes,
            w:game.unit
        };

        this.tiles= {
            w:12,
            h:5
        }
        this.colors;

        switch (this.lvl) {
            case 0:
                this.colors = new ColorScheme().yellowOrange;
                break;
        
            case 1:
                this.colors = new ColorScheme().blue;
                break;

            default:
                this.colors = new ColorScheme().yellowOrange;
                break;
        }
        

        this.gravity = -9.78;
        this.groundPosition = canvas.height - this.lanes.nr * game.unit;
        this.w = game.unit * 10;
        this.h = game.unit * 5;

        this.spawnTimer = Math.floor(Math.random() * 5*60) + 1*60;

        this.enemies = new Array;
        this.enemyID = 0;

        this.obsticles = new Array;
        this.obsticleID = 0;

        this.coins = new Array;
        this.coinID = 0;

        this.buffs = new Array;
        this.buffID = 0;

        this.gameObjectsFX = new Array;

        this.groundSprites = new Array(this.lanes.nr);

        for (let i = 0; i < this.groundSprites.length; i++) {
            this.groundSprites[i] = new Array(this.tiles.w);
            
        }

        //console.log(this.groundSprites)
        
        for (let i = 0; i < this.groundSprites.length; i++) {
            for (let j = 0; j < this.groundSprites[i].length; j++) {
                this.groundSprites[i][j] = this.makeGrndSprite(this.w + game.unit*j, this.h - (i*game.unit), game.unit, game.unit,);
                
            }
            
        }

        this.bkgSprites = new Array;
        this.fgSprites = new Array;

    }

    Update(){

        // UPDATE POSTION //
        for (let i = 0; i < this.groundSprites.length; i++) {
            for (let j = 0; j < this.groundSprites[i].length; j++) {
                this.groundSprites[i][j].X -= player.stats.speed;
                
                
            }
            
        }

        for (let i = 0; i < this.buffs.length; i++) {
            this.buffs[i].Update();
            
        }

        for (let i = 0; i < this.coins.length; i++) {
            this.coins[i].Update();
            
        }


        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].Update();
            
        }

        for (let i = 0; i < this.obsticles.length; i++) {
            this.obsticles[i].Update();;           
        }

        for (let i = 0; i < this.groundSprites.length; i++) {
            if (this.groundSprites[i].length < this.tiles.w) {
                this.groundSprites[i].push(this.makeGrndSprite(this.w + game.unit, this.h - (i*game.unit), game.unit, game.unit,));                
            }
            
        }


        // SPAWN //
        if (this.spawnTimer <= 0) {
            let lane = Math.floor(Math.random() * this.lanes.nr) + 1;
            let type = Math.floor(Math.random() * 100) + 1;

            if (type > 80) {
                let b_type = Math.floor(Math.random() * 10) + 1;

                console.log("rnd: " + b_type);

                let b;

                if (b_type < 4) {
                    b = new Buff(this.buffID, canvas.width + game.unit, canvas.height - lane * game.unit, lane, "coffee")
                }
                else{
                    b = new Buff(this.buffID, canvas.width + game.unit, canvas.height - lane*game.unit, lane, "energy_drink")
                }
                
                this.buffs.push(b);
                this.buffID++
            }
            else if (type > 60 && type < 80) {
                let c = new Coin(this.coinID, canvas.width + game.unit, canvas.height - lane*game.unit, lane)
                this.coins.push(c);
                this.coinID++
            }
            else if(type > 20 && type < 60){
                let o = new Obsticle(this.obsticleID, canvas.width + game.unit, canvas.height - lane*game.unit, lane)
                this.obsticles.push(o);
                this.obsticleID++;
            }
            else{
                let e = new Enemy(this.enemyID, canvas.width + game.unit, canvas.height - lane*game.unit, lane)
                this.enemies.push(e);
                this.enemyID++;
            }

            this.spawnTimer = Math.floor(Math.random() * 250) + 100;

        }

        // DELETE OBJECTS OFF SCREEN //
        for (let i = 0; i < this.groundSprites.length; i++) {
            for (let j = 0; j < this.groundSprites[i].length; j++) {
                if (this.groundSprites[i][j].X + this.groundSprites[i][j].w < 0) {
                    this.groundSprites[i].splice(j,1);
                }                
            }            
        }

        for (let i = 0; i < this.buffs.length; i++) {
            if (this.buffs[i].position.X + this.buffs[i].w < 0) {
                this.buffs.splice(i,1);
            }            
        }

        for (let i = 0; i < this.coins.length; i++) {
            if (this.coins[i].position.X + this.coins[i].w < 0) {
                this.coins.splice(i,1);
            }            
        }

        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].position.X + this.enemies[i].w < 0) {
                this.enemies.splice(i,1);
            }            
        }

        for (let i = 0; i < this.obsticles.length; i++) {
            if (this.obsticles[i].position.X + this.obsticles[i].w < 0) {
                this.obsticles.splice(i,1);
            }            
        }

        
        //console.log( this.spawnTimer)
        this.spawnTimer -= player.stats.speed;
    }

    makeGrndSprite( _X, _Y, _w, _h,){
        let rnd = Math.floor(Math.random() * 3);
        let random_0to10 = Math.random() * (10 - 0) + 0;

        let sprite = {
            img:new Image(),
            X:_X,
            Y:_Y -_w,
            w:_w,
            h:_h,
            
        };

        if (rnd == 0) {
            sprite.img.src = '../sprites/' + this.lvl + '/grnd00.png';
        }
        else if (rnd == 1) {
            sprite.img.src = '../sprites/' + this.lvl + '/grnd01.png';
        }
        else if (rnd == 2) {
            sprite.img.src = '../sprites/' + this.lvl + '/grnd02.png';
        }
        

        return sprite;
    }

    Render(){

        // BKG //
        ctx.fillStyle = this.colors.a;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // GROUND //
        ctx.fillStyle = this.colors.d;
        ctx.fillRect(0, canvas.height - this.groundSprites.length*game.unit, canvas.width, this.groundSprites.length*game.unit);
        
        for (let i = 0; i < this.groundSprites.length; i++) {
            for (let j = 0; j < this.groundSprites[i].length; j++) {
                ctx.drawImage(this.groundSprites[i][j].img, this.groundSprites[i][j].X, this.groundSprites[i][j].Y, game.unit, game.unit);
                
            }
            
        }

        // FG //
        
        /*
        ctx.fillStyle = "white";
        ctx.font = "15px Arial";
        ctx.fillText("Grnd Position: " + this.groundPosition, 80, canvas.height - 30);
        ctx.fillText("Obsticles: " + this.obsticles.length, 80, canvas.height - 15);
        */

        // DEBUG //
        if (game.debug) {
            this.RenderDebug();
        }


        
        
        
        

    }

    RenderDebug(){
        // DEBUG //
        for (let i = 0; i < this.groundSprites.length; i++) {
            
            //ctx.fillStyle = "rgba(255,255,0, 0.5)";
            //ctx.fillRect(0, game.unit + i * game.unit, game.unit*2, game.unit);

            ctx.strokeStyle = "rgba(0,255,0, 0.5)";
            ctx.beginPath();
            ctx.moveTo(0, game.unit + i*game.unit);
            ctx.lineTo(game.unit*11, game.unit+ i*game.unit);
            ctx.stroke();

            /*
            ctx.beginPath();
            ctx.moveTo(0, 64 );
            ctx.lineTo(300, 64);
            ctx.stroke();
            */


        }

        

        for (let i = 0; i < 11; i++) {
            ctx.fillStyle = "rgba(200, 0, 0, " + i * 0.1+ ")";
            ctx.strokeStyle = "rgba(0,0,0, 1)";
            ctx.fillRect(game.unit * i, 0, game.unit, game.unit);
            ctx.strokeRect(game.unit * i, 0, game.unit, game.unit);
            
        }

        for (let i = 0; i < 11; i++) {
            ctx.strokeStyle = "rgba(0,255,0, 0.5)";
            ctx.beginPath();
            ctx.moveTo(game.unit * i, 0);
            ctx.lineTo(game.unit * i, game.unit*5);
            ctx.stroke();
            
        }

    }






}



class GameWorld{
    constructor(){
        
        
        this.levels = new Array;
        this.levels.push(new Level(4,0));
        this.levels.push(new Level(3,1));
        this.levels.push(new Level(2,2));
        this.currentLevel = 0;

        this.timer;


    }

    Update(){
        camera.Update();
        player.Update();

        this.levels[this.currentLevel].Update();

        ui.Update();

        // LEVEL END //
        if (player.stats.distance > 100000) {
            player.stats.distance = 0;
            gameLoop = false;
            this.currentLevel++;
            gameLoop = true;
            
        }

    }



    
}



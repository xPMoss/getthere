


class Renderer{
    constructor(){

        this.Level;


    }



    Render(){
        this.Level = gameWorld.levels[gameWorld.currentLevel];
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.Level.Render();

        // 5 //
        this.RenderOrder(5)
        // 4 //
        this.RenderOrder(4)
        // 3 //
        this.RenderOrder(3)
        // 2 //
        this.RenderOrder(2)
        // 3 //
        this.RenderOrder(1)

        ui.Render();
        
    
    }

    RenderOrder(depth){
        if (player.position.Z == depth) {
            player.Render();
        }

        for(let i=0; i < this.Level.buffs.length; i++){
            let b = this.Level.buffs[i];
            
            if(b.position.Z == depth){
                b.Render();
            }

        }
        
        for(let i=0; i < this.Level.coins.length; i++){
            let c = this.Level.coins[i];
            
            if(c.position.Z == depth){
                c.Render();
            }

        }

        for(let i=0; i < this.Level.enemies.length; i++){
            let e = this.Level.enemies[i];
            
            if(e.position.Z == depth){
                e.Render();
            } 

        }

        for(let i=0; i < this.Level.obsticles.length; i++){
            let o = this.Level.obsticles[i];
            
            if(o.position.Z == depth){
                o.Render();
            }

        }



    }
    
    
}
    
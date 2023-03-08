

class Menu{

    constructor(){
        this.id = _id;
        this.open = false;
        this.X = _X;
        this.Y = _Y;
        this.W = _W;
        this.H = _H;
        this.sprite;
        this.sprite.src = '../sprites/ui/' + _id + '.png';

    }

    Render(){


    }


}

class Button{

    constructor(_id, _X, _Y, _W, _H, _icon, _type){
        this.id = _id;
        this.open = false;
        this.X = _X;
        this.Y = _Y;
        this.W = _W;
        this.H = _H;
        this.sprite = new Image();
        this.sprite.src = '../sprites/ui/' + _id + '.png';
        this.icon = _icon;
        this.text;

        this.type = _type;

        if (_type == "upgrade") {
            this.upgrade = new Upgrade();
            
        }

        
    }

}

class Upgrade{
    constructor(){
        this.lvl = 1;
        this.cost = 1;
        this.type;

        
    }


}

class UI{

    constructor(){
        this.Level;
        this.padding = game.unit/10;
        this.fontsize = game.unit/10*2;
        

        this.moveUpBtn = new Button("upBtn", 0, 0, game.unit, game.unit, "⯅");
        this.moveDownBtn = new Button("downBtn", 0, game.unit, game.unit, game.unit, "⯆");
        //this.walkBtn = new Button("walkBtn", 0, 128, 64, 64, "⯈");
        this.jumpBtn = new Button("jumpBtn", 0, game.unit*3, game.unit, game.unit, "O");
        this.boostBtn = new Button("boostBtn", 0, game.unit*4, game.unit, game.unit, "");
        this.invBtn = new Button("invBtn", canvas.width - game.unit*3, 0, game.unit, game.unit, "Inv.");
        this.upgradeBtn = new Button("upgradeBtn", canvas.width - game.unit*2, 0, game.unit, game.unit, "Upgr.");
        this.settingsBtn = new Button("settingsBtn", canvas.width - game.unit, 0, game.unit, game.unit, "Settings");
        

        this.btns = new Array;
        this.btns.push(this.moveUpBtn);
        this.btns.push(this.moveDownBtn);
        //this.btns.push(this.walkBtn);
        this.btns.push(this.jumpBtn);
        this.btns.push(this.boostBtn);
        this.btns.push(this.invBtn);
        this.btns.push(this.upgradeBtn);
        this.btns.push(this.settingsBtn);
        

        this.inv1 = new Button("boostBtn", canvas.width - game.unit*3, game.unit*1, game.unit, game.unit, "Item");
        this.inv2 = new Button("boostBtn", canvas.width - game.unit*3, game.unit*2, game.unit, game.unit, "Item");

        this.inventory = new Array;
        this.inventory.push(this.inv1);
        this.inventory.push(this.inv2);


        this.up1 = new Button("upgradeBtn", canvas.width - game.unit*2, game.unit*1, game.unit, game.unit, "Boost", "upgrade");
        this.up2 = new Button("upgradeBtn", canvas.width - game.unit*2, game.unit*2, game.unit, game.unit, "Energy", "upgrade");
        this.up3 = new Button("upgradeBtn", canvas.width - game.unit*2, game.unit*3, game.unit, game.unit, "x", "upgrade");
        this.upgrades = new Array;
        this.upgrades.push(this.up1);
        this.upgrades.push(this.up2);
        this.upgrades.push(this.up3);

        // SETTINGS //
        this.debug = new Button("Btn", canvas.width - game.unit, game.unit*1, game.unit, game.unit, "Debug", "debug");

        this.settings = new Array;
        this.settings.push(this.debug);

    }

    Update(){

        this.Level = gameWorld.levels[gameWorld.currentLevel];

    }

    CD(){
        let value = false;

        for (let i = 0; i < this.btns.length; i++) {
            let btn = this.btns[i];
            
            if (mouse.X > btn.X && mouse.X < btn.X + btn.W && mouse.Y > btn.Y && mouse.Y < btn.Y + btn.H) {
                if (btn.id == "boostBtn") {
                    player.Boost();
                    
                }
                else if (btn.id == "invBtn") {
                    if (btn.open == false) {
                        btn.open = true;
                    }
                    else{
                        btn.open = false;
                    }

                }
                else if (btn.id == "upgradeBtn") {
                    if (btn.open == false) {
                        btn.open = true;
                    }
                    else{
                        btn.open = false;
                    }

                }
                else if (btn.id == "settingsBtn") {
                    if (btn.open == false) {
                        btn.open = true;
                    }
                    else{
                        btn.open = false;
                    }

                }
                else if (btn.id == "upBtn") {
                    player.Move("up");

                }
                else if (btn.id == "downBtn") {
                    player.Move("down");

                }
                else if (btn.id == "jumpBtn") {
                    player.jump = true;

                }
                
                //console.log("Clicked: " + btn.id)

                value = true;
                
            }

        }

        /*
        //this.stats = {speed:1, normalSpeed:1, boostSpeed:5, attackSpeed:0, attackDmg:0, distance:0, vSpeed:5, lvl:0, energy:0, maxEnergy:100}
        this.stats.energy = this.stats.maxEnergy;


        this.upgrades = {boost:1, speed:1,}

        this.boost = {clock:0, time:120, cooldown:0, cooldownTime: 240, boost:false}
        this.boost.clock = this.boost.time;
        this.boost.cooldown = this.boost.cooldownTime; */

        // UPGRADES //
        for (let i = 0; i < this.upgrades.length; i++) {
            let btn = this.upgrades[i];
            
            if (mouse.X > btn.X && mouse.X < btn.X + btn.W && mouse.Y > btn.Y && mouse.Y < btn.Y + btn.H) {
                if (btn.type == "upgrade") {
                    if (player.inventory.coins >= btn.upgrade.cost) {
                        player.inventory.coins -= btn.upgrade.cost;
                        btn.upgrade.lvl++;
                        btn.upgrade.cost *= 2;

                        if (btn.icon == "Boost") {
                            player.boost.cooldown *= 0.9;
                            player.boost.time *= 1.1;
                            player.stats.boostSpeed *= 1.1;
                            
                        }

                        if (btn.icon == "Energy") {
                            player.stats.maxEnergy *= 1.1;
                            player.stats.energy = player.stats.maxEnergy;
                            
                        }

                    }
                    else{
                        console.log("You cant afford that!")
                    }
                    
                }

                value = true;
                
            }

        }

        // SETTINGS //
        for (let i = 0; i < this.settings.length; i++) {
            let btn = this.settings[i];
            
            if (mouse.X > btn.X && mouse.X < btn.X + btn.W && mouse.Y > btn.Y && mouse.Y < btn.Y + btn.H) {
                if (btn.type == "debug") {
                    if (game.debug == false) {
                        game.debug = true;
                    }
                    else{
                        game.debug = false;
                    }
                    
                }

                value = true;
                
            }

        }

        return value;
    }

    Render(){
        this.fontsize = game.unit/10*2;
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.fillRect(canvas.width/2 -game.unit, 0 + this.padding, game.unit*2, this.padding + this.fontsize);

        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.font = this.fontsize + "px Arial";
        ctx.textAlign = "center";
        ctx.fillText("COINS: " + player.inventory.coins, canvas.width/2, 0 + this.padding + this.fontsize);

        // ENERGY METER //
        this.fontsize *= 0.75;
        let eC = player.stats.energy * 100 / player.stats.maxEnergy *0.01;
        let e = game.unit*2 * eC;
        ctx.fillStyle = "rgba(0,255,0,1)";
        ctx.fillRect(canvas.width/2 -game.unit, game.unit/2, e, this.fontsize + this.padding);

        ctx.fillStyle = "rgba(0,0,0,1)";
        
        ctx.font = this.fontsize + "px Arial";
        ctx.fillText(Math.round(player.stats.energy) + "/" + Math.round(player.stats.maxEnergy), canvas.width/2, game.unit/2 + this.fontsize);

        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillRect(0, 0, game.unit, canvas.height);

        // BTNS //
        ctx.fillStyle = "rgba(255,255,255,1)";
        for (let i = 0; i < this.btns.length; i++) {
            let btn = this.btns[i];

            if (btn.open && btn.id == "invBtn") {
                ctx.fillStyle = "rgba(255,255,255,0.5)";
                ctx.fillRect(canvas.width - game.unit *3, 0, game.unit, canvas.height);

                for (let j = 0; j < this.inventory.length; j++) {
                    let inv = this.inventory[j];

                    ctx.drawImage(inv.sprite, inv.X, inv.Y, inv.W, inv.H);

                    ctx.fillStyle = "rgba(0,0,0,1)";
                    ctx.font = "35px Arial";

                    if(inv.icon.length > 1){
                        ctx.font = "15px Arial";

                    }

                    if (inv.icon != undefined) {
                        ctx.fillText(inv.icon, inv.X + inv.W/2, inv.Y + inv.H/2 +30/2);

                    }
                }

            }
            else if (btn.open && btn.id == "upgradeBtn") {
                ctx.fillStyle = "rgba(255,255,255,0.5)";
                ctx.fillRect(canvas.width - game.unit*2, 0, game.unit, canvas.height);

                for (let j = 0; j < this.upgrades.length; j++) {
                    let up = this.upgrades[j];

                    ctx.drawImage(up.sprite, up.X, up.Y, up.W, up.H);

                    ctx.fillStyle = "rgba(0,0,0,1)";
                    ctx.font = "35px Arial";

                    if(up.icon.length > 1){
                        ctx.font = "15px Arial";

                    }

                    if (up.icon != undefined) {
                        ctx.font = "14px Arial";
                        ctx.fillText(up.icon, up.X + up.W/2, up.Y + up.H/2 -9);

                    }

                    if (up.type == "upgrade") {
                        ctx.font = "12px Arial";
                        ctx.fillText("Lvl: " + up.upgrade.lvl, up.X + up.W/2, up.Y + up.H/2 +7);
                        ctx.font = "12px Arial";
                        ctx.fillText("Cost: " + up.upgrade.cost, up.X + up.W/2, up.Y + up.H/2 +20);
                    }

                }

            }
            else if (btn.open && btn.id == "settingsBtn") {
                ctx.fillStyle = "rgba(255,255,255,0.5)";
                ctx.fillRect(canvas.width - game.unit, 0, game.unit, canvas.height);

                for (let j = 0; j < this.settings.length; j++) {
                    let up = this.settings[j];

                    ctx.drawImage(up.sprite, up.X, up.Y, up.W, up.H);

                    ctx.fillStyle = "rgba(0,0,0,1)";
                    ctx.font = "35px Arial";

                    if(up.icon.length > 1){
                        ctx.font = "15px Arial";

                    }

                    if (up.icon != undefined) {
                        ctx.font = "14px Arial";
                        ctx.fillText(up.icon, up.X + up.W/2, up.Y + up.H/2 -9);

                    }

                }

            }
            else{
                ctx.drawImage(btn.sprite, btn.X, btn.Y, btn.W, btn.H);
                
            }

            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.font = "35px Arial";

            if(btn.icon.length > 1){
                ctx.font = "15px Arial";

            }

            if (btn.icon != undefined) {
                if (btn.text != undefined) {
                    ctx.fillText(btn.text[1], btn.X + btn.W/2, btn.Y + btn.H/2 +30/2);
                }
                else{
                    ctx.fillText(btn.icon, btn.X + btn.W/2, btn.Y + btn.H/2 +30/2);
                }
                
            }


            
            

        }
        
        // SIDE BTNS //
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.font = "10px Arial";
        ctx.fillText("BOOST", this.boostBtn.X + this.boostBtn.W/2, this.boostBtn.Y+22);
        ctx.font = "15px Arial";
        ctx.fillText("" + Math.round(player.stats.speed), this.boostBtn.X + this.boostBtn.W/2, this.boostBtn.Y+36);
        ctx.font = "10px Arial";
        ctx.fillText("" + Math.round(player.boost.clock), this.boostBtn.X + this.boostBtn.W/2, this.boostBtn.Y+44);
        ctx.fillText("Cool: " + Math.round(player.boost.cooldown), this.boostBtn.X + this.boostBtn.W/2, this.boostBtn.Y+54);

        
        
        // ← ↑ ↓ → ↖↗↘↙//⇦	⇧	⇨	⇩	// ⬅	⬆	⬇	⬈	⬉	⬊	⬋	
        // ⭠	⭡	⭢	⭣	⭤	⭥	⭦	⭧	⭨	⭩
        // ⮜	⮝	⮞	⮟
        // ⯅	⯆	⯇	⯈
        // 🡄	🡅	🡆	🡇
        // 🠀	🠁	🠂	🠃	🠄	🠅	🠆	🠇	🠈	🠉	🠊	🠋	
        // 🠐	🠑	🠒	🠓	🠔	🠕	🠖	🠗	🠘	🠙	🠚	🠛	🠜	🠝	🠞	🠟
        // 🡠	🡡	🡢	🡣	🡤	🡥	🡦	🡧	🡨	🡩	🡪	🡫	🡬	🡭	🡮	🡯
        // 🡐	🡑	🡒	🡓	🡔	🡕	🡖	🡗	🡘	🡙
        // 🡰	🡱	🡲	🡳	🡴	🡵	🡶	🡷	🡸	🡹	🡺	🡻	🡼	🡽	🡾	🡿


        /*
        // MOUSE COORDINATES //
        ctx.font = "10px Arial";
        ctx.fillText(mouse.X + ", " + mouse.Y, mouse.X, mouse.Y);
        */


    }



}
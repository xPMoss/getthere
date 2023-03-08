
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext('2d');


let gameLoop = true;

function getWidth() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  }
  
  function getHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    );
  }

class Game{
    constructor(){
        
        this.pause = false;
        this.debug = false;

        this.unit = getWidth()/10;
        canvas.width = this.unit * 10;

        if (this.unit * 5 > getHeight()) {
            this.unit = getHeight()/5;
            canvas.width = this.unit * 11;
        }
        
        canvas.height = this.unit * 5;


    }

    Update(){


    }

    Render(){

        //ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(255,255,255, 0.5)";
        ctx.fillRect(128, 64, 512-128, 256-64);

        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PAUSE", canvas.width/2, canvas.height/2+15);




    }

    Pause(){
        if (this.pause == false) {
            this.pause = true;
        }
        else{
            this.pause = false;

        }

    }

    
}

let game = new Game();

let camera = new Camera();
let player = new Player();
let gameWorld = new GameWorld();
let renderer = new Renderer();
let ui = new UI();


let mouse = {
    X:0,
    Y:0
};

function Update(){

    if (gameLoop) {
        if (game.pause) {
            game.Render();
        }
        else{
            gameWorld.Update();
            renderer.Render();
        }
        
    }
    else{
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.fillRect(64, 64, 512, 256-64);

        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.fillText("NEXT LEVEL", canvas.width/2, canvas.height/2+15);

        ctx.strokeStyle = "#FF0000";
        ctx.fillStyle = "black";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(64*8, 64+32);
        ctx.lineTo(64*9, 64+64+32);
        ctx.lineTo(64*8, 64+64+64+32);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();


    }
    
    
    window.requestAnimationFrame(Update);

};

window.addEventListener("keyup", function(event) {
    event.preventDefault();

    console.log("Pressed key: " + event.keyCode);

    if (event.keyCode === 87) {
        player.Move("up");
    }

    if (event.keyCode === 83) {
        player.Move("down");
    }

    if (event.keyCode === 32) {
        player.jump = true;
    }

    if (event.keyCode === 68) {
        player.Boost();
    }

    if (event.keyCode === 80) {
        game.Pause();
    }
    
});

function Start(){
        
    

    


};

window.requestAnimationFrame(Update);

canvas.addEventListener("click", function(event) {
    let CD = ui.CD();

    if (CD == false) {
        //player.Jump()
    }
    
    event.preventDefault();
});

canvas.addEventListener('mousemove', function(event) {
    let rect = canvas.getBoundingClientRect();

    mouse.X = event.clientX - rect.x;
	mouse.Y = event.clientY - rect.y;

    event.preventDefault();

}, false);


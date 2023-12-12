const canvas = document.querySelector("canvas");

const ctx = canvas.getContext('2d');



canvas.height = innerHeight;

canvas.width = innerWidth;



class BRICK{

    constructor(x, y, height, width, img){

        this.x = x;

        this.y = y;

        this.height = height;

        this.width = width;

        this.img = new Image();

        this.img.src = img;

    }



    draw(){

        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

    }
    
    collidesWith(character) {
        return (
            character.x + character.width > this.x &&
            character.y + character.height > this.y &&
            character.x < this.x + this.width &&
            character.y < this.y + this.height
        );
    }

    collidesFromSide(character) {
        // Check for collision from the sides
        return (
            character.x < this.x + this.width &&
            character.x + character.width > this.x &&
            character.y + character.height > this.y &&
            character.y < this.y + this.height
        );
    }

}

class Character{
    constructor(x, y, height, width, type,img, lifeX, lifeY){
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.type = type;

        this.img = new Image();
        this.img.src = img;

        this.velocityY = 10;
        this.run_speed = 10;
        this.onGround = false;

        this.Lifes = 3;
        this.lifeX = lifeX;
        this.lifeY = lifeY;
    }

    draw(){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    update(bricks, collectors){
        if(!(this.Lifes > 0)){
            return;
        }
        // ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        // ctx.fill();
        if(this.type == 'fire'){
            ctx.fillStyle = "darkred";
            ctx.beginPath();
            ctx.arc(this.lifeX, this.lifeY, 30, Math.PI*2, 0);
            ctx.stroke();
            ctx.fill();
        }
        else{
            ctx.fillStyle = "darkblue";
            ctx.beginPath();
            ctx.arc(this.lifeX, this.lifeY, 30, Math.PI*2, 0);
            ctx.stroke();
            ctx.fill();
        }
        ctx.fillStyle = "white";
        ctx.fillText(this.Lifes, this.lifeX, this.lifeY+5);
            

        if(this.y+this.height > canvas.height){

            this.y = canvas.height - this.height;

            this.velocityY = 0;

            this.onGround = true;

        }

        else{

            this.velocityY ++;

            this.onGround = false;

        }



        for(const brick of bricks){
            
            if(this.x+this.width >= brick.x && // right
                this.x <= brick.x+brick.width && //left
                this.y+this.height >= brick.y && //top
                this.y <= brick.y+brick.height // bottom
                ){
                if(this.y <= brick.y-2){
                    this.onGround = true;
                    this.y = brick.y-this.height - 2;
                }

                if(this.y > brick.y){
                    this.velocityY = 3;
                }

                if(this.y > brick.y && this.x+this.width >= brick.x && this.x+this.width <= brick.x+10){
                    // this.run_speed = 0;
                    this.x = brick.x-this.width-5;
                }

                if(this.y > brick.y && this.x <= brick.x+brick.width && this.x >= brick.x+brick.width -10){
                    // this.run_speed = 0;
                    this.x = brick.x+brick.width+5;
                }
                
                // this.velocityY = 0;
            }

        }



        if(!this.onGround){

            this.velocityY++;

        }else{

            this.velocityY = 0;

        }
        if(collectors != undefined){

            for(let i=0; i< collectors.length; i++){
                const collect = collectors[i];
                if(this.x+this.width >= collect.x && // right
                    this.x <= collect.x+collect.width && //left
                    this.y+this.height >= collect.y && //top
                    this.y <= collect.y+collect.height // bottom
                    ){
                        if(this.type == collect.type){
                            this.Lifes++;
                            collectors.splice(i,1);
                        }
                    }
            }
        }

        // Collision detection with bricks
        // for (const brick of bricks) {
            
            
        //     if (brick.collidesWith(this)) {
        //         this.run_speed = 10;
        //         this.velocityY = 0;
        //         this.onGround = true;
        //         this.y = brick.y - this.height;
        //     }
        //     // Check for collision from the sides
        //     else if (brick.collidesFromSide(this)) {
        //         this.run_speed = 0;
        //         this.velocityY = 0;
        //         // this.x = brick.x + brick.width;
        //     }
        // }

        this.y += this.velocityY;

        if(this.x < 0){
            this.x = 2;
        }
        if(this.x+this.width > canvas.width){
            this.x = canvas.width - this.width;
        }
    }

    jump(){

        if(this.onGround){

            this.velocityY = -30;

        }

    }
}

class Obstacle{
    constructor(x, y, height, width, type, img){
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.type = type;

        this.img = new Image();
        this.img.src = img;
    }
    draw(){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    update(character){
        if(character.type != this.type){
            if(character.x+character.width >= this.x && // right
                character.x <= this.x+this.width && //left
                character.y+character.height >= this.y && //top
                character.y <= this.y+this.height // bottom
            ){
                character.Lifes--;
                character.x = levels[level].character_initial_pos.x;
                character.y = levels[level].character_initial_pos.y;

                setInterval(() => {
                    ctx.fillStyle = "#000000";
                    ctx.fill();
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.font = "30px Arial";
                    ctx.textAlign = "center";
                    ctx.fillStyle = "white";
                    ctx.fillText(character.type+": "+character.Lifes, canvas.width/2, canvas.height/2);
                }, 2000);
            }
        }
    }
}

class Collector{
    constructor(x, y, height, width, type, img){
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.type = type;

        this.img = new Image();
        this.img.src = img;
    }
    draw(){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);   
    }
}

class Door{
    constructor(x, y, height, width, img){
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;

        this.img = new Image();
        this.img.src = img;
    }
    draw(){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);   
    }

    characters_collide(char_fire, char_water){
        if((char_fire.x+char_fire.width >= this.x && // right
                char_fire.x <= this.x+this.width && //left
                char_fire.y+char_fire.height >= this.y && //top
                char_fire.y <= this.y+this.height // bottom 
            ) && 
            (char_water.x+char_water.width >= this.x && // right
            char_water.x <= this.x+this.width && //left
            char_water.y+char_water.height >= this.y && //top
            char_water.y <= this.y+this.height // bottom 
        )){
            this.x = -500;
            this.y = -500;
            level++;
            fire_chatacter.x = levels[level].character_initial_pos.x;
            fire_chatacter.y = levels[level].character_initial_pos.y;
            
            water_chatacter.x = levels[level].character_initial_pos.x;
            water_chatacter.y = levels[level].character_initial_pos.y;
            // alert(level);
        }
    }
}

const fire_chatacter = new Character(2, canvas.height-60, 30, 30, 'fire', 'fire_char.png', 30, 50)
const water_chatacter = new Character(2, canvas.height-60, 30, 30, 'water', 'water_char.png', 100, 50)


// let img = document.querySelector("#bg");

let img = new Image();

img.src = "Project.png";






let key = {};

let level = 1;
let levels = {
    1:{
        bricks: [

            //new BRICK(00, canvas.height - 50, 50, 500, "brick2.png"),
        
            //new BRICK(500, canvas.height - 100, 50, 500, "brick2.png"),
        
           //BORDER
            new BRICK(00, canvas.height - 795, 50, 600, "brick2.png"),
            new BRICK(600, canvas.height - 795, 50, 600, "brick2.png"),
            new BRICK(1200, canvas.height - 795, 50, 600, "brick2.png"),

            new BRICK(00, canvas.height - 35, 50, 600, "brick2.png"),
            new BRICK(600, canvas.height - 35, 50, 600, "brick2.png"),
            new BRICK(1200, canvas.height - 35, 50, 600, "brick2.png"),

            
            new BRICK(00, canvas.height - 220, 50, 600, "brick2.png"),
            new BRICK(500, canvas.height - 220, 50, 600, "brick2.png"),
            new BRICK(1200, canvas.height - 220, 50, 600, "brick2.png"),

            new BRICK(00, canvas.height - 450, 50, 600, "brick2.png"),
            new BRICK(800, canvas.height - 450, 50, 600, "brick2.png"),
            new BRICK(1200, canvas.height - 450, 50, 600, "brick2.png"),

           
            new BRICK(500, canvas.height - 650, 50, 600, "brick2.png"),
            new BRICK(1200, canvas.height - 650, 50, 600, "brick2.png"),
    
    //       new BRICK(00, 490, 50, 300, "brick2.png"),
      //    new BRICK(canvas.width-100, 650, 50, 200, "brick2.png"),
       // new BRICK(300, 500, 70, 300, "brick2.png"),
        
      //new BRICK(600, 560, 50, 500, "brick2.png"),
    
   //   new BRICK(300, 250, 60, 300, "brick2.png"),
        
     /*       new BRICK(600, 350, 30, 500, "brick2.png"),
            new BRICK(200, 550, 30, 500, "brick2.png"),
            
            new BRICK(100, 250, 70, 300, "brick2.png"),
        
            new BRICK(00, 350, 30, 500, "brick2.png"),

            new BRICK(200, canvas.height - 50, 50, 500, "brick2.png"),*/
        ],
        
        obstacles: [
            new Obstacle(30, 600-2, 20, 50, 'water',"water_image.png"),
            new Obstacle(canvas.width-100+5, 650, 10, 50, 'water',"water_image.png"),
            new Obstacle(300+30, 500-2, 25, 50,'fire', "fire_image.png"),
            new Obstacle(700+40, 550-2, 10, 80,'fire', "fire_image.png"),
        ],
        
        collectors: [
            new Collector(400+30, 500-40, 30, 30,'water', "water_point.png"),
            new Collector(700+40, 550-40, 30, 30,'fire', "fire_point.png"),
        ],

        gate: new Door(700, canvas.height-50, 50, 50, "door_image.png"),

        character_initial_pos: {
            x: 0,
            y: canvas.height-60
        }
    },

    2:{
        bricks: [

            new BRICK(150, canvas.height - 30, 50, 500, "brick2.png"),
        
            new BRICK(430, canvas.height - 200, 50, 500, "brick2.png"),
        
            new BRICK(0, 0, 20, canvas.width, "brick2.png"),
        
            new BRICK(0, canvas.height-50, 50, 50, "brick2.png"),
            new BRICK(0, 650, 50, 200, "brick2.png"),
            new BRICK(canvas.width-100, 650, 50, 100, "brick2.png"),
            new BRICK(250, 550, 70, 300, "brick2.png"),
        
            new BRICK(650, 550, 30, 500, "brick2.png"),
        ],
        
        obstacles: [
            new Obstacle(50, 600-2, 20, 50, 'water',"water_image.png"),
            new Obstacle(canvas.width-100+5, 650, 10, 50, 'water',"water_image.png"),
            new Obstacle(300+30, 500-2, 25, 50,'fire', "fire_image.png"),
            new Obstacle(700+40, 550-2, 10, 80,'fire', "fire_image.png"),
        ],
        
        collectors: [
            new Collector(300+30, 500-40, 30, 30,'water', "water_point.png"),
            new Collector(700+40, 550-40, 30, 30,'fire', "fire_point.png"),
        ],

        gate: new Door(800, canvas.height-50, 50, 50, "door_image.png"),

        character_initial_pos: {
            x: 0,
            y: canvas.height-500
        }
    },

    3:{
        bricks: [

            new BRICK(100, canvas.height - 40, 50, 500, "brick2.png"),
        
            new BRICK(430, canvas.height - 250, 50, 500, "brick2.png"),
        
            new BRICK(0, 0, 20, canvas.width, "brick2.png"),
        
            new BRICK(0, canvas.height-100, 100, 50, "brick2.png"),
            new BRICK(0, 550, 50, 200, "brick2.png"),
            new BRICK(canvas.width-100, 550, 50, 100, "brick2.png"),
            new BRICK(250, 450, 70, 300, "brick2.png"),
        
            new BRICK(650, 350, 30, 500, "brick2.png"),
        ],
        
        obstacles: [
            new Obstacle(50, 600-2, 20, 50, 'water',"water_image.png"),
            new Obstacle(canvas.width-100+5, 650, 10, 50, 'water',"water_image.png"),
            new Obstacle(300+30, 500-2, 25, 50,'fire', "fire_image.png"),
            new Obstacle(700+40, 550-2, 10, 80,'fire', "fire_image.png"),
        ],
        
        collectors: [
            new Collector(300+30, 500-40, 30, 30,'water', "water_point.png"),
            new Collector(700+40, 550-40, 30, 30,'fire', "fire_point.png"),
        ],

      /*()  gate: new Door(800, canvas.height-50, 50, 50, "door_image.png"),

        character_initial_pos: {
            x: 0,
            y: canvas.height-500
        }*/
    },
    }
const finalLevelNum = 3;
let pause = false;
function gameLoop(){

    requestAnimationFrame(gameLoop);
    if(level > finalLevelNum){
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText("You Win", canvas.width/2, canvas.height/2);
        return;
    }

    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(!(fire_chatacter.Lifes > 0) || !(water_chatacter.Lifes > 0)){
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText("GameOver", canvas.width/2, canvas.height/2);
        return;
    }
    if(pause){
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText("paused", canvas.width/2, canvas.height/2);
        return;
    }

    ctx.fillStyle = "#000000";

    ctx.fill();

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    levels[level].gate.draw();

    fire_chatacter.draw();
    water_chatacter.draw();

    for(const brick of levels[level].bricks){

        brick.draw();

    }

    for(const obs of levels[level].obstacles){
        obs.draw();
        obs.update(fire_chatacter);
        obs.update(water_chatacter);
    }

    for(const collect of levels[level].collectors){
        collect.draw();
    }

    fire_chatacter.update(levels[level].bricks, levels[level].collectors);
    water_chatacter.update(levels[level].bricks, levels[level].collectors);


    
    levels[level].gate.characters_collide(fire_chatacter, water_chatacter);

    if(key['ArrowUp']){
        fire_chatacter.jump();
    }
    if(key['w'] || key['W']){
        water_chatacter.jump();
    }

    if(key['ArrowRight']){

        fire_chatacter.x += fire_chatacter.run_speed;

    }
    if(key['d'] || key['D']){
        water_chatacter.x += water_chatacter.run_speed;
    }

    if(key['ArrowLeft']){

        fire_chatacter.x -= fire_chatacter.run_speed;

    }
    if(key['a'] || key['A']){
        water_chatacter.x -= water_chatacter.run_speed;
    }

}



gameLoop();



window.addEventListener("keydown", e => {
    // alert(e.key);
    key[e.key] = true;
    if(key['Escape']){
        if(pause){
            pause = false;
        }else{
            pause = true;
        }
    }

});



document.addEventListener('keyup', (event) => {

    key[event.key] = false;

});
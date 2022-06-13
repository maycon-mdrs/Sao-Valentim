var PLAY = 1;
var END = 0;
var gameState = PLAY;

//AMBIENTE
var ground,ground_image,invisible_ground;
var floor, floor_image;
//var poste, poste_image;
//PERSONAGEM
var girl,girl_running,girlImage, back_girl;
//OBSTACULO
var obstaclesGroup,obstacle1,obstacle2;
var obstacle_t, obstacle;
//SONS
var jumpSound,dieSound,checkpointSound;
//GAME
var score, rand;
var min, max;
var gameOver,restart,gameOverImage,restartImage;

function preload(){
    //AMBIENTE
    floor_image=loadImage("img/chaoF.png")
    ground_image=loadImage("img/fundo2.png");
    //poste_image=loadImage("img/posteF.png");

    //PERSONAGEM
    girl_running=loadAnimation("img/luma/lumaF1.png", "img/luma/lumaF2.png", "img/luma/lumaF3.png", "img/luma/lumaF4.png", "img/luma/lumaF5.png", "img/luma/lumaF6.png", "img/luma/lumaF7.png"); 
    girl_collided=loadImage("img/luma/lumaFM.png");

    //OBSTACULO
    obstacle1=loadImage("img/cone_2.png");

    //SONS
    jumpSound = loadSound("audios/jump.mp3")
    dieSound = loadSound("audios/die.mp3")
    checkPointSound = loadSound("audios/checkPoint.mp3")

    //GAME
    gameOverImage=loadImage("img/gameOver1-3.png");
    restartImage=loadImage("img/restart1-1.png");
}

function setup() {
    //TELA JOGO
    cnv = createCanvas(800,450);
    //cnv.touchStarted(touchJump);
    
    //FUNDO
    ground=createSprite(0,140,0,0);
    ground.shapeColor="white";
    ground.addImage("ground_image",ground_image);
    ground.scale=0.5;
    ground.velocityX=0;

    //CHÃO
    floor=createSprite(500,430,0,0);
    floor.addImage("floor_image", floor_image);
    floor.scale=1;
    floor.velocityX=-2;

    /*POSTE
    poste=createSprite(850,285,0,0);
    poste.addImage("poste_image",poste_image);
    poste.scale=0.5;
    poste.velocityX=-2;
    */

    //OBSTACULOS
    obstaclesGroup=new Group();
    
    //PLAYER
    girl=createSprite(80,420,600,10);
    back_girl=createSprite(94,380,50,106);
    girl.addAnimation("girl_running",girl_running);
    girl.addImage("girl_collided",girl_collided);
    girl.scale=1; 
    
    girl.debug=false;
    back_girl.setCollider("rectangle",0,0,back_girl.width,back_girl.height);
    back_girl.visible=false;
    
    invisible_ground=createSprite(300,470,800,60);
    invisible_ground.visible=false;
    
    //END GAME
    gameOver = createSprite(400,100);
    gameOver.addImage(gameOverImage);
    
    restart = createSprite(400,190);
    restart.addImage(restartImage);

    score=0;

    //rand
    getRandomArbitrary(50,70);
}

function draw() {
    background("black");
    
    // console.log(girl.y);
    //Gravity
    girl.velocityY = girl.velocityY + 0.8;
    girl.collide(invisible_ground); 

    back_girl.velocityY = back_girl.velocityY + 0.8;
    back_girl.collide(invisible_ground);
  
    if (gameState===PLAY){
        gameOver.visible=false;
        restart.visible=false;
    
        score = score + Math.round(getFrameRate()/60);
        
        spawnObstacles();
        
        //ground.velocityX = -(4 + 3* score/50);
        if(score < 800){
            floor.velocityX = -(4 + 3 * score/150);
            //poste.velocityX = -(4 + 3 * score/150);
        }
        if(score >= 800){
            floor.velocityX = -20;
            //poste.velocityX = -20;
        }
        
        ground.x = 400;

        if(floor.x < 300){
            floor.x = floor.width/2;
        }
        /*
        if (ground.x < 0){
            ground.x = ground.width/2;
        }
        */
        if(score>0 && score%100 === 0){
            checkPointSound.play();
            if(score > 400){
                getRandomArbitrary(20,50);
            }
        }
        if((keyDown("space") && girl.y >= 380)) {
            girl.velocityY = -14;
            back_girl.velocityY = -14;
            jumpSound.play();
            //40 = seta para baixo
        } 
        if((keyDown("s"))){
            girl.velocityY = +18;
            back_girl.velocityY = +18;
            //38 = seta para cima 
        }
        if (back_girl.isTouching(obstaclesGroup)){
            girl.changeImage("girl_collided",girl_collided);
            dieSound.play();
            gameState=END;
        }
    }
    else if ( gameState===END) {
        //GAME
        gameOver.visible=true;
        restart.visible=true;
        getRandomArbitrary(50,70);

        //OBJ
        ground.velocityX = 0;
        floor.velocityX = 0;

        //PLAYER
        girl.velocityY = 0;
        back_girl.velocityY = 0;
        girl.changeImage("girlImage",girlImage);

        //OBSTACULOS
        obstacle.velocityX = 0;

        //set lifetime of the game objects so that they are never destroyed
        obstaclesGroup.setLifetimeEach(-1);
        obstaclesGroup.setVelocityXEach(0);
        
        if(mousePressedOver(restart)){
            reset();
        }
    } 
 
    drawSprites();
    fill("white");
    textSize(20);
    text("Score: "+ score, 650,50);
}

function reset(){
    gameState=PLAY;
    gameOver.visible=false;
    restart.visible=false;
    girl.changeAnimation("girl_running",girl_running);
    obstaclesGroup.destroyEach();
    score=0;
}

function spawnObstacles() {
   if (frameCount % rand === 0){
        obstacle = createSprite(825,410,0,0);
        
        if(score<100){
            obstacle.velocityX = -6 ;//+ score/100);
        }
        if(score>=100 && score<1200){
            obstacle.velocityX = -(4 + 3 * score/150);
            console.log('velocidade ' + obstacle.velocityX);
        }
        if(score>=1200 && score<1800){
            obstacle.velocityX = -30;
            console.log('velo_1200 ' + obstacle.velocityX);
        }
        if(score>=1800){
            obstacle.velocityX = -40;
            console.log('velo_1800 ' + obstacle.velocityX);
        }
        obstacle.addImage(obstacle1);
        obstacle.scale=0.25;
        obstaclesGroup.add(obstacle);
        
        //obstacle.setCollider("rectangle",35,86,180,160);
        obstacle.setCollider("rectangle",0,86,150,150);
        obstacle.debug=false;

        drawSprites();
    }
     
}

//CONE ALEATÓRIO
function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    rand = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log('rand ' + rand);
}

//SCROLL SPACEBAR DOWN
window.addEventListener('keydown', (e) => {  
    if (e.keyCode === 32 && e.target === document.body) {  
      e.preventDefault();  
    }  
});

function touchStarted() {
    if(girl.y >= 380){
        girl.velocityY = -14;
        back_girl.velocityY = -14;
        jumpSound.play();
        //40 = seta para baixo
    }
}
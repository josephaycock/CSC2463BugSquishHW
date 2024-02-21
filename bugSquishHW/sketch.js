let sprite;
let characters = [];
let score = 0;
let gameFont;
let gameFinished = false;
let timeRemaining = 30;
let count = 20;
let play, done;

function preload() {
  gameFont = loadFont('assets/PressStart2P-Regular.ttf');

  let animations = {
    stand: { row: 0, frames: 1},
    walkRight: {row: 0, col: 1, frames: 4},
    walkLeft: {row: 0, col: 1, frames: 4},
    walkUp: {row: 0, col: 1, frames: 4},
    walkDown: {row: 0, col: 1, frames: 4},
    squish: {row: 1, col: 0, frames: 1}
  };

  for (let i = 0; i < count; i++) {
    characters[i] = new Character(random(50, 750), random(50, 750), 80, 80, 'assets/spider.png', animations);
  }
}

function setup() {
  createCanvas(800, 800); 
  imageMode(CENTER);

  play = color('green');
  done = color('red');

  textFont(gameFont);
}

function draw() {
  background(play);

  if (gameFinished) {
    gameOver();
  } else {
    gamePlaying();
  }

  characters.forEach((character) => {
    if (random() > 0.95) {
      let randomX = random(-1,1);
      let randomY = random(-1,1);
      character.moveRandomly(randomX, randomY);
    }

    if (character.sprite.x + character.sprite.width/4 > width) {
      character.walkLeft();
    } else if (character.sprite.x - character.sprite.width/4 < 0) {
      character.walkRight();
    } else if (character.sprite.y + character.sprite.height/4 > height) {
      character.walkUp();
    } else if (character.sprite.y - character.sprite.height/4 < 0) {
      character.walkDown();
    }
  });
}

function mousePressed() {
  for (i = 0; i < count; i++) {
    characters[i].squish();
  }
}

function gamePlaying() {
  textSize(20);
  text('Score: ' + score, 10, 30);
  text('Time: ' + ceil(timeRemaining), 10, 60);

  timeRemaining -= deltaTime / 1000;
  if (timeRemaining < 0) {
    gameFinished = true;
  }
}

function gameOver() {
  text('Game Over', 250, 250);
  text('Score: ' + score, 250, 350);
  text('Press Enter to SPACE', 250, 450);
}

function keyPressed() {
  if (gameFinished == true) {
    gameFinished = false;
    score = 0;
    timeRemaining = 30;
  } 
}

class Character {
  constructor(x,y,width,height,spriteSheet,animations) {
    this.sprite = new Sprite(x,y,width,height);
    this.sprite.spriteSheet = spriteSheet;
    this.sprite.collider = 'none';
    this.sprite.anis.frameDelay = 7;
    this.sprite.addAnis(animations);
    this.sprite.changeAni('stand');
    this.dead = false;
    this.squished = false;
    this.speed = 1;
  }

  speedUp() {
    this.speed += 2;
  }

  stop() {
    this.sprite.vel.x = 0;
    this.sprite.vel.y = 0;
    this.sprite.changeAni('stand');
  }
  
  walkRight() {
    this.sprite.changeAni('walkRight');
    this.sprite.vel.x = 1 * this.speed;
    this.sprite.rotation = 90;
    this.sprite.vel.y = 0 * this.speed;
  }
  
  walkLeft() {
    this.sprite.changeAni('walkLeft');
    this.sprite.vel.x = -1 * this.speed;
    this.sprite.rotation = 270;
    this.sprite.vel.y = 0 * this.speed;
  }

  walkUp() {
    this.sprite.changeAni('walkUp');
    this.sprite.vel.y = -1 * this.speed;
    this.sprite.rotation = 0;
    this.sprite.vel.x = 0 * this.speed;
  }

  walkDown() {
    this.sprite.changeAni('walkDown');
    this.sprite.vel.y = 1 * this.speed;
    this.sprite.rotation = 180;
    this.sprite.vel.x = 0 * this.speed;
  }

  squish() {
    if (mouseX > this.sprite.x - this.sprite.width/2 && mouseX < this.sprite.x + this.sprite.width/2 && mouseY > this.sprite.y - this.sprite.height/2 && mouseY < this.sprite.y + this.sprite.height/2) {
      
      this.sprite.changeAni('squish');
      this.sprite.vel.x = 0;
      this.sprite.vel.y = 0;
      this.dead = true;
      this.squished = true;
      score++;

      if (score % 1 == 0) {
        this.speedUp();
      }
    }
  }

  moveRandomly(randomX, randomY) {
    this.sprite.vel.x = randomX * this.speed;
    this.sprite.vel.y = randomY * this.speed;

    if (this.squished) {
      this.stop();
    }

    if (randomX > 0) {
      this.walkRight();
    } else if (randomX < 0) {
      this.walkLeft();
    } else {
      this.stop();
    }

    if (randomY > 0) {
      this.walkDown();
    } else if (randomY < 0) {
      this.walkUp();
    } else {
      this.stop();
    }
  }
}

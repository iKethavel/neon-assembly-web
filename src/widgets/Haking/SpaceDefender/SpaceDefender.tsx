'use client';

import React, { useEffect, useRef, useState } from 'react';

// Define interfaces for game objects
interface GameObjects {
  player: Player | null;
  bullets: Bullet[];
  enemies: Enemy[];
  enemyBullets: EnemyBullet[];
  powerUps: PowerUp[];
  particles: Particle[];
}

interface GameState {
  gameRunning: boolean;
  score: number;
  lives: number;
  level: number;
  gameTime: number;
  lastEnemySpawn: number;
  lastPowerUpSpawn: number;
  requestId: number | null;
  lastTime: number;
  ctx: CanvasRenderingContext2D | null;
  gameObjects: GameObjects;
  starField: StarField | null;
}

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
}

// Player class
class Player {
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
  targetX: number;
  speed: number;
  lastShot: number;
  shootDelay: number;
  powerUpTime: number;
  hasPowerUp: boolean;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.width = canvasWidth * 0.1;
    this.height = this.width * 0.8;
    this.x = canvasWidth / 2 - this.width / 2;
    this.y = canvasHeight - this.height - 20;
    this.color = '#4285F4';
    this.targetX = this.x;
    this.speed = 0.1;
    this.lastShot = 0;
    this.shootDelay = 300;
    this.powerUpTime = 0;
    this.hasPowerUp = false;
  }

  update(deltaTime: number, gameTime: number): void {
    // Move toward target position
    const dx = this.targetX - this.x;
    this.x += dx * this.speed * deltaTime;

    // Check if player is powered up
    if (this.hasPowerUp) {
      this.powerUpTime -= deltaTime;
      if (this.powerUpTime <= 0) {
        this.hasPowerUp = false;
        this.shootDelay = 300;
        this.color = '#4285F4';
      }
    }

    // Auto shooting
    if (gameTime - this.lastShot > this.shootDelay) {
      this.shoot(gameObjects);
      this.lastShot = gameTime;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // Draw ship body
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.closePath();
    ctx.fill();

    // Draw ship wings
    ctx.fillStyle = this.hasPowerUp ? '#FFD700' : '#34A853';
    ctx.fillRect(this.x - this.width * 0.2, this.y + this.height * 0.7, this.width * 0.2, this.height * 0.3);
    ctx.fillRect(this.x + this.width, this.y + this.height * 0.7, this.width * 0.2, this.height * 0.3);

    // Draw ship engine glow
    ctx.fillStyle = '#FBBC05';
    ctx.beginPath();
    ctx.moveTo(this.x + this.width * 0.3, this.y + this.height);
    ctx.lineTo(this.x + this.width * 0.5, this.y + this.height + this.height * 0.2);
    ctx.lineTo(this.x + this.width * 0.7, this.y + this.height);
    ctx.closePath();
    ctx.fill();
  }

  shoot(gameObjects: GameObjects): void {
    // Using canvas from a closure since we can't pass it as a parameter easily
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const bulletWidth = canvas.width * 0.01;
    const bulletHeight = canvas.height * 0.02;

    if (this.hasPowerUp) {
      // Triple shot when powered up
      gameObjects.bullets.push(new Bullet(this.x + this.width / 2 - bulletWidth / 2, this.y, bulletWidth, bulletHeight));
      gameObjects.bullets.push(new Bullet(this.x + this.width / 4 - bulletWidth / 2, this.y + this.height / 4, bulletWidth, bulletHeight));
      gameObjects.bullets.push(new Bullet(this.x + this.width * 3 / 4 - bulletWidth / 2, this.y + this.height / 4, bulletWidth, bulletHeight));
    } else {
      // Single shot normally
      gameObjects.bullets.push(new Bullet(this.x + this.width / 2 - bulletWidth / 2, this.y, bulletWidth, bulletHeight));
    }
  }

  activatePowerUp(): void {
    this.hasPowerUp = true;
    this.powerUpTime = 8000;
    this.shootDelay = 200;
    this.color = '#EA4335';
  }

  reset(canvasWidth: number, canvasHeight: number): void {
    this.x = canvasWidth / 2 - this.width / 2;
    this.y = canvasHeight - this.height - 20;
    this.targetX = this.x;
    this.lastShot = 0;
    this.powerUpTime = 0;
    this.hasPowerUp = false;
    this.shootDelay = 300;
    this.color = '#4285F4';
  }
}

// Bullet class
class Bullet {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
  remove: boolean;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 0.8;
    this.color = '#FFFFFF';
    this.remove = false;
  }

  update(deltaTime: number): void {
    this.y -= this.speed * deltaTime;

    // Mark for removal if off-screen
    if (this.y + this.height < 0) {
      this.remove = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  checkCollision(enemy: { x: number; y: number; width: number; height: number }): boolean {
    return (
      this.x < enemy.x + enemy.width &&
      this.x + this.width > enemy.x &&
      this.y < enemy.y + enemy.height &&
      this.y + this.height > enemy.y
    );
  }
}

// Enemy class
class Enemy {
  width: number;
  height: number;
  x: number;
  y: number;
  speed: number;
  type: 'basic' | 'advanced';
  health: number;
  color: string;
  remove: boolean;
  lastShot: number;
  shootDelay: number;
  points: number;

  constructor(canvasWidth: number, level: number) {
    this.width = canvasWidth * 0.08;
    this.height = this.width;
    this.x = Math.random() * (canvasWidth - this.width);
    this.y = -this.height;
    this.speed = 0.1 + (level * 0.02);
    this.type = Math.random() < 0.2 ? 'advanced' : 'basic';
    this.health = this.type === 'advanced' ? 2 : 1;
    this.color = this.type === 'advanced' ? '#EA4335' : '#34A853';
    this.remove = false;
    this.lastShot = 0;
    this.shootDelay = 3000;
    this.points = this.type === 'advanced' ? 20 : 10;
  }

  update(deltaTime: number, gameTime: number, canvasHeight: number): void {
    this.y += this.speed * deltaTime;

    // Mark for removal if off-screen
    if (this.y > canvasHeight) {
      this.remove = true;
      // Player loses a life if enemy gets past - handled by the game loop
    }

    // Advanced enemies shoot
    if (this.type === 'advanced' && gameTime - this.lastShot > this.shootDelay) {
      this.shoot(gameObjects);
      this.lastShot = gameTime;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;

    if (this.type === 'basic') {
      // Draw basic enemy (triangle shape)
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y + this.height);
      ctx.lineTo(this.x + this.width, this.y);
      ctx.lineTo(this.x, this.y);
      ctx.closePath();
      ctx.fill();
    } else {
      // Draw advanced enemy (circle shape)
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw inner details
      ctx.fillStyle = '#FBBC05';
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  shoot(gameObjects: GameObjects): void {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const bulletWidth = canvas.width * 0.01;
    const bulletHeight = canvas.height * 0.02;
    gameObjects.enemyBullets.push(new EnemyBullet(this.x + this.width / 2 - bulletWidth / 2, this.y + this.height, bulletWidth, bulletHeight));
  }

  checkCollision(player: { x: number; y: number; width: number; height: number }): boolean {
    return (
      this.x < player.x + player.width &&
      this.x + this.width > player.x &&
      this.y < player.y + player.height &&
      this.y + this.height > player.y
    );
  }

  hit(): void {
    this.health--;

    if (this.health <= 0) {
      this.remove = true;
      // Score updates handled by the game loop

      // Create explosion particles and chance to spawn power-up handled by the game loop
    }
  }
}

// Enemy Bullet class
class EnemyBullet {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
  remove: boolean;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 0.5;
    this.color = '#EA4335';
    this.remove = false;
  }

  update(deltaTime: number, canvasHeight: number): void {
    this.y += this.speed * deltaTime;

    // Mark for removal if off-screen
    if (this.y > canvasHeight) {
      this.remove = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  checkCollision(player: { x: number; y: number; width: number; height: number }): boolean {
    return (
      this.x < player.x + player.width &&
      this.x + this.width > player.x &&
      this.y < player.y + player.height &&
      this.y + this.height > player.y
    );
  }
}

// PowerUp class
class PowerUp {
  width: number;
  height: number;
  x: number;
  y: number;
  speed: number;
  color: string;
  remove: boolean;
  rotation: number;
  rotationSpeed: number;

  constructor(x: number, y: number) {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.width = canvas.width * 0.04;
    this.height = this.width;
    this.x = x - this.width / 2;
    this.y = y;
    this.speed = 0.2;
    this.color = '#FFD700';
    this.remove = false;
    this.rotation = 0;
    this.rotationSpeed = 0.003;
  }

  update(deltaTime: number, canvasHeight: number): void {
    this.y += this.speed * deltaTime;
    this.rotation += this.rotationSpeed * deltaTime;

    // Mark for removal if off-screen
    if (this.y > canvasHeight) {
      this.remove = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);

    // Draw star shape
    ctx.fillStyle = this.color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = Math.cos(angle) * (this.width / 2);
      const y = Math.sin(angle) * (this.height / 2);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      const innerAngle = angle + Math.PI / 5;
      const innerX = Math.cos(innerAngle) * (this.width / 4);
      const innerY = Math.sin(innerAngle) * (this.height / 4);
      ctx.lineTo(innerX, innerY);
    }
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  checkCollision(player: { x: number; y: number; width: number; height: number }): boolean {
    return (
      this.x < player.x + player.width &&
      this.x + this.width > player.x &&
      this.y < player.y + player.height &&
      this.y + this.height > player.y
    );
  }
}

// Particle class for explosions
class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  life: number;
  remove: boolean;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 2;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = color;
    this.life = 100;
    this.remove = false;
  }

  update(deltaTime: number): void {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= deltaTime * 0.1;

    if (this.life <= 0) {
      this.remove = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.globalAlpha = this.life / 100;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// Stars background
class StarField {
  stars: Star[];
  numStars: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.stars = [];
    this.numStars = 100;
    this.initStars(canvasWidth, canvasHeight);
  }

  initStars(canvasWidth: number, canvasHeight: number): void {
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.05 + 0.01
      });
    }
  }

  update(deltaTime: number, canvasWidth: number, canvasHeight: number): void {
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      star.y += star.speed * deltaTime;

      if (star.y > canvasHeight) {
        star.y = 0;
        star.x = Math.random() * canvasWidth;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'white';
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Using a global gameObjects variable to simplify access in class methods
let gameObjects: GameObjects = {
  player: null,
  bullets: [],
  enemies: [],
  enemyBullets: [],
  powerUps: [],
  particles: []
};


interface SpaceDefenderProps {
  onGameOver: (score: number) => void;
  initialLives?: number;
  initialLevel?: number;
}

// Main SpaceDefender component
export const SpaceDefender: React.FC<SpaceDefenderProps> = ({ onGameOver, initialLevel = 1, initialLives = 3 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [level, setLevel] = useState<number>(1);
  const gameStateRef = useRef<GameState>({
    gameRunning: false,
    score: 0,
    lives: initialLives,
    level: initialLevel,
    gameTime: 0,
    lastEnemySpawn: 0,
    lastPowerUpSpawn: 0,
    requestId: null,
    lastTime: 0,
    ctx: null,
    gameObjects: {
      player: null,
      bullets: [],
      enemies: [],
      enemyBullets: [],
      powerUps: [],
      particles: []
    },
    starField: null
  });

  // Initialize game
  const initGame = (): void => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gameState = gameStateRef.current;

    gameState.score = 0;
    gameState.lives = 3;
    gameState.level = 1;
    gameState.gameTime = 0;
    gameState.lastEnemySpawn = 0;
    gameState.lastPowerUpSpawn = 0;

    setScore(0);
    setLives(3);
    setLevel(1);

    gameState.gameObjects = {
      player: new Player(canvas.width, canvas.height),
      bullets: [],
      enemies: [],
      enemyBullets: [],
      powerUps: [],
      particles: []
    };

    // Update the global gameObjects reference for use in class methods
    gameObjects = gameState.gameObjects;

    gameState.starField = new StarField(canvas.width, canvas.height);
  };

  // Spawn enemies
  const spawnEnemies = (): void => {
    if (!canvasRef.current) return;

    const gameState = gameStateRef.current;
    const canvas = canvasRef.current;

    // Calculate spawn delay based on level (gets shorter as level increases)
    const spawnDelay = Math.max(800 - (gameState.level * 50), 300);

    // Check if it's time to spawn
    if (gameState.gameTime - gameState.lastEnemySpawn > spawnDelay) {
      const enemy = new Enemy(canvas.width, gameState.level);
      gameState.gameObjects.enemies.push(enemy);
      gameState.lastEnemySpawn = gameState.gameTime;
    }
  };

  // Check for level up
  const checkLevelUp = (): void => {
    if (!canvasRef.current || !gameStateRef.current.ctx) return;

    const gameState = gameStateRef.current;
    const canvas = canvasRef.current;
    const ctx = gameState.ctx;

    const levelThreshold = gameState.level * 200;
    if (gameState.score >= levelThreshold && gameState.level < 10) {
      gameState.level++;
      setLevel(gameState.level);

      // Create level up text effect
      const levelUpText = {
        text: `LEVEL ${gameState.level}!`,
        x: canvas.width / 2,
        y: canvas.height / 2,
        alpha: 1,
        size: 60
      };

      // Display level up text
      const showLevelUp = (): void => {
        if (!ctx || levelUpText.alpha <= 0) return;

        ctx.globalAlpha = levelUpText.alpha;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${levelUpText.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(levelUpText.text, levelUpText.x, levelUpText.y);
        ctx.globalAlpha = 1;

        levelUpText.alpha -= 0.01;
        levelUpText.y -= 0.5;

        requestAnimationFrame(showLevelUp);
      };

      showLevelUp();
    }
  };

  // Game loop
  const gameLoop = (timestamp: number): void => {
    if (!canvasRef.current) return;

    const gameState = gameStateRef.current;
    const canvas = canvasRef.current;

    if (!gameState.ctx) {
      gameState.ctx = canvas.getContext('2d');
    }
    const ctx = gameState.ctx;

    if (!ctx) return;

    // Calculate delta time
    if (!gameState.lastTime) gameState.lastTime = timestamp;
    const deltaTime = timestamp - gameState.lastTime;
    gameState.lastTime = timestamp;

    // Update game time
    gameState.gameTime += deltaTime;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw starfield
    if (gameState.starField) {
      gameState.starField.update(deltaTime, canvas.width, canvas.height);
      gameState.starField.draw(ctx);
    }

    if (gameState.gameRunning) {
      // Spawn enemies
      spawnEnemies();

      // Check for level up
      checkLevelUp();

      // Update and draw player
      if (gameState.gameObjects.player) {
        gameState.gameObjects.player.update(deltaTime, gameState.gameTime);
        gameState.gameObjects.player.draw(ctx);
      }

      // Update and draw bullets
      for (let i = gameState.gameObjects.bullets.length - 1; i >= 0; i--) {
        const bullet = gameState.gameObjects.bullets[i];
        bullet.update(deltaTime);
        bullet.draw(ctx);

        // Check for bullet collisions with enemies
        for (let j = gameState.gameObjects.enemies.length - 1; j >= 0; j--) {
          const enemy = gameState.gameObjects.enemies[j];
          if (bullet.checkCollision(enemy)) {
            bullet.remove = true;
            enemy.hit();

            // Check if enemy is destroyed
            if (enemy.remove) {
              gameState.score += enemy.points;
              setScore(gameState.score);

              // Create explosion particles
              for (let k = 0; k < 10; k++) {
                gameState.gameObjects.particles.push(new Particle(
                  enemy.x + enemy.width / 2,
                  enemy.y + enemy.height / 2,
                  enemy.color
                ));
              }

              // Chance to spawn power-up
              if (Math.random() < 0.1) {
                gameState.gameObjects.powerUps.push(new PowerUp(
                  enemy.x + enemy.width / 2,
                  enemy.y + enemy.height / 2
                ));
              }
            }

            break;
          }
        }

        // Remove bullets marked for removal
        if (bullet.remove) {
          gameState.gameObjects.bullets.splice(i, 1);
        }
      }

      // Update and draw enemies
      for (let i = gameState.gameObjects.enemies.length - 1; i >= 0; i--) {
        const enemy = gameState.gameObjects.enemies[i];
        enemy.update(deltaTime, gameState.gameTime, canvas.height);
        enemy.draw(ctx);

        // Check for collision with player
        if (gameState.gameObjects.player && enemy.checkCollision(gameState.gameObjects.player)) {
          enemy.remove = true;
          gameState.lives--;
          setLives(gameState.lives);

          if (gameState.lives <= 0) {
            gameState.gameRunning = false;
            setGameOver(true);
          }
        }

        // Remove enemies marked for removal
        if (enemy.remove) {
          gameState.gameObjects.enemies.splice(i, 1);
        } else if (enemy.y > gameState.gameObjects.player!.y + gameState.gameObjects.player!.height) {
          // Enemy got past player
          gameState.lives--;
          setLives(gameState.lives);

          if (gameState.lives <= 0) {
            gameState.gameRunning = false;
            setGameOver(true);
          }

          // Remove enemy that got past
          gameState.gameObjects.enemies.splice(i, 1);
        }
      }

      // Update and draw power-ups
      for (let i = gameState.gameObjects.powerUps.length - 1; i >= 0; i--) {
        const powerUp = gameState.gameObjects.powerUps[i];
        powerUp.update(deltaTime, canvas.height);
        powerUp.draw(ctx);

        // Check for collision with player
        if (gameState.gameObjects.player && powerUp.checkCollision(gameState.gameObjects.player)) {
          powerUp.remove = true;
          gameState.gameObjects.player.activatePowerUp();
          gameState.score += 50;
          setScore(gameState.score);
        }

        // Remove power-ups marked for removal
        if (powerUp.remove) {
          gameState.gameObjects.powerUps.splice(i, 1);
        }
      }

      // Update and draw enemy bullets
      for (let i = gameState.gameObjects.enemyBullets.length - 1; i >= 0; i--) {
        const enemyBullet = gameState.gameObjects.enemyBullets[i];
        enemyBullet.update(deltaTime, canvas.height);
        enemyBullet.draw(ctx);

        // Check for collision with player
        if (gameState.gameObjects.player && enemyBullet.checkCollision(gameState.gameObjects.player)) {
          enemyBullet.remove = true;
          gameState.lives--;
          setLives(gameState.lives);

          if (gameState.lives <= 0) {
            gameState.gameRunning = false;
            setGameOver(true);
          }
        }

        // Remove enemy bullets marked for removal
        if (enemyBullet.remove) {
          gameState.gameObjects.enemyBullets.splice(i, 1);
        }
      }

      // Update and draw particles
      for (let i = gameState.gameObjects.particles.length - 1; i >= 0; i--) {
        const particle = gameState.gameObjects.particles[i];
        particle.update(deltaTime);
        particle.draw(ctx);

        // Remove particles marked for removal
        if (particle.remove) {
          gameState.gameObjects.particles.splice(i, 1);
        }
      }
    }

    gameState.requestId = requestAnimationFrame(gameLoop);
  };

  // Handle canvas resize
  const handleResize = (): void => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Reinitialize starfield on resize
    const gameState = gameStateRef.current;
    if (gameState.starField) {
      gameState.starField = new StarField(canvas.width, canvas.height);
    }

    // Reposition player if it exists
    if (gameState.gameObjects && gameState.gameObjects.player) {
      gameState.gameObjects.player.reset(canvas.width, canvas.height);
    }
  };

  // Handle start game
  const handleStartGame = (): void => {
    setGameStarted(true);
    setGameOver(false);
    gameStateRef.current.gameRunning = true;
    initGame();
  };

  // Handle restart game
  const handleRestartGame = (): void => {
    setGameOver(false);
    gameStateRef.current.gameRunning = true;
    initGame();
  };

  const handleEndGame = (): void => {
    onGameOver(gameStateRef.current.score);
  }

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>): void => {
    if (gameStateRef.current.gameRunning && gameStateRef.current.gameObjects.player) {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvasRef.current!.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;

      gameStateRef.current.gameObjects.player.targetX = touchX - gameStateRef.current.gameObjects.player.width / 2;
    }
  };

  // Handle mouse move (for desktop testing)
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (gameStateRef.current.gameRunning && gameStateRef.current.gameObjects.player) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;

      gameStateRef.current.gameObjects.player.targetX = mouseX - gameStateRef.current.gameObjects.player.width / 2;
    }
  };

  // Initial setup
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gameStateRef.current.ctx = canvas.getContext('2d');

    // Start game loop
    const requestId = requestAnimationFrame(gameLoop);
    gameStateRef.current.requestId = requestId;

    // Set up event listeners
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (gameStateRef.current.requestId) {
        cancelAnimationFrame(gameStateRef.current.requestId);
      }
    };
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, overflow: 'hidden', backgroundColor: '#000', touchAction: 'none', position: 'fixed', inset: '0', zIndex: 10 }}>
      <canvas
        id="gameCanvas"
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100vh', touchAction: 'none' }}
        onTouchMove={handleTouchMove}
        onMouseMove={handleMouseMove}
      />

      <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', fontFamily: 'Arial, sans-serif', fontSize: 18, pointerEvents: 'none' }}>
        <div>Score: {score}</div>
        <div>Lives: {lives}</div>
        <div>Level: {level}</div>
      </div>

      {!gameStarted && !gameOver && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontFamily: 'Arial, sans-serif'
        }}>
          {/* <h1 style={{ fontSize: 36, marginBottom: 20, textAlign: 'center' }}>SPACE DEFENDER</h1> */}
          <button
            onClick={handleStartGame}
            style={{
              backgroundColor: '#4CAF50',
              border: 'none',
              color: 'white',
              padding: '15px 32px',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'inline-block',
              fontSize: 16,
              margin: '4px 2px',
              cursor: 'pointer',
              borderRadius: 5
            }}
          >
            Let's breach this motherf*cker!
          </button>
          <p>Tap to move. Shoot automatically.</p>
          <p>Do not pass enemies through your ship.</p>
          <p>Difficulty increases over time!</p>
        </div>
      )}

      {gameOver && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '80%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h1 style={{ fontSize: 36, marginBottom: 20, textAlign: 'center' }}>GAME OVER</h1>
          <div style={{ fontSize: 24, marginBottom: 30 }}>Score: {score}</div>
          <button
            onClick={handleEndGame}
            style={{
              backgroundColor: '#4CAF50',
              border: 'none',
              color: 'white',
              padding: '15px 32px',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'inline-block',
              fontSize: 16,
              margin: '4px 2px',
              cursor: 'pointer',
              borderRadius: 5
            }}
          >
            END SESSION
          </button>
        </div>
      )}
    </div>
  );
};

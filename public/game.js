const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const cheetahImg = new Image();
cheetahImg.src = 'images/cheetah.png';

const obstacleImg = new Image();
obstacleImg.src = 'images/obstacle.png';

const rockImg = new Image();
rockImg.src = 'images/rock.png';

const treeImg = new Image();
treeImg.src = 'images/tree.png';

const backgroundImg = new Image();
backgroundImg.src = 'images/background.png';

const powerUpImg = new Image();
powerUpImg.src = 'images/speed.png';

// Game settings
let cheetahX = 50;
let cheetahY = canvas.height / 2;
let cheetahSpeed = 2;

let obstacles = [];
let obstacleSpeed = 4;

let backgroundX = 0;
let backgroundSpeed = 2;

let gameRunning = true;
let score = 0;

let powerUps = [];

// Game loop
function gameLoop() {
    if (gameRunning) {
        // Draw the background (looping)
        backgroundX -= backgroundSpeed;
        if (backgroundX <= -canvas.width) {
            backgroundX = 0;
        }
        ctx.drawImage(backgroundImg, backgroundX, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImg, backgroundX + canvas.width, 0, canvas.width, canvas.height);

        // Draw the cheetah
        ctx.drawImage(cheetahImg, cheetahX, cheetahY, 50, 30);

        // Move the cheetah
        cheetahY -= cheetahSpeed;

        // Generate and move obstacles
        if (Math.random() < 0.02) {
            const obstacleType = Math.random() > 0.5 ? 'rock' : 'tree';
            obstacles.push({
                x: canvas.width,
                y: Math.random() * (canvas.height - 30),
                width: 30,
                height: 30,
                type: obstacleType
            });
        }

        obstacles.forEach((obstacle, index) => {
            obstacle.x -= obstacleSpeed;
            const obstacleImg = obstacle.type === 'rock' ? rockImg : treeImg;
            ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

            // Check for collision
            if (cheetahX < obstacle.x + obstacle.width &&
                cheetahX + 50 > obstacle.x &&
                cheetahY < obstacle.y + obstacle.height &&
                cheetahY + 30 > obstacle.y) {
                gameRunning = false;
            }

            // Remove off-screen obstacles
            if (obstacle.x + obstacle.width < 0) {
                obstacles.splice(index, 1);
                score++;
            }
        });

        // Generate and move power-ups
        if (Math.random() < 0.01) {
            powerUps.push({
                x: canvas.width,
                y: Math.random() * (canvas.height - 30),
                width: 30,
                height: 30,
                type: 'speed'  // Add different types for more power-ups
            });
        }

        powerUps.forEach((powerUp, index) => {
            powerUp.x -= obstacleSpeed;
            ctx.drawImage(powerUpImg, powerUp.x, powerUp.y, powerUp.width, powerUp.height);

            // Check for collision with the cheetah
            if (cheetahX < powerUp.x + powerUp.width &&
                cheetahX + 50 > powerUp.x &&
                cheetahY < powerUp.y + powerUp.height &&
                cheetahY + 30 > powerUp.y) {

                // Apply the power-up effect
                if (powerUp.type === 'speed') {
                    cheetahSpeed += 2;
                    setTimeout(() => cheetahSpeed -= 2, 5000);  // Speed boost lasts 5 seconds
                }

                // Remove the power-up after collection
                powerUps.splice(index, 1);
            }

            // Remove off-screen power-ups
            if (powerUp.x + powerUp.width < 0) {
                powerUps.splice(index, 1);
            }
        });

        // Update the score
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 20);

        // Request the next frame
        requestAnimationFrame(gameLoop);
    } else {
        // Game over
        ctx.fillStyle = 'black';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 60, canvas.height / 2 + 40);
    
        // Send score to backend to earn tokens
        const userId = 'testUser123';  // This would be dynamically fetched in a real app
        fetch('/api/tokens/addTokens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, score })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(`Tokens earned: ${score}. Total tokens: ${data.tokens}`);
            } else {
                console.error('Failed to earn tokens');
            }
        });
    }
}

// Start the game
gameLoop();

// Simple input handling (up arrow to move up, down arrow to move down)
document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowUp') {
        cheetahSpeed = 2;
    } else if (event.code === 'ArrowDown') {
        cheetahSpeed = -2;
    }
});

document.addEventListener('keyup', () => {
    cheetahSpeed = 0;
});


document.addEventListener('DOMContentLoaded', () => {
    // 游戏变量
    const player = document.getElementById('player');
    const gameContainer = document.getElementById('game-container');
    const wordInput = document.getElementById('word-input');
    const scoreDisplay = document.getElementById('score-display');
    const gameOverScreen = document.getElementById('game-over');
    const finalScoreDisplay = document.getElementById('final-score');
    const restartBtn = document.getElementById('restart-btn');
    
    let score = 0;
    let enemies = [];
    let gameActive = true;
    let enemySpawnInterval;
    let enemySpeed = 1;
    let words = [
        'apple', 'banana', 'cat', 'dog', 'elephant', 
        'fish', 'girl', 'house', 'ice', 'jungle',
        'king', 'lion', 'monkey', 'nest', 'orange',
        'pig', 'queen', 'rabbit', 'sun', 'tree',
        'umbrella', 'violin', 'water', 'xylophone', 'yellow', 'zebra'
    ];
    
    // 初始化游戏
    function initGame() {
        score = 0;
        enemies = [];
        gameActive = true;
        scoreDisplay.textContent = `分数: ${score}`;
        gameOverScreen.style.display = 'none';
        wordInput.value = '';
        wordInput.focus();
        
        // 清除所有敌人
        document.querySelectorAll('.enemy').forEach(enemy => enemy.remove());
        
        // 开始生成敌人
        enemySpawnInterval = setInterval(spawnEnemy, 2000);
        
        // 游戏主循环
        const gameLoop = setInterval(() => {
            if (!gameActive) {
                clearInterval(gameLoop);
                clearInterval(enemySpawnInterval);
                return;
            }
            
            moveEnemies();
            checkCollisions();
        }, 16); // 约60fps
    }
    
    // 生成敌人
    function spawnEnemy() {
        if (!gameActive) return;
        
        const enemy = document.createElement('div');
        enemy.className = 'enemy';
        
        // 随机位置 (屏幕边缘)
        const sides = ['top', 'right', 'bottom', 'left'];
        const side = sides[Math.floor(Math.random() * sides.length)];
        
        let left, top;
        const size = 40;
        const padding = 20;
        
        switch(side) {
            case 'top':
                left = Math.random() * (window.innerWidth - size);
                top = -size - padding;
                break;
            case 'right':
                left = window.innerWidth + padding;
                top = Math.random() * (window.innerHeight - size);
                break;
            case 'bottom':
                left = Math.random() * (window.innerWidth - size);
                top = window.innerHeight + padding;
                break;
            case 'left':
                left = -size - padding;
                top = Math.random() * (window.innerHeight - size);
                break;
        }
        
        enemy.style.left = `${left}px`;
        enemy.style.top = `${top}px`;
        
        // 随机单词
        const randomWord = getRandomWord();
        enemy.textContent = randomWord;
        enemy.dataset.word = randomWord.toLowerCase();
        
        gameContainer.appendChild(enemy);
        enemies.push({
            element: enemy,
            x: left,
            y: top,
            targetX: window.innerWidth / 2 - 30,
            targetY: window.innerHeight / 2 - 30,
            speed: enemySpeed + Math.random() * 2
        });
    }
    
    // 获取随机单词
    function getRandomWord() {
        return words[Math.floor(Math.random() * words.length)];
    }
    
    // 移动敌人
    function moveEnemies() {
        enemies.forEach((enemy, index) => {
            const dx = enemy.targetX - enemy.x;
            const dy = enemy.targetY - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 1) {
                enemy.x += dx / distance * enemy.speed;
                enemy.y += dy / distance * enemy.speed;
                
                enemy.element.style.left = `${enemy.x}px`;
                enemy.element.style.top = `${enemy.y}px`;
            }
        });
    }
    
    // 检查碰撞
    function checkCollisions() {
        enemies.forEach((enemy, index) => {
            const enemyRect = enemy.element.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();
            
            // 简单的碰撞检测
            if (
                enemyRect.left < playerRect.right &&
                enemyRect.right > playerRect.left &&
                enemyRect.top < playerRect.bottom &&
                enemyRect.bottom > playerRect.top
            ) {
                // 游戏结束
                gameOver();
            }
        });
    }
    
    // 游戏结束
    function gameOver() {
        gameActive = false;
        gameOverScreen.style.display = 'flex';
        finalScoreDisplay.textContent = `最终分数: ${score}`;
    }
    
    // 检查输入
    wordInput.addEventListener('input', () => {
        if (!gameActive) return;
        
        const inputValue = wordInput.value.toLowerCase();
        
        // 检查是否有敌人被消灭
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            if (enemy.dataset.word === inputValue) {
                // 移除敌人
                enemy.element.remove();
                enemies.splice(i, 1);
                
                // 增加分数
                score += 10;
                scoreDisplay.textContent = `分数: ${score}`;
                
                // 清空输入
                wordInput.value = '';
                
                // 随着分数增加难度
                if (score % 50 === 0) {
                    enemySpeed += 0.2;
                    clearInterval(enemySpawnInterval);
                    enemySpawnInterval = setInterval(spawnEnemy, Math.max(300, 2000 - score * 10));
                }
                
                break;
            }
        }
    });
    
    // 重新开始游戏
    restartBtn.addEventListener('click', initGame);
    
    // 初始游戏启动
    initGame();
    
    // 窗口大小调整时重新定位玩家
    window.addEventListener('resize', () => {
        player.style.left = '50%';
        player.style.top = '50%';
        player.style.transform = 'translate(-50%, -50%)';
    });
});

// 滚动动画
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        window.addEventListener('scroll', () => {
            timelineItems.forEach(item => {
                const itemTop = item.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (itemTop < windowHeight * 0.8) {
                    item.style.animation = 'slideIn 0.6s ease-in-out forwards';
                }
            });
        });

        // 新增下雪粒子效果
        const canvas = document.getElementById('snowCanvas');
        const ctx = canvas.getContext('2d');
 
        // 设置画布尺寸
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
 
        // 雪花数组
        const snowflakes = [];
        const maxSnowflakes = 150;
 
        // 雪花类
        class Snowflake {
            constructor() {
                this.reset();
            }
 
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = Math.random() * 3 + 1;
                this.speedX = Math.random() - 0.5;
                this.speedY = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.5;
            }
 
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
 
                if (this.x < 0 || this.x > canvas.width || this.y > canvas.height) {
                    this.reset();
                }
            }
 
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(200, 100%, 100%, ${this.opacity})`;
                ctx.fill();
            }
        }
 
        // 初始化雪花
        for (let i = 0; i < maxSnowflakes; i++) {
            snowflakes.push(new Snowflake());
        }
 
        // 动画循环
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
 
            snowflakes.forEach(snowflake => {
                snowflake.update();
                snowflake.draw();
            });
 
            requestAnimationFrame(animate);
        }
 
        // 启动动画
        animate();
 
        // 窗口调整处理
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
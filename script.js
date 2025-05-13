// 5. public/script.js
// 抽屉导航控制
let drawerVisible = false;
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const drawer = document.getElementById('drawer');
    const currentScroll = window.pageYOffset;

    // 滚动超过50px显示抽屉
    if (currentScroll > 50 && !drawerVisible) {
        drawer.style.top = '0';
        drawerVisible = true;
    } else if (currentScroll < 50 && drawerVisible) {
        drawer.style.top = '-200px';
        drawerVisible = false;
    }

    // 页面切换动画
    document.querySelectorAll('.page').forEach(page => {
        const pageTop = page.offsetTop - 300;
        if (window.scrollY >= pageTop - 100) {
            page.classList.add('active');
        }
    });
});

// 抽屉导航点击处理
document.querySelectorAll('.drawer-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const target = document.querySelector(targetId);
        
        window.scrollTo({
            top: target.offsetTop - 50,
            behavior: 'smooth'
        });
    });
});

// 功能按钮事件处理
        document.querySelector('.function-card').addEventListener('click', (e) => {
            const target = e.target.closest('.function-item');
            if (!target) return;
 
            const action = target.dataset.action;
            const searchInput = document.querySelector('.search-input');
 
            switch(action) {
                case 'toggle-theme':
                    document.body.classList.toggle('dark-mode');
                    break;
                case 'focus-search':
                    searchInput.focus();
                    break;
                case 'show-alert':
                    alert('这是一个功能演示提示！');
                    break;
            }
        });
 
        // 搜索框回车事件
        document.querySelector('.search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    alert(`正在搜索：${query}`);
                    // 这里可以添加实际搜索逻辑
                }
            }
        });

// 自定义页面粒子效果（可选）
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
// 这里可以添加Canvas粒子动画代码
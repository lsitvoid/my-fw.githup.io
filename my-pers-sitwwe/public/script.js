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

// 自定义页面粒子效果（可选）
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
// 这里可以添加Canvas粒子动画代码
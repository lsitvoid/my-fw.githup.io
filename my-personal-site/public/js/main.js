let isDrawerOpen = false;
let lastScroll = 0;

// 监听鼠标滚动/触摸事件
//window.addEventListener('wheel', handleScroll, { passive: false });
//window.addEventListener('touchmove', handleScroll, { passive: false });
//在这里我给他一个网页下滑的识别指示器


//function handleScroll(e) {
    //const delta = e.deltaY || (e.touches ? e.touches[0].clientY - lastScroll : 0);
    //lastScroll = e.touches ? e.touches[0].clientY : 0;

    //if (delta > 5 && !isDrawerOpen) {
        //openDrawer();
        //e.preventDefault();
    //} else if (delta < -5 && isDrawerOpen) {
        //closeDrawer();
        //e.preventDefault();
    //}
//}

// function openDrawer() {
//     document.querySelector('.drawer-container').classList.add('active');
//     isDrawerOpen = true;
// }

// function closeDrawer() {
//     document.querySelector('.drawer-container').classList.remove('active');
//     isDrawerOpen = false;
// }

// // 点击外部关闭抽屉
// document.addEventListener('click', (e) => {
//     if (!e.target.closest('.drawer-page') && isDrawerOpen) {
//         closeDrawer();
//     }
// });

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
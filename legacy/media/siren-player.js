/* 塞壬唱片全局音乐盒 —— 左下角黑胶唱片，纯前端
 * 曲库 siren-library.json 由 scripts/update-siren.py 快照，
 * GitHub Actions 每日自动刷新保持音频签名 URL 有效。
 */
(function () {
    'use strict';

    var BASE = (function () {
        var s = document.currentScript && document.currentScript.src || '';
        return s.slice(0, s.lastIndexOf('/'));
    })();

    var css = [
        '@keyframes sp-spin{to{transform:rotate(360deg)}}',
        '@keyframes sp-in{from{opacity:0;transform:translateY(10px) scale(.97)}',
        'to{opacity:1;transform:none}}',
        /* 黑胶唱片按钮 */
        '.sp-btn{position:fixed;left:20px;bottom:20px;z-index:9999;width:54px;height:54px;',
        'border-radius:50%;border:none;cursor:pointer;padding:0;background:none;',
        'filter:drop-shadow(0 4px 14px rgba(0,0,0,.5));transition:transform .25s;}',
        '.sp-btn:hover{transform:scale(1.07);}',
        '.sp-btn:active{transform:scale(.95);}',
        '.sp-disc{width:54px;height:54px;border-radius:50%;display:block;position:relative;',
        'background:radial-gradient(circle at 35% 30%, #3a3d44 0 8%, #17181c 60%, #0a0b0e 100%);',
        'box-shadow:inset 0 0 0 1px rgba(255,255,255,.08), inset 0 0 0 14px rgba(255,255,255,.025);}',
        '.sp-disc::before{content:"";position:absolute;inset:0;border-radius:50%;',
        'background:repeating-radial-gradient(circle, transparent 0 2px, rgba(255,255,255,.02) 2px 3px);}',
        '.sp-disc::after{content:"";position:absolute;left:50%;top:50%;width:16px;height:16px;',
        'margin:-8px 0 0 -8px;border-radius:50%;',
        'background:radial-gradient(circle, #ffcf7d 0 34%, #c2571c 36%, #17181c 60%);',
        'box-shadow:0 0 0 2px rgba(255,207,125,.25);}',
        '.sp-btn.playing .sp-disc{animation:sp-spin 5s linear infinite;}',
        /* 面板 */
        '.sp-panel{position:fixed;left:20px;bottom:86px;z-index:9999;width:308px;',
        'border-radius:16px;overflow:hidden;display:none;flex-direction:column;',
        'background:rgba(17,18,22,.88);backdrop-filter:blur(18px) saturate(1.2);',
        '-webkit-backdrop-filter:blur(18px) saturate(1.2);',
        'border:1px solid rgba(255,255,255,.09);',
        'box-shadow:0 18px 50px rgba(0,0,0,.55);color:#d6d3cd;',
        "font-family:'Noto Sans CJK SC',system-ui,sans-serif;font-size:13px;",
        'animation:sp-in .28s cubic-bezier(.2,.9,.3,1);}',
        '.sp-panel.open{display:flex;}',
        /* 当前曲：大封面 + 毛玻璃叠字 */
        '.sp-now{position:relative;height:118px;flex:none;background:#1c1d22 center/cover;}',
        '.sp-now::after{content:"";position:absolute;inset:0;',
        'background:linear-gradient(rgba(17,18,22,0) 30%, rgba(17,18,22,.92));}',
        '.sp-now-txt{position:absolute;left:14px;right:14px;bottom:10px;z-index:1;}',
        '.sp-now-txt .t{font-size:15px;font-weight:600;color:#fff;',
        'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
        '.sp-now-txt .a{font-size:12px;color:rgba(255,207,125,.85);margin-top:2px;',
        'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
        '.sp-now-txt .src{float:right;font-size:10px;color:rgba(255,255,255,.35);',
        'border:1px solid rgba(255,255,255,.18);border-radius:4px;padding:1px 6px;}',
        /* 搜索 */
        '.sp-head{padding:8px 12px;border-top:1px solid rgba(255,255,255,.06);flex:none;}',
        '.sp-head input{width:100%;background:rgba(255,255,255,.07);',
        'border:1px solid rgba(255,255,255,.08);border-radius:8px;color:#d6d3cd;',
        'padding:7px 10px;font-size:12px;outline:none;transition:border-color .2s;}',
        '.sp-head input:focus{border-color:rgba(255,207,125,.55);}',
        '.sp-head input::placeholder{color:rgba(255,255,255,.3);}',
        /* 列表 */
        '.sp-list{overflow-y:auto;flex:1;min-height:120px;max-height:34vh;scrollbar-width:thin;',
        'scrollbar-color:rgba(255,207,125,.35) transparent;}',
        '.sp-item{display:flex;align-items:center;gap:10px;padding:7px 12px;cursor:pointer;}',
        '.sp-item:hover{background:rgba(255,207,125,.08);}',
        '.sp-item img{width:34px;height:34px;border-radius:7px;object-fit:cover;flex:none;',
        'background:rgba(255,255,255,.05);}',
        '.sp-item .m{min-width:0;flex:1;}',
        '.sp-item .n{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12.5px;}',
        '.sp-item .a{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;',
        'font-size:11px;color:#8a8880;margin-top:1px;}',
        '.sp-item.cur .n{color:#ffcf7d;font-weight:600;}',
        '.sp-item.cur img{box-shadow:0 0 0 2px rgba(255,207,125,.6);}',
        '.sp-empty{padding:22px 0;text-align:center;color:#8a8880;font-size:12px;}',
        /* 控制条 */
        '.sp-ctrl{display:flex;border-top:1px solid rgba(255,255,255,.07);flex:none;}',
        '.sp-ctrl button{flex:1;background:none;border:none;color:#d6d3cd;padding:11px 0;',
        'cursor:pointer;font-size:15px;transition:color .15s, background .15s;}',
        '.sp-ctrl button:hover{color:#ffcf7d;background:rgba(255,207,125,.08);}',
        '.sp-ctrl .big{font-size:19px;color:#ffcf7d;}'
    ].join('');

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.className = 'sp-btn';
    btn.title = '塞壬唱片音乐盒';
    btn.setAttribute('aria-label', '塞壬唱片音乐盒');
    btn.innerHTML = '<span class="sp-disc"></span>';

    var panel = document.createElement('div');
    panel.className = 'sp-panel';
    panel.innerHTML =
        '<div class="sp-now"><div class="sp-now-txt">' +
        '<span class="src">MSR</span><div class="t">塞壬唱片</div>' +
        '<div class="a">Monster Siren Records</div></div></div>' +
        '<div class="sp-head"><input type="search" placeholder="搜索曲名 / 作者…" aria-label="搜索曲目"></div>' +
        '<div class="sp-list" role="listbox"></div>' +
        '<div class="sp-ctrl">' +
        '<button data-act="prev" title="上一首">⏮</button>' +
        '<button data-act="toggle" title="播放/暂停" class="big">▶</button>' +
        '<button data-act="next" title="下一首">⏭</button>' +
        '<button data-act="rand" title="随机">🔀</button>' +
        '</div>';

    var audio = new Audio();
    audio.preload = 'none';
    var LIB = [], view = [], cur = -1;
    var fails = 0;                       /* 连续失败熔断计数 */
    var MAX_FAIL = 3;
    var listEl = panel.querySelector('.sp-list');
    var input = panel.querySelector('input');
    var nowBox = panel.querySelector('.sp-now');
    var nowT = panel.querySelector('.sp-now-txt .t');
    var nowA = panel.querySelector('.sp-now-txt .a');
    var toggleBtn = panel.querySelector('[data-act="toggle"]');

    function setStatus(msg) {
        listEl.innerHTML = '<div class="sp-empty">' + msg + '</div>';
    }

    fetch(BASE + '/siren-library.json')
        .then(function (r) { return r.json(); })
        .then(function (j) {
            LIB = j;
            render('');
        })
        .catch(function () { setStatus('曲库加载失败，请稍后刷新'); });

    function esc(s) {
        return String(s).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    }

    function render(q) {
        q = (q || '').trim().toLowerCase();
        view = q ? LIB.filter(function (s) {
            return s.name.toLowerCase().indexOf(q) > -1 ||
                   s.artist.toLowerCase().indexOf(q) > -1;
        }) : LIB;
        if (!view.length) { setStatus(q ? '没有匹配「' + esc(q) + '」的曲目' : '曲库为空'); return; }
        var html = '';
        for (var i = 0; i < Math.min(view.length, 60); i++) {
            var s = view[i];
            html += '<div class="sp-item" data-i="' + i + '" role="option">' +
                    (s.cov ? '<img src="' + esc(s.cov) + '" alt="" loading="lazy">' : '<img alt="">') +
                    '<span class="m"><span class="n">' + esc(s.name) +
                    '</span><br><span class="a">' + esc(s.artist) + '</span></span></div>';
        }
        listEl.innerHTML = html;
        mark();
    }

    function mark() {
        var items = listEl.querySelectorAll('.sp-item');
        for (var i = 0; i < items.length; i++) {
            items[i].classList.toggle('cur', i === cur);
        }
        var curEl = listEl.querySelector('.sp-item.cur');
        if (curEl) curEl.scrollIntoView({ block: 'nearest' });
    }

    function play(i) {
        if (!view.length) return;
        cur = ((i % view.length) + view.length) % view.length;
        var s = view[cur];
        nowBox.style.backgroundImage = s.cov ? 'url(' + s.cov + ')' : 'none';
        nowT.textContent = s.name;
        nowA.textContent = s.artist;
        mark();
        if (!s.url) { fail(); return; }
        audio.src = s.url;
        var p = audio.play();
        if (p) p.then(function () { fails = 0; }).catch(function () { fail(); });
    }

    /* 熔断：连续 MAX_FAIL 首失败即停，防止 error→next 死循环卡死页面 */
    function fail() {
        fails++;
        if (fails >= MAX_FAIL) {
            fails = 0;
            audio.removeAttribute('src');
            btn.classList.remove('playing');
            toggleBtn.textContent = '▶';
            setStatus('连续 ' + MAX_FAIL + ' 首加载失败——快照可能过期，明天会自动更新');
            return;
        }
        setTimeout(next, 50);   /* 异步跳下一首，避免同步级联 */
    }

    function next() { play(cur + 1); }
    function prev() { play(cur - 1); }
    function rand() { play(Math.floor(Math.random() * view.length)); }

    btn.addEventListener('click', function () { panel.classList.toggle('open'); });
    input.addEventListener('input', function () { render(input.value); });
    listEl.addEventListener('click', function (e) {
        var it = e.target.closest('.sp-item');
        if (it && it.dataset.i != null) { fails = 0; play(+it.dataset.i); }
    });
    panel.querySelector('.sp-ctrl').addEventListener('click', function (e) {
        var act = e.target.dataset.act;
        if (act === 'next') { fails = 0; next(); }
        else if (act === 'prev') { fails = 0; prev(); }
        else if (act === 'rand') { fails = 0; rand(); }
        else if (act === 'toggle') {
            if (audio.paused) {
                if (audio.src) audio.play();
                else rand();
            } else {
                audio.pause();
            }
        }
    });
    audio.addEventListener('play', function () {
        btn.classList.add('playing');
        toggleBtn.textContent = '⏸';
    });
    audio.addEventListener('pause', function () {
        btn.classList.remove('playing');
        toggleBtn.textContent = '▶';
    });
    audio.addEventListener('ended', function () { fails = 0; next(); });
    audio.addEventListener('error', function () {
        if (audio.src && view.length) fail();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') panel.classList.remove('open');
    });

    document.body.appendChild(panel);
    document.body.appendChild(btn);
})();

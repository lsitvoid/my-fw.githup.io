/* 塞壬唱片全局音乐盒 —— 左下角黑胶唱片，纯前端
 * 曲库 siren-library.json 由 scripts/update-siren.py 快照 + 定时刷新。
 * 新鲜度守卫：快照音频 URL 失效时，只播放本地主题曲
 * Lily of the Valley（默认 3:25 起）。
 */
(function () {
    'use strict';

    var BASE = (function () {
        var s = document.currentScript && document.currentScript.src || '';
        return s.slice(0, s.lastIndexOf('/'));
    })();

    /* 本地兜底主题曲：从 3:25 开始 */
    var LILY = { name: 'Lily of the Valley', artist: '塞壬唱片-MSR',
                 url: BASE + '/lily-of-the-valley.m4a', start: 205 };

    var css = [
        '@keyframes sp-spin{to{transform:rotate(360deg)}}',
        '@keyframes sp-in{from{opacity:0;transform:translateY(10px) scale(.97)}',
        'to{opacity:1;transform:none}}',
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
        /* 面板：半透明毛玻璃 */
        '.sp-panel{position:fixed;left:20px;bottom:86px;z-index:9999;width:300px;',
        'border-radius:16px;overflow:hidden;display:none;flex-direction:column;',
        'background:rgba(17,18,22,.45);backdrop-filter:blur(22px) saturate(1.25);',
        '-webkit-backdrop-filter:blur(22px) saturate(1.25);',
        'border:1px solid rgba(255,255,255,.12);',
        'box-shadow:0 18px 50px rgba(0,0,0,.4);color:#eeeae2;',
        "font-family:'Noto Sans CJK SC',system-ui,sans-serif;font-size:13px;",
        'animation:sp-in .28s cubic-bezier(.2,.9,.3,1);}',
        '.sp-panel.open{display:flex;}',
        '.sp-head{padding:12px 14px 8px;flex:none;display:flex;align-items:baseline;',
        'justify-content:space-between;gap:8px;}',
        '.sp-head .ttl{font-size:13px;font-weight:600;color:#ffcf7d;letter-spacing:.12em;}',
        '.sp-head .flag{font-size:10px;color:rgba(255,255,255,.45);}',
        '.sp-now{padding:0 14px 10px;flex:none;}',
        '.sp-now .t{font-size:14px;font-weight:600;color:#fff;white-space:nowrap;',
        'overflow:hidden;text-overflow:ellipsis;}',
        '.sp-now .a{font-size:11.5px;color:rgba(255,207,125,.8);margin-top:1px;}',
        '.sp-note{margin:0 14px 8px;padding:7px 10px;border-radius:8px;flex:none;display:none;',
        'background:rgba(255,207,125,.1);border:1px solid rgba(255,207,125,.25);',
        'font-size:11px;color:#ffcf7d;line-height:1.5;}',
        '.sp-head input{width:100%;background:rgba(255,255,255,.08);',
        'border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#eeeae2;',
        'padding:7px 10px;font-size:12px;outline:none;transition:border-color .2s;}',
        '.sp-head input:focus{border-color:rgba(255,207,125,.55);}',
        '.sp-head input::placeholder{color:rgba(255,255,255,.35);}',
        '.sp-list{overflow-y:auto;flex:1;min-height:120px;max-height:38vh;scrollbar-width:thin;',
        'scrollbar-color:rgba(255,207,125,.35) transparent;}',
        '.sp-item{padding:7px 14px;cursor:pointer;display:flex;justify-content:space-between;',
        'gap:10px;align-items:baseline;border-bottom:1px solid rgba(255,255,255,.045);}',
        '.sp-item:hover{background:rgba(255,207,125,.09);}',
        '.sp-item .n{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12.5px;}',
        '.sp-item .a{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;',
        'font-size:11px;color:rgba(255,255,255,.4);flex:none;max-width:40%;}',
        '.sp-item.cur .n{color:#ffcf7d;font-weight:600;}',
        '.sp-empty{padding:24px 0;text-align:center;color:rgba(255,255,255,.4);font-size:12px;}',
        '.sp-ctrl{display:flex;border-top:1px solid rgba(255,255,255,.09);flex:none;}',
        '.sp-ctrl button{flex:1;background:none;border:none;color:#eeeae2;padding:11px 0;',
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
        '<div class="sp-head"><span class="ttl">♪ 塞壬唱片</span>' +
        '<span class="flag">MSR</span></div>' +
        '<div class="sp-now"><div class="t"></div><div class="a"></div></div>' +
        '<div class="sp-note"></div>' +
        '<div class="sp-head" style="padding-top:0;">' +
        '<input type="search" placeholder="搜索曲名 / 作者…" aria-label="搜索曲目"></div>' +
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
    var fails = 0, MAX_FAIL = 3;
    var fresh = false;            /* 曲库快照 URL 是否新鲜 */
    var listEl = panel.querySelector('.sp-list');
    var input = panel.querySelector('input');
    var nowT = panel.querySelector('.sp-now .t');
    var nowA = panel.querySelector('.sp-now .a');
    var note = panel.querySelector('.sp-note');
    var toggleBtn = panel.querySelector('[data-act="toggle"]');

    /* ---------- 曲库加载与新鲜度检测 ---------- */
    fetch(BASE + '/siren-library.json')
        .then(function (r) { return r.json(); })
        .then(function (j) {
            LIB = j; view = LIB; render('');
            if (!LIB.length || !LIB[0].url) { setFallback(); return; }
            /* 首曲发探测请求：2xx 即视为整库新鲜（同批签名） */
            fetch(LIB[0].url, { method: 'GET',
                                headers: { 'Range': 'bytes=0-99' } })
                .then(function (r) {
                    if (r.ok) fresh = true; else setFallback();
                })
                .catch(setFallback);
        })
        .catch(function () { setFallback(); });

    function setFallback() {
        fresh = false;
        note.style.display = 'block';
        note.textContent = '曲库快照已过期，暂时只播放主题曲 ' + LILY.name + '，明天自动恢复。';
    }

    /* ---------- 播放核心 ---------- */
    function playTrack(url, name, artist, startAt) {
        nowT.textContent = name;
        nowA.textContent = artist;
        audio.src = url;
        if (startAt) {
            audio.addEventListener('loadedmetadata', function seek() {
                if (audio.currentTime < startAt && audio.duration > startAt) {
                    audio.currentTime = startAt;
                }
                audio.removeEventListener('loadedmetadata', seek);
            });
        }
        var p = audio.play();
        if (p) p.then(function () { fails = 0; }).catch(function () {
            /* 自动播放被浏览器拦截：等用户任意交互后重试（不静音） */
            onceInteraction(function () { audio.play().catch(function () {}); });
        });
    }

    function onceInteraction(fn) {
        function h() {
            document.removeEventListener('click', h);
            document.removeEventListener('keydown', h);
            fn();
        }
        document.addEventListener('click', h);
        document.addEventListener('keydown', h);
    }

    /* 实际选择的曲目：曲库过期 → 一律落回主题曲 */
    function pick(i) {
        if (!view.length) return;
        if (!fresh) { playLily(); return; }
        cur = ((i % view.length) + view.length) % view.length;
        var s = view[cur];
        playTrack(s.url, s.name, s.artist, 0);
        mark();
    }
    function playLily() {
        cur = -1; mark();
        playTrack(LILY.url, LILY.name, LILY.artist, LILY.start);
    }

    function fail() {
        fails++;
        if (fails >= MAX_FAIL) {
            fails = 0;
            audio.removeAttribute('src');
            btn.classList.remove('playing');
            toggleBtn.textContent = '▶';
            if (fresh) setFallback();   /* 连续失败视同快照过期 */
            playLily();
            return;
        }
        setTimeout(function () { pick(cur + 1); }, 50);
    }

    function next() { fresh ? pick(cur + 1) : playLily(); }
    function prev() { fresh ? pick(cur - 1) : playLily(); }
    function rand() { fresh ? pick(Math.floor(Math.random() * view.length)) : playLily(); }

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
        if (!view.length) {
            listEl.innerHTML = '<div class="sp-empty">' +
                (q ? '没有匹配「' + esc(q) + '」的曲目' : '曲库为空') + '</div>';
            return;
        }
        var html = '';
        for (var i = 0; i < Math.min(view.length, 60); i++) {
            html += '<div class="sp-item" data-i="' + i + '" role="option">' +
                    '<span class="n">' + esc(view[i].name) + '</span>' +
                    '<span class="a">' + esc(view[i].artist) + '</span></div>';
        }
        listEl.innerHTML = html;
        mark();
    }

    function mark() {
        var items = listEl.querySelectorAll('.sp-item');
        for (var i = 0; i < items.length; i++) {
            items[i].classList.toggle('cur', i === cur);
        }
        var el = listEl.querySelector('.sp-item.cur');
        if (el) el.scrollIntoView({ block: 'nearest' });
    }

    /* ---------- 事件 ---------- */
    btn.addEventListener('click', function () { panel.classList.toggle('open'); });
    input.addEventListener('input', function () { render(input.value); });
    listEl.addEventListener('click', function (e) {
        var it = e.target.closest('.sp-item');
        if (it && it.dataset.i != null) { fails = 0; pick(+it.dataset.i); }
    });
    panel.querySelector('.sp-ctrl').addEventListener('click', function (e) {
        var act = e.target.dataset.act;
        if (act === 'next') { fails = 0; next(); }
        else if (act === 'prev') { fails = 0; prev(); }
        else if (act === 'rand') { fails = 0; rand(); }
        else if (act === 'toggle') {
            if (audio.paused) { if (audio.src) audio.play(); else rand(); }
            else audio.pause();
        }
    });
    audio.addEventListener('play', function () {
        btn.classList.add('playing'); toggleBtn.textContent = '⏸';
    });
    audio.addEventListener('pause', function () {
        btn.classList.remove('playing'); toggleBtn.textContent = '▶';
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

    /* ---------- 打开网站默认播放主题曲（3:25 起） ---------- */
    playLily();
})();

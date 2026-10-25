/* 塞壬唱片全局音乐盒 —— 左下角悬浮，纯前端
 * 引入：<script src="…/siren-player.js"></script>
 * 曲库：与组件同目录的 siren-library.json（构建时快照自塞壬唱片 API）
 */
(function () {
    'use strict';

    var BASE = (function () {
        var s = document.currentScript && document.currentScript.src || '';
        return s.slice(0, s.lastIndexOf('/'));
    })();

    var css = [
        '.sp-btn{position:fixed;left:18px;bottom:18px;z-index:9999;width:44px;height:44px;',
        'border-radius:50%;border:1px solid rgba(255,207,125,.4);background:rgba(15,16,20,.72);',
        'color:#ffcf7d;font-size:19px;cursor:pointer;backdrop-filter:blur(8px);',
        'display:flex;align-items:center;justify-content:center;transition:transform .2s,background .2s;}',
        '.sp-btn:hover{transform:scale(1.08);background:rgba(255,207,125,.14);}',
        '.sp-btn.playing{animation:sp-pulse 2.4s ease-in-out infinite;}',
        '@keyframes sp-pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,207,125,.35)}',
        '50%{box-shadow:0 0 0 9px rgba(255,207,125,0)}}',
        '.sp-panel{position:fixed;left:18px;bottom:72px;z-index:9999;width:290px;max-height:56vh;',
        'background:rgba(15,16,20,.92);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.1);',
        'border-radius:12px;display:none;flex-direction:column;overflow:hidden;color:#d6d3cd;',
        "font-family:'Noto Sans CJK SC',system-ui,sans-serif;font-size:13px;}",
        '.sp-panel.open{display:flex;}',
        '.sp-head{padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.08);',
        'display:flex;align-items:center;gap:8px;}',
        '.sp-head b{font-size:13px;color:#ffcf7d;letter-spacing:.1em;}',
        '.sp-head input{flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);',
        'border-radius:6px;color:#d6d3cd;padding:5px 8px;font-size:12px;outline:none;}',
        '.sp-head input:focus{border-color:rgba(255,207,125,.5);}',
        '.sp-list{overflow-y:auto;flex:1;scrollbar-width:thin;}',
        '.sp-item{padding:7px 12px;cursor:pointer;display:flex;justify-content:space-between;gap:8px;',
        'border-bottom:1px solid rgba(255,255,255,.04);}',
        '.sp-item:hover{background:rgba(255,207,125,.08);}',
        '.sp-item.cur{color:#ffcf7d;}',
        '.sp-item .a{color:#8a8880;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
        '.sp-ctrl{display:flex;border-top:1px solid rgba(255,255,255,.08);}',
        '.sp-ctrl button{flex:1;background:none;border:none;color:#d6d3cd;padding:9px 0;cursor:pointer;font-size:14px;}',
        '.sp-ctrl button:hover{color:#ffcf7d;background:rgba(255,207,125,.07);}',
        '.sp-now{padding:7px 12px;font-size:11px;color:#8a8880;border-top:1px solid rgba(255,255,255,.08);',
        'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}'
    ].join('');

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.className = 'sp-btn';
    btn.title = '塞壬唱片音乐盒';
    btn.textContent = '♪';

    var panel = document.createElement('div');
    panel.className = 'sp-panel';
    panel.innerHTML =
        '<div class="sp-head"><b>♪ 塞壬唱片</b>' +
        '<input type="search" placeholder="搜索曲名 / 作者…" aria-label="搜索曲目"></div>' +
        '<div class="sp-list" role="listbox"></div>' +
        '<div class="sp-ctrl">' +
        '<button data-act="prev" title="上一首">⏮</button>' +
        '<button data-act="toggle" title="播放/暂停">▶</button>' +
        '<button data-act="next" title="下一首">⏭</button>' +
        '<button data-act="rand" title="随机一首">🎲</button>' +
        '</div>' +
        '<div class="sp-now">塞壬唱片 · Monster Siren Records</div>';

    var audio = new Audio();
    audio.preload = 'none';
    var LIB = [], view = [], cur = -1;
    var listEl = panel.querySelector('.sp-list');
    var input = panel.querySelector('input');
    var nowEl = panel.querySelector('.sp-now');
    var toggleBtn = panel.querySelector('[data-act="toggle"]');

    fetch(BASE + '/siren-library.json')
        .then(function (r) { return r.json(); })
        .then(function (j) { LIB = j; render(''); })
        .catch(function () {
            listEl.innerHTML = '<div class="sp-item">曲库加载失败</div>';
        });

    function render(q) {
        q = (q || '').trim().toLowerCase();
        view = q ? LIB.filter(function (s) {
            return s.name.toLowerCase().indexOf(q) > -1 ||
                   s.artist.toLowerCase().indexOf(q) > -1;
        }) : LIB;
        var html = '';
        for (var i = 0; i < Math.min(view.length, 80); i++) {
            var s = view[i];
            html += '<div class="sp-item" data-i="' + i + '" role="option">' +
                    '<span>' + esc(s.name) + '</span>' +
                    '<span class="a">' + esc(s.artist) + '</span></div>';
        }
        if (!view.length) html = '<div class="sp-item">没有匹配的曲目</div>';
        listEl.innerHTML = html;
        mark();
    }

    function esc(s) {
        return String(s).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    }

    function mark() {
        var items = listEl.querySelectorAll('.sp-item');
        for (var i = 0; i < items.length; i++) {
            items[i].classList.toggle('cur', i === cur);
        }
    }

    function play(i) {
        if (!view.length) return;
        cur = ((i % view.length) + view.length) % view.length;
        var s = view[cur];
        if (!s.url) { next(); return; }
        audio.src = s.url;
        audio.play().catch(function () { next(); });
        nowEl.textContent = '正在播放：' + s.name + ' · ' + s.artist;
        btn.classList.add('playing');
        toggleBtn.textContent = '⏸';
        mark();
    }

    function next() { play(cur + 1); }
    function prev() { play(cur - 1); }
    function rand() { play(Math.floor(Math.random() * view.length)); }

    btn.addEventListener('click', function () {
        panel.classList.toggle('open');
    });
    input.addEventListener('input', function () { render(input.value); });
    listEl.addEventListener('click', function (e) {
        var it = e.target.closest('.sp-item');
        if (it && it.dataset.i != null) play(+it.dataset.i);
    });
    panel.querySelector('.sp-ctrl').addEventListener('click', function (e) {
        var act = e.target.dataset.act;
        if (act === 'next') next();
        else if (act === 'prev') prev();
        else if (act === 'rand') rand();
        else if (act === 'toggle') {
            if (audio.paused) { if (audio.src) audio.play(); else rand(); }
            else { audio.pause(); toggleBtn.textContent = '▶'; btn.classList.remove('playing'); }
        }
    });
    audio.addEventListener('ended', function () { next(); });
    audio.addEventListener('error', function () { if (view.length) next(); });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') panel.classList.remove('open');
    });

    document.body.appendChild(panel);
    document.body.appendChild(btn);
})();

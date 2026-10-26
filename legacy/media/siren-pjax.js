/* 全站无缝跳转（pjax）：站内 .html 链接走 fetch 换体，
 * JS 上下文与塞壬音乐盒不销毁 —— 跨页不断播。
 * 换体失败自动回退整页跳转。
 */
(function () {
    'use strict';
    if (window.__spjax) return;
window.__spjax = true;

    window.spjaxTo = function (url) { load(url, true); };

    var PLAYER_NODES = ['.sp-btn', '.sp-panel'];

    /* 给本页原生 style 打标记，跳转时可整体替换不残留 */
    document.querySelectorAll('head style').forEach(function (s) {
        s.setAttribute('data-page', '1');
    });

    function isInternal(a) {
        if (a.target && a.target !== '_self') return false;
        if (a.hasAttribute('download')) return false;
        var h = a.getAttribute('href') || '';
        if (!h || h.charAt(0) === '#' || /^(javascript|mailto|tel):/i.test(h)) return false;
        var u = new URL(a.href, location.href);
        if (u.origin !== location.origin) return false;
        if (u.pathname === location.pathname && u.hash) return false;  /* 纯锚点 */
        var p = u.pathname.endsWith('/') ? u.pathname + 'index.html' : u.pathname;
        return /\.html?$/i.test(p);
    }

    function adoptPlayer(newBody) {
        PLAYER_NODES.forEach(function (sel) {
            var el = document.querySelector(sel);
            if (el) newBody.appendChild(el);   /* 搬运节点：闭包与 audio 均存活 */
        });
    }

    function runScripts(newBody) {
        var scripts = newBody.querySelectorAll('script');
        Array.prototype.forEach.call(scripts, function (old) {
            var src = old.getAttribute('src') || '';
            if (/siren-player\.js|siren-pjax\.js/.test(src)) {   /* 已在运行，绝不重执行 */
                old.remove();
                return;
            }
            var s = document.createElement('script');
            if (src) s.src = src;
            else s.textContent = old.textContent;
            old.parentNode.replaceChild(s, old);   /* 重建节点才会执行 */
        });
    }

    function swap(doc, url, push) {
        var newBody = doc.body;

        /* 换样式：移除上一页标记样式，搬入新一页 */
        document.querySelectorAll('head style[data-page]').forEach(function (s) { s.remove(); });
        doc.querySelectorAll('head style').forEach(function (s) {
            s.setAttribute('data-page', '1');
            document.head.appendChild(s.cloneNode(true));
        });
        document.title = doc.title;

        adoptPlayer(newBody);
        runScripts(newBody);
        document.body.replaceChildren(newBody);

        var u = new URL(url);
        if (push) history.pushState({ spjax: 1 }, '', u.href);
        window.scrollTo(0, 0);
    }

    function load(url, push) {
        fetch(url, { headers: { 'X-Requested-With': 'spjax' } })
            .then(function (r) {
                if (!r.ok) throw new Error(r.status);
                return r.text();
            })
            .then(function (t) {
                swap(new DOMParser().parseFromString(t, 'text/html'), url, push);
            })
            .catch(function () { location.href = url; });   /* 失败回退整页跳转 */
    }

    document.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var a = e.target.closest('a');
        if (a && isInternal(a)) {
            e.preventDefault();
            load(a.href, true);
        }
    });

    window.addEventListener('popstate', function () {
        load(location.href, false);
    });
})();

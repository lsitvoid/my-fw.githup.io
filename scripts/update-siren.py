#!/usr/bin/env python3
"""快照塞壬唱片全站曲库 → legacy/media/siren-library.json（含专辑封面）"""
import json, os, urllib.request

BASE = os.path.join(os.path.dirname(__file__), '..', 'legacy', 'media')

def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    return json.loads(urllib.request.urlopen(req, timeout=20).read())

def main():
    songs = get('https://monster-siren.hypergryph.com/api/songs')['data']['list']
    cov = {a['cid']: a.get('coverUrl', '')
           for a in get('https://monster-siren.hypergryph.com/api/albums')['data']}
    lib = []
    for s in songs:
        try:
            d = get(f"https://monster-siren.hypergryph.com/api/song/{s['cid']}")['data']
        except Exception:
            continue
        if not d.get('sourceUrl'):
            continue
        lib.append({
            'cid': s['cid'], 'name': d.get('name', ''),
            'artist': ','.join(d.get('artists', [])) or '塞壬唱片',
            'url': d['sourceUrl'], 'cov': cov.get(s.get('albumCid', ''), '')
        })
    out = os.path.join(BASE, 'siren-library.json')
    json.dump(lib, open(out, 'w', encoding='utf-8'), ensure_ascii=False)
    print(f'{len(lib)} songs -> {out}')

if __name__ == '__main__':
    main()

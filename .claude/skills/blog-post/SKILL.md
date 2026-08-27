---
name: blog-post
description: Create a new TENGU blog post from a client request folder (an email + photos/video that Nishimura-san sends). Handles the posts.json entry, image/video placement, browser verification, and a PR opened as samusimitar. Use whenever the user points at a request folder (e.g. `pedidos/MMDD/`, `NNNN update/`) and asks to make/apply a blog post, or asks to publish/merge one.
---

# TENGU blog post workflow

How this site's blog updates arrive, how they're built, and how they ship.

## 0. GitHub identity — do this first, every time

All git/GitHub operations in this repo MUST be attributed to **`samusimitar`**
(see `CLAUDE.md`). Before any commit / push / PR / merge:

```bash
gh auth switch --user samusimitar        # gh has multiple accounts; active one drifts
gh api user --jq .login                  # must print: samusimitar
git config user.name                     # must print: samusimitar
```

The user's personal/default account is `jbros17a`. **After the blog work is done,
restore it:** `gh auth switch --user jbros17a`. If `samusimitar` isn't among the
authenticated accounts, stop and ask — don't proceed under another login (merge/PR
attribution can't be changed retroactively).

## 1. How the user provides the data

The client (西村さん / Nishimura) drops a request folder — e.g. `pedidos/0821/`,
`0805_update/`, `0724 update/` — containing:

- **A text file** (`text.txt` or `post.txt`) — the request email, in Japanese.
- **Image files** (`.JPG`/`.jpg`), sometimes named with the intended caption
  (`③安全確認状況.JPG`) or generically (`警備講習②.JPG`). Occasionally a video (`.mp4`).

The email has a consistent shape:

```
「<title>」
更新日：令和8年M月D日      ← publication date  → posts.json `date` + `id`
日時：令和8年M月D日        ← event date        → posts.json `displayDate`
部署名：<部署>             ← department        → posts.json `participants`
<body paragraphs>          ← posts.json `description`
写真番号とコメント
<filename/label>:<caption>  ← posts.json `captions`, in order
```

**Watch for follow-up corrections.** The same text file often ends with a second
message amending the first — a date fix (`(誤)8月5日 → (正)8月3日`), a photo removal
(`(誤)警備講習① → (正)削除`), or a caption change. These override the original. Always
read the whole file.

## 2. The data model (`blog/posts.json`)

Newest post first. `blog.html` and `index.html` read only `date`/`title`;
`blog_post.html?id=<id>` renders the full entry. Fields:

| field | source / rule |
|---|---|
| `id` | `YYYYMMDD` of the **更新日** (publication date). Same digits as `date`. |
| `date` | `"YYYY/MM/DD"` of the 更新日. Drives sort order. |
| `displayDate` | The **日時** (event date) as given, e.g. `"令和8年7月23日"`. |
| `title` | The quoted title, no 「」. |
| `location` | Only if the email names a 現場/会場 (e.g. `"道内の護岸工事の現場"`). Omit otherwise. |
| `participantsLabel` | `"部署名"`. |
| `participants` | The 部署名 value (e.g. `"警備事業部"`). |
| `images` | `["img/social-gathering/<id>-1.jpg", ...]`, in order. |
| `captions` | One per image, same order. |
| `videos` / `videoCaptions` | Only when a video is provided. `videos: ["video/<id>-award.mp4"]`. `blog_post.html` renders these in a separate `#blog-videos` container. |
| `description` | Body as HTML — each paragraph wrapped in `<p>…</p>`, concatenated. |

**Conventions:**
- Copy images to `img/social-gathering/` renamed `<id>-N.jpg` (extension lowercase; content is jpeg regardless). Video to `video/` as `<id>-*.mp4`.
- Keep the client's captions when meaningful; see judgment calls below.

## 3. Judgment calls — apply the sensible fix, then flag it in the PR

The email is frequently imperfect. Fix it, but never silently — call it out in the
PR body (in Japanese) so the client can confirm. Real examples seen:

- **Copy-paste caption errors:** captions like `作業状況:表彰式` carried over from the
  previous (award) post onto construction photos. Use the photo filename / actual
  content instead.
- **Photo removals / renumbering:** when a correction drops a photo, use the survivors
  and renumber captions so they don't start at ② (e.g. keep `警備講習①/②`).
- **Company-name / factual mismatches:** if the email text contradicts what the photos
  clearly show (e.g. 麻生フォークリフト in text vs 麻生フォームクリート on the banner),
  go with the photos and flag it prominently.
- **Date corrections:** apply the corrected 日時.

Read every image (they're small) to write/verify captions and catch mismatches.

## 4. Build it

```bash
gh auth switch --user samusimitar        # §0
git fetch origin -q
git checkout -b blog-update-<id> origin/main
cp "<request>/<photo>" img/social-gathering/<id>-1.jpg   # etc.
```

Prepend the new object to `blog/posts.json`. Validate:

```bash
python3 -c "import json; p=json.load(open('blog/posts.json')); \
print(p[0]['id'], p[0]['title'], 'imgs', len(p[0]['images']), 'caps', len(p[0]['captions']))"
```

## 5. Verify in the browser (don't skip)

```bash
# reuse the server if already up on 8899, else:
python3 -m http.server 8899 >/dev/null 2>&1 &
```

Open `http://localhost:8899/blog_post.html?id=<id>` in Chrome (claude-in-chrome
skill). Confirm: title, 日時 (corrected date), 部署名, body, every photo + caption
(and video controls if present). Check console for errors (`read_console_messages`,
`onlyErrors`). The list pages fetch `blog/posts.json` too — a JSON syntax error breaks
the whole blog, so the `python3 -c` validation above is mandatory.

## 6. Commit, push, PR — as samusimitar

Commit only the post files (`blog/posts.json`, the new images/video) — leave unrelated
working-tree changes (e.g. `.gitignore`) out. Commit trailer:
`Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

Open the PR `base main`, head `blog-update-<id>`, with a **Japanese** body that lists
what changed and, under a `⚠️ 依頼内容からの調整点` heading, every judgment call from §3.
Verify `gh pr view <n> --json author` shows `samusimitar`. Then restore `jbros17a` (§0).

## 7. Optional extras (only when asked)

- **Schedule the merge** for the 更新日 midnight JST. Past posts were merged at
  `00:00 JST` of the publication date via a one-time cloud routine (`/schedule`), i.e.
  `run_once_at` = `<date>T15:00:00Z`. The merge prompt must itself switch to
  `samusimitar` and merge unconditionally. This is user-triggered — confirm timing.
- **Clean up** the request folder when asked: move it (and any stray `*_update.txt`) to
  `~/.Trash/` (reversible) rather than `rm`.
- **Response email** — a short Japanese reply from Jordi to 西村さん confirming the post
  is live / scheduled, and restating any §3 adjustment for confirmation. Template:

  ```
  西村さま
  お世話になっております。ジョルディです。
  「<title>」の記事を公開いたしました。ホームページよりご確認いただけます。
  <一言：調整点があれば「〜として掲載しております。意図と異なる場合はお知らせください。」>
  引き続きよろしくお願いいたします。
  ジョルディ
  ```

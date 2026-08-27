# CLAUDE.md

## GitHub identity (mandatory)

All GitHub and git operations in this repository must be performed as the user
**`samusimitar`**. This is non-negotiable and applies to commits, pushes, branches,
pull requests, comments, reviews, and any other `gh` action.

**Always verify before acting** — do not assume the identity is already correct:

```bash
gh auth status                # active account must be samusimitar
gh auth switch --user samusimitar   # if it is not
git config user.name          # must be samusimitar
```

If `samusimitar` is not among the authenticated `gh` accounts, stop and ask the user
to log in (`gh auth login`) rather than proceeding under a different account.

Re-check at the start of every session and again immediately before any push or PR —
`gh` has multiple accounts configured and the active one can change between sessions.

The user's personal/default account is **`jbros17a`**. After finishing
`samusimitar`-attributed work, restore it: `gh auth switch --user jbros17a`.

## Blog updates

The full workflow for turning a client request folder into a published post lives in
the **`blog-post` skill** (`.claude/skills/blog-post/SKILL.md`) — how the request emails
are structured, the `posts.json` data model, image/caption conventions, the common
judgment calls (caption copy-paste errors, date/photo corrections, name mismatches),
browser verification, and the samusimitar PR steps. Invoke it (`/blog-post`) whenever a
request folder (`pedidos/MMDD/`, `NNNN update/`) needs to become a blog post.

Quick reference: posts live in `blog/posts.json` (newest first). `blog.html` and
`index.html` read only `date` and `title`; `blog_post.html` renders the full entry.
Images go in `img/social-gathering/` named `YYYYMMDD-N.jpg`; videos in `video/`. `date`
(= `id` digits) is the publication/更新日 date and drives sort order; `displayDate` is
the Japanese-era event date (日時).

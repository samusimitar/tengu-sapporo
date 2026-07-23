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

## Blog updates

Posts live in `blog/posts.json` (newest first). `blog.html` and `index.html` only read
`date` and `title`; `blog_post.html` renders the full entry.

- Images go in `img/social-gathering/` named `YYYYMMDD-N.jpg`, referenced by `images`
  with matching `captions`.
- Videos go in `video/` and are referenced by `videos` with matching `videoCaptions`.
- `date` is the publication date (`YYYY/MM/DD`, drives sort order); `displayDate` is the
  Japanese-era date of the event itself.

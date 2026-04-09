# sam-the-man.com

Personal site of Samuel Castaneda — Engineering Manager at Bolt.

Live at [sam-the-man.com](https://sam-the-man.com).

## Stack

- Astro v6 with MDX, static output
- Tailwind CSS v4
- Full-text search via Pagefind (`⌘K` / `Ctrl+K`)
- Giscus comments

## Local development

```bash
pnpm install
pnpm run dev       # → http://localhost:4321
pnpm run build     # production build + Pagefind index
pnpm run preview   # preview the production build
```

The search index is only available after a production build. Run `pnpm run build && pnpm run preview` to test it locally.

## Content

- **Posts:** `src/data/blog/` — `.md` or `.mdx` files
- **Galleries:** `src/data/galleries/<slug>/` — one folder per album with `index.md` metadata
- **Config:** `src/config.ts`

---

Built on top of [Devosfera](https://github.com/0xdres/devosfera) (MIT License)

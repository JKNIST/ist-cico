

## Plan: Lila "Intern"-badge + ta bort [INTERNT] från titlar

### Ändringar

**1. `src/components/blog/BlogPostHeader.tsx`**
- Lägg till en lila badge (`bg-[#7C3AED] text-white`) med texten "Intern" till vänster om status-badgen
- Visas endast när `post.internalOnly === true`

**2. `src/data/blog/posts/InformationPosts.ts`**
- Ta bort `[INTERNT] ` från alla titlar (info-3 till info-8)


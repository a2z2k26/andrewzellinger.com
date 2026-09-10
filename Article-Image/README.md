# Article image inventory

Updated September 9, 2026. **13 original files, 12 distinct images: 11 assigned, 1 available.** One file is a duplicate, not an additional spare.

Andrew approved using these abstract artworks without requiring a relationship to article subject matter. Each article uses the same image in its collection card and detail view. Article order and copy are unchanged.

## Assigned images

| Article | Original file | Web copy |
| --- | --- | --- |
| The Constraint Was the Brief | [material-sculpture-set__reference-company-of-one.png](./material-sculpture-set__reference-company-of-one.png) | [the-constraint-was-the-brief.webp](../public/images/articles/the-constraint-was-the-brief.webp) |
| Intention Deficit Disorder | [material-sculpture-set-2__intention-deficit-disorder__option-2.png](./material-sculpture-set-2__intention-deficit-disorder__option-2.png) | [intention-deficit-disorder.webp](../public/images/articles/intention-deficit-disorder.webp) |
| Company of One | [material-sculpture-set-4__company-of-one__option-1.png](./material-sculpture-set-4__company-of-one__option-1.png) | [company-of-one.webp](../public/images/articles/company-of-one.webp) |
| Cut, Defer or Build | [material-sculpture-set__cut-defer-or-build__option-1.png](./material-sculpture-set__cut-defer-or-build__option-1.png) | [cut-defer-or-build.webp](../public/images/articles/cut-defer-or-build.webp) |
| Product Design Principles | [material-sculpture-set__design-principles-that-actually-shape-the-product__option-2.png](./material-sculpture-set__design-principles-that-actually-shape-the-product__option-2.png) | [design-principles-that-actually-shape-the-product.webp](../public/images/articles/design-principles-that-actually-shape-the-product.webp) |
| Embedded Product Design Lessons | [material-sculpture-set-4__embedded-product-design-lessons__option-2.png](./material-sculpture-set-4__embedded-product-design-lessons__option-2.png) | [lessons-from-fifteen-years-of-embedded-product-design.webp](../public/images/articles/lessons-from-fifteen-years-of-embedded-product-design.webp) |
| What Makes a Real MVP? | [material-sculpture-set-3__a-free-surf-lesson__option-1.png](./material-sculpture-set-3__a-free-surf-lesson__option-1.png) | [what-makes-a-real-mvp.webp](../public/images/articles/what-makes-a-real-mvp.webp) |
| You Always Let Yourself Win | [material-sculpture-set-4__you-always-let-yourself-win__option-2.png](./material-sculpture-set-4__you-always-let-yourself-win__option-2.png) | [you-always-let-yourself-win.webp](../public/images/articles/you-always-let-yourself-win.webp) |
| Two-Dollar Bill | [material-sculpture-set-4__the-two-dollar-bill__option-1.png](./material-sculpture-set-4__the-two-dollar-bill__option-1.png) | [two-dollar-bill.webp](../public/images/articles/two-dollar-bill.webp) |
| A Free Surf Lesson | [material-sculpture-set-4__a-free-surf-lesson__option-2.png](./material-sculpture-set-4__a-free-surf-lesson__option-2.png) | [a-free-surf-lesson.webp](../public/images/articles/a-free-surf-lesson.webp) |
| Showing My Teeth | [material-sculpture-set__you-always-let-yourself-win__option-2.png](./material-sculpture-set__you-always-let-yourself-win__option-2.png) | [showing-my-teeth.webp](../public/images/articles/showing-my-teeth.webp) |

## Available for future articles

This image is **not assigned or served by any current article**. Keep it for a future article:

- [two-dollar-bill__option-2.png](./two-dollar-bill__option-2.png)

## Duplicate retained, not a spare

[mixed-material-outtakes__company-of-one__option-4.png](./mixed-material-outtakes__company-of-one__option-4.png) duplicates [material-sculpture-set__reference-company-of-one.png](./material-sculpture-set__reference-company-of-one.png), which is assigned to The Constraint Was the Brief. Both original files are preserved, but only one counts toward the twelve distinct artworks.

Showing My Teeth originally used that duplicate. It now uses the previously unassigned artwork listed in the assignment table above, so all eleven articles have visually distinct images.

## Maintenance

- The authoritative mapping is [src/article-images.js](../src/article-images.js), consumed by the shared article records.
- All originals are preserved unchanged at 1536 × 1024 (3:2). Web copies keep those dimensions and composition, encoded as quality-90 WebP for lower transfer size.
- To add an article, assign one of the available files in the mapping, create its web copy, update the static listing image, and move the file from Available to Assigned here. Use the same image on the detail page and in transitions.
- Rebuild derivatives with `node scripts/prepare-article-images.mjs` (requires `cwebp`). Verify with the article-image tests, production build, and Sites packaging tests.

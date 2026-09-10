# Accepted Masthead navigation

Approved September 9, 2026 for main. Supersedes the navigation comparison lab and its five other directions.

- Desktop: persistent top Projects, Articles and History links, including detail views. Orange arrow and Back sit left aligned 16px above the large page title. Detail reading lockups are visible; collection lockups remain hidden.
- Tablet: black floating dock; details have the orange circular Close control at bottom center.
- Mobile: 68px black bottom navigation plus safe area. Detail state replaces links with white Close and a 14px orange X.
- Existing detail-return history, keyboard focus restoration, page transitions and carousel behavior are retained.

Implementation: src/site-navigation/index.js, model.js and styles.css. No concept selector, query/session variant state or reserved comparison-toolbar spacing remains.
The old gooey navigation is inactive; its pre-existing implementation remains in git-tracked source for historical regression coverage. No new alternate navigation demos are retained.

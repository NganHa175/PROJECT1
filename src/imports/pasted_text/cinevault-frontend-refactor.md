Build and restructure the complete frontend for my existing CineVault project.

IMPORTANT — EXISTING DESIGN PRESERVATION:

- This project already has a completed Home Page that I like.
- Do not replace it with a completely different design.
- Treat the existing Home Page as the main visual reference for the entire CineVault application.
- Preserve its cinematic dark theme, red accent color, typography hierarchy, card shapes, spacing, borders, gradients, and premium visual atmosphere.
- Preserve the recognizable composition of the existing Home Page:
  - Centered desktop navigation
  - Multi-row movie-poster mosaic hero
  - Large circular play element in the center
  - Centered hero headline and call-to-action
  - Category cards with four-poster collages
  - Six-card information grid
  - Two-column numbered FAQ
  - Pricing section
  - Poster-backed bottom CTA
  - Multi-column footer
- The content and functionality may be changed to match CineVault, but the current visual identity and layout should remain recognizable.
- Replace all “StreamVibe” branding with “CineVault”.
- Do not redesign the Home Page into a dashboard.
- Do not replace the poster mosaic with a generic single-backdrop Netflix hero.

TECHNICAL REQUIREMENTS:

- Use React, TypeScript, and Vite.
- Use React Router for navigation.
- Use reusable components.
- Do not place the entire application inside App.tsx or one large file.
- Do not implement a real backend.
- Use typed mock services and mock data in separate files.
- Make the interface responsive for desktop, tablet, and mobile.
- Preserve existing working dependencies whenever possible.
- Use Lucide React icons.
- Do not use emoji as interface icons.
- The same frontend must contain both the user website and the admin dashboard.
- Admin is a protected section at /admin, not a separate application.
- Do not remove existing working pages or components without replacing their functionality.
- Refactor duplicated or oversized code into reusable files.

==================================================
1. REQUIRED FRONTEND STRUCTURE
==================================================

Organize the source code approximately as follows:

src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
├── components/
│   ├── ui/
│   ├── home/
│   ├── layout/
│   ├── movie/
│   ├── trailer/
│   ├── payment/
│   ├── wallet/
│   └── feedback/
├── layouts/
│   ├── PublicLayout.tsx
│   ├── AuthLayout.tsx
│   ├── UserLayout.tsx
│   └── AdminLayout.tsx
├── features/
│   ├── auth/
│   ├── movies/
│   ├── playback/
│   ├── favorites/
│   ├── history/
│   ├── wallet/
│   ├── subscription/
│   ├── recommendations/
│   └── admin/
├── pages/
│   ├── public/
│   ├── user/
│   ├── auth/
│   └── admin/
├── services/
│   ├── apiClient.ts
│   ├── authService.ts
│   ├── movieService.ts
│   ├── recommendationService.ts
│   ├── walletService.ts
│   ├── purchaseService.ts
│   ├── subscriptionService.ts
│   └── adminService.ts
├── mocks/
│   ├── homeData.ts
│   ├── movies.ts
│   ├── users.ts
│   ├── transactions.ts
│   └── mockApi.ts
├── types/
├── hooks/
├── utils/
└── assets/

Each page and every major component must be placed in its own file.

Avoid:

- One-file implementation
- Very large page components
- Repeated movie-card code
- Hardcoded data directly inside JSX
- Duplicated user and admin components
- Unnecessary dependencies

==================================================
2. USER ROLES AND ROUTING
==================================================

Support two mocked roles:

USER
ADMIN

Create protected routes and role-based navigation.

Required routes:

Public and authentication:

- /
- /movies
- /series
- /search
- /movie/:movieId
- /series/:seriesId
- /login
- /register

Authenticated user:

- /watch/movie/:movieId
- /watch/episode/:episodeId
- /favorites
- /history
- /wallet
- /subscription
- /profile

Admin:

- /admin
- /admin/content
- /admin/movies/:movieId
- /admin/series/:seriesId
- /admin/series/:seriesId/seasons/:seasonId
- /admin/pricing
- /admin/users
- /admin/transactions

Provide a development-only mock user-state switcher for previewing:

- Logged out
- Logged-in normal user
- Active Premium user
- Admin user

Do not display this development switcher as part of the final production navigation.

==================================================
3. DESIGN SYSTEM
==================================================

Derive the application design system from the existing Home Page.

Use:

- Near-black page backgrounds
- Dark charcoal cards and navigation surfaces
- Red or crimson primary actions
- Subtle dark-red gradients
- White primary text
- Muted gray secondary text
- Rounded cards
- Thin dark borders
- Subtle shadows
-- Soft poster and backdrop overlays
- Controlled red glow effects
- Spacious desktop layouts
- Compact but readable mobile layouts

Premium may use a subtle purple accent.

Wallet may use a subtle blue or violet accent.

Do not allow these accents to overpower the main black-and-red CineVault identity.

Create reusable UI components:

- Button
- IconButton
- Input
- SearchInput
- NumberInput
- Select
- Tabs
- Badge
- Modal
- ConfirmDialog
- Drawer
- DropdownMenu
- Pagination
- Skeleton
- EmptyState
- ErrorState
- Toast
- Tooltip
- DataTable
- StatCard
- FormField
- PriceBadge
- LockBadge
- PremiumBadge
- WalletBalanceBadge

Support clear states:

- Default
- Hover
- Focus
- Selected
- Disabled
- Loading
- Success
- Warning
- Error

Use accessible labels, keyboard focus states, and sufficient color contrast.

==================================================
4. GLOBAL PUBLIC HEADER
==================================================

Preserve the current Home Page header composition and proportions.

Replace the StreamVibe branding with:

CineVault

Keep the existing cinematic red logo treatment, but make the logo and wordmark suitable for CineVault.

Update the navigation to:

- Home
- Movies
- TV Series
- Premium
- FAQ

The FAQ item should scroll to the FAQ section when the user is on the Home Page.

Keep:

- Search icon
- Notification icon
- Compact dark navigation container
- Existing active-navigation styling

Logged-out state:

- Show Sign In
- Show Create Account

Logged-in state:

- Show Wallet balance
- Show Premium badge when active
- Show notification icon
- Show user avatar dropdown

The Wallet balance should appear as a compact pill:

Wallet: 52,000 VND

Do not overcrowd the header.

On mobile:

- Use a compact header
- Add a navigation drawer
- Keep Search, Wallet, and Profile accessible

==================================================
5. EXISTING HOME PAGE
==================================================

Modify the current Home Page instead of replacing it.

The Home Page is a public cinematic landing page that introduces CineVault and provides entry points to movies, TV series, Wallet access, and Premium.

--------------------------------------------------
5.1 HERO POSTER MOSAIC
--------------------------------------------------

Preserve the existing multi-row movie-poster mosaic.

Keep:

- Multiple poster rows
- Rounded poster cards
- Dark image overlays
- Edge fading
- Bottom gradient fading into the page background
- Existing cinematic density
- Large circular play element in the center

The posters must be rendered from reusable mock data rather than repeated hardcoded markup.

The central circular play element represents:

“Watch Featured Trailer”

Behavior:

- Display a Play icon
- Add a subtle red glow on hover
- Slightly scale on hover
- Open a trailer modal when clicked
- Include an accessible label and tooltip

Do not remove or significantly redesign this central element.

--------------------------------------------------
5.2 HERO CONTENT
--------------------------------------------------

Keep the centered hero text position and approximate spacing.

Replace the heading with:

“Your Next Story Starts Here”

Supporting text:

“Discover movies and series selected for every mood. Watch free content, unlock individual titles with your CineVault Wallet, or enjoy unlimited access with Premium.”

Use two actions:

Primary:
“Explore Movies”

Secondary:
“Watch Trailer”

The primary button must preserve the existing bright-red CTA style.

The secondary button should use a dark background with a subtle border.

Do not significantly change the height or atmosphere of the existing hero.

--------------------------------------------------
5.3 CATEGORY SECTION
--------------------------------------------------

Preserve the existing category section layout.

Heading:

“Explore Movies by Category”

Description:

“Find something for every mood, from action and adventure to comedy, drama, horror, and more.”

Use categories such as:

- Action
- Adventure
- Comedy
- Drama
- Horror

Every category card should:

- Preserve the four-poster collage design
- Display the category name
- Include the existing arrow action
- Navigate to a filtered movie-list page
- Have a subtle hover interaction
- Be generated from reusable mock data

Preserve:

- Current card proportions
- Horizontal layout
- Carousel arrows
- Pagination indicator
- Dark surfaces and borders

--------------------------------------------------
5.4 AUTHENTICATED HOME SECTIONS
--------------------------------------------------

When the mock user is logged in, insert the following sections after the category section:

- Continue Watching
- Recommended for You
- Recently Unlocked

Use horizontal movie carousels matching the current CineVault card style.

Continue Watching cards must show:

- Playback progress
- Continue button
- Episode information when applicable

Recently Unlocked cards must show:

- Access status
- “Available until [date]”

Hide these sections when the user is logged out.

--------------------------------------------------
5.5 REPLACE THE DEVICE SECTION
--------------------------------------------------

The existing section about smartphones, tablets, Smart TVs, laptops, consoles, and VR headsets does not match the CineVault scope.

Preserve its current:

- Position
- Heading layout
- Description layout
- Six-card grid
- Card size
- Dark-red visual treatment
- Icon placement

Replace its content with:

Heading:

“Everything You Need for a Better Movie Night”

Description:

“CineVault combines discovery, flexible access, personal recommendations, and seamless watch progress in one cinematic experience.”

Card 1:

Title:
“Discover Movies”

Description:
“Browse trending movies, new releases, TV series, and carefully organized genres.”

Card 2:

Title:
“Flexible Unlocking”

Description:
“Unlock individual movies or episodes using your CineVault Wallet for the displayed access period.”

Card 3:

Title:
“One Premium Plan”

Description:
“Access all published locked content while your Premium subscription remains active.”

Card 4:

Title:
“Continue Watching”

Description:
“Resume movies and episodes from your latest saved playback position.”

Card 5:

Title:
“Personal Recommendations”

Description:
“Receive suggestions based on your watch history, favorites, and preferred genres.”

Card 6:

Title:
“Secure Wallet”

Description:
“View your balance and transaction history before confirming any content purchase.”

Use relevant Lucide icons.

--------------------------------------------------
5.6 FAQ SECTION
--------------------------------------------------

Preserve the current two-column numbered accordion layout.

Keep the heading:

“Frequently Asked Questions”

Use these questions and answers:

01 — What is CineVault?

“CineVault is a movie and TV-series platform where you can watch free content, temporarily unlock individual titles, or subscribe to one Premium plan.”

02 — How do I unlock a movie or episode?

“Add funds to your CineVault Wallet, select a locked title, review its price and access duration, and confirm the transaction.”

03 — How long does an individual unlock last?

“The access duration is displayed before payment and may vary by movie or episode. Your expiration date is available in your account.”

04 — What happens when my access expires?

“The content becomes locked again. Your previous transaction remains visible, and you may unlock the content again.”

05 — What does Premium include?

“Premium provides access to all published locked movies and episodes while your subscription remains active.”

06 — Can I unlock individual content without Premium?

“Yes. You can use your CineVault Wallet to unlock individual movies or episodes without subscribing.”

07 — Are completed transactions refundable?

“No. CineVault transactions are non-refundable, so the price and access duration are shown before confirmation.”

08 — How are movies recommended to me?

“Recommendations are generated from movie metadata, watch history, favorites, and the genres you interact with.”

Replace “Ask a Question” with:

“Contact Support”

The accordion must be interactive.

--------------------------------------------------
5.7 ACCESS AND PREMIUM SECTION
--------------------------------------------------

The existing three-plan subscription section does not match CineVault.

Preserve:

- The section position
- Dark pricing-card style
- Red CTA buttons
- Heading and description alignment
- Overall section width

Remove:

- Basic Plan
- Standard Plan
- Three subscription tiers
- Monthly/yearly toggle
- Free-trial buttons

Use the heading:

“Choose How You Want to Watch”

Description:

“Unlock only the content you want, or subscribe to Premium for access to all published locked titles.”

Create two large centered cards.

Card 1:

Title:
“Pay as You Watch”

Description:
“Use your CineVault Wallet to unlock individual movies or episodes for their displayed access duration.”

Benefits:

- No recurring payment
- Price shown before confirmation
- Time-limited access
- Complete transaction history
- Unlock only the content you want

Price display:

“From 3,000 VND”

Action:

“Explore Movies”

Do not call this a subscription plan.

Card 2:

Title:
“CineVault Premium”

Add a Premium badge.

Description:
“Access all published locked movies and episodes while your Premium subscription remains active.”

Benefits:

- One Premium plan
- Access to all published locked content
- Manual renewal
- Payment through CineVault Wallet
- Personalized recommendations

Use a configurable mock Premium price.

Actions:

- Get Premium
- View Benefits

--------------------------------------------------
5.8 BOTTOM CTA
--------------------------------------------------

Preserve the current poster-backed CTA banner.

Replace the free-trial content with:

Heading:

“Ready to Find Your Next Favorite?”

Description:

“Explore free titles, unlock individual movies with your Wallet, or enjoy the complete CineVault experience with Premium.”

Actions:

- Explore CineVault
- View Premium

Remove every free-trial reference.

--------------------------------------------------
5.9 FOOTER
--------------------------------------------------

Preserve the current multi-column footer structure and styling.

Replace all StreamVibe references with CineVault.

Footer groups:

Home:
- Categories
- Trending
- Popular
- New Releases

Movies:
- Genres
- Recently Added
- Recommended

TV Series:
- Genres
- Seasons
- New Episodes

Account:
- Wallet
- Favorites
- Watch History
- Premium

Support:
- FAQ
- Contact
- Terms of Use
- Privacy Policy

Keep simple social icons.

Copyright:

“© 2026 CineVault. All rights reserved.”

==================================================
6. SEARCH AND BROWSING
==================================================

Create movie and TV-series listing pages with:

- Search by title
- Genre filter
- Release-year filter
- Movie or TV-series filter
- Sort by popularity
- Sort by release date
- Responsive filter drawer on mobile
- Pagination or Load More
- Loading skeletons
- Empty search results
- API error state

Use the same dark cinematic visual language as the Home Page.

Movie cards must support:

- Free
- Locked
- Temporarily unlocked
- Premium access
- Favorite
- Continue watching

==================================================
7. LOCKED CONTENT VISUAL LANGUAGE
==================================================

A locked movie or episode card must display:

- A small lock icon
- A subtle dark overlay
- Current price
- Unlock duration when space allows

Do not hide the poster unnecessarily.

Lock icon is visible when:

- Content is locked
- User does not have active Premium
- User has no valid individual access

Lock icon is hidden when:

- Content is free
- User has active Premium
- User has valid temporary access

When access expires:

- Display the lock icon again
- Show “Unlock Again”
- Keep the previous transaction in history

==================================================
8. MOVIE DETAIL PAGE
==================================================

Create a cinematic movie detail page containing:

- Large backdrop
- Poster
- Title
- Original title
- Overview
- Genres
- Release year
- Runtime
- Director
- Cast
- Community vote
- Popularity
- Favorite button
- Trailer button
- Watch or Unlock button
- Access-status badge
- Price
- Unlock duration
- Similar Movies section

Access states:

FREE:
- Show Watch Now
- Hide lock icon

LOCKED:
- Show lock icon
- Show price
- Show access duration
- Show “Unlock for [price]”

VALID INDIVIDUAL ACCESS:
- Hide lock icon
- Show “Unlocked until [date]”
- Show Watch Now

ACTIVE PREMIUM:
- Hide lock icon
- Show “Included with Premium”
- Show Watch Now

EXPIRED ACCESS:
- Show lock icon again
- Show “Unlock Again”

Trailer behavior:

- Open a modal
- Display an embedded YouTube trailer placeholder
- Do not upload or store trailer files

==================================================
9. TV SERIES, SEASONS, AND EPISODES
==================================================

Create a TV-series detail page containing:

- Series information
- Backdrop and poster
- Trailer
- Season selector
- Episode list
- Episode number
- Episode title
- Episode thumbnail
- Duration
- Short overview
- Watch progress
- Price
- Unlock duration
- Lock status
- Watch or Unlock action

Each episode must visually support:

- Free
- Locked
- Temporarily unlocked
- Active Premium
- Expired access
- Continue watching

==================================================
10. WATCH PAGE
==================================================

Create a watch page containing:

- Responsive video-player placeholder
- Movie or episode information
- Previous-episode control
- Next-episode control
- Season and episode selector
- Watch progress
- Back-to-details action
- Related content

When access is invalid, replace the player with a locked-content panel.

The panel must display:

- Lock icon
- Content title
- Price
- Unlock duration
- Unlock button
- Premium alternative

==================================================
11. FAVORITES AND WATCH HISTORY
==================================================

Favorites page:

- Favorite movie and series grid
- Remove-from-favorites action
- Empty state

Watch History page:

- Recently watched content
- Progress bars
- Continue Watching action
- Last-watched date
- Remove-history action
- Clear-history confirmation dialog
- Empty state

==================================================
12. WALLET
==================================================

Create a complete CineVault Wallet page.

Display:

- Current balance
- Add Funds button
- Recent transactions
- Full transaction history
- Transaction filters
- Transaction-detail modal

Suggested top-up values:

- 20,000 VND
- 50,000 VND
- 100,000 VND

Optionally provide a custom top-up input.

Use a mock payment confirmation flow.

Transaction types:

- TOP_UP
- MOVIE_UNLOCK
- EPISODE_UNLOCK
- SUBSCRIPTION_PAYMENT
- ADMIN_ADJUSTMENT

Display:

- Added funds in green
- Spending in red
- Transaction status
- Related content
- Date and time
- Balance after transaction

Do not include:

- Refund
- Withdrawal
- Wallet transfer
- Multiple currencies

==================================================
13. CONTENT UNLOCK FLOW
==================================================

Create a reusable UnlockContentModal.

Display:

- Movie or episode title
- Price
- Unlock duration
- Current Wallet balance
- Remaining balance after purchase
- Non-refundable warning
- Confirm Unlock button
- Cancel button

Confirmation message:

“You are about to unlock this content for [price].
Access will remain active for [duration].
This transaction is non-refundable.”

Support:

- Sufficient balance
- Insufficient balance
- Already unlocked
- Active Premium
- Processing
- Successful purchase
- Failed purchase

When balance is insufficient:

- Disable confirmation
- Show Add Funds action

After successful mock purchase:

- Deduct the mock Wallet balance
- Create a mock transaction
- Hide the lock icon
- Display access expiration
- Enable Watch Now
- Display a success toast

==================================================
14. PREMIUM SUBSCRIPTION
==================================================

Create one Premium subscription page.

Display:

- One Premium plan
- Premium price
- Subscription duration
- Benefits
- Current subscription status
- Start date
- Expiration date
- Subscribe button
- Manual renewal button
- Wallet payment confirmation

Premium benefits:

- Access to all published locked movies
- Access to all published locked episodes
- No individual payment while Premium is active

Do not include:

- Multiple Premium plans
- Monthly/yearly plan selector
- Automatic renewal
- Free trial
- Refund

==================================================
15. RECOMMENDATIONS
==================================================

The frontend only displays recommendation results.

Create:

- Similar Movies
- Recommended for You
- Trending fallback for new users
- Genre-preference onboarding

Do not implement the real machine-learning algorithm in the frontend.

Create a typed recommendationService that currently returns mock data and can later connect to the recommendation backend.

==================================================
16. ADMIN LAYOUT
==================================================

Create a protected AdminLayout.

Include:

- Collapsible sidebar
- Dashboard
- Content
- Pricing
- Users
- Transactions
- Back to CineVault
- Admin profile menu

Use a clean dashboard structure while preserving the Home Page’s:

- Dark surfaces
- Red accent
- Rounded cards
- Typography
- Borders
- Visual hierarchy

Do not create an unrelated light admin theme.

==================================================
17. ADMIN DASHBOARD
==================================================

Create dashboard cards and charts for:

- Total users
- Active Premium users
- Total movies
- Total TV series
- Total episodes
- Total Wallet transactions
- Simulated revenue
- Most unlocked movies
- Most unlocked episodes
- Recent transactions

Use mock analytics data.

==================================================
18. ADMIN CONTENT MANAGEMENT
==================================================

Create a content-management page with:

- Movie and TV-series table
- Search
- Content-type filter
- Publication-status filter
- Access-status filter
- Import from TMDb button
- Edit action
- Publish or hide action
- Free or lock action

Publication states:

- PUBLISHED
- HIDDEN

Access states:

- FREE
- LOCKED

A hidden item must remain unavailable to users regardless of its access status or price.

==================================================
19. ADMIN PRICE PRESETS
==================================================

Create a Pricing Settings page.

The system supports a maximum of two active default price presets.

Example initial values:

- Default Price 1: 3,000 VND
- Default Price 2: 7,000 VND

Admin can:

- Create a preset
- Rename a preset
- Edit its amount
- Delete a preset
- Maintain no more than two active presets

When two active presets already exist:

- Disable Add Price Preset
- Explain that the maximum has been reached

The content-price selector contains:

- Default Price 1
- Default Price 2
- Custom Price

When Custom Price is selected:

- Show a VND amount input
- Require an amount greater than zero

When deleting a preset:

- Show a confirmation dialog
- Explain that existing content will retain its latest amount as a custom price

Previously completed transactions must retain their original price snapshots.

==================================================
20. ADMIN MOVIE EDITOR
==================================================

Create an admin movie editor with:

- Imported TMDb metadata preview
- Publication status
- Playback URL
- Trailer URL
- Free or locked access
- Price source
- Custom-price input
- Unlock duration
- Save action
- Cancel action

When LOCKED is selected, require one of:

- Default Price 1
- Default Price 2
- Custom Price

Allow unlock duration to be entered in hours or days.

Show a preview of the user-facing locked movie card.

==================================================
21. ADMIN SEASON AND EPISODE EDITOR
==================================================

Create a season-management page with:

- Season information
- Default publication status
- Default access status
- Default price selector
- Custom-price input
- Default unlock duration
- Apply to All Episodes button
- Episode table
- Add Episode button

Admin can:

- Publish or hide an episode
- Make an episode free
- Lock an episode
- Edit its price
- Edit its unlock duration
- Override season settings

When Apply to All Episodes is selected, show:

- Apply only to future episodes
- Update episodes currently inheriting season settings
- Override all episodes, including manually edited episodes

Clearly warn that the final option overwrites episode-level overrides.

Every episode row must display:

- Episode number
- Title
- Publication status
- Access status
- Price
- Unlock duration
- Setting source: Season or Override
- Edit action

New episodes must automatically inherit:

- Season access status
- Season price setting
- Season unlock duration

Admin can later override an individual episode.

==================================================
22. ADMIN USER MANAGEMENT
==================================================

Create a user-management page containing:

- User table
- Search
- Role filter
- Account-status filter
- Premium-status filter
- User-detail drawer
- Lock-account action
- Unlock-account action
- Wallet balance
- Premium expiration
- Unlock history
- Transaction history

==================================================
23. ADMIN TRANSACTION MANAGEMENT
==================================================

Create a transaction-management page containing:

- Transaction table
- Search by transaction ID
- Search by user
- Transaction-type filter
- Status filter
- Date-range filter
- Transaction-detail drawer
- User information
- Balance before transaction
- Balance after transaction
- Related movie or episode
- Paid amount
- Purchased duration

Do not include a Refund button.

Allow ADMIN_ADJUSTMENT through a separate modal.

Require:

- Increase or decrease selection
- Adjustment amount
- Reason
- Confirmation

==================================================
24. MOCK DATA AND TYPES
==================================================

Create realistic TypeScript types for:

- User
- Movie
- Series
- Season
- Episode
- Wallet
- WalletTransaction
- PricePreset
- ContentAccess
- Subscription
- Favorite
- WatchHistory
- Recommendation

Create mock records demonstrating:

- Free movie
- Locked movie
- Temporarily unlocked movie
- Expired movie access
- Active Premium user
- Non-Premium user
- Hidden content
- Series with inherited episode pricing
- Episode with a custom override
- Successful transaction
- Failed transaction
- Sufficient Wallet balance
- Insufficient Wallet balance

Do not hardcode mock data directly inside page components.

==================================================
25. FRONTEND BUSINESS RULES
==================================================

Use this conceptual access rule:

canWatch =
  content.isPublished &&
  (
    content.accessMode === "FREE" ||
    user.hasActivePremium ||
    user.hasValidContentAccess
  )

Lock icon is visible when:

- Content is locked
- User does not have active Premium
- User has no valid individual access

Lock icon is hidden when:

- Content is free
- User has active Premium
- User has a valid non-expired unlock

When access expires:

- Show the lock icon again
- Block playback
- Show Unlock Again
- Keep the previous transaction in history

Previously completed unlock transactions must retain:

- Original price
- Original duration
- Original purchase date
- Original expiration date

Changing a current price must not modify old transaction records.

==================================================
26. RESPONSIVE BEHAVIOR
==================================================

Desktop:

- Preserve the current wide poster mosaic
- Keep centered navigation
- Use multi-column layouts
- Preserve generous spacing

Tablet:

- Reduce poster density without losing the mosaic effect
- Use two-column feature cards
- Keep the hero centered
- Make tables horizontally scrollable when needed

Mobile:

- Use a compact header
- Use a navigation drawer
- Reduce the number of visible mosaic posters
- Keep the central Play element visible but smaller
- Stack pricing cards vertically
- Convert FAQ into one column
- Convert admin tables into responsive cards or scrollable tables
- Keep unlock and payment actions easy to reach

==================================================
27. OUT OF SCOPE
==================================================

Do not implement interfaces for:

- User star ratings
- User-written reviews
- Comments
- Refunds
- Purchase cancellation
- Wallet withdrawal
- Wallet transfer
- Multiple currencies
- Multiple Premium plans
- Automatic subscription renewal
- Full-season purchase
- Separate admin website
- Advertisements
- Chat
- Social-network features
- Video uploading
- Video transcoding
- CDN management
- Real machine-learning execution in the frontend

==================================================
28. DELIVERY REQUIREMENTS
==================================================

Deliver a complete navigable frontend prototype.

Requirements:

- Preserve the recognizable existing Home Page design.
- Keep the Home Page poster mosaic and central Play element.
- Replace all StreamVibe branding with CineVault.
- Update Home Page content to match CineVault’s real business model.
- All routes must work.
- Buttons must demonstrate their intended behavior using mock state.
- Accordions must open and close.
- Trailer modal must work.
- Carousels must be interactive.
- Wallet balance must update after mock transactions.
- Lock icons must update after mock unlocking.
- Expiration states must be represented.
- Price presets must support a maximum of two active options.
- Custom pricing must work.
- Season inheritance must be demonstrated.
- Episode overrides must be demonstrated.
- User and admin layouts must belong to the same application.
- Avoid placeholder-only pages.
- Avoid duplicated components.
- Avoid a one-file implementation.
- Keep services modular and ready for backend integration.
- Ensure the project runs with the existing Vite development command.

FINAL GOAL:

Keep the current CineVault Home Page visually recognizable and close to the existing design while restructuring the complete frontend into a maintainable React and TypeScript application.

The final frontend must accurately represent:

- CineVault branding
- Movie discovery
- TV series and episodes
- Free and locked content
- Lock-icon states
- Temporary content access
- CineVault Wallet
- A maximum of two default price presets
- Custom pricing
- Season-level inheritance
- Episode-level overrides
- One Premium subscription plan
- Watch history and favorites
- Content-based recommendations
- An integrated admin dashboard

Do not sacrifice the existing Home Page quality while adding the new CineVault functionality.
# The Joy Project --- Approved Website Build Specification

> **Status:** Approved mockup\
> **Purpose:** This document is the implementation source of truth for
> reproducing the approved homepage mockup as closely as possible.\
> **Design reference:** The approved mockup supplied in this
> conversation.

------------------------------------------------------------------------

## 1. Project Overview

**The Joy Project** is a university student event built around two
shared experiences:

1.  **Barbie Movie Marathon**
2.  **Charity Football Match**

The events bring university students together while raising awareness
and funds to support children with disabilities.

The website must communicate:

-   joy
-   nostalgia
-   friendship
-   inclusion
-   student culture
-   participation
-   purpose

The site is **not a donation website**.

The primary conversion is **event attendance / ticket acquisition**, not
fundraising.

------------------------------------------------------------------------

# 2. Core Creative Concept

## Hero idea

> **remember when joy was this easy?**

The site should feel like a collection of memories rather than a
conventional event or charity website.

The visual world combines:

**university culture + childhood nostalgia + scrapbook memories + modern
editorial design**

The design should feel like:

> **The coolest university event poster became a website.**

It should **not** feel like:

-   a children's website
-   a traditional NGO/charity website
-   a Barbie-branded website
-   a generic Gen-Z landing page
-   an AI-generated startup template

------------------------------------------------------------------------

# 3. Audience

## Primary audience

University students, with both male and female students represented
equally.

## Audience requirements

The website must make it immediately clear that:

### Barbie Movie Marathon

**Boys and girls are watching together.**

Barbie should not visually read as an event exclusively for girls.

### Charity Match

**Girls and boys are playing together.**

The football event should not visually communicate "boys play while
girls watch."

The overall message is:

> **Everyone is invited.**

------------------------------------------------------------------------

# 4. Primary User Journey

The homepage should follow this emotional sequence:

``` text
Curiosity
   ↓
Nostalgia
   ↓
"This looks fun"
   ↓
Discover the two events
   ↓
Understand the purpose
   ↓
Feel included
   ↓
Get a ticket
```

The website should sell the **experience first**, then reveal the deeper
purpose.

------------------------------------------------------------------------

# 5. Homepage Structure

The homepage must follow this exact order:

``` text
1. Navigation
2. Hero
3. Events Introduction
4. Two Event Cards
5. Why We're Doing This
6. Final CTA
7. Footer
```

Do not add unnecessary sections to the homepage.

------------------------------------------------------------------------

# 6. Visual Design System

## 6.1 Primary Background

Warm cream:

``` text
HEX: #F8F2E8
```

The site should never feel like a stark white corporate website.

------------------------------------------------------------------------

## 6.2 Colour Palette

### Deep Navy

``` text
HEX: #102238
```

Use for:

-   primary text
-   headings
-   navigation
-   primary buttons
-   high-contrast UI

------------------------------------------------------------------------

### Soft Pink

``` text
HEX: #F3B6C5
```

Use for:

-   Barbie event
-   hero accent
-   handwritten annotations
-   selected highlights
-   CTA decoration

Pink should be an accent, not the entire brand.

------------------------------------------------------------------------

### Muted Green

``` text
HEX: #C7D1A7
```

Use for:

-   football event
-   match-related accents
-   secondary backgrounds

------------------------------------------------------------------------

### Soft Blue

``` text
HEX: #3D78A8
```

Use for:

-   final CTA section
-   hand-drawn underlines
-   selected secondary accents

------------------------------------------------------------------------

### Paper Yellow

``` text
HEX: #F4D98B
```

Use sparingly for:

-   paper notes
-   tiny highlights
-   hand-drawn accents

------------------------------------------------------------------------

# 7. Typography

Use two contrasting type systems.

## 7.1 Primary Typeface

A clean contemporary sans-serif.

Recommended options:

-   Inter
-   DM Sans
-   Manrope

Use for:

-   navigation
-   body copy
-   event information
-   dates
-   times
-   locations
-   buttons
-   labels

------------------------------------------------------------------------

## 7.2 Personality Typeface

A handwritten typeface.

Recommended options:

-   Caveat
-   Patrick Hand
-   Kalam

Use only for:

-   handwritten notes
-   annotations
-   small personality moments
-   selected section headings
-   captions

### Critical rule

Do **not** use the handwritten typeface everywhere.

The visual contrast should be:

``` text
Modern typography = structure
Handwritten typography = personality
```

------------------------------------------------------------------------

# 8. Texture & Materials

The site should subtly resemble physical paper.

Use:

-   subtle paper grain
-   Polaroid/photo frames
-   masking tape
-   notebook paper
-   handwritten annotations
-   imperfect underlines
-   hand-drawn arrows
-   hand-drawn stars
-   occasional circles

Do not decorate every component.

The target ratio is approximately:

``` text
80–90% clean interface
10–20% handmade detail
```

The handmade details should feel discovered rather than systematically
repeated.

------------------------------------------------------------------------

# 9. Global Layout

Use a centered desktop container.

Recommended:

``` text
max-width: 1440px
width: 100%
margin: 0 auto
padding-inline: 40–64px
```

For very wide screens, prevent content from stretching excessively.

The page should retain the proportions of the approved mockup.

------------------------------------------------------------------------

# 10. Navigation

## Desktop

Left:

``` text
the joy
project
```

with a small hand-drawn pink star.

Right:

``` text
Home
About
Events
Impact
Get Involved
Get Your Ticket
```

### Active navigation

The active item receives a slightly imperfect hand-drawn underline.

Example:

``` text
Home
────
```

Do not use a standard thick CSS border.

------------------------------------------------------------------------

## Primary navigation CTA

Label:

> **Get Your Ticket**

Style:

-   deep navy background
-   warm/white text
-   slightly squared corners
-   subtle hand-drawn yellow/pink accent around it

Do not make it an oversized pill.

------------------------------------------------------------------------

## Mobile navigation

Left:

**the joy project**

Right:

menu button.

The mobile menu should contain:

-   Home
-   About
-   Events
-   Impact
-   Get Involved
-   Get Your Ticket

------------------------------------------------------------------------

# 11. HERO SECTION

## Desktop layout

Two-column composition.

Approximate ratio:

``` text
Left: 38–40%
Right: 60–62%
```

The left side contains the headline and actions.

The right side contains the large photograph and layered scrapbook
elements.

------------------------------------------------------------------------

# 12. Hero Headline

Exact copy:

> **remember\
> when joy\
> was this\
> easy?**

The headline should be very large and visually dominant.

Recommended desktop range:

``` text
font-size: 64–88px
line-height: 0.95–1.05
font-weight: 700–800
```

Scale responsively.

The headline should remain visually dominant over every other element.

------------------------------------------------------------------------

# 13. Hero Accent

Use a hand-drawn pink underline beneath the headline.

It should look:

-   imperfect
-   hand-drawn
-   slightly irregular

Do not use a perfect straight CSS border.

------------------------------------------------------------------------

# 14. Hero Annotation

Place a handwritten annotation beside the headline:

> **and yes,\
> Barbie is\
> involved.**

Include:

-   hand-drawn arrow
-   small heart

The arrow should visually point toward the Barbie photograph.

------------------------------------------------------------------------

# 15. Hero Supporting Copy

Exact direction:

> We're bringing back the things we loved growing up --- movies,
> football, friends and feel-good chaos.\
> All for a reason that matters.

Typography:

-   clean sans-serif
-   readable
-   approximately 18--20px desktop
-   generous line-height

Do not make this sound like NGO copy.

------------------------------------------------------------------------

# 16. Hero Actions

Primary:

> **JOIN THE JOY**

Secondary:

> **See the events →**

### Primary button

Pink background.

Dark navy text.

Use a slightly irregular / paper-like treatment.

Avoid excessive rounding.

### Secondary action

Plain text with a hand-drawn blue underline.

------------------------------------------------------------------------

# 17. Hero Main Photograph

The main photograph occupies most of the right side.

It should show:

-   university-age students
-   boys and girls
-   watching Barbie together
-   laughing
-   popcorn
-   casual clothing
-   genuine friendship

The scene should look candid.

It should not look like a corporate stock photo.

------------------------------------------------------------------------

## Photo composition

The photograph should be:

-   slightly rotated
-   framed like a physical print
-   layered into the page
-   allowed to overlap other objects

The image should feel like a photograph someone physically placed on a
scrapbook page.

------------------------------------------------------------------------

# 18. Hero Football Photograph

Place a smaller photograph partially overlapping the hero image.

It should show:

-   students playing football
-   boys and girls participating
-   energetic but natural interaction

This photo immediately communicates that The Joy Project is not only
about Barbie.

------------------------------------------------------------------------

# 19. Hero Memory Note

Place a notebook-paper card over the bottom area of the hero photo.

Text:

> **good friends.\
> great times.\
> bigger purpose.**

The card should resemble graph/notebook paper.

Add a small pink heart.

It should appear physically layered over the photograph.

------------------------------------------------------------------------

# 20. EVENTS INTRODUCTION

After the hero, introduce the two event experiences.

Exact copy:

> **two events.**\
> **one really\
> good reason.**

The first line should be navy.

The important phrase should use the pink accent.

Add a blue hand-drawn underline beneath the heading.

------------------------------------------------------------------------

# 21. Event Section Layout

Desktop:

``` text
┌──────────────────┬───────────────────┬───────────────────┐
│                  │                   │                   │
│ two events.      │ Barbie Card      │ Match Card        │
│ one really       │                   │                   │
│ good reason.     │                   │                   │
│                  │                   │                   │
└──────────────────┴───────────────────┴───────────────────┘
```

The heading occupies approximately 25--30% of the row.

The two cards occupy the remaining space.

------------------------------------------------------------------------

# 22. EVENT CARD --- BARBIE

## Theme

Soft pink.

## Number

``` text
01
```

Place inside a small pink label in the top-left of the image.

## Image

Students watching Barbie together.

Must visibly include:

-   boys
-   girls
-   mixed friendship groups

## Title

> **BARBIE MOVIE MARATHON**

## Supporting copy

> popcorn. pink. questionable singing.

## Metadata

Display:

``` text
Saturday, 24 May
2:00PM
Main Hall
```

Use small icons if desired, but keep them minimal.

## CTA

> **GET THE DETAILS →**

------------------------------------------------------------------------

# 23. EVENT CARD --- CHARITY MATCH

## Theme

Muted green.

## Number

``` text
02
```

Place inside a small green label.

## Image

Students actively playing football.

Must visibly include:

-   girls playing
-   boys playing
-   mixed participation

Do not use a composition where boys are playing and girls are only
watching.

## Title

> **CHARITY MATCH**

## Supporting copy

> pick your team. bring the noise.

## Metadata

Display:

``` text
Sunday, 25 May
4:00PM
Sports Field
```

## CTA

> **GET THE DETAILS →**

------------------------------------------------------------------------

# 24. Event Card Styling

Cards should feel like physical event posters rather than generic SaaS
cards.

Use:

-   small or moderate corner radius
-   image at top
-   coloured paper-like information area
-   subtle texture
-   strong title
-   handwritten subtitle
-   minimal metadata

Avoid:

-   glassmorphism
-   drop-shadow-heavy cards
-   floating UI
-   huge rounded rectangles

------------------------------------------------------------------------

# 25. WHY WE'RE DOING THIS

This section should explain the purpose of the project without becoming
emotionally manipulative.

Heading:

> **why we're doing this**

Use handwritten typography.

------------------------------------------------------------------------

## Body Copy

Use the following approved direction:

> The Joy Project exists to create moments of happiness and connection
> --- and to use those moments to support and empower children with
> disabilities.
>
> Through these events, we're raising awareness and funds to help create
> a more inclusive world where every child has the chance to thrive.

The language should remain hopeful.

------------------------------------------------------------------------

# 26. Impact Image

Place an authentic photograph beside the impact text.

The image should communicate:

-   inclusion
-   friendship
-   happiness
-   participation
-   dignity

Avoid sad or pity-based imagery.

Do not use children with disabilities as an emotional device to pressure
visitors.

The visual message should be:

> **inclusion is part of joy.**

------------------------------------------------------------------------

# 27. Impact Handwritten Note

Place a small paper note on the right side.

Text:

> **joy shared\
> is joy\
> multiplied. :)**

Use:

-   paper-yellow background
-   subtle tape
-   handwritten type
-   slight rotation

------------------------------------------------------------------------

# 28. No Donation Dashboard

Do not build:

-   donation thermometer
-   fundraising progress bar
-   amount raised counter
-   donation goal
-   donation CTA
-   donation checkout
-   "Donate Now"

The project is not using the website to ask visitors for donations.

The website's primary action is:

> **Attend the event.**

------------------------------------------------------------------------

# 29. FINAL CTA SECTION

Use a full-width blue section.

This should be the strongest colour block on the page.

------------------------------------------------------------------------

## Left Copy

Exact direction:

> **come watch.\
> come play.\
> come be part of it.**

Circle the word:

> **part**

with a hand-drawn yellow/orange line.

------------------------------------------------------------------------

## Centre Photos

Use 2--3 overlapping Polaroid-style photographs.

Suggested images:

1.  movie night
2.  football match
3.  students together

The photos should feel like real memories.

Slightly rotate each photo differently.

------------------------------------------------------------------------

## Right Copy

> **grab your ticket and\
> let's make it a day\
> to remember.**

CTA:

> **GET YOUR TICKET →**

Use a dark navy button.

Add small hand-drawn yellow accents around it.

------------------------------------------------------------------------

# 30. Footer

Keep it minimal.

Left:

> **the joy project ♡**

Centre:

``` text
Instagram
X (Twitter)
TikTok
Email
```

Right:

> **made for good times\
> and greater things.**

Add a small blue underline.

Do not add unnecessary footer columns.

------------------------------------------------------------------------

# 31. Responsive Design

## Desktop breakpoint

Recommended:

``` text
≥ 1024px
```

Maintain the full composition.

------------------------------------------------------------------------

## Tablet

Recommended:

``` text
768px–1023px
```

Adjust:

-   headline size
-   image scale
-   section gaps
-   event card widths

The event cards may remain side-by-side.

------------------------------------------------------------------------

## Mobile

Recommended:

``` text
< 768px
```

The design becomes a vertical story.

Order:

``` text
Logo
Menu
Ticket CTA

Hero headline
Hero image
Hero copy
Hero actions

Two events.
One really good reason.

Barbie event
Charity match

Why we're doing this
Impact image
Impact copy

Final CTA
Event photos

Footer
```

Do not simply scale down the desktop composition.

Recompose it intentionally.

------------------------------------------------------------------------

# 32. Mobile Hero

On mobile:

-   headline should remain large
-   image comes immediately after the headline or supporting copy
-   annotation can overlap the image
-   football image becomes a smaller layered photo
-   avoid horizontal overflow
-   preserve the scrapbook feel

Recommended headline:

``` text
48–60px
```

Adjust according to viewport.

------------------------------------------------------------------------

# 33. Mobile Event Cards

Cards become full-width.

Use:

``` text
Barbie Movie Marathon
        ↓
Charity Match
```

Each card should retain its coloured theme.

Do not compress the card content excessively.

------------------------------------------------------------------------

# 34. Motion

Motion should be subtle.

## Allowed

-   fade-in
-   slight upward movement
-   small photo parallax
-   card lift of 2--4px
-   image scale of approximately 1.01--1.03 on hover
-   underline animation

## Avoid

-   bouncing
-   spinning
-   excessive parallax
-   floating stickers
-   constant movement
-   animated backgrounds
-   flashy transitions

The website should feel calm.

------------------------------------------------------------------------

# 35. Interaction Behaviour

## Navigation

Smooth-scroll to relevant sections where applicable.

## Event cards

Clicking the event card or:

> GET THE DETAILS →

opens the event detail page or event information modal.

## Ticket CTA

Both:

> GET YOUR TICKET

and

> JOIN THE JOY

should route to the ticket / registration flow.

## Social links

Open the relevant social platform.

------------------------------------------------------------------------

# 36. Accessibility

Implement:

-   semantic HTML
-   keyboard navigation
-   visible focus states
-   sufficient colour contrast
-   alt text on all meaningful images
-   reduced-motion support
-   accessible button labels
-   proper heading hierarchy

Do not use handwritten fonts for essential information that must remain
highly legible.

------------------------------------------------------------------------

# 37. Image Requirements

Use real photography wherever possible.

## Required image categories

### Hero Barbie image

Mixed group of university students watching Barbie.

### Hero football image

Mixed group playing football.

### Barbie event card

Movie-night group.

### Match event card

Mixed football players.

### Impact image

Joyful inclusive group interaction.

### Final CTA images

Real moments from the event or intentionally captured event-style
photographs.

------------------------------------------------------------------------

# 38. Photography Direction

Photography should feel:

-   candid
-   warm
-   slightly imperfect
-   youthful
-   natural
-   social
-   documentary

Avoid:

-   corporate stock photography
-   excessive posing
-   perfect studio lighting
-   exaggerated facial expressions
-   unrealistic AI-looking people

The website should look like it was built around actual memories.

------------------------------------------------------------------------

# 39. Component Architecture

Suggested React/Next.js structure:

``` text
src/
├── app/
│   ├── page.tsx
│   ├── about/
│   ├── events/
│   ├── impact/
│   └── get-involved/
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   │
│   ├── hero/
│   │   ├── Hero.tsx
│   │   ├── HeroPhoto.tsx
│   │   └── MemoryNote.tsx
│   │
│   ├── events/
│   │   ├── EventsIntro.tsx
│   │   ├── EventCard.tsx
│   │   ├── BarbieEventCard.tsx
│   │   └── CharityMatchCard.tsx
│   │
│   ├── impact/
│   │   └── ImpactSection.tsx
│   │
│   └── ui/
│       ├── PrimaryButton.tsx
│       ├── Polaroid.tsx
│       ├── HandwrittenNote.tsx
│       └── HandDrawnUnderline.tsx
│
├── assets/
│   ├── images/
│   ├── textures/
│   └── fonts/
│
└── styles/
    └── globals.css
```

------------------------------------------------------------------------

# 40. Reusable Components

## `EventCard`

Props:

``` ts
type EventCardProps = {
  number: string
  title: string
  description: string
  image: string
  theme: "pink" | "green"
  date: string
  time: string
  location: string
  href: string
}
```

------------------------------------------------------------------------

## `Polaroid`

Props:

``` ts
type PolaroidProps = {
  image: string
  rotation?: number
  tape?: boolean
  tapeColor?: string
  caption?: string
}
```

------------------------------------------------------------------------

## `HandwrittenNote`

Props:

``` ts
type HandwrittenNoteProps = {
  text: string
  rotation?: number
  background?: "paper" | "yellow" | "pink"
}
```

------------------------------------------------------------------------

## `PrimaryButton`

Props:

``` ts
type PrimaryButtonProps = {
  label: string
  href: string
  variant?: "pink" | "navy"
}
```

------------------------------------------------------------------------

# 41. Suggested CSS Variables

``` css
:root {
  --color-cream: #F8F2E8;
  --color-navy: #102238;
  --color-pink: #F3B6C5;
  --color-green: #C7D1A7;
  --color-blue: #3D78A8;
  --color-yellow: #F4D98B;

  --font-body: "Inter", sans-serif;
  --font-hand: "Caveat", cursive;

  --container-max: 1440px;

  --radius-card: 8px;
  --radius-button: 4px;

  --section-padding-desktop: 96px;
  --section-padding-mobile: 56px;
}
```

These values are a starting implementation system; visual matching
against the approved mockup takes priority.

------------------------------------------------------------------------

# 42. Suggested Z-Index Layers

Use explicit layers for scrapbook compositions.

``` text
Base page                 z-index: 0
Background texture        z-index: 1
Content                   z-index: 2
Main photo                z-index: 3
Overlapping photo         z-index: 4
Memory note               z-index: 5
Decorative tape           z-index: 6
Hand-drawn annotations    z-index: 7
Navigation                z-index: 20
Mobile menu               z-index: 50
```

Do not create excessive stacking contexts.

------------------------------------------------------------------------

# 43. Animation Timing

Recommended:

``` css
--ease-natural: cubic-bezier(0.22, 1, 0.36, 1);
--duration-fast: 180ms;
--duration-normal: 350ms;
--duration-slow: 600ms;
```

Animations should never distract from the content.

------------------------------------------------------------------------

# 44. Design QA Checklist

Before launch, verify:

## Brand

-   [ ] The Joy Project logo is visible.
-   [ ] The site feels nostalgic.
-   [ ] The site feels modern.
-   [ ] The site does not feel childish.
-   [ ] The site does not feel like a generic charity website.

## Audience

-   [ ] Boys appear in the Barbie experience.
-   [ ] Girls appear in the football experience.
-   [ ] Both events visibly communicate mixed participation.
-   [ ] No event feels gender-exclusive.

## Hero

-   [ ] "remember when joy was this easy?" is the dominant headline.
-   [ ] Barbie annotation is present.
-   [ ] Hero Barbie photograph is prominent.
-   [ ] Football photograph overlaps the composition.
-   [ ] Memory note is present.
-   [ ] Join the Joy CTA is present.
-   [ ] See the events CTA is present.

## Events

-   [ ] Barbie is pink.
-   [ ] Football is muted green.
-   [ ] Event 01 and Event 02 labels are present.
-   [ ] Dates are visible.
-   [ ] Times are visible.
-   [ ] Locations are visible.
-   [ ] Get the Details CTA exists on both.

## Purpose

-   [ ] "why we're doing this" is present.
-   [ ] Disability inclusion is explained respectfully.
-   [ ] Impact photography communicates joy and inclusion.
-   [ ] No donation dashboard exists.
-   [ ] No Donate button exists.

## Final CTA

-   [ ] Blue section exists.
-   [ ] "come watch. come play. come be part of it." exists.
-   [ ] Event photos overlap.
-   [ ] Get Your Ticket CTA is prominent.

## Footer

-   [ ] Social links exist.
-   [ ] Email exists.
-   [ ] "made for good times and greater things." exists.

------------------------------------------------------------------------

# 45. Anti-AI Design Checklist

Before approving the final implementation, ask:

### Does every section look perfectly symmetrical?

If yes, introduce subtle asymmetry.

### Is every element decorated?

If yes, remove decoration.

### Is the handwritten font everywhere?

If yes, reduce it.

### Are there too many cards?

If yes, simplify.

### Are there excessive rounded corners?

If yes, reduce them.

### Does every image look like stock photography?

Replace with candid/event photography.

### Does the site look like a charity campaign?

Reduce emotional marketing language.

### Does it look like a Barbie fan site?

Make sure football and the broader Joy Project identity remain equally
visible.

### Does it look like a generic AI "Gen-Z" website?

Remove unnecessary gradients, floating objects, excessive doodles and
trendy UI effects.

------------------------------------------------------------------------

# 46. Final Creative Standard

The finished site should communicate this in the first few seconds:

> **This looks fun.**
>
> **I could see myself going.**
>
> **My friends would probably come too.**
>
> **And there's actually a good reason behind it.**

The site should make students want to **participate**, not feel like
they are being asked to perform charity.

The emotional equation is:

``` text
NOSTALGIA
    +
FRIENDSHIP
    +
FUN
    +
INCLUSION
    +
PURPOSE
    =
THE JOY PROJECT
```

------------------------------------------------------------------------

# 47. Approved Homepage Copy Reference

Use this copy unless content is intentionally changed later.

## Navigation

``` text
Home
About
Events
Impact
Get Involved
Get Your Ticket
```

## Hero

``` text
remember
when joy
was this
easy?
```

``` text
We're bringing back the things we loved growing up —
movies, football, friends and feel-good chaos.
All for a reason that matters.
```

``` text
and yes,
Barbie is
involved.
```

``` text
JOIN THE JOY
```

``` text
See the events →
```

## Hero note

``` text
good friends.
great times.
bigger purpose.
```

## Events intro

``` text
two events.
one really
good reason.
```

## Barbie

``` text
BARBIE MOVIE MARATHON
```

``` text
popcorn. pink. questionable singing.
```

``` text
GET THE DETAILS →
```

## Match

``` text
CHARITY MATCH
```

``` text
pick your team. bring the noise.
```

``` text
GET THE DETAILS →
```

## Impact

``` text
why we're doing this
```

``` text
The Joy Project exists to create moments of happiness
and connection — and to use those moments to support
and empower children with disabilities.

Through these events, we're raising awareness and funds
to help create a more inclusive world where every child
has the chance to thrive.
```

## Impact note

``` text
joy shared
is joy
multiplied. :)
```

## Final CTA

``` text
come watch.
come play.
come be part of it.
```

``` text
grab your ticket and
let's make it a day
to remember.
```

``` text
GET YOUR TICKET →
```

## Footer

``` text
the joy project ♡
```

``` text
Instagram
X (Twitter)
TikTok
Email
```

``` text
made for good times
and greater things.
```

------------------------------------------------------------------------

# 48. Definition of Done

The homepage is considered complete when:

1.  It follows the approved visual hierarchy.
2.  It reproduces the approved section order.
3.  The hero composition closely matches the approved mockup.
4.  The Barbie event visibly includes boys and girls.
5.  The football match visibly includes girls and boys.
6.  The colour system is consistent.
7.  Typography follows the clean + handwritten contrast.
8.  Scrapbook elements are restrained.
9.  Photography feels authentic.
10. The site is responsive.
11. Navigation works.
12. Ticket CTAs work.
13. Event detail links work.
14. Accessibility requirements are met.
15. No donation CTA or donation dashboard has been introduced.
16. The final result feels like a real university event rather than an
    AI-generated landing page.

------------------------------------------------------------------------

## Final Design Principle

> **Make it feel like a memory, not a marketing campaign.**

The website should feel as though students gathered their favourite
photographs, scribbled their favourite memories onto paper, pinned
everything to a wall, and somehow turned that wall into a beautiful
digital experience.

That is **The Joy Project**.

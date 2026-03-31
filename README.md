# ⌬ Dor Mandel | Profile ⏣

A personal profile page built with **HTML, CSS, and JavaScript**.

The goal is to create a profile page that introduces who I am, what I do, and how to contact me, while also showing a tryout in HTML architecture language with visual style based on **glass panels**, a personal wallpaper background, and interactive UI elements.

---

## ✨ Main Idea

This page is a personal landing page / profile page.

It presents:
- my name and role
- a short personal bio
- quick actions like GitHub, CV, and contact
- a contact popup with multiple ways to reach me
- a live date/time display
- a settings panel ( that save the preferences )
- a location preview popup (using in-frame Google maps)

---
## Current Structure Note

This project currently uses a single `index.html` file that contains:

- HTML
- CSS
- JavaScript

all together in one place.

### Why this approach was chosen
At this stage, keeping everything in one file makes learning, testing, and iterating faster.

### Tradeoff
This is easier for early development, but less modular for long-term growth.

### Future direction
Later, the project may be split into:
- `index.html`
- `style.css`
- `script.js`

for better structure and maintainability.

##  JavaScript Behaviors

### What they do
JavaScript is used here for:
- opening / closing the contact popup
- opening / closing the settings panel
- opening / closing the location modal
- copying the Discord username
- updating the date and time every second
- updating the glass opacity from the slider

### Why it was chosen
These behaviors make the page feel interactive and alive, while still staying lightweight.

---

# 🎨 Color Palette

The page uses a cool dark palette with glass-style transparency.

## Main colors used

### Text
- `#f4f7ff` → main bright text
- `#c8d3ea` → softer secondary text

### Accent
- `#79b8ff` → blue accent for highlights and identity

### Status
- `#7cffb2` → green indicator for the status chip

### Background overlay
- `rgba(6, 10, 20, 0.52)` → dark overlay above the wallpaper

### Glass panels
- `rgba(255, 255, 255, 0.08)` → light transparency layer
- `rgba(255, 255, 255, 0.14)` → stronger glass layer

### Popup / modal panels
- `rgba(14, 22, 38, 0.92)` → dark popup background

## Why this palette was chosen
This palette gives the page:
- readability
- a tech / modern feeling
- strong contrast
- a premium dark aesthetic

The blue tones match the overall visual direction and also fit the profile image and wallpaper style.

---

# 🧩 Simple Term Explanations

## HTML
HTML is the structure of the page.  
It tells the browser what exists on the page.

Examples:
- titles
- paragraphs
- buttons
- images
- sections

## CSS
CSS controls how the page looks.

Examples:
- colors
- spacing
- borders
- layout
- transparency
- hover effects

## JavaScript
JavaScript adds behavior.

Examples:
- opening popups
- updating time
- copying text
- reacting to button clicks

## Modal
A modal is a popup window shown above the page content.

## Tooltip / Popup
A small floating box that appears for actions or extra information.

## Glass Effect
A design style that uses:
- transparency
- blur
- soft borders
- layered light

to create a frosted-glass look.

## Responsive Design
A page that adjusts better to different screen sizes like desktop and mobile.

---

# 🧠 Why the Page Was Built This Way

This page was designed with a few goals in mind:

- keep the first screen clear and strong
- show useful information quickly
- keep the design personal, not generic
- make interaction compact instead of noisy
- add features gradually in a modular way

The page is intentionally split into modules so it is easier to:
- understand
- explain
- improve later
- maintain over time

---

# 🚀 Current Features

- personal wallpaper background
- profile image
- name + role
- bio section
- live date and time
- GitHub button
- CV button
- interactive contact popup
- Gmail / mail app email options
- phone / WhatsApp actions
- Discord username copy
- location modal with Google Maps
- settings panel
- live glass opacity control

---

# 🔮 Future Ideas

Planned ideas for later versions may include:
- dark / light mode toggle
- improved icons
- shine hover animation
- project cards
- music / Spotify section
- easter eggs
- accessibility controls
- animations on scroll
- custom logo / SVG signature

---

# 📁 Project Structure

```text
project-folder/
│
├── index.html
│
├── images/
│   ├── wpbg.png
│   ├── profile_pic.jpg
│   └── cv.pdf
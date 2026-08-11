<<<<<<< HEAD
# Nellie Cordova's Portfolio Website

🔗 [Visit My Portfolio](https://cordovank.github.io/)

A personal portfolio website designed to present my background, projects, and technical focus in a clear, professional way — with a lightweight **chat assistant** to quickly explore my experience.

Rather than treating the site as only a static profile page, I designed it as a **static frontend with a secure backend boundary** for chat. This keeps the portfolio fast and simple to browse while also supporting an interactive way to learn about my work.

This project shows how I think about integrating AI features into real applications without overengineering the user-facing layer.
=======
# Nellie Cordova’s Portfolio Website

🔗 [Visit My Portfolio](https://cordovank.github.io/)

A personal portfolio website designed to present my background, projects, and technical focus in a clear, professional way — with a lightweight **chat assistant** that helps recruiters, hiring managers, and clients quickly explore my experience.

Rather than treating the site as only a static profile page, I designed it as a **static frontend with a secure backend boundary** for chat. This keeps the portfolio fast and simple to browse while also supporting an interactive way to learn about my work.

## Overview

The portfolio is built to showcase more than project screenshots or resume bullets. It gives visitors a structured view of:

* who I am and what I build
* selected technical projects and systems work
* applied AI/ML, backend, and system-design strengths
* an interactive chat experience for portfolio Q&A

The chat feature is intentionally designed so the browser handles only the **UI and local conversation flow**, while retrieval and model access stay outside the frontend. This keeps the experience cleaner, safer, and easier to maintain.
>>>>>>> master

## Design Highlights

* **Static-first portfolio:** hosted simply through GitHub Pages for fast, lightweight delivery
* **Thin frontend:** the site focuses on presentation, navigation, and chat interaction
* **Secure chat boundary:** LLM/provider access and retrieval logic are kept out of the browser
* **Retrieval-backed responses:** the assistant uses relevant portfolio content rather than relying on a single hardcoded prompt
* **Clear separation of responsibilities:** frontend, worker, and portfolio knowledge artifacts each serve a distinct role

## High-Level Architecture

`Visitor → GitHub Pages portfolio frontend → chat widget → backend worker → portfolio knowledge store → LLM provider`

<<<<<<< HEAD
=======
## Why this project matters

This project reflects the way I like to build systems: with **clear boundaries, practical deployment decisions, and maintainable architecture**. It also shows how I think about integrating AI features into real applications without overengineering the user-facing layer.

For a recruiter or client, the portfolio is meant to be both:

* a **professional introduction**
* a **small but meaningful example** of how I approach interactive, AI-enabled product design

>>>>>>> master
## Tech Stack

* **GitHub Pages**
* **HTML**
* **CSS**
* **JavaScript**
* **Chat widget integration**
* **HTTP fetch API**
* **Static portfolio knowledge artifacts**

## Setup and Deployment
<<<<<<< HEAD
This website is designed to be hosted on GitHub Pages:
=======

This site is designed to be hosted on GitHub Pages:
>>>>>>> master

1. Fork this repository
2. Enable GitHub Pages in your repository settings
3. The site will be available at `https://cordovank.github.io/`

For local development:

1. Clone the repository
<<<<<<< HEAD
2. Open `index.html` in your browser
=======
2. Open `index.html` in your browser
>>>>>>> master

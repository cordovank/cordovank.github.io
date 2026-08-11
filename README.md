# Nellie Cordova's Portfolio Website

🔗 [Visit My Portfolio](https://cordovank.github.io/)

A personal portfolio website designed to present my background, projects, and technical focus in a clear, professional way — with a lightweight **chat assistant** to quickly explore my experience.

Rather than treating the site as only a static profile page, I designed it as a **static frontend with a secure backend boundary** for chat. This keeps the portfolio fast and simple to browse while also supporting an interactive way to learn about my work.

This project shows how I think about integrating AI features into real applications without overengineering the user-facing layer.

The chat feature is intentionally designed so the browser handles only the **UI and local conversation flow**, while retrieval and model access stay outside the frontend. This keeps the experience cleaner, safer, and easier to maintain.

## Design Highlights

* **Static-first portfolio:** hosted simply through GitHub Pages for fast, lightweight delivery
* **Thin frontend:** the site focuses on presentation, navigation, and chat interaction
* **Secure chat boundary:** LLM/provider access and retrieval logic are kept out of the browser
* **Retrieval-backed responses:** the assistant uses relevant portfolio content rather than relying on a single hardcoded prompt
* **Clear separation of responsibilities:** frontend, worker, and portfolio knowledge artifacts each serve a distinct role

## High-Level Architecture

`Visitor → GitHub Pages portfolio frontend → chat widget → backend worker → portfolio knowledge store → LLM provider`

## Tech Stack

* **GitHub Pages**
* **HTML**
* **CSS**
* **JavaScript**
* **Chat widget integration**
* **HTTP fetch API**
* **Static portfolio knowledge artifacts**

## Setup and Deployment

This site is designed to be hosted on GitHub Pages:

1. Fork this repository
2. Enable GitHub Pages in your repository settings
3. The site will be available at `https://cordovank.github.io/`

For local development:

1. Clone the repository
2. Open `index.html` in your browser

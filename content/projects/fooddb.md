---
id: project_fooddb
label: FoodDB
section: projects
tags: [sqlite, streamlit, typer, regex, ocr, tesseract, ollama vision, service layer, local-first]
---
FoodDB is a local-first nutrition facts catalog project designed around a shared service layer. It combines a SQLite backend, a Typer CLI, and a Streamlit UI so that multiple interfaces rely on the same core logic instead of duplicating functionality. That design makes the project a good example of separation between application logic and presentation layers.

The system also includes a regex parser and swappable OCR backends. Depending on the setup, it can use either Tesseract or an Ollama vision model, which makes it flexible for experimenting with different extraction paths while keeping the rest of the application stable. This is useful for handling nutrition label data where text quality and format can vary.

FoodDB is a strong portfolio piece for discussing practical software design choices: local-first architecture, shared services, structured storage, and pluggable OCR components. It highlights engineering judgment more than model novelty, which is part of what makes it valuable.
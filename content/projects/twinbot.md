---
id: project_twinbot
label: TwinBot
section: projects
tags: [chatbot, retrieval, resume assistant, streamlit, grounded answering, personal knowledge]
---
TwinBot is an interactive resume-style assistant that answers questions about Nellie’s background using only provided source context. It was built as a grounded chatbot rather than an open-ended persona bot, which means the system is instructed to avoid invention and respond only from the available resume and profile materials.

The project is relevant because it explores the same core reliability problem that appears in many RAG-style systems: how to keep responses useful without letting the model drift into unsupported claims. TwinBot uses a context-grounded prompt construction pattern and provides a practical example of building a small, personal assistant around fixed source documents.

It also serves as a conceptual bridge to the portfolio assistant. TwinBot demonstrates how to structure a context-bound assistant, while the portfolio chat extends that idea into chunked retrieval, better source management, and a more maintainable frontend-to-worker architecture. It is a useful “earlier evolution” project in the portfolio story./
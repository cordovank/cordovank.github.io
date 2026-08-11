---
id: project_productlens
label: ProductLens
section: projects
tags: [agentic workflow, product comparison, openai agents sdk, gradio, orchestration, recommendation]
---
ProductLens is an LLM-driven product comparison system built around an agentic workflow. A user provides a buying goal and priorities, and the system compares options, ranks trade-offs, and explains the recommendation in terms of those stated preferences. Rather than acting like a generic chatbot, it is structured around a focused comparison task.

The project is useful for showcasing lightweight orchestration. It demonstrates planning, product research, and comparison as distinct steps instead of one large undifferentiated prompt. That makes the reasoning process easier to inspect and lets the system produce more structured decision support. A Gradio UI provides an accessible front end for trying the workflow interactively.

ProductLens is best discussed as an example of practical agentic design: use an LLM where judgment and synthesis help, but keep the workflow constrained around explicit user priorities and explainable outputs. It shows Nellie’s interest in making LLM systems task-oriented rather than purely conversational.
---
id: project_jobpostprofiler
label: JobPostProfiler
section: projects
tags: [agents, pydantic, extraction, schema-first, structured output, quality audit, no hallucination]
---
JobPostProfiler is a schema-first extraction pipeline for turning a job posting into structured, reviewable output. A user can provide a job post as raw text or a URL, and the system normalizes the input, extracts fields into a strict Pydantic schema, and then generates a QA-style audit report over the extracted result.

The project emphasizes controlled information extraction rather than freeform summarization. Its no-hallucination policy means missing information is left null or marked with warnings instead of guessed. That makes the system more useful for downstream workflows such as job analysis, comparison, and application planning, where false detail is worse than incomplete detail.

This project demonstrates a style Nellie values strongly in agentic and LLM systems: use the model for the narrow part it is good at, constrain output with structure, and keep the rest of the pipeline deterministic and inspectable. It is a strong example of schema-driven LLM integration using Python and Pydantic.
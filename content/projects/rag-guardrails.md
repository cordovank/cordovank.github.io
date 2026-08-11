---
id: project_rag_guardrails
label: RAG System with Guardrails
section: projects
tags: [rag, guardrails, bm25, faiss, rrf, mmr, citations, fastapi, retrieval]
---
RAG System with Guardrails is the earlier, more monolithic retrieval-augmented generation project that directly preceded Modular RAG. It combines BM25 and FAISS for hybrid retrieval, then improves result ordering with reciprocal rank fusion and MMR reranking before generating grounded answers. The system also emphasizes citation-aware answering, helping responses stay tied to source evidence instead of drifting into unsupported claims.

This project is important in the portfolio because it shows the architectural evolution of Nellie’s retrieval work. It solved the right core problems, but in a tighter and less modular structure. Working through its limitations led to the later Modular RAG design, where retrieval components, ranking logic, and evaluation concerns were separated more explicitly.

It is best described as the first serious RAG system in the portfolio: technically solid, grounded in retrieval and guardrails, and directly responsible for the design lessons that shaped the more mature follow-on framework.
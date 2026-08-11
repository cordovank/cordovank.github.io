---
id: project_modular_rag
label: Modular RAG
section: projects
tags: [rag, retrieval, hybrid retrieval, bm25, faiss, rrf, mmr, fastapi, evaluation, observability]
---
Modular RAG is the strongest and most architecturally mature project in the portfolio. It is a flow-based RAG framework designed around explicit component wiring rather than hidden framework magic. Retrieval backends are pluggable and include BM25, FAISS, and hybrid retrieval, with ranking improvements from reciprocal rank fusion and MMR reranking.

The system emphasizes inspectability and vendor isolation: components are deliberately separated so that retrieval, ranking, and answer generation can be tested and evolved independently. It also includes observability-first thinking, making it easier to debug the retrieval pipeline and reason about why a result was returned.

A major strength of the project is that it includes a retrieval evaluation framework, using metrics such as Hits@k, MRR, and NDCG rather than relying only on anecdotal outputs. Built with FastAPI, this project best represents Nellie’s approach to ML systems engineering: explicit control flow, measurable performance, and architecture designed for extension rather than a one-off demo.
---
id: "arxivhero"
title: "ArxivHero Personalized Research-Digest Pipeline"
period: "2024–Present"
organization: "Personal project"
delivery: "Automated LLM information-retrieval pipeline"
projectType: "code-opensource"
summary: "Built a daily research-digest workflow that retrieves new arXiv papers, ranks them for a user-defined research profile, summarizes them with an LLM, and publishes a static HTML digest."
topics: ["LLMs", "Information Retrieval", "NLP", "Topic Modeling", "Embeddings", "Automation"]
skills: ["LLM", "Semantic search", "Batch Agent", "Topic modeling", "Langchain"]
links:
  - label: "Project write-up"
    url: "https://mylonasc.netlify.app/post/arxiv-hero/"
  - label: "GitHub repository"
    url: "https://github.com/mylonasc/arxiv_llm_assistant"
media:
  - type: "image"
    src: "assets/arxivhero.svg"
    alt: "ArxivHero Personalized Research-Digest Pipeline concept diagram"
---

## Context

Keeping up with research (and in particular LLM/agentic AI/ML research!) requires filtering a large volume of new papers, and generic newsletters cannot reflect the reader’s exact background, interests, or desired level of explanation.

## Contribution

- Designed a staged retrieval pipeline combining arXiv queries, classical topic modeling, topic filtering, and embedding-based similarity re-ranking.
- Encoded user intent and domain focus into configurable summarization prompts rather than relying on one generic paper summary.
- Automated generation and publication of a daily HTML digest with individual paper summaries and a top-level synthesis.

## Outcome

The system turns a broad feed of recent papers into a small, personalized reading queue and demonstrates an end-to-end blend of retrieval, ranking, LLM summarization, and automated publishing. This system helped me stay up-to-date with research the last few years by discovering many interesting preprints.

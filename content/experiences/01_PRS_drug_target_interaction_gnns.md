---
id: "drug-target-interaction-gnns"
title: "Drug–Target Interaction Knowledge-Graph Learning"
period: "2025"
organization: "Personal project"
delivery: "Experimental graph-learning notebook (work in progress)"
projectType: "personal"
summary: "Developed a graph-learning pipeline for drug–target interaction prediction, including DrugBank preprocessing, neighborhood sampling, negative sampling, and transductive edge prediction."
topics: ["Knowledge Graphs", "Drug Discovery", "Graph Neural Networks", "Link Prediction", "Representation Learning"]
skills: ["Knowledge-graph modeling", "Graph sampling", "Hard negative sampling","GNNs"]
links:
  - label: "Project write-up"
    url: "https://mylonasc.netlify.app/post/drug-discovery/"
  - label: "GitHub repository"
    url: "https://github.com/mylonasc/drug-target-interaction-gnns"
media:
  - type: "image"
    src: "assets/drug-target-interaction-gnns.svg"
    alt: "Drug–Target Interaction Knowledge-Graph Learning concept diagram"
---

## Context

Drug–target interaction data naturally forms a heterogeneous graph, but efficient training requires careful preprocessing, neighborhood construction, relation handling, and generation of informative negative examples.

## Contribution

- Implemented cleanup and preprocessing for DrugBank-derived interaction data.
- Created samplers for drug and target neighborhoods and an efficient graph-tuple construction workflow.
- Designed an efficient derangement-based negative-edge sampling strategy that reuses loaded embeddings and avoids unnecessary GPU expansion.
- Trained a transductive edge-prediction model and completed initial qualitative validation, while explicitly documenting the remaining inductive and quantitative validation work.

## Outcome

The project established a functioning experimental pipeline and demonstrates practical graph-learning skills while clearly distinguishing completed components from planned validation. I'm in the process of refactoring it for the newer tf-gnns library, and use openly accessible KGs for reproducibility.

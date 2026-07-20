---
id: "modulai-graph-ml-fraud-detection"
title: "Modulai Graph ML Fraud Detection"
period: "Client engagement"
organization: "Modulai"
delivery: "Graph-feature methodology and fraud-model training pipeline"
projectType: "ML and agentic consulting"
summary: "Helped a peer-to-peer payments client evaluate and implement graph ML features for fraud detection, improving PR-AUC and reducing false positives at fixed recall."
topics: ["Fraud Detection", "Graph Machine Learning", "Payments", "Feature Engineering", "Risk Modeling", "Large-scale Transactions"]
skills: ["Graph feature engineering", "Spectral graph methods", "PageRank", "Centrality features", "Feature selection", "Model training pipelines", "Temporal graph construction", "Precision-recall evaluation", "Client knowledge transfer","Hard negative sampling]
media:
  - type: "image"
    src: "assets/modulai-graph-ml-fraud-detection.svg"
    alt: "Modulai Graph ML Fraud Detection concept diagram"
---

## Context

Fraud in peer-to-peer payments is strongly relational: suspicious behavior can emerge from transaction neighborhoods, account interactions, and evolving graph structure rather than only from account-level or transaction-level features.

The client already had expert-driven feature extraction in production, so the engagement needed to assess graph ML techniques pragmatically, deliver useful signals quickly, and avoid approaches that would not scale to the available transaction volume.

## Contribution

- Evaluated graph ML options against delivery time, technology constraints, existing codebase constraints, and the need to de-risk whether there was useful signal in the transaction graph.
- Implemented graph-feature extraction over a payments graph serving roughly 35M users and 2B transactions per year, with train/validation/test windows built from millions of transactions.
- Added classic graph and spectral features such as PageRank and centrality measures as extensions to the client's existing fraud-feature set.
- Built a feature-selection and training pipeline that was essential for improving over the pre-existing expert-engineered features.
- Transferred knowledge on graph deep learning trade-offs, temporal graph generation, and practical feature extraction choices for fraud-detection workflows.

## Outcome

The graph-feature methodology improved the client's existing fraud-detection baseline, delivering a 2.3% PR-AUC improvement and a 7% false-positive reduction at 50% recall.

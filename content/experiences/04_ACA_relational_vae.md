---
id: "relational-vae"
title: "Relational VAE for Graph-Structured Uncertainty"
period: "2021"
organization: "ETH Zurich"
delivery: "Research model, paper, code, and datasets"
projectType: "academic work"
summary: "Proposed a variational graph-network model with graph-structured latent and conditioning variables for probabilistic modeling of relational data."
topics: ["Variational Autoencoders", "Graph Neural Networks", "Bayesian Deep Learning", "Wind Energy", "Meta-Learning"]
skills: ["VAE","Deep Learning", "Graph generative models", "GNNs", "Meta-learning", "TensorFlow", "Wind Energy", "Research communication"]
links:
  - label: "Project page"
    url: "https://mylonasc.netlify.app/publication/rvae_2021/"
  - label: "Paper"
    url: "https://arxiv.org/abs/2106.16049"
media:
  - type: "image"
    src: "assets/relational-vae.svg"
    alt: "Relational VAE for Graph-Structured Uncertainty concept diagram"
---

## Context

Wind-farm monitoring and other relational systems contain uncertainty not only in individual entities but also in interactions, which standard vector-valued latent-variable models do not represent naturally.

## Contribution

- Extended Graph Networks with Variational Bayes using graph-structured latent and conditioning variables.
- Connected the formulation to Neural Processes and relational meta-learning.
- Evaluated structured density modeling on simulated and real wind-farm monitoring data and on simulated Gaussian-process tasks.
- Released source code and simulated datasets to support reproducibility.

## Outcome

The work established a flexible probabilistic model for attributed directed graphs and demonstrated how relational inductive bias can be combined with latent-variable uncertainty.

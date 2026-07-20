---
id: "causal-graphnets-rul"
title: "Remaining Useful Life Estimation with Causal GraphNets"
period: "2021"
organization: "ETH Zurich"
delivery: "Peer-reviewed predictive-maintenance model"
projectType: "academic work"
summary: "Designed a causal GraphNet architecture for remaining-useful-life estimation that removes the sequential bottleneck of conventional irregular time-series models."
topics: ["Remaining Useful Life", "Graph Neural Networks", "Time Series", "Predictive Maintenance", "TensorFlow"]
skills: ["Irregular time-series modeling", "GNN", "Remaining-useful-life estimation", "LSTM","CNN","TensorFlow", "Predictive maintenance","Deep Learning"]
links:
  - label: "Project page"
    url: "https://mylonasc.netlify.app/publication/mylonas-2021-rul/"
  - label: "Paper"
    url: "https://doi.org/10.3390/s21196325"
media:
  - type: "image"
    src: "assets/causal-graphnets-rul.svg"
    alt: "Remaining Useful Life Estimation with Causal GraphNets concept diagram"
---

## Context

Many engineered systems produce irregular multivariate histories, but strictly sequential models can become a computational and representational bottleneck when long-range causal dependencies matter.
One such case is the monitoring and remaining useful life prediction of components subject to fatigue.

## Contribution

- Recast irregular time-series histories as causally connected graphs.
- Used message passing (GNNs) to model temporal dependencies without relying solely on step-by-step recurrent processing.
- Created a simulated stochastic degradation process for validation.
- Combined CNNs for extracting features from high sampling rate timeseries (e.g., ball bearing accelerometers). 
- Applied the architecture to remaining-useful-life estimation under uncertainty.
- Compared with temporal CNNs + LSTMs (with time-parametrized edges).

## Outcome

The project demonstrated a graph-based architecture for predictive maintenance that preserves causal temporal structure while enabling more flexible computation over irregular observations.

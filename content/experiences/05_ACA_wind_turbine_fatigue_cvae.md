---
id: "wind-turbine-fatigue-cvae"
title: "Probabilistic Wind-Turbine Blade Fatigue Estimation"
period: "2021"
organization: "ETH Zurich / Wind Energy"
delivery: "Peer-reviewed probabilistic monitoring method"
projectType: "academic work"
summary: "Applied conditional variational autoencoders to estimate distributions of wind-turbine blade fatigue from SCADA data rather than relying on deterministic point estimates."
topics: ["Wind Energy", "Conditional VAEs", "SCADA", "Predictive Maintenance", "Uncertainty Quantification"]
skills: ["Conditional variational autoencoders", "Probabilistic regression", "SCADA", "Fatigue-load estimation", "Latent-variable modeling"]
links:
  - label: "Project page"
    url: "https://mylonasc.netlify.app/publication/delvae_2020/"
  - label: "DOI"
    url: "https://doi.org/10.1002/we.2621"
media:
  - type: "image"
    src: "assets/wind-turbine-fatigue-cvae.svg"
    alt: "Probabilistic Wind-Turbine Blade Fatigue Estimation concept diagram"
---

## Context

Direct strain-based monitoring across an entire wind farm is expensive, while operational SCADA signals provide broad coverage but only indirect information about fatigue loading.

## Contribution

- Formulated fatigue estimation as a conditional probabilistic latent-variable problem.
- Used operational monitoring variables to estimate uncertainty-aware fatigue-load distributions.
- Processed wind-farm SCADA data and evaluated the model for condition-monitoring use.
- Translated a deep generative model into an engineering decision-support setting where uncertainty is operationally meaningful.

## Outcome

The work provided a probabilistic alternative to deterministic fatigue estimation and demonstrated the value of conditional generative models for wind-energy asset monitoring.

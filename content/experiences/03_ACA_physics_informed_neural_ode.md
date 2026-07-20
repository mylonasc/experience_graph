---
id: "physics-informed-neural-ode"
title: "Physics-Informed Neural ODEs for Structural Identification"
period: "2021"
organization: "ETH Zurich / Journal of Sound and Vibration"
delivery: "Peer-reviewed scientific-ML framework"
projectType: "academic work"
summary: "Co-developed a physics-informed Neural ODE framework that separates known structural dynamics from a learned discrepancy term and supports interpretable governing-equation discovery."
topics: ["Physics-Informed ML", "Neural ODEs", "Structural Identification", "Scientific Machine Learning", "System Identification"]
skills: ["Neural ODEs", "Physics-informed learning", "Dynamical systems", "Deep Learning"]
links:
  - label: "Project page"
    url: "https://mylonasc.netlify.app/publication/lai-2021-structural/"
  - label: "ETH Research Collection"
    url: "https://www.research-collection.ethz.ch/items/3c1416ca-5d6b-4664-a383-62432340e79c"
media:
  - type: "image"
    src: "assets/physics-informed-neural-ode.svg"
    alt: "Physics-Informed Neural ODEs for Structural Identification concept diagram"
---

## Context

Structural-identification problems may be high-dimensional, stiff, nonlinear, and only partially described by existing equations, making purely data-driven learning difficult and opaque. 
Motivation for this work was the capability of NeuralODEs to treat irregularly sampled data (although not ultimately applied for that).

## Contribution

- Initial idea on using neural ODEs for predictive maintenance problems
- Original contributed idea was to use the neural ODEs for making better use of irregularly sampled timeseries, but project drifted to physics-informed ML.

## Outcome

The framework showed how prior engineering knowledge and flexible neural dynamics can be fused to improve governing-equation approximation and interpretability in structural monitoring.

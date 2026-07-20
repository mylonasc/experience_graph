---
id: "tf-gnns"
title: "tf_gnns: Hackable Graph-Network Library"
period: "2016–Present"
organization: "Open-source research software"
delivery: "Multi-backend graph-learning library"
projectType: "code-opensource"
summary: "Created and maintained a modular library for message-passing graph neural networks, designed for flexible graph attributes, research experimentation, and modern Keras backends."
topics: ["Graph Neural Networks", "Keras", "TensorFlow", "PyTorch", "JAX", "Open Source"]
skills: ["GNNs",  "Keras 3", "TensorFlow", "PyTorch", "JAX", "API design", "Performance engineering", "Library design", "Deep Learning"]
links:
  - label: "GitHub repository"
    url: "https://github.com/mylonasc/tf_gnns"
media:
  - type: "image"
    src: "assets/tf-gnns.svg"
    alt: "tf_gnns: Hackable Graph-Network Library concept diagram"
---

## Context

Research on graph-structured engineering data required a transparent, adaptable implementation of Graph Network-style message passing rather than a rigid high-level abstraction.

## Contribution

- Designed APIs for message-passing neural networks and graph convolutional baselines with arbitrary node, edge, and global attributes.
- Structured operations to work with backend graph compilers such as XLA and to remain portable through Keras 3.
- Extended validation across TensorFlow, PyTorch, and JAX backends with automated smoke tests and version-compatibility matrices.
- Added benchmarks, notebooks, documentation, packaging, and reusable MLP-building utilities for research and application development.

## Outcome

The library became the software foundation for several graph-learning research projects and remains a public, testable example of scientific-software engineering for geometric deep learning.

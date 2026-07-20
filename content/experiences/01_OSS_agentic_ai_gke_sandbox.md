---
id: "agentic-ai-gke-sandbox"
title: "Secure GKE Infrastructure for Agentic AI Workloads"
period: "2025–Present"
organization: "Open-source personal infrastructure project"
delivery: "Infrastructure-as-code platform"
projectType: "code-opensource"
summary: "Designed a reproducible Google Kubernetes Engine environment for mixed CPU/GPU agent workloads, with workload isolation, secrets integration, and Terraform-managed sandbox runtime components."
topics: ["Agentic AI", "GCP", "Kubernetes", "Infrastructure as Code", "GPU Computing", "Platform Engineering"]
skills: ["Terraform", "Google Kubernetes Engine", "Kubernetes", "gVisor workload isolation", "GPU infrastructure", "Workload Identity", "Secret Manager", "Platform documentation"]
links:
  - label: "GitHub repository"
    url: "https://github.com/mylonasc/iac-gke-k8s"
media:
  - type: "image"
    src: "assets/agentic-ai-gke-sandbox.svg"
    alt: "Secure GKE Infrastructure for Agentic AI Workloads concept diagram"
---

## Context

Modern agentic-AI workloads need reproducible infrastructure, access to both general-purpose and accelerator nodes, secure identity and secret handling, and stronger isolation for code-executing agents. The project treats these requirements as a platform-engineering problem rather than a collection of manual cluster steps.
The core of the project is a cost effective GKE (Kubernetes) cluster I maintain, and deployed with Terraform. 

## Contribution

- Implemented a GKE Standard cluster through Terraform with separate baseline, general-purpose, spot, GPU, and gVisor-isolated node pools.
- Integrated Workload Identity, Google Secret Manager, remote Terraform state, labels, taints, and deployment-oriented cluster configuration.
- Managed Agent Sandbox controllers, custom resources, sandbox templates, warm pools, and routing services as infrastructure code.
- Created deployment, operations, inventory, diagnostics, and architecture documentation for repeatable day-two operation.

## Outcome

The repository provides a reusable foundation for secure, cost-aware experimentation with containerized AI agents and GPU-backed services, while making the infrastructure auditable and recoverable from code.

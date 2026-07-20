---
id: "epam-agentic-ai-poc"
title: "Agentic AI in Wealth Management"
period: "Client engagement"
organization: "EPAM, Zurich"
delivery: "LangGraph agent platform and evaluation framework"
projectType: "ML and agentic consulting"
summary: "Architected and implemented a LangGraph-based agentic AI proof of concept for portfolio optimization and insights, with evaluation tooling that reduced token spend while maintaining measured performance."
topics: ["Agentic AI", "LLMs", "Portfolio Analytics", "Tool Calling", "Evaluation", "Hybrid Cloud"]
skills: ["LangGraph", "Python", "FastAPI", "Agent architecture", "LLM evaluation", "Token-cost optimization", "Legacy-system integration", "CI/CD", "Terraform", "Authentication architecture"]
media:
  - type: "image"
    src: "assets/epam-agentic-ai-poc.svg"
    alt: "EPAM Agentic AI PoC for Portfolio Insights concept diagram"
---

## Context

The engagement focused on validating agentic AI for portfolio optimization and insight workflows in an environment with legacy integrations, hybrid-cloud constraints, and governance requirements around authentication, authorization, and secrets handling.
The client requested us to discover feasible use cases for the project's timeline, map them to system integration requirements, design and implement a fitting agent architecture for the use-case(s) selected, deliver DevOps automation artifacts, and a working prototype with a clear path to production.

## Contribution

- Conducted small workshop sessions with client stakeholders on use-case discovery and knowledge transfer on agentic AI. 
- Proactively identiffied and resolved technical and governance blockers.
- Owned the architecture and software design for the core backend framework of LangGraph-based agents built with Python and FastAPI.
- Built a local profiling, evaluation, and benchmarking library to compare agent architectures, tool implementations, and context-management strategies (e.g., context truncation, tool output truncation  or sub-agent patterns).
- Led integration with poorly documented legacy systems and created a reusable agent template and easily extensible server for future use cases.
- Configured CI/CD workflows (Terraform, Ansible, Docker), and GitLab pipelines.
- Owned the authentication and authorization architecture for hybrid-cloud API integrations, including token exchange, secrets management, and internal PKI/TLS workflows.

## Outcome

The PoC produced a modular agent framework and evaluation workflow, with a clear path to production, a verified 35-40% reduction in token spend from baseline ReAct agents while maintaining accuracy through improvements to tool implementations and agent architecture.

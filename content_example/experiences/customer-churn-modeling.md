---
id: customer-churn-modeling
title: Customer Churn Modeling Program
period: 2024
organization: Northstar Telecom
delivery: Production ML system
summary: Built a churn prediction workflow that helped retention teams prioritize outreach and understand leading churn indicators.
topics: [Churn, Classification, Customer Analytics, Explainability, Python]
skills: [Feature engineering, Model interpretation, Stakeholder communication, Production scoring]
links:
  - label: Model card example
    url: https://example.com/churn-model-card
  - label: Retention playbook
    url: https://example.com/retention-playbook
media:
  - type: image
    src: assets/churn.svg
    alt: Churn workflow diagram
---

## Context

The retention team had many disconnected reports but no consistent way to identify which customers were likely to leave within the next billing cycle. Elena led the modeling and translation layer between analytics, customer success, and engineering.

## Contribution

- Designed a monthly training set from billing, support, usage, and contract data.
- Built a gradient-boosted classification model with calibrated risk scores.
- Added feature contribution summaries so account managers could understand the likely cause of each risk score.
- Partnered with operations to define action thresholds and exclusion rules.

## Outcome

The system became a weekly scoring workflow used by regional retention leads. More importantly, the model surfaced operational drivers such as failed onboarding milestones and repeated support escalations.

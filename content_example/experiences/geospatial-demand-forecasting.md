---
id: geospatial-demand-forecasting
title: Geospatial Demand Forecasting
period: 2023
organization: Urban Mobility Cooperative
delivery: Forecasting dashboard
summary: Created short-term demand forecasts across city zones to support vehicle repositioning and service planning.
topics: [Forecasting, Geospatial, Time Series, Mobility, Dashboards]
skills: [Spatiotemporal modeling, Data visualization, SQL, Python, Decision support]
links:
  - label: Technical write-up
    url: https://example.com/geospatial-forecasting
media:
  - type: image
    src: assets/geospatial.svg
    alt: City demand heatmap
---

## Context

Fleet operators needed better visibility into where trips were likely to start during morning and evening peaks. Static historical averages were not sufficient during weather changes, public events, and seasonal shifts.

## Contribution

- Created a grid-based spatial aggregation model over trip, weather, and event data.
- Compared baseline seasonal naive forecasts against boosted trees and hierarchical time-series features.
- Designed map-based uncertainty displays for operations managers.
- Converted model output into shift-level recommendations for repositioning.

## Outcome

The final dashboard emphasized forecast confidence rather than only point estimates, helping operators decide when to trust model recommendations and when to override them.

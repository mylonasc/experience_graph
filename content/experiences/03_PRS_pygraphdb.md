---
id: "pygraphdb"
title: "PyGraphDB Embedded Attributed-Graph Database"
period: "202-current"
organization: "Personal open-source project"
delivery: "Python graph-database toolkit"
projectType: "personal"
summary: "Built an embedded graph database for attributed graphs with pluggable key-value storage, indexing, serializers, a subset of Cypher syntax, and fast bulk ingestion utilities."
topics: ["Graph Databases", "Storage Engines", "Cypher", "Indexing", "Python", "Data Engineering"]
skills: ["Database architecture", "Graph data modeling", "Index design", "Query-engine implementation", "LMDB", "LevelDB", "RocksDB", "Serialization", "Bulk ingestion", "Python package engineering"]
links:
  - label: "GitHub repository"
    url: "https://github.com/mylonasc/pygraphdb"
  - label: "Documentation"
    url: "https://mylonasc.github.io/pygraphdb/"
media:
  - type: "image"
    src: "assets/pygraphdb.svg"
    alt: "PyGraphDB Embedded Attributed-Graph Database concept diagram"
---

## Context

Graph-heavy applications often need a lightweight in-process store that preserves attributed nodes and edges without requiring a separate database server. There is a significant gap in python ecosystem in that domain.
This project was inspired by the effectiveness of high performance single-process KV stores (e.g., levelDB) in treating blockchain data in single node, and from my work on transaction graph analytics.

## Contribution

- Designed stable node and edge models with labels, typed relationships, properties, and adjacency records.
- Implemented interchangeable LMDB, LevelDB, and RocksDB/PyRex backends plus Pickle, JSON, MessagePack, and Protobuf serializers.
- Added label, relationship, property, composite, and range indexes together with a read-only Cypher subset for indexed scans and traversal.
- Developed bulk and columnar ingestion helpers, path and subgraph sampling, tests, benchmarks, and user documentation.

## Outcome

(work in process) PyGraphDB provides a modular storage and query layer for local graph applications and demonstrates end-to-end database design spanning persistence, indexing, querying, ingestion, and developer ergonomics. Benchmarking is upcoming - it is a dependency to other personal projects (e.g., KG embedding learning, tf-gnns)

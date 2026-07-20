---
id: "pyrex-rocksdb"
title: "PyRex Python Binding for RocksDB"
period: "Current open-source project"
organization: "Personal open-source project"
delivery: "Packaged Python/C++ storage library"
projectType: "personal"
summary: "Developed a Python wrapper around the C++ RocksDB engine to provide a fast, write-optimized, embedded key-value store with distributable wheels."
topics: ["Databases", "RocksDB", "Python Extensions", "Packaging", "Performance"]
skills: ["C++/Python interoperability", "RocksDB", "Cross-platform builds", "API design", "CICD"]
links:
  - label: "GitHub repository"
    url: "https://github.com/mylonasc/pyrex"
media:
  - type: "image"
    src: "assets/pyrex-rocksdb.svg"
    alt: "PyRex Python Binding for RocksDB concept diagram"
---

## Context

Python applications that need high write throughput can benefit from RocksDB, but usable adoption depends on a maintainable wrapper, portable builds, packaging, and a Python-friendly API.
This work was motivated when reaching the limits of the single-threaded compaction of levelDB for certain workloads. 

## Contribution

- Wrapped the original C++ RocksDB engine for direct in-process use from Python.
- Designed the library around the performance characteristics of LSM trees, memtables, SSTables, and background compaction.
- Built Linux and macOS distribution workflows and published installable wheels through PyPI.
- Added benchmarks, tests, examples, installation documentation, and build tooling for an otherwise complex native dependency.

## Outcome

The project exposes a systems-level storage engine through a practical Python package and showcases cross-language engineering, performance awareness, and release automation. It is already the most performant backend for my python graph DB project for certain loads.

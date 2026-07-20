---
id: "modular-mcp-esp32-iot-firmware"
title: "Modular MCP-enabled IoT Firmware for ESP32"
period: "2025-Present"
organization: "Personal open-source project"
delivery: "Composable ESP32 firmware and MCP server runtime"
projectType: "code-opensource"
summary: "Built a modular ESP32 firmware architecture that lets microcontroller devices expose configurable sensors, actuators, REST endpoints, and MCP interfaces for agentic AI workflows."
topics: ["Microcontrollers", "IoT", "MCP", "Agentic AI", "Embedded Systems", "Software Architecture"]
skills: ["ESP32 firmware", "Embedded software design", "Model Context Protocol", "REST API design", "Sensor integration", "Actuator control", "Modular architecture", "Configuration interfaces"]
links:
  - label: "GitHub repository"
    url: "https://github.com/mylonasc/esp32iotserver/tree/main/esp32-modular-iot-server"
media:
  - type: "image"
    src: "assets/modular-mcp-esp32-iot-firmware.svg"
    alt: "Modular MCP-enabled IoT Firmware for ESP32 concept diagram"
---

## Context

Agentic AI systems need safe and explicit interfaces to interact with physical devices. ESP32 boards are flexible enough for many sensing and actuation setups, but firmware can quickly become brittle when each hardware combination requires a separate implementation.

The project treats each capability as a module that can be enabled, disabled, configured, presented to users, exposed through REST, and surfaced as an MCP interface.

## Contribution

- Designed a modular firmware architecture for ESP32 devices that supports flexible combinations of relays, servos, sensors, and other hardware features.
- Defined module boundaries so each capability provides a presentation interface, configuration interface, REST interface, and MCP interface.
- Implemented the device-side pattern where ESP32 boards operate as MCP servers, making physical-device capabilities discoverable to agentic AI clients.
- Published the implementation as an open-source reference for composing embedded IoT functionality without rewriting device firmware for every setup.

## Outcome

The project provides a reusable foundation for MCP-enabled IoT devices, bridging embedded firmware, RESTful control, and agent-facing tool interfaces for flexible ESP32 deployments.

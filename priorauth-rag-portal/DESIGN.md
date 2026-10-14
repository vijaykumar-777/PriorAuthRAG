---
name: PriorAuth RAG Design System
description: Clinical Decision Support & Prior Authorization RAG Interface
colors:
  primary: "#006194"
  primary-container: "#007bb9"
  on-primary: "#ffffff"
  primary-fixed: "#cce5ff"
  secondary: "#006c4a"
  secondary-container: "#82f5c1"
  tertiary: "#b90538"
  error: "#ba1a1a"
  background: "#f8f9ff"
  on-background: "#0d1c2e"
  surface: "#f8f9ff"
  on-surface: "#0d1c2e"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#eff4ff"
  surface-container: "#e6eeff"
  surface-container-high: "#dce9ff"
  inverse-surface: "#233144"
  outline: "#707881"
  outline-variant: "#bfc7d2"
typography:
  sans:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "14px"
    lineHeight: "1.5"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "24px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
---

## Overview
PriorAuth RAG's design language is authoritative, clinical, crisp, and high-density. Built for rapid scanning by clinical reviewers and intake specialists, it prioritizes clarity, explicit status determinations, and progressive disclosure of complex medical policy hierarchies.

## Colors
- **Clinical Blue (Primary - `#006194`)**: Primary actions, section headings, and policy ontology links.
- **Verification Emerald (Secondary - `#006c4a`)**: Verified indications, checkmarks, and "No Prior Auth Required" badges.
- **Caution Amber**: Prior Authorization Required alerts and pending review states.
- **Contraindication Crimson (Error - `#ba1a1a`)**: Non-indications, surgical exclusions, and denial criteria.
- **Subtle Surface Container Palette**: Layered tints of `#f8f9ff`, `#eff4ff`, `#e6eeff`, and `#ffffff` create clean depth without visual noise.

## Typography
- **Font Family**: Inter, sans-serif with Google Material Symbols for clinical iconography.
- **Hierarchies**: Bold, compact headings paired with clear, readable body text designed for parsing complex multi-clause medical criteria.

## Layout & Spatial System
- Clean single-column container max-width `1152px` (`max-w-6xl`) centered with generous padding.
- Card containers with subtle border separation (`border-surface-container`) and low-elevation shadows (`shadow-xs`).
- Zero static clutter: 100% of screen real estate is dedicated to the clinical inquiry and structured determination results.

## Components
- **Search Hero**: High-contrast input with `/` shortcut indicator and one-click sample query chips.
- **Progressive Stepper**: 4-node pipeline visualizer highlighting the active stage during hybrid search and Qwen 3.8-27b synthesis.
- **Status Badges**: High-contrast pill badges indicating commercial Prior Auth requirements.
- **Interactive Finding Checkboxes**: Clinical reviewer checklist allowing item-by-item verification with state retention.
- **EHR Note Exporter**: Instant formatting for Epic/Cerner chart pasting.

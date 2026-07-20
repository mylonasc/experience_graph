const { profile, experiences } = window.EXPERIENCE_NAVIGATOR_DATA;

const state = {
  query: "",
  projects: new Set(),
  topics: new Set(),
  skills: new Set(),
  selectedId: null,
  selectedNodeIds: new Set(),
  modifierKeyDown: false,
  showTopics: true,
  showSkills: true
};

const els = {
  profileName: document.querySelector("#profileName"),
  profileRole: document.querySelector("#profileRole"),
  profileSummary: document.querySelector("#profileSummary"),
  profileLinks: document.querySelector("#profileLinks"),
  searchInput: document.querySelector("#searchInput"),
  projectTypeFilters: document.querySelector("#projectTypeFilters"),
  projectFilters: document.querySelector("#projectFilters"),
  topicFilters: document.querySelector("#topicFilters"),
  skillFilters: document.querySelector("#skillFilters"),
  resultCount: document.querySelector("#resultCount"),
  clearFilters: document.querySelector("#clearFilters"),
  resetGraph: document.querySelector("#resetGraph"),
  toggleTopics: document.querySelector("#toggleTopics"),
  toggleSkills: document.querySelector("#toggleSkills"),
  zoomIn: document.querySelector("#zoomIn"),
  zoomOut: document.querySelector("#zoomOut"),
  zoomExtent: document.querySelector("#zoomExtent"),
  graphHint: document.querySelector("#graphHint"),
  graph: document.querySelector("#graph"),
  nodeTooltip: document.querySelector("#nodeTooltip"),
  detailPanel: document.querySelector("#detailPanel"),
  detailContent: document.querySelector("#detailContent"),
  closePanel: document.querySelector("#closePanel"),
  panelScrim: document.querySelector("#panelScrim")
};

const allTopics = unique(experiences.flatMap((item) => item.topics || []));
const allSkills = unique(experiences.flatMap((item) => item.skills || []));
const projectTypes = unique(experiences.map((item) => item.projectType || "uncategorized"));
const projectTypeColors = new Map(projectTypes.map((projectType, index) => [projectType, colorForIndex(index)]));
const graphRuntime = {
  nodes: [],
  links: [],
  byId: new Map(),
  saved: new Map(),
  width: 0,
  height: 0,
  animationFrame: 0,
  drag: null,
  wasDragging: false,
  lastPointerNodeId: null,
  lastPointerAt: 0,
  simulation: null,
  zoom: null,
  zoomLayer: null
};
let resizeFrame = 0;
let simulationStopTimer = 0;
let focusSimulationTimer = 0;
window.EXPERIENCE_NAVIGATOR_FOCUS_SIMULATION = { active: false, nodeIds: [] };

function setFocusSimulationStatus(active, nodes = []) {
  window.EXPERIENCE_NAVIGATOR_FOCUS_SIMULATION = {
    active,
    nodeIds: active ? nodes.map((node) => node.id) : []
  };
}

function linkSourceId(link) {
  return typeof link.source === "string" ? link.source : link.source.id;
}

function linkTargetId(link) {
  return typeof link.target === "string" ? link.target : link.target.id;
}

function unique(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function searchableText(item) {
  return [
    item.title,
    item.period,
    item.organization,
    item.delivery,
    item.projectType,
    item.summary,
    ...(item.topics || []),
    ...(item.skills || []),
    item.detailMarkdown
  ]
    .join(" ")
    .toLowerCase();
}

function matchesExperience(item) {
  const queryMatch = !state.query || searchableText(item).includes(state.query.toLowerCase());
  const projectMatch = !state.projects.size || state.projects.has(item.id);
  const topicMatch = !state.topics.size || [...state.topics].every((topic) => item.topics.includes(topic));
  const skillMatch = !state.skills.size || [...state.skills].every((skill) => item.skills.includes(skill));
  return queryMatch && projectMatch && topicMatch && skillMatch;
}

function getFilteredExperiences() {
  return experiences.filter(matchesExperience);
}

function renderProfile() {
  els.profileName.textContent = profile.name;
  els.profileRole.textContent = `${profile.role} · ${profile.location}`;
  els.profileSummary.textContent = profile.summary;
  els.profileLinks.innerHTML = profile.links
    .map((link) => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`)
    .join("");
}

function colorForIndex(index) {
  const hue = (index * 67 + 172) % 360;
  return `hsl(${hue} 45% 38%)`;
}

function projectTypeStyle(projectType) {
  return `style="--project-type-color: ${escapeHtml(projectTypeColors.get(projectType || "uncategorized") || "#da5f3f")}"`;
}

function renderFilters() {
  els.projectTypeFilters.innerHTML = projectTypes.map(projectTypeFilter).join("");
  els.projectFilters.innerHTML = experiences.map((item) => projectFilterButton(item)).join("");
  els.topicFilters.innerHTML = allTopics.map((topic) => filterButton(topic, "topic", state.topics.has(topic))).join("");
  els.skillFilters.innerHTML = allSkills.map((skill) => filterButton(skill, "skill", state.skills.has(skill))).join("");
}

function projectTypeFilter(projectType) {
  const matchingProjects = experiences.filter((item) => item.projectType === projectType);
  const selectedCount = matchingProjects.filter((item) => state.projects.has(item.id)).length;
  const checked = matchingProjects.length > 0 && selectedCount === matchingProjects.length;
  const partial = selectedCount > 0 && selectedCount < matchingProjects.length;
  return `<label class="project-type-option${checked ? " active" : ""}${partial ? " partial" : ""}" ${projectTypeStyle(projectType)}>
    <input type="checkbox" data-project-type="${escapeHtml(projectType)}" ${checked ? "checked" : ""}>
    <span>${escapeHtml(projectType)}</span>
    <small>${selectedCount}/${matchingProjects.length}</small>
  </label>`;
}

function projectFilterButton(item) {
  return `<button class="chip project-chip${state.projects.has(item.id) ? " active" : ""}" type="button" data-filter-type="project" data-filter-value="${escapeHtml(item.id)}">
    <span>${escapeHtml(item.title)}</span>
    <small class="project-type-badge" ${projectTypeStyle(item.projectType)}>${escapeHtml(item.projectType || "uncategorized")}</small>
  </button>`;
}

function filterButton(label, type, active, value = label) {
  return `<button class="chip${active ? " active" : ""}" type="button" data-filter-type="${type}" data-filter-value="${escapeHtml(value)}">${escapeHtml(label)}</button>`;
}

function toggleFilter(type, value) {
  const set = type === "project" ? state.projects : type === "topic" ? state.topics : state.skills;
  if (set.has(value)) set.delete(value);
  else set.add(value);
  state.selectedNodeIds.clear();
  update();
}

function toggleProjectType(projectType, checked) {
  const matchingProjects = experiences.filter((item) => item.projectType === projectType);
  for (const item of matchingProjects) {
    if (checked) state.projects.add(item.id);
    else state.projects.delete(item.id);
  }
  state.selectedNodeIds.clear();
  update();
}

function clearFilters() {
  state.query = "";
  state.projects.clear();
  state.topics.clear();
  state.skills.clear();
  state.selectedNodeIds.clear();
  els.searchInput.value = "";
  update();
}

function getGraphFocus() {
  const selected = state.selectedNodeIds;
  const highlighted = new Set(selected);
  const highlightedLinks = new Set();

  if (!selected.size) return { selected, highlighted, highlightedLinks };

  for (const link of graphRuntime.links) {
    const sourceId = linkSourceId(link);
    const targetId = linkTargetId(link);
    const sourceSelected = selected.has(sourceId);
    const targetSelected = selected.has(targetId);
    const source = graphRuntime.byId.get(sourceId);
    const target = graphRuntime.byId.get(targetId);

    if (sourceSelected || targetSelected) {
      highlighted.add(sourceId);
      highlighted.add(targetId);
      highlightedLinks.add(`${sourceId}->${targetId}`);
    }

    if (sourceSelected && source?.type === "experience") {
      highlighted.add(targetId);
      highlightedLinks.add(`${sourceId}->${targetId}`);
    }
    if (targetSelected && target?.type === "experience") {
      highlighted.add(sourceId);
      highlightedLinks.add(`${sourceId}->${targetId}`);
    }
  }

  return { selected, highlighted, highlightedLinks };
}

function updateGraphFocusClasses() {
  const { selected, highlighted, highlightedLinks } = getGraphFocus();
  const hasSelection = selected.size > 0;

  d3.select(els.graph).selectAll(".graph-node")
    .classed("selected", (node) => selected.has(node.id))
    .classed("focus-muted", (node) => hasSelection && !highlighted.has(node.id))
    .classed("focus-related", (node) => hasSelection && highlighted.has(node.id) && !selected.has(node.id));

  d3.select(els.graph).selectAll(".graph-link")
    .classed("selected", (link) => {
      const sourceId = linkSourceId(link);
      const targetId = linkTargetId(link);
      return highlightedLinks.has(`${sourceId}->${targetId}`);
    })
    .classed("focus-muted", (link) => {
      if (!hasSelection) return false;
      const sourceId = linkSourceId(link);
      const targetId = linkTargetId(link);
      return !highlightedLinks.has(`${sourceId}->${targetId}`);
    });
  updateGraphHint();
  scheduleFocusedSimulation();
}

function scheduleFocusedSimulation() {
  window.clearTimeout(focusSimulationTimer);
  if (!state.selectedNodeIds.size || state.modifierKeyDown || !graphRuntime.simulation) return;
  focusSimulationTimer = window.setTimeout(() => {
    if (!state.selectedNodeIds.size || state.modifierKeyDown || !graphRuntime.simulation) return;
    startFocusedSimulation();
  }, 500);
}

function startFocusedSimulation() {
  const { highlighted, highlightedLinks } = getGraphFocus();
  const focusNodes = graphRuntime.nodes.filter((node) => highlighted.has(node.id));
  const focusLinks = graphRuntime.links.filter((link) => highlightedLinks.has(`${linkSourceId(link)}->${linkTargetId(link)}`));
  if (!focusNodes.length) return;

  window.clearTimeout(simulationStopTimer);
  setFocusSimulationStatus(true, focusNodes);
  graphRuntime.simulation.stop();
  graphRuntime.simulation.nodes(focusNodes);
  graphRuntime.simulation.force("link").links(focusLinks);
  graphRuntime.simulation.alpha(0.42).alphaTarget(0.04).restart();

  simulationStopTimer = window.setTimeout(() => {
    graphRuntime.simulation.alphaTarget(0);
    graphRuntime.simulation.stop();
    graphRuntime.simulation.nodes(graphRuntime.nodes);
    graphRuntime.simulation.force("link").links(graphRuntime.links);
    setFocusSimulationStatus(false);
    window.EXPERIENCE_NAVIGATOR_GRAPH_READY = true;
  }, 1800);
}

function updateGraphHint(node = null) {
  const selectedCount = state.selectedNodeIds.size;
  const selectionText = selectedCount ? ` ${selectedCount} node${selectedCount === 1 ? "" : "s"} selected. Press Esc to reset selection.` : " Press Esc to reset selection.";

  if (!node) {
    els.graphHint.firstElementChild.textContent = `Hover over a node to see available actions.${selectionText}`;
    return;
  }

  if (node.type === "experience") {
    els.graphHint.firstElementChild.textContent = `${node.label}: click to select, Ctrl/Cmd-click for group selection, double-click for details, drag to move.${selectionText}`;
    return;
  }

  const label = node.type === "topic" ? "Topic" : "Skill";
  els.graphHint.firstElementChild.textContent = `${label} ${node.label}: click to filter, Ctrl/Cmd-click for group selection, drag to move.${selectionText}`;
}

function showNodeTooltip(node, event) {
  const content = node.type === "experience"
    ? `<strong>${escapeHtml(node.label)}</strong><span>${escapeHtml([...(node.experience.topics || []), ...(node.experience.skills || [])].join(" · "))}</span>`
    : `<strong>${escapeHtml(node.type === "topic" ? "Topic" : "Skill")}</strong><span>${escapeHtml(node.label)}</span>`;
  els.nodeTooltip.innerHTML = content;
  els.nodeTooltip.hidden = false;
  positionNodeTooltip(event);
}

function positionNodeTooltip(event) {
  if (els.nodeTooltip.hidden) return;
  const graphBox = els.graph.getBoundingClientRect();
  const tooltipBox = els.nodeTooltip.getBoundingClientRect();
  const x = Math.min(Math.max(event.clientX - graphBox.left - tooltipBox.width / 2, 10), graphBox.width - tooltipBox.width - 10);
  const y = Math.max(event.clientY - graphBox.top - tooltipBox.height - 18, 10);
  els.nodeTooltip.style.transform = `translate(${x}px, ${y}px)`;
}

function hideNodeTooltip() {
  els.nodeTooltip.hidden = true;
}

function resetGraphSelection() {
  if (!state.selectedNodeIds.size) return false;
  window.clearTimeout(focusSimulationTimer);
  setFocusSimulationStatus(false);
  state.selectedNodeIds.clear();
  state.selectedId = null;
  updateGraphFocusClasses();
  if (graphRuntime.simulation) {
    graphRuntime.simulation.stop();
    graphRuntime.simulation.nodes(graphRuntime.nodes);
    graphRuntime.simulation.force("link").links(graphRuntime.links);
  }
  return true;
}

function resetGraphLikeEscape() {
  if (resetGraphSelection()) return;
  closeDetail();
}

function zoomGraphBy(factor) {
  if (!graphRuntime.zoom) return;
  d3.select(els.graph)
    .transition()
    .duration(260)
    .ease(d3.easeCubicOut)
    .call(graphRuntime.zoom.scaleBy, factor);
}

function zoomGraphToExtent() {
  if (!graphRuntime.zoom) return;
  d3.select(els.graph)
    .transition()
    .duration(320)
    .ease(d3.easeCubicOut)
    .call(graphRuntime.zoom.transform, d3.zoomIdentity);
}

function beginGraphDrag(event, node, element) {
  window.clearTimeout(simulationStopTimer);
  const [x, y] = d3.pointer(event, graphRuntime.zoomLayer.node());
  graphRuntime.drag = { node, pointerId: event.pointerId ?? "mouse", startX: x, startY: y };
  graphRuntime.wasDragging = false;
  graphRuntime.lastPointerNodeId = node.id;
  graphRuntime.lastPointerAt = performance.now();
  node.fx = node.x;
  node.fy = node.y;
  d3.select(element).classed("dragging", true).raise();
  graphRuntime.simulation.alphaTarget(0.24).restart();
}

function moveGraphDrag(event, node) {
  const [x, y] = d3.pointer(event, graphRuntime.zoomLayer.node());
  graphRuntime.wasDragging = graphRuntime.wasDragging || Math.hypot(x - graphRuntime.drag.startX, y - graphRuntime.drag.startY) > 4;
  node.fx = x;
  node.fy = y;
  node.x = x;
  node.y = y;
  applyGraphPositions();
}

function finishGraphDrag(event, node, element) {
  graphRuntime.lastPointerNodeId = node.id;
  graphRuntime.lastPointerAt = performance.now();
  graphRuntime.drag = null;
  node.fx = null;
  node.fy = null;
  d3.select(element).classed("dragging", false);
  graphRuntime.simulation.alphaTarget(0);
  simulationStopTimer = window.setTimeout(() => {
    graphRuntime.simulation.stop();
    setFocusSimulationStatus(false);
    window.EXPERIENCE_NAVIGATOR_GRAPH_READY = true;
  }, 900);
}

function setGraphSelection(id, additive) {
  if (!additive) state.selectedNodeIds.clear();
  if (additive && state.selectedNodeIds.has(id)) state.selectedNodeIds.delete(id);
  else state.selectedNodeIds.add(id);
  updateGraphFocusClasses();
}

function buildGraphData(filtered) {
  const filteredIds = new Set(filtered.map((item) => item.id));
  const graphExperiences = state.projects.size ? filtered : experiences;
  const nodes = [];
  const links = [];
  const seen = new Set();

  for (const item of graphExperiences) {
    const active = filteredIds.has(item.id);
    nodes.push({ id: item.id, label: item.title, type: "experience", projectType: item.projectType, active, experience: item });
    if (state.showTopics) {
      for (const topic of item.topics) {
        const id = `topic:${topic}`;
        if (!seen.has(id)) {
          seen.add(id);
          nodes.push({ id, label: topic, type: "topic", active: false });
        }
        links.push({ source: item.id, target: id, active });
      }
    }
    if (state.showSkills) {
      for (const skill of item.skills) {
        const id = `skill:${skill}`;
        if (!seen.has(id)) {
          seen.add(id);
          nodes.push({ id, label: skill, type: "skill", active: false });
        }
        links.push({ source: item.id, target: id, active });
      }
    }
  }

  const activeRelated = new Set();
  for (const link of links) {
    if (link.active) {
      activeRelated.add(link.source);
      activeRelated.add(link.target);
    }
  }
  for (const node of nodes) node.active = activeRelated.has(node.id);
  return { nodes, links };
}

function initializeGraphNodes(nodes, width, height, isMobile) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = isMobile ? Math.min(width, height) * 0.36 : Math.min(width, height) * 0.32;
  const typeOffsets = { experience: 0, topic: -Math.PI * 0.62, skill: Math.PI * 0.62 };
  const groups = {
    experience: nodes.filter((node) => node.type === "experience"),
    topic: nodes.filter((node) => node.type === "topic"),
    skill: nodes.filter((node) => node.type === "skill")
  };

  for (const [type, group] of Object.entries(groups)) {
    group.forEach((node, index) => {
      const saved = graphRuntime.saved.get(node.id);
      node.radius = nodeRadius(node);
      node.collisionRadius = labelAwareRadius(node);
      node.vx = 0;
      node.vy = 0;
      if (saved && graphRuntime.width && graphRuntime.height) {
        node.x = saved.x * (width / graphRuntime.width);
        node.y = saved.y * (height / graphRuntime.height);
      } else {
        const spread = type === "experience" ? 0.58 : 1;
        const angle = typeOffsets[type] + (Math.PI * 2 * index) / Math.max(group.length, 1);
        node.x = centerX + Math.cos(angle) * radius * spread;
        node.y = centerY + Math.sin(angle) * radius * spread;
      }
      updateLabelPosition(node, centerX, centerY);
    });
  }
}

function nodeRadius(node) {
  if (node.type === "experience") return 34;
  if (node.type === "topic") return 13;
  return 11;
}

function labelAwareRadius(node) {
  const labelWidth = shortLabel(node.label).length * (node.type === "experience" ? 8.8 : 5.9);
  const base = node.type === "experience" ? 98 : 40;
  return Math.max(base, labelWidth / 2 + nodeRadius(node) + 18);
}

function updateLabelPosition(node, centerX, centerY) {
  if (node.type === "experience") {
    node.labelAnchor = "middle";
    node.labelX = 0;
    node.labelY = 58;
    return;
  }
  const dx = node.x - centerX;
  const dy = node.y - centerY;
  const horizontal = Math.abs(dx) > Math.abs(dy) * 0.65;
  node.labelAnchor = horizontal ? (dx > 0 ? "start" : "end") : "middle";
  node.labelX = horizontal ? (dx > 0 ? 18 : -18) : 0;
  node.labelY = horizontal ? 4 : dy > 0 ? 28 : -18;
}

function simulateGraph(iterations = 1) {
  const { nodes, links, byId, width, height } = graphRuntime;
  const centerX = width / 2;
  const centerY = height / 2;
  const padding = 38;

  for (let step = 0; step < iterations; step += 1) {
    for (const link of links) {
      const source = byId.get(link.source);
      const target = byId.get(link.target);
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.hypot(dx, dy) || 1;
      const desired = source.type === "experience" ? 210 : 155;
      const strength = link.active ? 0.018 : 0.006;
      const force = (distance - desired) * strength;
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;
      if (!source.fixed) {
        source.vx += fx;
        source.vy += fy;
      }
      if (!target.fixed) {
        target.vx -= fx;
        target.vy -= fy;
      }
    }

    for (const node of nodes) {
      const centerStrength = node.type === "experience" ? 0.032 : 0.006;
      const ring = node.type === "experience" ? 0 : Math.min(width, height) * 0.34;
      const angle = node.type === "topic" ? -Math.PI / 2 : node.type === "skill" ? Math.PI / 2 : 0;
      const targetX = centerX + Math.cos(angle) * ring;
      const targetY = centerY + Math.sin(angle) * ring * 0.42;
      if (!node.fixed) {
        node.vx += (targetX - node.x) * centerStrength;
        node.vy += (targetY - node.y) * centerStrength;
      }
    }

    for (let a = 0; a < nodes.length; a += 1) {
      for (let b = a + 1; b < nodes.length; b += 1) {
        const first = nodes[a];
        const second = nodes[b];
        const dx = second.x - first.x;
        const dy = second.y - first.y;
        const distance = Math.hypot(dx, dy) || 1;
        const desired = first.collisionRadius + second.collisionRadius;
        if (distance >= desired) continue;
        const bias = first.type === "experience" || second.type === "experience" ? 0.12 : 0.07;
        const push = (desired - distance) * bias;
        const fx = (dx / distance) * push;
        const fy = (dy / distance) * push;
        if (!first.fixed) {
          first.vx -= fx;
          first.vy -= fy;
        }
        if (!second.fixed) {
          second.vx += fx;
          second.vy += fy;
        }
      }
    }

    for (const node of nodes) {
      if (node.fixed) {
        node.x = node.fixed.x;
        node.y = node.fixed.y;
        node.vx = 0;
        node.vy = 0;
      } else {
        node.vx *= 0.78;
        node.vy *= 0.78;
        node.x += node.vx;
        node.y += node.vy;
      }
      node.x = Math.max(padding, Math.min(width - padding, node.x));
      node.y = Math.max(padding, Math.min(height - padding, node.y));
      updateLabelPosition(node, centerX, centerY);
      graphRuntime.saved.set(node.id, { x: node.x, y: node.y, vx: node.vx, vy: node.vy });
    }
  }
}

function applyGraphPositions() {
  const { byId } = graphRuntime;
  for (const linkEl of els.graph.querySelectorAll(".graph-link")) {
    const source = byId.get(linkEl.dataset.source);
    const target = byId.get(linkEl.dataset.target);
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;
    const curve = target.type === "topic" ? -38 : 38;
    linkEl.setAttribute("d", `M ${source.x} ${source.y} Q ${midX} ${midY + curve} ${target.x} ${target.y}`);
  }

  for (const nodeEl of els.graph.querySelectorAll(".graph-node")) {
    const node = byId.get(nodeEl.dataset.nodeId);
    nodeEl.setAttribute("transform", `translate(${node.x}, ${node.y})`);
    const label = nodeEl.querySelector(".node-label");
    label.setAttribute("text-anchor", node.labelAnchor);
    label.setAttribute("x", node.labelX);
    label.setAttribute("y", node.labelY);
  }
}

function settleGraphFrames(frames) {
  window.cancelAnimationFrame(graphRuntime.animationFrame);
  let remaining = frames;
  const frame = () => {
    simulateGraph(2);
    applyGraphPositions();
    remaining -= 1;
    if (remaining > 0) graphRuntime.animationFrame = window.requestAnimationFrame(frame);
  };
  graphRuntime.animationFrame = window.requestAnimationFrame(frame);
}

function graphPoint(event) {
  const point = els.graph.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  return point.matrixTransform(els.graph.getScreenCTM().inverse());
}

function startDrag(event) {
  const nodeEl = event.target.closest(".graph-node");
  if (!nodeEl) return;
  const node = graphRuntime.byId.get(nodeEl.dataset.nodeId);
  if (!node) return;
  const point = graphPoint(event);
  graphRuntime.drag = {
    node,
    pointerId: event.pointerId,
    startX: point.x,
    startY: point.y,
    offsetX: node.x - point.x,
    offsetY: node.y - point.y
  };
  graphRuntime.wasDragging = false;
  graphRuntime.lastPointerNodeId = node.id;
  graphRuntime.lastPointerAt = performance.now();
  node.fixed = { x: node.x, y: node.y };
  nodeEl.classList.add("dragging");
  els.graph.setPointerCapture(event.pointerId);
}

function moveDrag(event) {
  const drag = graphRuntime.drag;
  if (!drag || drag.pointerId !== event.pointerId) return;
  const point = graphPoint(event);
  const moved = Math.hypot(point.x - drag.startX, point.y - drag.startY);
  graphRuntime.wasDragging = graphRuntime.wasDragging || moved > 4;
  drag.node.fixed = { x: point.x + drag.offsetX, y: point.y + drag.offsetY };
  simulateGraph(1);
  applyGraphPositions();
}

function endDrag(event) {
  const drag = graphRuntime.drag;
  if (!drag || drag.pointerId !== event.pointerId) return;
  drag.node.fixed = null;
  graphRuntime.lastPointerNodeId = drag.node.id;
  graphRuntime.lastPointerAt = performance.now();
  graphRuntime.drag = null;
  els.graph.querySelectorAll(".dragging").forEach((node) => node.classList.remove("dragging"));
  try {
    els.graph.releasePointerCapture(event.pointerId);
  } catch {
    // The pointer may already be released after touch cancellation.
  }
  settleGraphFrames(35);
}

function renderGraph() {
  window.clearTimeout(simulationStopTimer);
  window.clearTimeout(focusSimulationTimer);
  setFocusSimulationStatus(false);
  window.EXPERIENCE_NAVIGATOR_GRAPH_READY = false;
  if (graphRuntime.simulation) graphRuntime.simulation.stop();

  const filtered = getFilteredExperiences();
  els.resultCount.textContent = `${filtered.length} of ${experiences.length} experiences`;
  els.toggleTopics.checked = state.showTopics;
  els.toggleSkills.checked = state.showSkills;
  els.toggleTopics.closest(".graph-toggle").classList.toggle("active", state.showTopics);
  els.toggleSkills.closest(".graph-toggle").classList.toggle("active", state.showSkills);

  const clientWidth = els.graph.clientWidth || 900;
  const isMobile = clientWidth < 640;
  const { nodes, links } = buildGraphData(filtered);
  const baseWidth = isMobile ? 760 : Math.max(720, clientWidth);
  const baseHeight = isMobile ? 920 : Math.max(520, els.graph.clientHeight || 600);
  const width = Math.min(isMobile ? 980 : 1220, Math.max(baseWidth, 700 + nodes.length * 3));
  const height = Math.min(isMobile ? 1400 : 1180, Math.max(baseHeight, 520 + nodes.length * 7));
  initializeGraphNodes(nodes, width, height, isMobile);
  graphRuntime.nodes = nodes;
  graphRuntime.links = links;
  graphRuntime.byId = new Map(nodes.map((node) => [node.id, node]));
  graphRuntime.width = width;
  graphRuntime.height = height;

  graphRuntime.simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links)
      .id((node) => node.id)
      .distance((link) => link.source.type === "experience" ? 145 : 118)
      .strength((link) => link.active ? 0.12 : 0.045))
    .force("charge", d3.forceManyBody().strength((node) => node.type === "experience" ? -280 : -72))
    .force("collide", d3.forceCollide((node) => node.collisionRadius * 0.78).strength(0.92).iterations(7))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX(width / 2).strength((node) => node.type === "experience" ? 0.12 : 0.014))
    .force("y", d3.forceY(height / 2).strength((node) => node.type === "experience" ? 0.12 : 0.014))
    .force("orbit", d3.forceRadial((node) => {
      if (node.type === "experience") return Math.min(width, height) * 0.08;
      if (node.type === "topic") return Math.min(width, height) * 0.24;
      return Math.min(width, height) * 0.33;
    }, width / 2, height / 2)
      .strength((node) => node.type === "experience" ? 0.24 : node.type === "topic" ? 0.06 : 0.08))
    .force("bounds", forceBounds(width, height, 64, 0.36))
    .stop();

  for (let index = 0; index < (isMobile ? 700 : 620); index += 1) {
    graphRuntime.simulation.tick(1);
    constrainGraphNodes(nodes, width, height);
  }
  fitGraphToViewport(nodes, width, height, 64);

  els.graph.setAttribute("viewBox", `0 0 ${width} ${height}`);
  els.graph.innerHTML = '<g class="graph-viewport"><g class="links"></g><g class="nodes"></g></g>';

  graphRuntime.zoomLayer = d3.select(els.graph).select(".graph-viewport");
  graphRuntime.zoom = d3.zoom()
    .scaleExtent([0.45, 3.5])
    .translateExtent([[-width * 0.65, -height * 0.65], [width * 1.65, height * 1.65]])
    .filter((event) => {
      if (event.type === "wheel") return true;
      if (event.target.closest(".graph-node")) return false;
      return !event.button;
    })
    .on("zoom", (event) => {
      graphRuntime.zoomLayer.attr("transform", event.transform);
    });

  d3.select(els.graph)
    .call(graphRuntime.zoom)
    .on("dblclick.zoom", null);

  const linkSelection = graphRuntime.zoomLayer.select(".links")
    .selectAll("path")
    .data(links)
    .join("path")
    .attr("class", (link) => `graph-link${link.source.active && link.target.active ? "" : " dimmed"}`)
    .attr("data-source", (link) => link.source.id)
    .attr("data-target", (link) => link.target.id);

  const nodeSelection = graphRuntime.zoomLayer.select(".nodes")
    .selectAll("g")
    .data(nodes, (node) => node.id)
    .join((enter) => {
      const group = enter.append("g")
        .attr("class", (node) => `graph-node ${node.type}${node.active ? "" : " dimmed"}`)
        .style("--project-type-color", (node) => node.type === "experience" ? projectTypeColors.get(node.projectType || "uncategorized") : null)
        .attr("data-node-id", (node) => node.id);
      group.append("circle").attr("r", (node) => node.radius);
      group.append("text")
        .attr("class", "node-label")
        .text((node) => shortLabel(node.label));
      return group;
    })
    .on("mouseenter", function (event, node) {
      d3.select(this).classed("hovered", true).raise();
      updateGraphHint(node);
      showNodeTooltip(node, event);
    })
    .on("mousemove", function (event) {
      positionNodeTooltip(event);
    })
    .on("mouseleave", function () {
      d3.select(this).classed("hovered", false);
      updateGraphHint();
      hideNodeTooltip();
    })
    .on("mousedown", function (event, node) {
      event.preventDefault();
      event.stopPropagation();
      beginGraphDrag(event, node, this);
    })
    .on("pointerdown", function (event, node) {
      event.preventDefault();
      event.stopPropagation();
      beginGraphDrag(event, node, this);
      this.setPointerCapture(event.pointerId);
    })
    .on("pointermove", function (event, node) {
      if (!graphRuntime.drag || graphRuntime.drag.pointerId !== event.pointerId || graphRuntime.drag.node !== node) return;
      event.preventDefault();
      event.stopPropagation();
      moveGraphDrag(event, node);
    })
    .on("pointerup pointercancel", function (event, node) {
      if (!graphRuntime.drag || graphRuntime.drag.pointerId !== event.pointerId || graphRuntime.drag.node !== node) return;
      event.preventDefault();
      event.stopPropagation();
      finishGraphDrag(event, node, this);
      try {
        this.releasePointerCapture(event.pointerId);
      } catch {
        // The pointer can already be released after cancellation.
      }
    });

  const ticked = () => {
    constrainGraphNodes(nodes, width, height);
    linkSelection.attr("d", (link) => graphLinkPath(link.source, link.target));
    nodeSelection
      .attr("transform", (node) => `translate(${node.x}, ${node.y})`)
      .select("text")
      .attr("text-anchor", (node) => node.labelAnchor)
      .attr("x", (node) => node.labelX)
      .attr("y", (node) => node.labelY);
    for (const node of nodes) graphRuntime.saved.set(node.id, { x: node.x, y: node.y, vx: 0, vy: 0 });
  };

  graphRuntime.simulation.on("tick", ticked).on("end", () => {
    window.EXPERIENCE_NAVIGATOR_GRAPH_READY = true;
  });
  ticked();
  updateGraphFocusClasses();
  updateGraphHint();
  window.EXPERIENCE_NAVIGATOR_GRAPH_READY = true;
}

function constrainGraphNodes(nodes, width, height) {
  for (const node of nodes) {
    updateLabelPosition(node, width / 2, height / 2);
    graphRuntime.saved.set(node.id, { x: node.x, y: node.y, vx: 0, vy: 0 });
  }
}

function fitGraphToViewport(nodes, width, height, padding) {
  const minX = Math.min(...nodes.map((node) => node.x - node.collisionRadius));
  const maxX = Math.max(...nodes.map((node) => node.x + node.collisionRadius));
  const minY = Math.min(...nodes.map((node) => node.y - node.collisionRadius));
  const maxY = Math.max(...nodes.map((node) => node.y + node.collisionRadius));
  const graphWidth = Math.max(1, maxX - minX);
  const graphHeight = Math.max(1, maxY - minY);
  const scale = Math.min((width - padding * 2) / graphWidth, (height - padding * 2) / graphHeight, 1);

  for (const node of nodes) {
    node.x = padding + (node.x - minX) * scale;
    node.y = padding + (node.y - minY) * scale;
    updateLabelPosition(node, width / 2, height / 2);
    graphRuntime.saved.set(node.id, { x: node.x, y: node.y, vx: 0, vy: 0 });
  }
}

function forceBounds(width, height, padding, strength) {
  let nodes = [];
  const force = () => {
    for (const node of nodes) {
      if (node.x < padding) node.vx += (padding - node.x) * strength;
      if (node.x > width - padding) node.vx -= (node.x - width + padding) * strength;
      if (node.y < padding) node.vy += (padding - node.y) * strength;
      if (node.y > height - padding) node.vy -= (node.y - height + padding) * strength;
    }
  };
  force.initialize = (values) => {
    nodes = values;
  };
  return force;
}

function graphLinkPath(source, target) {
  const midX = (source.x + target.x) / 2;
  const midY = (source.y + target.y) / 2;
  const curve = target.type === "topic" ? -38 : 38;
  return `M ${source.x} ${source.y} Q ${midX} ${midY + curve} ${target.x} ${target.y}`;
}

function shortLabel(label) {
  return label.length > 28 ? `${label.slice(0, 25)}...` : label;
}

function renderDetail(item) {
  const links = (item.links || [])
    .map((link) => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`)
    .join("");
  const media = (item.media || [])
    .map((entry) => `<figure class="media-card"><img src="${escapeHtml(entry.src)}" alt="${escapeHtml(entry.alt || "Experience media")}"><figcaption>${escapeHtml(entry.alt || entry.src)}</figcaption></figure>`)
    .join("");

  els.detailContent.innerHTML = `
    <article class="detail-content">
      <h1>${escapeHtml(item.title)}</h1>
      <p class="detail-meta">${escapeHtml(item.organization)} · ${escapeHtml(item.period)} · ${escapeHtml(item.delivery)}</p>
      <div class="chip-list"><span class="project-type-badge" ${projectTypeStyle(item.projectType)}>${escapeHtml(item.projectType || "uncategorized")}</span></div>
      <p>${escapeHtml(item.summary)}</p>
      <div class="chip-list">${item.topics.map((topic) => `<span class="chip">${escapeHtml(topic)}</span>`).join("")}</div>
      <h2>Demonstrated Skills</h2>
      <div class="chip-list">${item.skills.map((skill) => `<span class="chip">${escapeHtml(skill)}</span>`).join("")}</div>
      ${media ? `<h2>Media</h2>${media}` : ""}
      ${links ? `<h2>Artifacts</h2><div class="profile-links">${links}</div>` : ""}
      ${item.detailHtml}
    </article>
  `;
}

function openDetail(item) {
  state.selectedId = item.id;
  renderDetail(item);
  els.detailPanel.classList.add("open");
  els.detailPanel.setAttribute("aria-hidden", "false");
  els.panelScrim.hidden = false;
}

function closeDetail() {
  els.detailPanel.classList.remove("open");
  els.detailPanel.setAttribute("aria-hidden", "true");
  els.panelScrim.hidden = true;
}

function handleGraphEvent(event, openOnClick = false) {
  if (graphRuntime.wasDragging) {
    graphRuntime.wasDragging = false;
    return;
  }
  const nodeEl = event.target.closest(".graph-node");
  const recentPointerNode = performance.now() - graphRuntime.lastPointerAt < 700 ? graphRuntime.lastPointerNodeId : null;
  const id = nodeEl?.dataset.nodeId || recentPointerNode;
  if (!id) return;
  const additive = event.ctrlKey || event.metaKey;
  const experience = experiences.find((item) => item.id === id);
  if (experience) {
    setGraphSelection(id, additive);
    if (openOnClick || event.type === "dblclick") openDetail(experience);
    else state.selectedId = experience.id;
    return;
  }
  if (additive) {
    setGraphSelection(id, true);
    return;
  }
  const [type, value] = id.split(":");
  if (type === "topic") toggleFilter("topic", value);
  if (type === "skill") toggleFilter("skill", value);
}

function update() {
  renderFilters();
  renderGraph();
}

renderProfile();
renderFilters();
renderGraph();

els.searchInput.addEventListener("input", (event) => {
  state.query = event.target.value.trim();
  renderGraph();
});

document.addEventListener("click", (event) => {
  const filter = event.target.closest("[data-filter-type]");
  if (filter) toggleFilter(filter.dataset.filterType, filter.dataset.filterValue);
});

document.addEventListener("change", (event) => {
  const input = event.target.closest("[data-project-type]");
  if (input) toggleProjectType(input.dataset.projectType, input.checked);
});

els.clearFilters.addEventListener("click", clearFilters);
els.resetGraph.addEventListener("click", resetGraphLikeEscape);
els.zoomIn.addEventListener("click", () => zoomGraphBy(1.25));
els.zoomOut.addEventListener("click", () => zoomGraphBy(0.8));
els.zoomExtent.addEventListener("click", zoomGraphToExtent);
els.toggleTopics.addEventListener("change", (event) => {
  state.showTopics = event.target.checked;
  state.selectedNodeIds.clear();
  renderGraph();
});
els.toggleSkills.addEventListener("change", (event) => {
  state.showSkills = event.target.checked;
  state.selectedNodeIds.clear();
  renderGraph();
});
els.closePanel.addEventListener("click", closeDetail);
els.panelScrim.addEventListener("click", closeDetail);
els.graph.addEventListener("click", (event) => handleGraphEvent(event, window.matchMedia("(max-width: 760px)").matches));
els.graph.addEventListener("dblclick", handleGraphEvent);
window.addEventListener("resize", () => {
  window.cancelAnimationFrame(resizeFrame);
  resizeFrame = window.requestAnimationFrame(renderGraph);
});
window.addEventListener("mousemove", (event) => {
  if (!graphRuntime.drag) return;
  event.preventDefault();
  moveGraphDrag(event, graphRuntime.drag.node);
});
window.addEventListener("mouseup", (event) => {
  if (!graphRuntime.drag) return;
  event.preventDefault();
  const node = graphRuntime.drag.node;
  const element = els.graph.querySelector(`[data-node-id="${CSS.escape(node.id)}"]`);
  finishGraphDrag(event, node, element);
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Control" || event.key === "Meta") {
    state.modifierKeyDown = true;
    window.clearTimeout(focusSimulationTimer);
    if (graphRuntime.simulation) graphRuntime.simulation.stop();
    setFocusSimulationStatus(false);
    return;
  }
  if (event.key !== "Escape") return;
  resetGraphLikeEscape();
});
window.addEventListener("keyup", (event) => {
  if (event.key !== "Control" && event.key !== "Meta") return;
  state.modifierKeyDown = false;
  scheduleFocusedSimulation();
});

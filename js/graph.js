// Graph visualization - Public API
import { state, step, draw, computeMainAnchors, clamp, cleanupGifElements } from './graph/engine.js';
import { setupInteraction, createMainNode, setupGalleryListeners } from './graph/navigation.js';
import * as CFG from './graph/config.js';

export function startGraph(canvas) {
  stopGraph();
  
  state.ctx = canvas.getContext("2d");
  resizeCanvasToDisplaySize(canvas);
  window.addEventListener("resize", () => handleResponsiveResize(canvas));
  
  // Initialize 3 main nodes
  const { width, height } = canvas;
  state.nodes = [];
  state.nodes.push(createMainNode("ABOUT", "#/about", 0, width, height));
  state.mainNodeIndexes.ABOUT = 0;
  state.nodes.push(createMainNode("PROJECTS", "#/projects", 1, width, height));
  state.mainNodeIndexes.PROJECTS = 1;
  state.nodes.push(createMainNode("CONTACTS", "#/contacts", 2, width, height));
  state.mainNodeIndexes.CONTACTS = 2;
  state.mode = "home";
  state.focusKey = null;
  state.selectedCategoryIndex = -1;
  state.selectedProjectIndex = -1;
  
  // Reset camera to center
  state.uiDepth = 0;
  state.uiDepthTarget = 0;
  state.cameraOffsetX = 0;
  state.cameraTargetOffsetX = 0;
  
  // Compute three stable anchors for mains and initialize near them
  state.mainAnchors = computeMainAnchors(width, height);
  for (let i = 0; i < 3; i++) {
    const a = state.mainAnchors[i];
    state.nodes[i].x = a.x;
    state.nodes[i].y = a.y;
    state.nodes[i].targetX = a.x;
    state.nodes[i].targetY = a.y;
  }
  
  // Setup interaction handlers
  setupInteraction(canvas);
  
  // Setup gallery mode listeners (ESC key, backdrop click)
  setupGalleryListeners();
  
  // Start animation loop
  state.lastTimestamp = performance.now();
  state.animationHandle = requestAnimationFrame(tick);
}

export function stopGraph() {
  if (state.animationHandle) {
    cancelAnimationFrame(state.animationHandle);
    state.animationHandle = null;
  }
  // Clean up any HTML image elements from media nodes
  cleanupGifElements();
  if (state.ctx) {
    const { canvas } = state.ctx;
    state.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function tick(ts) {
  const dt = Math.min(0.05, (ts - state.lastTimestamp) / 500);
  state.lastTimestamp = ts;
  
  // Animate UI depth and camera offset
  state.uiDepth += (state.uiDepthTarget - state.uiDepth) * 0.2;
  const width = state.ctx?.canvas?.width || 0;
  state.cameraTargetOffsetX = -width * CFG.CAMERA.SHIFT_PER_DEPTH * state.uiDepth;
  state.cameraOffsetX += (state.cameraTargetOffsetX - state.cameraOffsetX) * 0.2;
  
  // Update physics and render
  step(dt);
  draw();
  
  state.animationHandle = requestAnimationFrame(tick);
}

function resizeCanvasToDisplaySize(canvas) {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const { clientWidth, clientHeight } = canvas;
  canvas.width = Math.floor(clientWidth * dpr);
  canvas.height = Math.floor(clientHeight * dpr);
}

function handleResponsiveResize(canvas) {
  resizeCanvasToDisplaySize(canvas);
  // Recompute anchors and reposition main nodes
  const { width, height } = canvas;
  state.mainAnchors = computeMainAnchors(width, height);
  for (let i = 0; i < 3; i++) {
    const a = state.mainAnchors[i];
    state.nodes[i].x = a.x;
    state.nodes[i].y = a.y;
    state.nodes[i].targetX = a.x;
    state.nodes[i].targetY = a.y;
  }
  // Optionally, reset camera offsets
  state.cameraOffsetX = 0;
  state.cameraTargetOffsetX = 0;
}

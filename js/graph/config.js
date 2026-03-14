// Configuration constants for the graph visualization

// Main nodes wandering bounds (padding ratios from canvas edges)
export const MAIN_BOUNDS = { xPad: 0.1, yPad: 0.1 };

// Visual elements
export const RECT = getResponsiveRect(); // small vertical rectangle
export const LINE_WIDTH = 2; // connection lines

// Main nodes behavior
export const MAIN = {
  SEPARATION: 300, // pixels - minimum distance between main nodes
  REPULSION_STRENGTH: 0.00001, // strength of separation force
  WANDER_RADIUS: 400, // how far mains wander from anchor
  RETURN_STRENGTH: 0.008, // spring force back to anchor
  SHRINK_SCALE: 0.7, // scale for non-focused mains in focus mode
  DIM_ALPHA: 0.3, // alpha for non-focused mains when focused
  X_OFFSET: getResponsiveMainXOffset() // pixels added to main nodes X position (responsive)
};

function getResponsiveMainXOffset() {
  const w = window.innerWidth || 1920;
  if (w <= 480) return -50; // mobile: shift left
  if (w < 1200) return -50; // tablet: slight shift
  return 0; // desktop: no offset
}

// Child nodes (categories/contacts)
export const CHILD = {
  RING_RADIUS: 400, // initial distance of children from focus node
  WANDER_RADIUS: 400, // wander radius around focus node
  SPEED_SCALE: 1,
  MIN_DISTANCE: 260, // minimum distance focus->child
  SECTOR_HALF_ANGLE: Math.PI / 6, // ±30° around east
  SHRINK_SCALE: 0.85, // scale for non-selected categories in category mode
  X_OFFSET: 0, // pixels added to child X position
  SEPARATION: 280, // minimum distance between child nodes (pixels)
  REPULSION_STRENGTH: 0.4  // strength of separation force
};

// Grandchild nodes (projects)
export const GRANDCHILD = {
  WANDER_RADIUS: 400, // wander around category node
  SPEED_SCALE: 1,
  SECTOR_HALF_ANGLE: Math.PI / 3, // ±60° around east
  X_OFFSET: 0, // pixels added to grandchild X position
  SEPARATION: 200, // minimum distance between grandchild nodes (pixels)
  REPULSION_STRENGTH: 0.3 // strength of separation force
};

// Media nodes (project images/videos)
export const MEDIA = {
  SIZE: getResponsiveMediaSize(), // base size of media thumbnail in pixels
  OSCILLATION_SPEED: 0.8, // speed factor for media movement
  BORDER_WIDTH: 2, // border thickness for media thumbnails in pixels
  BRACKET_PADDING: 8, // extra padding for hover brackets around media (in CSS pixels)
  
  // Repulsion between media (keeps them spread out)
  SEPARATION: 600, // minimum distance between media centers (pixels)
  REPULSION_STRENGTH: 0.5, // strength of separation force
  
  // Dynamic scale based on media count
  SCALE_MIN: 0.5, // minimum scale (used when many media)
  SCALE_MAX: 1.0, // maximum scale (used when few media)
  SCALE_THRESHOLD_MIN: 1, // 1 media = max scale
  SCALE_THRESHOLD_MAX: 6, // 6+ media = min scale
  SCALE_VARIATION: 0.1, // random variation (±10%)
  
  // Breakpoint for mobile detection
  MOBILE_BREAKPOINT: 480,
  
  // Spawn area DESKTOP (media on left side)
  DESKTOP: {
    X_MIN: 0.03, // 3% from left edge
    X_MAX: 0.45, // up to 45%
    Y_MIN: 0.10, // 10% from top
    Y_MAX: 0.90  // up to 90%
  },
  
  // Spawn area MOBILE (media on top)
  MOBILE: {
    X_MIN: 0.05,
    X_MAX: 0.95,
    Y_MIN: 0.08,
    Y_MAX: 0.45
  }
};

// Description text formatting (project descriptions)
export const DESCRIPTION = {
  TEXT_MAX_WIDTH_RATIO: getResponsiveDescriptionWidthRatio(), // responsive max width
  FONT_SIZE: getResponsiveFontSize(), // font size for description text (responsive)
  LINE_HEIGHT: getResponsiveTextLineHeight(), // unified responsive line height
  PADDING: 18, // space between text and corner brackets
  Y_SPAWN: getResponsiveDescriptionYSpawn(), // responsive vertical spawn area
  DESKTOP: {
    X_FIXED: 0.98, // fixed horizontal position (far right)
    Y_MIN: 0.05, // from top
    Y_MAX: 0.11, // 
    ANCHOR_POINT: "top-right"
  },
  MOBILE: {
    X_FIXED: 0.95, // slightly scaled from desktop
    Y_MIN: 0.55,
    Y_MAX: 0.85,
    ANCHOR_POINT: "top-right"
  }
};

// Responsive vertical spawn area for description box
function getResponsiveDescriptionYSpawn() {
  const h = window.innerHeight || 1080;
  if (h <= 480) return { Y_MIN: 0.08, Y_MAX: 0.92 }; // mobile: more vertical space
  if (h < 1200) return { Y_MIN: 0.10, Y_MAX: 0.90 }; // tablet: generous
  return { Y_MIN: 0.05, Y_MAX: 0.11 }; // desktop: default
}

// Text content formatting (for ABOUT/CONTACTS text)
export const TEXT = {
  MAX_WIDTH: 1800, // max width for text wrapping
  FONT_SIZE: 14, // font size for text content
  LINE_HEIGHT: 14, // line height for text content
  PADDING: 20 // space between text and corner brackets
};

// About section specific formatting
export const ABOUT = {
  TEXT_MAX_WIDTH_RATIO: getResponsiveAboutWidthRatio(), // responsive max width
  FONT_SIZE: getResponsiveFontSize(),
  LINE_HEIGHT: getResponsiveTextLineHeight(), // unified responsive line height
  PADDING: 18,
  Y_OFFSET: 0.12 // positive = lower on screen
};

// Typography
export const FONTS = {
  MAIN: 16, // px base (scaled by DPR)
  MAIN_SMALL: 10, // px when mode === 'category' for non-selected mains
  CHILD: 16,
  GRANDCHILD: 16,
  MEDIA: 12 // small font for media labels
};

// Camera system
export const CAMERA = {
  SHIFT_PER_DEPTH: 0.03 // how much the view shifts left when going deeper (0.03 = 3% of screen width per level)
};

// Project level specific
export const PROJECT = {
  SHRINK_SCALE: 0.6 // scale for non-selected nodes in project mode
};

// Colors (read from CSS custom properties)
export const COLOR = getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() || "#00ff66";

// Cursor style
export const CURSOR = {
  LINE_WIDTH: 2.0, // stroke width
  SIZE: 10, // px length of each line (base, scaled by DPR)
  GAP: 3, // px empty zone at center
  BOTTOM_ANGLE: 100, // degrees between the two bottom lines
  BRACKET_LENGTH: 16, // px corner bracket length (base, scaled by DPR)
  BRACKET_OFFSET: 4, // px distance from box edges
  TRANSITION_MS: 120 // crosshair <-> brackets animation duration
};

// Slug (title) hover detection
export const SLUG = {
  HOVER_PADDING: 16 // extra pixels around slug for easier hover detection
};

// Responsive scaling helpers
function getResponsiveFontSize() {
  const w = window.innerWidth || 1920;
  if (w > 1920) return 18 + Math.min(6, (w - 1920) / 320); // max 21px
  if (w < 1200) return 14;
  return 15;
}

function getResponsiveLineHeight() {
  const w = window.innerWidth || 1920;
  if (w > 1920) return 22 + Math.min(8, (w - 1920) / 320); // max 40px
  if (w < 1200) return 28;
  return 32;
}

function getResponsiveMediaSize() {
  const w = window.innerWidth || 1920;
  if (w > 1920) return 600;
  if (w < 1200) return 600;
  return 1000;
}

// Responsive rectangle size
function getResponsiveRect() {
  const w = window.innerWidth || 1920;
  if (w > 1920) return { w: 12, h: 20 };
  if (w < 1200) return { w: 20, h: 36 };
  return { w: 21, h: 38
   };
}

// Responsive label right padding for bounding (proportional to label width)
export function getResponsiveGrandchildLabelRightPadding(labelWidth) {
  const w = window.innerWidth || 1920;
  if (w <= 480) return Math.max(600, labelWidth * 0.12);
  if (w < 1200) return Math.max(12, labelWidth * 0.15);
  return Math.max(16, labelWidth * 0.18);
}

export function getResponsiveChildLabelRightPadding(labelWidth) {
  const w = window.innerWidth || 1920;
  if (w <= 480) return Math.max(300, labelWidth * 0.10);
  if (w < 1200) return Math.max(10, labelWidth * 0.13);
  return Math.max(14, labelWidth * 0.16);
}

// Responsive max width ratio for description box
function getResponsiveDescriptionWidthRatio() {
  const w = window.innerWidth || 1920;
  if (w <= 480) return 0.85; // mobile: much wider
  if (w < 1200) return 0.65; // tablet: wider
  return 0.45; // desktop: default
}

// Responsive max width ratio for about box
function getResponsiveAboutWidthRatio() {
  const w = window.innerWidth || 1920;
  if (w <= 480) return 0.95; // mobile: almost full width
  if (w < 1200) return 0.75; // tablet: wider
  return 0.52; // desktop: default
}

// Responsive line height for description and about box
function getResponsiveTextLineHeight() {
  const w = window.innerWidth || 1920;
  if (w > 1920) return 26;
  if (w <= 480) return 32; // mobile: tighter
  if (w < 1200) return 28; // tablet: slightly tighter
  return 40; // desktop: default
}









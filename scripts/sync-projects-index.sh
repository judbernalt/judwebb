#!/bin/bash

# Syncs data/projects/index.json with all individual project files
# Usage: bash scripts/sync-projects-index.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PROJECTS_DIR="$PROJECT_ROOT/data/projects"
INDEX_FILE="$PROJECTS_DIR/index.json"
TEMP_FILE="$INDEX_FILE.tmp"

# Check that the projects directory exists
if [[ ! -d "$PROJECTS_DIR" ]]; then
  echo "Directory not found: $PROJECTS_DIR"
  exit 1
fi

# Check that jq is available
if ! command -v jq &> /dev/null; then
  echo "jq is not installed. Install with: brew install jq"
  exit 1
fi

# Find all JSON files except index.json and sort them
PROJECT_FILES=($(find "$PROJECTS_DIR" -maxdepth 1 -name "*.json" ! -name "index.json" | sort))

if [[ ${#PROJECT_FILES[@]} -eq 0 ]]; then
  echo "⚠️  No project files found in $PROJECTS_DIR"
  exit 1
fi

# Assemble JSON array into temporary file
temp_array=$(mktemp)
{
  echo "["
  
  for i in "${!PROJECT_FILES[@]}"; do
    file="${PROJECT_FILES[$i]}"
    
    # Add comma before each element except the first
    if [[ $i -gt 0 ]]; then
      echo ","
    fi
    
    # Validate and read the file
    if jq empty "$file" 2>/dev/null; then
      cat "$file"
    else
      echo "Invalid JSON file: $(basename $file)" >&2
      rm "$temp_array"
      exit 1
    fi
  done
  
  echo ""
  echo "]"
} > "$temp_array"

# Validate the assembled JSON
if jq empty "$temp_array" 2>/dev/null; then
  # Format and save
  jq '.' "$temp_array" > "$INDEX_FILE"
  rm "$temp_array"
  echo "Index synced: ${#PROJECT_FILES[@]} projects"
else
  echo "Invalid JSON after assembly" >&2
  rm "$temp_array"
  exit 1
fi

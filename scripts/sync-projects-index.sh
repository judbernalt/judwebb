#!/bin/bash

# Sincronizza data/projects/index.json con tutti i file di progetto singoli
# Uso: bash scripts/sync-projects-index.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PROJECTS_DIR="$PROJECT_ROOT/data/projects"
INDEX_FILE="$PROJECTS_DIR/index.json"
TEMP_FILE="$INDEX_FILE.tmp"

# Controlla che la directory progetti esista
if [[ ! -d "$PROJECTS_DIR" ]]; then
  echo "❌ Directory non trovata: $PROJECTS_DIR"
  exit 1
fi

# Controlla che jq sia disponibile
if ! command -v jq &> /dev/null; then
  echo "❌ jq non è installato. Installa con: brew install jq"
  exit 1
fi

# Trova tutti i file JSON tranne index.json e ordina
PROJECT_FILES=($(find "$PROJECTS_DIR" -maxdepth 1 -name "*.json" ! -name "index.json" | sort))

if [[ ${#PROJECT_FILES[@]} -eq 0 ]]; then
  echo "⚠️  Nessun file di progetto trovato in $PROJECTS_DIR"
  exit 1
fi

# Assembla array JSON in file temporaneo
temp_array=$(mktemp)
{
  echo "["
  
  for i in "${!PROJECT_FILES[@]}"; do
    file="${PROJECT_FILES[$i]}"
    
    # Aggiunge virgola prima di ogni elemento eccetto il primo
    if [[ $i -gt 0 ]]; then
      echo ","
    fi
    
    # Valida e legge il file
    if jq empty "$file" 2>/dev/null; then
      cat "$file"
    else
      echo "❌ File JSON non valido: $(basename $file)" >&2
      rm "$temp_array"
      exit 1
    fi
  done
  
  echo ""
  echo "]"
} > "$temp_array"

# Valida il JSON assemblato
if jq empty "$temp_array" 2>/dev/null; then
  # Formatta e salva
  jq '.' "$temp_array" > "$INDEX_FILE"
  rm "$temp_array"
  echo "✅ Index sincronizzato: ${#PROJECT_FILES[@]} progetti"
else
  echo "❌ JSON non valido dopo assembly" >&2
  rm "$temp_array"
  exit 1
fi

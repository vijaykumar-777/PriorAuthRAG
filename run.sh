#!/usr/bin/env bash
# ==============================================================================
# Prior Authorization Hierarchical RAG Platform - Unified Launcher
# ==============================================================================
# Usage:
#   ./run.sh
# ==============================================================================

set -e

# Change directory to project root
cd "$(dirname "$0")"

# Prefer virtualenv Python if present
if [ -f "./venv/bin/python" ]; then
  PYTHON_EXEC="./venv/bin/python"
elif command -v python3 &> /dev/null; then
  PYTHON_EXEC="python3"
elif command -v python &> /dev/null; then
  PYTHON_EXEC="python"
else
  echo "Error: Python interpreter not found." >&2
  exit 1
fi

exec "$PYTHON_EXEC" run.py "$@"

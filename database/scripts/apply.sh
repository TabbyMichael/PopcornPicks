#!/usr/bin/env bash
# ============================================================================
# apply.sh
# Apply database migrations in order.
# Usage: ./scripts/apply.sh [DATABASE_URL]
# ============================================================================
set -euo pipefail

DATABASE_URL="${1:-${DATABASE_URL:-postgres://localhost:5432/popcornpicks}}"
MIGRATIONS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../migrations" && pwd)"

echo "Applying migrations from ${MIGRATIONS_DIR}"

for migration in "${MIGRATIONS_DIR}"/[0-9]*.sql; do
    [ -e "${migration}" ] || continue
    echo "Applying: $(basename "${migration}")"
    psql "${DATABASE_URL}" -v ON_ERROR_STOP=1 -f "${migration}"
done

echo "Migrations applied successfully."
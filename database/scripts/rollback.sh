#!/usr/bin/env bash
# ============================================================================
# rollback.sh
# Apply rollback migrations in reverse order.
# Usage: ./scripts/rollback.sh [DATABASE_URL]
# ============================================================================
set -euo pipefail

DATABASE_URL="${1:-${DATABASE_URL:-postgres://localhost:5432/popcornpicks}}"
ROLLBACK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../rollback" && pwd)"

echo "Applying rollback migrations from ${ROLLBACK_DIR}"

for rollback in $(ls "${ROLLBACK_DIR}"/[0-9]*.sql 2>/dev/null | sort -r); do
    echo "Rolling back: $(basename "${rollback}")"
    psql "${DATABASE_URL}" -v ON_ERROR_STOP=1 -f "${rollback}"
done

echo "Rollback migrations applied successfully."
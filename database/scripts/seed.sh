#!/usr/bin/env bash
# ============================================================================
# seed.sh
# Apply seed data (idempotent reference data).
# Usage: ./scripts/seed.sh [DATABASE_URL]
# ============================================================================
set -euo pipefail

DATABASE_URL="${1:-${DATABASE_URL:-postgres://localhost:5432/popcornpicks}}"
SEEDS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../seeds" && pwd)"

echo "Applying seeds from ${SEEDS_DIR}"

for seed in "${SEEDS_DIR}"/[0-9]*.sql; do
    [ -e "${seed}" ] || continue
    echo "Seeding: $(basename "${seed}")"
    psql "${DATABASE_URL}" -v ON_ERROR_STOP=1 -f "${seed}"
done

echo "Seeds applied successfully."
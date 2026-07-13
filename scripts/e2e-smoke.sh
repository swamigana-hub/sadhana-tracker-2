#!/usr/bin/env bash
# Smoke E2E for Sadhana Tracker — run against preview or production URL.
# Usage: ./scripts/e2e-smoke.sh [base-url]
# Example: npm run build && npm run preview -- --host 127.0.0.1 --port 4173 &
#          npm run e2e:smoke http://127.0.0.1:4173

set -euo pipefail

BASE_URL="${1:-http://127.0.0.1:4173}"
export AGENT_BROWSER_SESSION="${AGENT_BROWSER_SESSION:-sadhana-e2e}"

cleanup() {
  agent-browser close 2>/dev/null || true
}
trap cleanup EXIT

select_practice() {
  local name="$1"
  agent-browser eval "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('${name}') && !b.textContent.includes('Next')).click()"
}

echo "E2E smoke: $BASE_URL"

agent-browser open "$BASE_URL/setup"
agent-browser wait --load networkidle
agent-browser find role button click --name "Get started"

agent-browser wait --load networkidle
select_practice "Guru Pooja"
agent-browser find role button click --name "Next"

agent-browser wait --load networkidle
agent-browser scroll down 2000
agent-browser eval "Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Skip').click()"

agent-browser wait --load networkidle
agent-browser find role button click --name "Log Guru Pooja"
agent-browser wait 1500

agent-browser find role button click --name "Log additional practice"
agent-browser wait --load networkidle
agent-browser eval "document.querySelector('[role=dialog]') !== null"

agent-browser scroll down 800
agent-browser wait --load networkidle
agent-browser get text body | grep -q "Days practiced"
agent-browser get text body | grep -q "Minutes practiced"

echo "E2E smoke passed: setup → main → daily log → log additional → progress view"

#!/usr/bin/env bash
# One-shot deploy of the 911 Realtor Club site to GitHub Pages.
# Prereq (you run this once, it opens a browser): gh auth login
# Then:  bash deploy-to-github.sh
set -e

REPO="${1:-911-realtor-club}"     # repo name (arg 1, default 911-realtor-club)
VIS="${2:-public}"                # public | private  (private Pages needs GitHub Pro)

echo "Checking GitHub auth..."
gh auth status >/dev/null 2>&1 || { echo "Not logged in. Run:  gh auth login"; exit 1; }
OWNER="$(gh api user -q .login)"
echo "Deploying as: $OWNER  ->  repo: $REPO  ($VIS)"

# 1. Create the repo + wire the remote (no push yet)
gh repo create "$REPO" --"$VIS" --source=. --remote=origin

# 2. Enable GitHub Pages built from GitHub Actions (ignore if already enabled)
gh api --method POST "repos/$OWNER/$REPO/pages" -f build_type=workflow >/dev/null 2>&1 || true

# 3. Push main -> triggers the Actions workflow (build + deploy)
git push -u origin main

echo ""
echo "Done. The Actions workflow is building now."
echo "Watch it:   gh run watch"
echo "Live URL:   https://$OWNER.github.io/$REPO/"
echo "(first deploy takes ~1-2 min; Settings > Pages must show 'GitHub Actions')"

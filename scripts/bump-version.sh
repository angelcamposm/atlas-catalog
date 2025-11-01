#!/bin/bash

# Script to automatically bump the patch version in package.json
# Usage: ./scripts/bump-version.sh

set -e

PACKAGE_JSON="frontend/package.json"

# Check if package.json exists
if [ ! -f "$PACKAGE_JSON" ]; then
    echo "Error: $PACKAGE_JSON not found"
    exit 1
fi

# Get current version
CURRENT_VERSION=$(grep -o '"version": "[^"]*"' "$PACKAGE_JSON" | cut -d'"' -f4)

if [ -z "$CURRENT_VERSION" ]; then
    echo "Error: Could not find version in $PACKAGE_JSON"
    exit 1
fi

echo "Current version: $CURRENT_VERSION"

# Split version into major.minor.patch
IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR="${VERSION_PARTS[0]}"
MINOR="${VERSION_PARTS[1]}"
PATCH="${VERSION_PARTS[2]}"

# Increment patch version
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="${MAJOR}.${MINOR}.${NEW_PATCH}"

echo "New version: $NEW_VERSION"

# Update package.json with new version
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" "$PACKAGE_JSON"
else
    # Linux
    sed -i "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" "$PACKAGE_JSON"
fi

echo "✅ Version bumped from $CURRENT_VERSION to $NEW_VERSION"

# Add package.json to git staging area if it was modified
if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    git add "$PACKAGE_JSON"
    echo "✅ $PACKAGE_JSON staged for commit"
fi

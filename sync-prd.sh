#!/bin/bash
# sync-prd.sh
# Synchronizes PRD.md between main repo and wiki
# Usage: ./sync-prd.sh [to-wiki|to-repo]

set -e

REPO_DIR="$(dirname "$0")"
WIKI_DIR="${REPO_DIR}/../cecharactergen.wiki"
PRD_FILE="${REPO_DIR}/PRD.md"
WIKI_FILE="${WIKI_DIR}/Project-Requirements-Document.md"

show_help() {
    echo "Usage: ./sync-prd.sh [to-wiki|to-repo]"
    echo ""
    echo "Commands:"
    echo "  to-wiki    Copy PRD.md from repo to wiki"
    echo "  to-repo    Copy wiki PRD back to repo"
    echo "  help       Show this help message"
    echo ""
    echo "This script synchronizes the Product Requirements Document"
    echo "between the main repository and the wiki."
}

copy_to_wiki() {
    if [ ! -f "$PRD_FILE" ]; then
        echo "Error: PRD.md not found in repo"
        exit 1
    fi
    
    # Convert repo PRD to wiki format
    # Add wiki header and adjust relative links
    cat > "$WIKI_FILE" << 'WIKIHEADER'
# Project Requirements Document (PRD)

*This page is synchronized with the [PRD.md file](../blob/main/PRD.md) in the main repository.*

---

WIKIHEADER
    
    # Append the content, excluding the first title line and converting links
    tail -n +2 "$PRD_FILE" | sed 's|\.\/wiki\/\([^)]*\)|[[\1]]|g' >> "$WIKI_FILE"
    
    # Add footer
    cat >> "$WIKI_FILE" << 'WIKIFOOTER'

---

*This document is synchronized with the PRD.md file in the main repository. Changes to either should be reflected in both locations.*

**To update this document:** Edit [PRD.md](../blob/main/PRD.md) in the main repo, then copy changes here.
WIKIFOOTER
    
    echo "✓ Copied PRD.md to wiki/Project-Requirements-Document.md"
    echo "  Wiki file: $WIKI_FILE"
}

copy_to_repo() {
    if [ ! -f "$WIKI_FILE" ]; then
        echo "Error: Project-Requirements-Document.md not found in wiki"
        exit 1
    fi
    
    # Convert wiki format back to repo format
    # Remove wiki header and footer, convert wiki links back
    sed '1,/^---$/d' "$WIKI_FILE" | \
    sed '/^\*This document is synchronized/,/^WIKI$/d' | \
    sed 's/\[\[\([^]]*\)\]\]/\.\/wiki\/\1/g' > "$PRD_FILE"
    
    echo "✓ Copied wiki PRD to repo/PRD.md"
    echo "  Repo file: $PRD_FILE"
}

# Main
case "${1:-help}" in
    to-wiki)
        copy_to_wiki
        ;;
    to-repo)
        copy_to_repo
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "Error: Unknown command '$1'"
        show_help
        exit 1
        ;;
esac

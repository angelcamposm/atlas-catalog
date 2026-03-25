#!/bin/bash

# Fix Next.js 15 async params in all page files
# This script updates params type signatures and adds React.use() unwrapping

cd "$(dirname "$0")/.." || exit

echo "Fixing async params in Next.js 15..."
echo ""

# Find all page.tsx files that need fixing
files=$(grep -l "params: { locale" app/**/page.tsx 2>/dev/null || true)

if [ -z "$files" ]; then
    echo "No files need fixing!"
    exit 0
fi

for file in $files; do
    echo "Processing: $file"
    
    # Create a temporary file
    tmp_file=$(mktemp)
    
    # Use perl for complex multi-line regex replacements
    perl -i -pe '
        # Add use to React imports if not present
        s/^import \{ ((?:(?!use,).)+) \} from "react"/import { use, $1 } from "react"/
            if /^import \{/ && /from "react"/ && !/\buse\b/;
        
        # Update params type signature (with id)
        s/params: \{ locale: string; id: string \}/params: Promise<{ locale: string; id: string }>/g;
        
        # Update params type signature (without id)
        s/params: \{ locale: string \}/params: Promise<{ locale: string }>/g;
    ' "$file"
    
    # Check if file has params.id and params.locale
    has_id=$(grep -c "params\.id" "$file" 2>/dev/null || echo "0")
    has_locale=$(grep -c "params\.locale" "$file" 2>/dev/null || echo "0")
    
    # Add use(params) unwrapping after function declaration
    if [ "$has_id" -gt "0" ] && [ "$has_locale" -gt "0" ]; then
        # Both id and locale
        perl -i -pe 's/(export default function \w+\([^)]+\) \{\n)/$1    const { locale, id } = use(params);\n/ if !/{.*use\(params\)/;' "$file"
    elif [ "$has_locale" -gt "0" ]; then
        # Only locale
        perl -i -pe 's/(export default function \w+\([^)]+\) \{\n)/$1    const { locale } = use(params);\n/ if !/{.*use\(params\)/;' "$file"
    elif [ "$has_id" -gt "0" ]; then
        # Only id
        perl -i -pe 's/(export default function \w+\([^)]+\) \{\n)/$1    const { id } = use(params);\n/ if !/{.*use\(params\)/;' "$file"
    fi
    
    # Replace params.locale with locale
    perl -i -pe 's/params\.locale/locale/g' "$file"
    
    # Replace params.id with id
    perl -i -pe 's/params\.id/id/g' "$file"
    
    echo "  ✓ Fixed: $file"
done

echo ""
echo "Done! Fixed $(echo "$files" | wc -w) files."

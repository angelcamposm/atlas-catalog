#!/usr/bin/env node

/**
 * Fix Next.js 15 async params issue
 * This script updates all page components to use React.use() for unwrapping params
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all page.tsx files in the app directory
const pageFiles = glob.sync('app/**/page.tsx', {
    cwd: path.join(__dirname, '..'),
    absolute: true,
});

console.log(`Found ${pageFiles.length} page files to check\n`);

pageFiles.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Skip if already uses React.use()
    if (content.includes('use(params)')) {
        console.log(`✓ Already fixed: ${path.relative(process.cwd(), file)}`);
        return;
    }

    // Check if file uses params.locale or params.id
    if (!content.includes('params.locale') && !content.includes('params.id')) {
        console.log(`- Skipped (no params): ${path.relative(process.cwd(), file)}`);
        return;
    }

    // Add 'use' to React imports if not present
    if (content.includes('from "react"') && !content.includes('use,')) {
        content = content.replace(
            /import\s+{\s*([^}]+)\s*}\s+from\s+"react"/,
            (match, imports) => {
                if (!imports.includes('use')) {
                    const importsList = imports.split(',').map(i => i.trim());
                    importsList.unshift('use');
                    return `import { ${importsList.join(', ')} } from "react"`;
                }
                return match;
            }
        );
        modified = true;
    }

    // Update params type from { locale: string; id?: string } to Promise<...>
    content = content.replace(
        /params:\s*{\s*locale:\s*string;?\s*(id:\s*string;?)?\s*}/g,
        (match) => {
            const hasId = match.includes('id:');
            if (hasId) {
                return 'params: Promise<{ locale: string; id: string }>';
            }
            return 'params: Promise<{ locale: string }>';
        }
    );

    // Add params unwrapping at the start of the component
    content = content.replace(
        /(export default function \w+\([^)]+\) {\n)/,
        (match) => {
            // Determine what params to unwrap based on what's used in the file
            const hasId = content.includes('params.id');
            const hasLocale = content.includes('params.locale');
            
            if (hasId && hasLocale) {
                return match + '    const { locale, id } = use(params);\n';
            } else if (hasLocale) {
                return match + '    const { locale } = use(params);\n';
            } else if (hasId) {
                return match + '    const { id } = use(params);\n';
            }
            return match;
        }
    );

    // Replace all params.locale with locale
    content = content.replace(/params\.locale/g, 'locale');
    
    // Replace all params.id with id
    content = content.replace(/params\.id/g, 'id');

    if (content !== fs.readFileSync(file, 'utf8')) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✓ Fixed: ${path.relative(process.cwd(), file)}`);
        modified = true;
    }

    if (!modified) {
        console.log(`- No changes: ${path.relative(process.cwd(), file)}`);
    }
});

console.log('\nDone!');

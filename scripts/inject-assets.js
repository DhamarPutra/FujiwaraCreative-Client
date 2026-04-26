import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MANIFEST_PATH = path.resolve(__dirname, '../../Server/public/.vite/manifest.json');
const BLADE_PATH = path.resolve(__dirname, '../../Server/resources/views/app.blade.php');

const START_HOOK = '{{-- VITE_ASSETS_START --}}';
const END_HOOK = '{{-- VITE_ASSETS_END --}}';

function inject() {
    console.log('🚀 Injecting Vite assets into Blade template...');

    if (!fs.existsSync(MANIFEST_PATH)) {
        console.error(`❌ Manifest not found at ${MANIFEST_PATH}. Did you run "vite build"?`);
        process.exit(1);
    }

    if (!fs.existsSync(BLADE_PATH)) {
        console.error(`❌ Blade template not found at ${BLADE_PATH}. Creation failed?`);
        process.exit(1);
    }

    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    const entry = manifest['src/main.tsx'];

    if (!entry) {
        console.error('❌ Entry point "src/main.tsx" not found in manifest.');
        process.exit(1);
    }

    let tags = `\n    <script type="module" src="/${entry.file}"></script>`;
    
    if (entry.css) {
        entry.css.forEach(cssFile => {
            tags = `\n    <link rel="stylesheet" href="/${cssFile}" />` + tags;
        });
    }
    
    tags += '\n    ';

    const bladeContent = fs.readFileSync(BLADE_PATH, 'utf-8');
    const regex = new RegExp(`${escapeRegExp(START_HOOK)}[\\s\\S]*?${escapeRegExp(END_HOOK)}`, 'g');
    
    const updatedContent = bladeContent.replace(regex, `${START_HOOK}${tags}${END_HOOK}`);

    fs.writeFileSync(BLADE_PATH, updatedContent);
    console.log('✅ Assets injected successfully!');
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

inject();

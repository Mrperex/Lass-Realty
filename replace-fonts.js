const fs = require('fs');
const path = require('path');

const dirs = ['app', 'components'];
const targetExts = ['.tsx', '.ts', '.js', '.jsx'];

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    content = content.replace(/font-outfit/g, 'font-montserrat');
    content = content.replace(/font-cormorant/g, 'font-playfair');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated fonts in: ${filePath}`);
    }
}

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            traverse(fullPath);
        } else if (targetExts.includes(path.extname(fullPath))) {
            replaceInFile(fullPath);
        }
    }
}

dirs.forEach(dir => traverse(path.join(__dirname, dir)));
console.log('Font replacement complete.');

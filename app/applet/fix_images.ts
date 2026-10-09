import fs from 'fs';
let content = fs.readFileSync('src/views/LandingView.tsx', 'utf-8');
content = content.replace(/<img /g, '<img referrerPolicy="no-referrer" ');
fs.writeFileSync('src/views/LandingView.tsx', content);

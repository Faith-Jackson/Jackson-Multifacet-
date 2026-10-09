import fs from 'fs';

let content = fs.readFileSync('src/views/LandingView.tsx', 'utf-8');

// Replace amber with coffee
content = content.replace(/amber/g, 'coffee');
// Specifically the rgba values for shadow. Amber was 245,158,11. Coffee is 169,128,88.
content = content.replace(/245,158,11/g, '169,128,88');

fs.writeFileSync('src/views/LandingView.tsx', content);
console.log('Done replacement');

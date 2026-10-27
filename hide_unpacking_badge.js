const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// 1. Hide #__bundler_loading in CSS
content = content.replace(
  '#__bundler_loading { position: fixed; bottom: 20px; right: 20px; font: 13px/1.4 -apple-system, BlinkMacSystemFont, sans-serif; color: #666; background: #fff; padding: 8px 14px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.12); z-index: 10000; }',
  '#__bundler_loading { display: none !important; }'
);

// 2. Hide #__bundler_loading in HTML
content = content.replace(
  '<div id="__bundler_loading">Unpacking...</div>',
  '<div id="__bundler_loading" style="display:none !important"></div>'
);

fs.writeFileSync('index.html', content, 'utf8');

console.log('Successfully hidden #__bundler_loading element completely!');

const fs = require('fs');
const filePath = 'src/components/FABMenu/FABMenu.tsx';
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Change radius to full and update shadows if applicable
  content = content.replace(/borderRadius: \d+,/g, 'borderRadius: theme.radius.full,');
  fs.writeFileSync(filePath, content);
}

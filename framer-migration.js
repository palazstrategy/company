const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);
let modifiedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace imports
  // "import { motion }" or "import {motion}" -> "import { m }"
  // "import { motion, AnimatePresence }" -> "import { m, AnimatePresence }"
  // "import { AnimatePresence, motion }" -> "import { AnimatePresence, m }"
  if (content.match(/import\s+{([^}]*)\bmotion\b([^}]*)}\s+from\s+['"]framer-motion['"]/)) {
      content = content.replace(/import\s+{([^}]*)\bmotion\b([^}]*)}\s+from\s+['"]framer-motion['"]/g, "import { $1m$2 } from 'framer-motion'");
  }

  // Replace tags
  // <motion.div -> <m.div
  // </motion.div> -> </m.div>
  // motion(Component) -> m(Component)
  if (content.includes('motion.')) {
      content = content.replace(/<motion\./g, '<m.');
      content = content.replace(/<\/motion\./g, '</m.');
      content = content.replace(/ motion\(/g, ' m('); // HOC usage
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log('Modified:', file.replace(__dirname, ''));
  }
});

console.log(`\nMigration complete. Modified ${modifiedCount} files.`);

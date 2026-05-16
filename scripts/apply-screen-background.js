/**
 * Remplace ImageBackground + home-background par ScreenBackground dans app/
 */
const fs = require("fs");
const path = require("path");

const appDir = path.join(__dirname, "..", "app");

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (/\.(tsx|ts)$/.test(name)) files.push(p);
  }
  return files;
}

const skip = new Set([
  path.normalize("app/_layout.tsx"),
  path.normalize("app/(root)/(tabs)/profile/theme.tsx"),
  path.normalize("app/(root)/(tabs)/profile/index.tsx"),
]);

for (const file of walk(appDir)) {
  const rel = path.relative(path.join(__dirname, ".."), file).replace(/\\/g, "/");
  if (skip.has(rel)) continue;

  let content = fs.readFileSync(file, "utf8");
  if (!content.includes("home-background.png")) continue;

  if (!content.includes("ScreenBackground")) {
    const importLine =
      'import { ScreenBackground } from "@/components/ScreenBackground";\n';
    // Insérer après le dernier import complet (évite de couper un import multiligne)
    const importBlocks = [...content.matchAll(/^import .+?;$/gm)];
    if (importBlocks.length > 0) {
      const last = importBlocks[importBlocks.length - 1];
      const insertAt = last.index + last[0].length + 1;
      content =
        content.slice(0, insertAt) + importLine + content.slice(insertAt);
    } else {
      content = importLine + content;
    }
  }

  content = content.replace(
    /const homeBackground = require\("@\/assets\/images\/home-background\.png"\);\r?\n\r?\n?/g,
    ""
  );
  content = content.replace(
    /<ImageBackground\s+source=\{homeBackground\}\s+style=\{([^}]+)\}\s+resizeMode="cover"\s*>/g,
    "<ScreenBackground style={$1}>"
  );
  content = content.replace(/<\/ImageBackground>/g, "</ScreenBackground>");

  if (content.includes('from "react-native"') && content.includes("ImageBackground")) {
    content = content.replace(
      /,\s*ImageBackground/g,
      ""
    );
    content = content.replace(/ImageBackground,\s*/g, "");
  }

  fs.writeFileSync(file, content);
  console.log("Updated:", rel);
}

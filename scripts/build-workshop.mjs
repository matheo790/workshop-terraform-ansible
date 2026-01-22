import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const docs = path.join(root, "docs");
const header = path.join(docs, "workshop.header.md");
const stepsDir = path.join(docs, "steps");

// Génère 2 fichiers : étudiant + formateur
const outStudent = path.join(docs, "workshop.md");
const outInstructor = path.join(docs, "workshop.instructor.md");

// Flags CLI
const instructorMode = process.argv.includes("--instructor");
const generateBoth = process.argv.includes("--both") || !instructorMode; 
// Par défaut : on génère les 2 (pratique). Si tu veux uniquement instructor: --instructor

function readText(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}

// IMPORTANT : ne jamais laisser '---' seul dans le contenu des steps,
// sinon MOAW croit que c'est un séparateur de page.
function sanitizeStepContent(md) {
  // Remplace toute ligne exactement "---" par "***" (HR markdown safe)
  return md.replace(/^\s*---\s*$/gm, "***").trim();
}

// Mode formateur : blocs filtrés pour les étudiants
function stripInstructorBlocks(md) {
  return md.replace(
    /<!--\s*INSTRUCTOR:START\s*-->[\s\S]*?<!--\s*INSTRUCTOR:END\s*-->\n?/g,
    ""
  );
}

// Injecte un badge de progression sous le premier H1
function injectProgressBadge(md, stepNo, total) {
  const badge = [
    `> **🧭 Progression : Étape ${stepNo}/${total}**`,
    `>`,
    `> ✅ À la fin, je valide avec : \`curl http://localhost:8080/health\` (si applicable)`,
  ].join("\n");

  // On l'injecte juste après le premier titre H1
  // Si pas de H1, on le met en haut (fallback)
  if (/^#\s+/m.test(md)) {
    return md.replace(/^#\s+.+$/m, (m) => `${m}\n\n${badge}\n`);
  }
  return `${badge}\n\n${md}`;
}

function buildWorkshop({ includeInstructorBlocks, outFile }) {
  const steps = fs
    .readdirSync(stepsDir)
    .filter((f) => f.endsWith(".md"))
    .sort((a, b) => a.localeCompare(b, "en"));

  const total = steps.length;
  const parts = [];
  parts.push(readText(header).trim());

  steps.forEach((file, idx) => {
    let content = sanitizeStepContent(readText(path.join(stepsDir, file)));

    // Si on génère la version étudiant, on retire les blocs instructor
    if (!includeInstructorBlocks) {
      content = stripInstructorBlocks(content);
    }

    // Badge Step X/N
    content = injectProgressBadge(content, idx + 1, total);

    // Séparateur MOAW entre steps
    parts.push("---\n\n" + content);
  });

  fs.writeFileSync(outFile, parts.join("\n\n"), "utf-8");
  console.log(
    `Generated: ${path.relative(root, outFile)} (${total} steps) [instructor=${includeInstructorBlocks}]`
  );
}

// Génération
// Par défaut : on génère les 2 fichiers pour éviter les erreurs de “j’ai oublié le build”
if (generateBoth) {
  buildWorkshop({ includeInstructorBlocks: false, outFile: outStudent });
  buildWorkshop({ includeInstructorBlocks: true, outFile: outInstructor });
} else {
  // Mode uniquement instructor si tu veux (rare)
  buildWorkshop({ includeInstructorBlocks: true, outFile: outInstructor });
}

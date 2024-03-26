import fs from "fs";
import path from "path";
import archiver from "archiver";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, "bin", "lambda.zip");
const outputDir = path.dirname(outputPath);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const output = fs.createWriteStream(outputPath);
const archive = archiver("zip", { zlib: { level: 9 } });

archive.on("warning", (err) => {
  if (err.code === "ENOENT") {
    console.warn(err);
  } else {
    throw err;
  }
});

archive.on("error", (err) => {
  throw err;
});

archive.pipe(output);

archive.glob("**/*", { cwd: path.join(__dirname, "src") });

["package.json", "package-lock.json", "readme.md"].forEach((file) => {
  archive.file(path.join(__dirname, file), { name: file });
});

archive.glob("node_modules/**/*", { cwd: __dirname, dot: true });

archive.finalize();

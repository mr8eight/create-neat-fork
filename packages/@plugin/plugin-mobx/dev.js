import { spawn } from "cross-spawn";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fse from "fs-extra";

// 获取 ESM 中的 __dirname 等效值
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建 dist/generator 目录
const distGeneratorPath = join(__dirname, "dist", "generator");
try {
  fse.ensureDirSync(distGeneratorPath);
} catch (err) {
  console.error("目录创建失败:", err);
  process.exit(1);
}

// 复制模板文件
const srcTemplatePath = join(__dirname, "src", "generator", "template");
const distTemplatePath = join(__dirname, "dist", "generator", "template");
try {
  fse.copySync(srcTemplatePath, distTemplatePath, { recursive: true });
} catch (err) {
  console.error("目录复制失败:", err);
  process.exit(1);
}

// 启动 tsc 进程
const tscProcess = spawn("pnpm", ["tsc", "-w"], {
  stdio: "inherit",
  shell: process.platform === "win32", // 仅在 Windows 下使用 shell 模式
});

tscProcess.on("error", (err) => {
  console.error("tsc 进程启动出错:", err);
  process.exit(1);
});

tscProcess.on("close", (code) => {
  if (code !== 0) {
    console.error(`tsc 进程异常退出，退出码: ${code}`);
  }
  // process.exit(code);
});

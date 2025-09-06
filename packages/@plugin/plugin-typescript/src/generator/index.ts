import type GeneratorAPI from "@src/models/GeneratorAPI.js";
import path from "path";
import fs from "fs";
import { FileData } from "@src/models/FileTree.js";

type ConfigGenerator = () => void;

const __dirname = import.meta.dirname;
// 文件类型正则表达式映射
const FileReg: Record<string, RegExp> = {
  js: /\.js$/i,
  jsx: /\.jsx$/i,
};

function processTypeScriptFiles(fileData: FileData): FileData {
  for (const srcDir of fileData.children) {
    if (path.basename(srcDir.path) === "src") {
      for (const tsFile of srcDir.children) {
        const ext = path.extname(tsFile.path);
        if (FileReg["js"].test(ext)) {
          // 更新文件扩展名
          const newExt = `.ts`;
          tsFile.path = tsFile.path.replace(ext, newExt);
          tsFile.describe.fileExtension = "ts";
        } else if (FileReg["jsx"].test(ext)) {
          // 更新文件扩展名
          const newExt = `.tsx`;
          tsFile.path = tsFile.path.replace(ext, newExt);
          tsFile.describe.fileExtension = "tsx";
        }
      }
    }
  }
  return fileData;
}

const templateToBuildToolProtocol = {
  ADD_CONFIG: "ADD_CONFIG",
  ENTRY_FILE: "ENTRY_FILE",
  UPDATE_EXPORT_CONTENT_PROTOCOL: "UPDATE_EXPORT_CONTENT_PROTOCOL",
  INSERT_IMPORT_PROTOCOL: "INSERT_IMPORT_PROTOCOL",
  SLOT_CONTENT_PROTOCOL: "SLOT_CONTENT_PROTOCOL",
  REPLACE_CONTENT_PROTOCOL: "REPLACE_CONTENT_PROTOCOL",
};

function fileRender(files: Record<string, string>): void {
  try {
    const outputDir = path.join(__dirname, "template");
    Object.entries(files).forEach(([filePath, content]) => {
      const fullPath = path.join(outputDir, filePath);
      fs.writeFileSync(fullPath, content, "utf-8");
    });
  } catch (error) {
    console.log("文件渲染失败: ", error);
  }
}

const generateReactConfig: ConfigGenerator = () => {
  const files = {
    "tsconfig.json": `{
      "compilerOptions": {
        "target": "ES2020",
        "module": "ES2020",
        "strict": true,
        "allowJs": true,
        "moduleResolution": "node",
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "forceConsistentCasingInFileNames": true,
        "useDefineForClassFields": true,
        "baseUrl": ".",
        "jsx": "react-jsx",
        "paths": {
          "@/*": ["src/*"]
        },
        "lib": ["esnext", "dom", "dom.iterable", "scripthost"]
      },
      "include": ["src/**/*.ts", "src/**/*.tsx"],
      "exclude": ["node_modules"]
    }`,
  };
  fileRender(files);
};

const generateVueConfig: ConfigGenerator = () => {
  const files = {
    "tsconfig.json": `{
      "compilerOptions": {
        "target": "ES2020",
        "module": "ES2020",
        "strict": true,
        "allowJs": true,
        "moduleResolution": "node",
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "forceConsistentCasingInFileNames": true,
        "useDefineForClassFields": true,
        "baseUrl": ".",
        "paths": {
          "@/*": ["src/*"]
        },
        "lib": ["esnext", "dom", "dom.iterable", "scripthost"]
      },
      "include": ["src/**/*.ts"],
      "exclude": ["node_modules"]
    }`,
  };
  fileRender(files);
};

const typescriptPlugin = (generatorAPI: GeneratorAPI) => {
  let devDependencies = {
    typescript: "~5.4.0",
    "@types/node": "^20.11.28",
    "ts-node": "^10.9.2",
  };
  const reactDeps = {
    "@types/react": "^18.0.37",
    "@types/react-dom": "^18.0.11",
  };
  const vueDeps = {};
  const preset = generatorAPI.generator.getPreset();
  if (preset.template === "react") {
    devDependencies = { ...devDependencies, ...reactDeps };
    generateReactConfig();
  } else if (preset.template === "vue") {
    devDependencies = { ...devDependencies, ...vueDeps };
    generateVueConfig();
  }
  generatorAPI.extendPackage({
    devDependencies,
  });
  const fileData = generatorAPI.generator.getFiles().getFileData();
  processTypeScriptFiles(fileData);
  generatorAPI.protocolGenerate({
    [templateToBuildToolProtocol.ADD_CONFIG]: {
      params: {
        content: {
          rules: [
            {
              test: /\.ts$/, // 匹配所有以 .ts 结尾的文件 (修正了正则表达式)
              exclude: /node_modules/, // 排除 node_modules 目录
              use: [
                {
                  loader: "ts-loader", // 指定 TS Loader
                },
              ],
            },
          ],
        },
      },
      priority: 1,
    },
  });
};

export default typescriptPlugin;

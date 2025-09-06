import type GeneratorAPI from "@src/models/GeneratorAPI.js";
import path from "path";
import { FileData } from "@src/models/FileTree.js";

import { pluginToTemplateProtocol } from "../../../../core/dist/src/configs/protocol.js";
// 样式文件类型正则表达式映射
const StyleReg: Record<string, RegExp> = {
  css: /\.css$/i,
  scss: /\.scss$/i,
  less: /\.less$/i,
};

/**
 * 处理样式文件
 * @param plugin 插件名称（'css' | 'scss' | 'less'）
 * @param fileData 文件树结构
 */
function processStyleFiles(plugin: keyof typeof StyleReg, fileData: FileData): FileData {
  const regex = StyleReg["css"];
  // 遍历文件树
  for (const srcDir of fileData.children) {
    if (path.basename(srcDir.path) === "src") {
      for (const styleFile of srcDir.children) {
        const ext = path.extname(styleFile.path);

        if (regex.test(ext)) {
          // 更新文件扩展名
          const newExt = `.${plugin}`;
          styleFile.path = styleFile.path.replace(ext, newExt);
          styleFile.describe.fileExtension = plugin;
        }
      }
    }
  }

  return fileData;
}

// 插件主入口
export default (generatorAPI: GeneratorAPI) => {
  // 添加依赖
  generatorAPI.extendPackage({
    devDependencies: {
      sass: "^1.81.0",
      "sass-loader": "^16.0.0",
    },
  });
  const fileData = generatorAPI.generator.getFiles().getFileData();
  // 处理样式文件
  const cssType = generatorAPI.getCssType();
  processStyleFiles(cssType, fileData);
  // 生成协议配置
  generatorAPI.protocolGenerate({
    [pluginToTemplateProtocol.INSERT_IMPORT_PROTOCOL]: {
      params: {
        imports: [
          {
            dir: "src",
            modules: [
              {
                name: "",
                from: `./style/main.${generatorAPI.getCssType()}`,
              },
            ],
          },
        ],
        astOptions: {
          parserOptions: {
            sourceType: "module",
            plugins: ["jsx", "typescript"],
          },
        },
      },
    },
    [pluginToTemplateProtocol.REPLACE_CONTENT_PROTOCOL]: {
      params: {
        replaceConfig: [
          {
            url: "src/App",
            replacedItem: "@import",
            replaceContent: "@use",
          },
        ],
      },
    },
  });
};

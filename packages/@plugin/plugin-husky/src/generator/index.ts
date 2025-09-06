import path from "path";
import fs from "fs";
import type GeneratorAPI from "@src/models/GeneratorAPI.js";

const __dirname = import.meta.dirname;

type ConfigGenerator = (generatorAPI: GeneratorAPI, pkgManager: string) => void;

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

const basicConfig = (pkgManager: string) => {
  return {
    scripts: {
      postinstall: "husky install",
      "commit-msg": "commitlint --edit $1",
    },
    "lint-staged": {
      "*.{ts,tsx,js,jsx}": [`${pkgManager} format:ci`, `${pkgManager} lint:ci`],
    },
    devDependencies: {
      husky: "^9.0.11",
      "lint-staged": "^15.2.0",
      "@commitlint/cli": "^18.4.3",
      "@commitlint/config-conventional": "^18.4.3",
    },
  };
};

const generateBasicConfig: ConfigGenerator = (generatorAPI, pkgManager) => {
  generatorAPI.extendPackage(basicConfig(pkgManager));
  const files = {
    ".commitlintrc.js": `module.exports = {
      extends: ["@commitlint/config-conventional"]
    }`,
  };
  fileRender(files);
};

const generateStrictConfig: ConfigGenerator = (generatorAPI, pkgManager) => {
  const res = basicConfig(pkgManager);
  generatorAPI.extendPackage({
    ...res,
    scripts: {
      ...res.scripts,
      "pre-commit": `lint-staged && ${pkgManager} run test`,
    },
    "lint-staged": {
      ...res["lint-staged"],
      "*.{css,scss,less}": [`${pkgManager} stylelint`],
    },
    devDependencies: {
      ...res.devDependencies,
      stylelint: "^15.10.0",
    },
  });
  const files = {
    ".commitlintrc.js": `module.exports = {
      extends:["@commitlint/config-conventional"],
      rules:{
        'body-max-line-length':[2,'always',100],
        'subject-case':[2,'always','lower-case'],
        'type-enum':[
          2,
          'always',
          ['feat','fix','docs','style','refactor','perf','test','chore','revert']
        ]
      }
    }`,
  };
  fileRender(files);
};

const configs: Record<string, ConfigGenerator> = {
  basic: generateBasicConfig,
  strict: generateStrictConfig,
};

const pluginConfig = (generatorAPI, template, configType = "basic") => {
  const generator = configs[configType];
  const preset = generatorAPI.getPreset();
  const pkgManager = preset.packageManager;
  if (!generator) {
    console.warn(`不支持的配置类型：${configType}`);
    return configs.basic(generatorAPI, pkgManager);
  }

  return generator(generatorAPI, pkgManager);
};

export default pluginConfig;

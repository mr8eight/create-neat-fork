// plugins/eslint/generator/index.ts
import type GeneratorAPI from "@src/models/GeneratorAPI.js";

// const pluginToBuildToolProtocol = {
//   ADD_COMPILER_CONFIG: "ADD_COMPILER_CONFIG",
//   ENTRY_FILE: "ENTRY_FILE",
//   UPDATE_EXPORT_CONTENT_PROTOCOL: "UPDATE_EXPORT_CONTENT_PROTOCOL",
//   INSERT_IMPORT_PROTOCOL: "INSERT_IMPORT_PROTOCOL",
//   SLOT_CONTENT_PROTOCOL: "SLOT_CONTENT_PROTOCOL",
//   REPLACE_CONTENT_PROTOCOL: "REPLACE_CONTENT_PROTOCOL",
// };

// 通用 ESLint 配置基座
const baseESLintConfig = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "no-console": "warn",
    "no-unused-vars": "warn",
  },
};

// React 扩展配置
const reactExtensions = {
  extends: ["plugin:react/recommended", "plugin:react-hooks/recommended"],
  plugins: ["react", "react-hooks"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react/jsx-uses-vars": "error",
    "react/jsx-uses-react": "error",
  },
};

// Vue 扩展配置
const vueExtensions = {
  extends: ["plugin:vue/recommended"],
  plugins: ["vue"],
  rules: {
    "vue/multi-word-component-names": "off",
    "vue/html-indent": ["error", 2],
  },
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
};

// 依赖集合
const commonDeps = { eslint: "^8.32.0" };
const reactDeps = {
  "eslint-plugin-react": "^7.32.2",
  "eslint-plugin-react-hooks": "^4.6.0",
};
const vueDeps = {
  "eslint-plugin-vue": "^9.9.0",
  "@babel/eslint-parser": "^7.19.1",
};
const webpackDeps = {
  "eslint-webpack-plugin": "^5.0.2",
};

export default (generatorAPI: GeneratorAPI) => {
  // 根据模板合并配置
  const preset = generatorAPI.generator.getPreset();
  const eslintConfig = { ...baseESLintConfig };
  let devDependencies = { ...commonDeps };

  if (preset.template === "react") {
    Object.assign(eslintConfig, reactExtensions);
    devDependencies = { ...devDependencies, ...reactDeps };
  } else if (preset.template === "vue") {
    Object.assign(eslintConfig, vueExtensions);
    devDependencies = { ...devDependencies, ...vueDeps };
  }
  if (preset.buildTool === "webpack") {
    devDependencies = { ...devDependencies, ...webpackDeps };
  }
  // 注入 package.json 配置
  generatorAPI.extendPackage({
    eslint: eslintConfig,
    scripts: {
      lint: "eslint . --ext .js,.ts,.jsx,.tsx,.vue",
    },
    devDependencies,
  });
  // 调用协议注入构建工具配置（如 webpack 的 eslint-loader）
  // generatorAPI.protocolGenerate({
  //   [pluginToBuildToolProtocol.ADD_COMPILER_CONFIG]: {
  //     compiler: "eslint",
  //     template: preset.template,
  //     buildTool: preset.buildTool,
  //   },
  // });
};

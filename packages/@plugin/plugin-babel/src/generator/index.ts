// 这里不采用tsc-alias引入而直接定义是因为，tsc-alias只在编译过程中起作用，而最终生成的实际文件仍然是未编译的引用（比如@src），这样node会出现找不到模块的情况。
// 后期插件要考虑单独发包，所以插件尽量不要引入core内部的实际函数。（类型可以）
const pluginToBuildToolProtocol = {
  ADD_COMPILER_CONFIG: "ADD_COMPILER_CONFIG",
  ENTRY_FILE: "ENTRY_FILE",
  UPDATE_EXPORT_CONTENT_PROTOCOL: "UPDATE_EXPORT_CONTENT_PROTOCOL",
  INSERT_IMPORT_PROTOCOL: "INSERT_IMPORT_PROTOCOL",
  SLOT_CONTENT_PROTOCOL: "SLOT_CONTENT_PROTOCOL",
  REPLACE_CONTENT_PROTOCOL: "REPLACE_CONTENT_PROTOCOL",
};
// 通用的Babel预设和插件
const commonBabelPresets = [
  [
    "@babel/preset-env",
    {
      useBuiltIns: "usage",
      corejs: 3,
    },
  ],
  "@babel/preset-typescript",
];

const commonBabelPlugins = [
  "@babel/plugin-transform-runtime",
  "@babel/plugin-syntax-dynamic-import",
];

// 通用的依赖
const commonDependencies = {
  "core-js": "^3.8.3",
};

const commonDevDependencies = {
  "@babel/core": "^7.24.7",
  "@babel/preset-env": "^7.24.7",
  "@babel/runtime": "^7.24.7",
  "@babel/plugin-transform-runtime": "^7.24.7",
  "babel-loader": "^9.1.3",
  "@babel/plugin-syntax-dynamic-import": "^7.8.3",
  "@babel/preset-typescript": "^7.24.7",
  "cross-spawn": "^7.0.3",
};

// React的Babel配置
const reactBabelConfig = {
  presets: ["@babel/preset-react", ...commonBabelPresets],
  plugins: [...commonBabelPlugins],
};

// Vue的Babel配置
const vueBabelConfig = {
  presets: [...commonBabelPresets, "@vue/cli-plugin-babel/preset", "@vue/babel-preset-jsx"],
  plugins: ["@vue/babel-plugin-jsx", ...commonBabelPlugins],
};

const pluginConfig = (generatorAPI) => {
  let config;
  const preset = generatorAPI.generator.getPreset();
  if (preset.template === "react") {
    config = {
      babel: reactBabelConfig,
      dependencies: commonDependencies,
      devDependencies: {
        ...commonDevDependencies,
        "@babel/preset-react": "^7.24.7",
      },
    };
  } else if (preset.template === "vue") {
    config = {
      babel: vueBabelConfig,
      dependencies: commonDependencies,
      devDependencies: {
        ...commonDevDependencies,
        "@vue/cli-plugin-babel": "^5.0.8",
        "@vue/babel-plugin-jsx": "1.2.2",
        "@ant-design-vue/vue-jsx-hot-loader": "^0.1.4",
      },
    };
  }

  // 扩展package.json配置
  generatorAPI.extendPackage({
    ...config,
  });

  generatorAPI.protocolGenerate({
    [pluginToBuildToolProtocol.ADD_COMPILER_CONFIG]: {
      compiler: "babel",
      template: preset.template,
      buildTool: preset.buildTool,
    },
  });
};

export default pluginConfig;

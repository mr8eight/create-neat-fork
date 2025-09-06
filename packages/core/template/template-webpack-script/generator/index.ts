import TemplateAPI from "../../../src/models/TemplateAPI.js";

const devDependencies = {
  autoprefixer: "^10.4.19",
  chalk: "^4.0.0",
  "circular-dependency-plugin": "^5.2.2",
  "copy-webpack-plugin": "^12.0.2",
  "cross-spawn": "^7.0.3",
  "css-loader": "^7.1.2",
  "css-minimizer-webpack-plugin": "^7.0.0",
  dotenv: "^16.4.5",
  "dotenv-expand": "^11.0.6",
  "fork-ts-checker-webpack-plugin": "^9.0.2",
  "html-webpack-plugin": "^5.6.0",
  "mini-css-extract-plugin": "^2.9.0",
  portfinder: "^1.0.32",
  "postcss-loader": "^8.1.1",
  "purgecss-webpack-plugin": "^6.0.0",
  "terser-webpack-plugin": "^5.3.10",
  webpack: "^5.91.0",
  "webpack-dev-server": "^5.0.4",
  "webpack-manifest-plugin": "^5.0.0",
  "cross-env": "^7.0.3",
  "webpack-cli": "^5.1.4"
};

// 检查是否为TypeScript项目
const isTypeScript = process.env.isTs === "true";

// 根据是否为TypeScript项目返回不同的scripts
function getScripts() {
  const configFile = isTypeScript ? "./webpack.config.ts" : "./webpack.config.js";
  
  return {
    dev: `cross-env NODE_ENV=development npx webpack serve --config ${configFile}`,
    build: `cross-env NODE_ENV=production npx webpack build --config ${configFile}`,
  };
}

export default (templateAPI: TemplateAPI, template: string) => {
  const scripts = getScripts();
  
  if (template === "vue") {
    templateAPI.extendPackage({
      scripts,
      dependencies: {},
      devDependencies: {
        ...devDependencies,
        "vue-loader": "^17.4.2",
        "vue-style-loader": "^4.1.3",
        "style-loader": "^4.0.0",
      },
    });
  } else if (template === "react") {
    templateAPI.extendPackage({
      scripts,
      dependencies: {},
      devDependencies: {
        ...devDependencies,
        "@pmmmwh/react-refresh-webpack-plugin": "^0.5.15",
        "react-refresh": "^0.14.2",
        "style-loader": "^4.0.0",
      },
    });
  }
};

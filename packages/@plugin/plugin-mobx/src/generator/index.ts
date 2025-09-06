import type GeneratorAPI from "@src/models/GeneratorAPI.js";

const pluginToTemplateProtocol = {
  PROCESS_STYLE_PLUGIN: "PROCESS_STYLE_PLUGIN",
  ENTRY_FILE: "ENTRY_FILE",
  UPDATE_EXPORT_CONTENT_PROTOCOL: "UPDATE_EXPORT_CONTENT_PROTOCOL",
  INSERT_IMPORT_PROTOCOL: "INSERT_IMPORT_PROTOCOL",
  SLOT_CONTENT_PROTOCOL: "SLOT_CONTENT_PROTOCOL",
  REPLACE_CONTENT_PROTOCOL: "REPLACE_CONTENT_PROTOCOL",
};

export default (generatorAPI: GeneratorAPI) => {
  // 1. 添加 MobX 核心依赖
  generatorAPI.extendPackage({
    devDependencies: {
      mobx: "^6.6.4",
      "mobx-react-lite": "^3.2.2",
    },
  });

  // 2. 协议化配置注入
  generatorAPI.protocolGenerate({
    // 导入声明协议
    [pluginToTemplateProtocol.INSERT_IMPORT_PROTOCOL]: {
      params: {
        imports: [
          {
            dir: "src/App",
            modules: [
              {
                name: "{ observer }",
                from: "mobx-react-lite",
              },
            ],
          },
          {
            dir: "src/App",
            modules: [
              {
                name: "{ store }",
                from: "../counter",
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

    // 导出包装协议
    [pluginToTemplateProtocol.UPDATE_EXPORT_CONTENT_PROTOCOL]: {
      params: {
        url: "src/App",
        exportContent: "observer",
        astOptions: {
          parserOptions: {
            sourceType: "module",
            plugins: ["jsx", "typescript"],
          },
        },
      },
    },

    // 插槽内容注入协议
    [pluginToTemplateProtocol.SLOT_CONTENT_PROTOCOL]: {
      params: {
        slotConfig: [
          {
            url: "src/App",
            slotName: "store-slot",
            slotContent: "const handleIncrement = () => store.increment();",
          },
        ],
      },
    },
  });
};

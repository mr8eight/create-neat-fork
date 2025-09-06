import type GeneratorAPI from "@src/models/GeneratorAPI.js";

import { pluginToTemplateProtocol } from "../../../../core/dist/src/configs/protocol.js";

const routerPlugin = (generatorAPI: GeneratorAPI) => {
  generatorAPI.extendPackage({
    dependencies: {
      "react-router-dom": "^6.0.0",
    },
  });

  generatorAPI.protocolGenerate({
    [pluginToTemplateProtocol.INSERT_IMPORT_PROTOCOL]: {
      params: {
        imports: [
          {
            dir: "src/App",
            modules: [
              {
                name: "{ BrowserRouter as Router, Route }",
                from: "react-router-dom",
              },
            ],
          },
        ],
        astOptions: {
          parserOptions: {
            sourceType: "module",
            plugins: ["typescript", "jsx"] as const,
          },
        },
      },
    },
    [pluginToTemplateProtocol.SLOT_CONTENT_PROTOCOL]: {
      params: {
        slotConfig: [
          {
            url: "src/App",
            slotName: "router-start-slot",
            slotContent: "<Router>",
          },
          {
            url: "src/App",
            slotName: "router-end-slot",
            slotContent: "</Router>",
          },
        ],
      },
    },
  });
};

export default routerPlugin;

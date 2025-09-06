import { parse, ParserOptions } from "@babel/parser";
import _traverse, { NodePath } from "@babel/traverse";
import t from "@babel/types";
import generateDefault from "@babel/generator";

// 定义生成器函数类型
interface GeneratorResult {
  code: string;
  map?: object;
}

// 提取 t 的类型
type BabelTypes = typeof t;

type GenerateFunction = (ast: object, opts?: object, code?: string) => GeneratorResult;

// 定义 operations 类型
type Operations = {
  Program?: (path: NodePath<t.Program>, t: BabelTypes) => void;
  ImportDeclaration?: (path: NodePath<t.ImportDeclaration>, t: BabelTypes) => void;
  ExportDefaultDeclaration?: (path: NodePath<t.ExportDefaultDeclaration>, t: BabelTypes) => void;
  ExportNamedDeclaration?: (path: NodePath<t.ExportNamedDeclaration>, t: BabelTypes) => void;
  VariableDeclaration?: (path: NodePath<t.VariableDeclaration>, t: BabelTypes) => void;
  FunctionDeclaration?: (path: NodePath<t.FunctionDeclaration>, t: BabelTypes) => void;
  ArrowFunctionExpression?: (path: NodePath<t.ArrowFunctionExpression>, t: BabelTypes) => void;
  ClassDeclaration?: (path: NodePath<t.ClassDeclaration>, t: BabelTypes) => void;
  ClassMethod?: (path: NodePath<t.ClassMethod>, t: BabelTypes) => void;
  ExpressionStatement?: (path: NodePath<t.ExpressionStatement>, t: BabelTypes) => void;
  CallExpression?: (path: NodePath<t.CallExpression>, t: BabelTypes) => void;
  JSXElement?: (path: NodePath<t.JSXElement>, t: BabelTypes) => void;
  JSXAttribute?: (path: NodePath<t.JSXAttribute>, t: BabelTypes) => void;
  Literal?: (path: NodePath<t.Literal>, t: BabelTypes) => void;
};

// 创建正确类型的函数引用
const generateCode = generateDefault.default as unknown as GenerateFunction; // TypeScript 不允许直接从一个特定类型断言到另一个不相关的类型，但允许通过 unknown 作为中间步骤。

//正确的 traverse 使用方法
const traverse = _traverse.default;

/**
 * 封装AST操作的通用函数
 * @param {string} fileContent 源代码字符串
 * @param {object} operations 用户定义的操作对象
 * @param {object} parserOptions 解析器选项（可选）
 * @returns {string} 修改后的代码
 */
export function transformCode(
  fileContent: string,
  operations: Operations,
  parserOptions: ParserOptions,
) {
  // 1. 解析源代码为AST
  const ast = parse(fileContent, parserOptions);
  // 2. 遍历AST，应用用户定义的操作逻辑
  traverse(ast, {
    Program(path) {
      if (operations.Program) {
        operations.Program(path, t);
      }
    },
    ImportDeclaration(path) {
      if (operations.ImportDeclaration) {
        operations.ImportDeclaration(path, t);
      }
    },
    ExportDefaultDeclaration(path) {
      if (operations.ExportDefaultDeclaration) {
        operations.ExportDefaultDeclaration(path, t);
      }
    },
    ExportNamedDeclaration(path) {
      if (operations.ExportNamedDeclaration) {
        operations.ExportNamedDeclaration(path, t);
      }
    },
    VariableDeclaration(path) {
      if (operations.VariableDeclaration) {
        operations.VariableDeclaration(path, t);
      }
    },
    FunctionDeclaration(path) {
      if (operations.FunctionDeclaration) {
        operations.FunctionDeclaration(path, t);
      }
    },
    ArrowFunctionExpression(path) {
      if (operations.ArrowFunctionExpression) {
        operations.ArrowFunctionExpression(path, t);
      }
    },
    ClassDeclaration(path) {
      if (operations.ClassDeclaration) {
        operations.ClassDeclaration(path, t);
      }
    },
    ClassMethod(path) {
      if (operations.ClassMethod) {
        operations.ClassMethod(path, t);
      }
    },
    ExpressionStatement(path) {
      if (operations.ExpressionStatement) {
        operations.ExpressionStatement(path, t);
      }
    },
    CallExpression(path) {
      if (operations.CallExpression) {
        operations.CallExpression(path, t);
      }
    },
    JSXElement(path) {
      if (operations.JSXElement) {
        operations.JSXElement(path, t);
      }
    },
    JSXAttribute(path) {
      if (operations.JSXAttribute) {
        operations.JSXAttribute(path, t);
      }
    },
    Literal(path) {
      if (operations.Literal) {
        operations.Literal(path, t);
      }
    },
    // 其他常见节点类型可以继续扩展
  });

  // 3. 生成新的代码
  return generateCode(ast, {}, fileContent).code;
}

const fs = require("fs");
const { resolve } = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const t = require("@babel/types");

const SOURCE_CODE = resolve("./index.js");

const TARGET_FOLDER = resolve("outputs");

// 读入源代码
const code = fs.readFileSync(`${SOURCE_CODE}`, "utf-8");
// 将源代码转换成AST
const ast = parser.parse(code);

let writeToFile = function (funcName, funcCode) {
  fs.writeFileSync(`${TARGET_FOLDER}/${funcName}.js`, funcCode);
};

let createImportDeclaration = function (funcName) {
  return t.importDeclaration(
    [t.importDefaultSpecifier(t.identifier(funcName))],
    t.stringLiteral(`./${funcName}`)
  );
};

traverse(ast, {
  AssignmentExpression({ node }) {
    const { left, right } = node;
    // 如果当前节点的左右子节点为成员表达式节点及函数表达式节点
    // 则需要提取函数
    if (
      left.type === "MemberExpression" &&
      right.type === "FunctionExpression"
    ) {
      // 获取表达式节点及属性名称
      const { object, property } = left;
      // 检查节点的属性名称是否为prototype
      if (object.property.name === "prototype") {
        const funcName = property.name;
        // 将AST重新生成源码
        const { code: funcCode } = generator(right);
        const replaceNode = t.identifier(funcName);
        // 修改右子树，用函数名替换函数声明
        node.right = replaceNode;
        // 将函数声明写入单独的文件
        writeToFile(funcName, `export default ${funcCode}`);
        // 将模块引入到旧的遗留代码中
        ast.program.body.unshift(createImportDeclaration(funcName));
      }
    }
  },
});
// 将AST重新生成源码，并写入到遗留代码。
writeToFile('refacted_code', generator(ast).code);

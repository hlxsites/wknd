const cellNameRegex = /^\$?[A-Z]+\$?(\d+)$/;

function visitor(nameMap, fields) {
  return function visit(n) {
    if (n.type === 'Field') {
      const name = n?.name;
      const match = cellNameRegex.exec(name);
      let field;
      if (match?.[1]) {
        field = nameMap[match[1]];
      }
      if (!field) {
        // eslint-disable-next-line no-console
        console.log(`Unknown column used in excel formula ${n.name}`);
      } else {
        n.name = field.name;
        fields.add(field.id);
      }
    } if (n.type === 'Function') {
      n.name = n.name.toLowerCase();
    } else if (n.type === 'Subexpression') {
      return visit({
        type: 'Field',
        name: n.children[1].name,
      }, n.children[0].name);
    }
    return {
      ...n,
      children: n.children?.map((c) => visit(c)),
    };
  };
}

function updateCellNames(ast, rowNumberFieldMap) {
  const fields = new Set();
  const newAst = visitor(rowNumberFieldMap, fields)(ast);
  return [newAst, Array.from(fields)];
}

export default function transformRule({ prop, expression }, fieldToCellMap, formula) {
  const ast = formula.compile(expression.slice(1));
  const [newAst, deps] = updateCellNames(ast, fieldToCellMap);
  return {
    prop,
    deps,
    ast: newAst,
  };
}

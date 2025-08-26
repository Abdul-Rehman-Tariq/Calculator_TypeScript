
export type EvalContext = {
  variables: Record<string, number>;
  constants: Record<string, number>;
};

function isNumber(str: string) {
  return /^-?\d+(\.\d+)?$/.test(str);
}

function isIdentifier(str: string) {
  return /^[a-zA-Z_]\w*$/.test(str);
}

function tokenize(expr: string): string[] {
  // Tokenize numbers, operators, parentheses, functions, variables, constants
  const regex = /\s*([A-Za-z_][A-Za-z_0-9]*|\d*\.\d+|\d+|\^|\*|\/|\+|\-|\(|\))/g;
  let tokens: string[] = [];
  let match;
  while ((match = regex.exec(expr)) !== null) {
    tokens.push(match[1]);
  }
  return tokens;
}

function parsePrimary(tokens: string[], ctx: EvalContext): number {
  let token = tokens.shift();
  if (!token) throw new Error('Unexpected end of expression');
  if (token === '(') {
    const val = parseExpression(tokens, ctx);
    if (tokens.shift() !== ')') throw new Error('Missing closing parenthesis');
    return val;
  }
  if (isNumber(token)) return parseFloat(token);
  if (isIdentifier(token)) {
    // Functions or variables/constants
    if (['sqrt', 'sin', 'cos', 'tan'].includes(token)) {
      if (tokens.shift() !== '(') throw new Error(`Missing '(' after function ${token}`);
      const arg = parseExpression(tokens, ctx);
      if (tokens.shift() !== ')') throw new Error('Missing closing parenthesis');
      switch (token) {
        case 'sqrt': return Math.sqrt(arg);
        case 'sin': return Math.sin(arg);
        case 'cos': return Math.cos(arg);
        case 'tan': return Math.tan(arg);
      }
    }
    // Variable or constant
    if (token in ctx.variables) return ctx.variables[token];
    if (token in ctx.constants) return ctx.constants[token];
    throw new Error(`Unknown variable or constant: ${token}`);
  }
  throw new Error(`Unexpected token: ${token}`);
}

function parseFactor(tokens: string[], ctx: EvalContext): number {
  let val = parsePrimary(tokens, ctx);
  while (tokens[0] === '^') {
    tokens.shift();
    val = Math.pow(val, parsePrimary(tokens, ctx));
  }
  return val;
}

function parseTerm(tokens: string[], ctx: EvalContext): number {
  let val = parseFactor(tokens, ctx);
  while (tokens[0] === '*' || tokens[0] === '/') {
    const op = tokens.shift();
    const right = parseFactor(tokens, ctx);
    if (op === '*') val *= right;
    else {
      if (right === 0) throw new Error('Division by zero');
      val /= right;
    }
  }
  return val;
}

function parseExpression(tokens: string[], ctx: EvalContext): number {
  let val = parseTerm(tokens, ctx);
  while (tokens[0] === '+' || tokens[0] === '-') {
    const op = tokens.shift();
    const right = parseTerm(tokens, ctx);
    if (op === '+') val += right;
    else val -= right;
  }
  return val;
}

export function evaluate(expr: string, ctx: EvalContext): number {
  expr = expr.replace(/\s+/g, '');
  const tokens = tokenize(expr);
  if (tokens.length === 0) throw new Error('Empty expression');
  const val = parseExpression(tokens, ctx);
  if (tokens.length > 0) throw new Error('Unexpected token: ' + tokens[0]);
  return val;
}

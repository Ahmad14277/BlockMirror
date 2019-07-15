BlockMirrorTextToBlocks.BINOPS = [
    ["+", "Add", Blockly.Python.ORDER_ADDITIVE, 'Return the sum of the two numbers.'],
    ["-", "Sub", Blockly.Python.ORDER_ADDITIVE, 'Return the difference of the two numbers.'],
    ["*", "Mult", Blockly.Python.ORDER_MULTIPLICATIVE, 'Return the product of the two numbers.'],
    ["/", "Div", Blockly.Python.ORDER_MULTIPLICATIVE, 'Return the quotient of the two numbers.'],
    ["%", "Mod", Blockly.Python.ORDER_MULTIPLICATIVE, 'Return the remainder of the first number divided by the second number.'],
    ["**", "Pow", Blockly.Python.ORDER_EXPONENTIATION, 'Return the first number raised to the power of the second number.'],
    ["//", "FloorDiv", Blockly.Python.ORDER_MULTIPLICATIVE, 'Return the truncated quotient of the two numbers.'],
    ["<<", "LShift", Blockly.Python.ORDER_BITWISE_SHIFT, 'Return the left number left shifted by the right number.'],
    [">>", "RShift", Blockly.Python.ORDER_BITWISE_SHIFT, 'Return the left number right shifted by the right number.'],
    ["|", "BitOr", Blockly.Python.ORDER_BITWISE_OR, 'Returns the bitwise OR of the two values.'],
    ["^", "BitXor", Blockly.Python.ORDER_BITWISE_XOR, 'Returns the bitwise XOR of the two values.'],
    ["&", "BitAnd", Blockly.Python.ORDER_BITWISE_AND, 'Returns the bitwise AND of the two values.'],
    ["@", "MatMult", Blockly.Python.ORDER_MULTIPLICATIVE, 'Return the matrix multiplication of the two numbers.']
];
var BINOPS_SIMPLE = ['Add', 'Sub', 'Mult', 'Div', 'Mod', 'Pow'];
var BINOPS_BLOCKLY_DISPLAY_FULL = BlockMirrorTextToBlocks.BINOPS.map(
    binop => [binop[0], binop[1]]
);
var BINOPS_BLOCKLY_DISPLAY = BINOPS_BLOCKLY_DISPLAY_FULL.filter(
    binop => BINOPS_SIMPLE.indexOf(binop[1]) >= 0
);
var BINOPS_BLOCKLY_GENERATE = {};
BlockMirrorTextToBlocks.BINOPS.forEach(function (binop) {
    BINOPS_BLOCKLY_GENERATE[binop[1]] = [" " + binop[0] + " ", binop[2]];
    Blockly.Constants.Math.TOOLTIPS_BY_OP[binop[1]] = binop[3];
});

BlockMirrorTextToBlocks.BLOCKS.push({
    "type": "ast_BinOpFull",
    "message0": "%1 %2 %3",
    "args0": [
        {"type": "input_value", "name": "A"},
        {"type": "field_dropdown", "name": "OP", "options": BINOPS_BLOCKLY_DISPLAY_FULL},
        {"type": "input_value", "name": "B"}
    ],
    "inputsInline": true,
    "output": null,
    "style": "math_blocks",
    "extensions": ["math_op_tooltip"]
});

BlockMirrorTextToBlocks.BLOCKS.push({
    "type": "ast_BinOp",
    "message0": "%1 %2 %3",
    "args0": [
        {"type": "input_value", "name": "A"},
        {"type": "field_dropdown", "name": "OP", "options": BINOPS_BLOCKLY_DISPLAY},
        {"type": "input_value", "name": "B"}
    ],
    "inputsInline": true,
    "output": null,
    "style": "math_blocks",
    "extensions": ["math_op_tooltip"]
});

Blockly.Python['ast_BinOp'] = function (block) {
    // Basic arithmetic operators, and power.
    var tuple = BINOPS_BLOCKLY_GENERATE[block.getFieldValue('OP')];
    var operator = tuple[0];
    var order = tuple[1];
    var argument0 = Blockly.Python.valueToCode(block, 'A', order) || Blockly.Python.blank;
    var argument1 = Blockly.Python.valueToCode(block, 'B', order) || Blockly.Python.blank;
    var code = argument0 + operator + argument1;
    return [code, order];
};

BlockMirrorTextToBlocks.prototype['ast_BinOp'] = function (node) {
    let left = node.left;
    let op = node.op.name;
    let right = node.right;

    let blockName = (BINOPS_SIMPLE.indexOf(op) >= 0) ? "ast_BinOp" : 'ast_BinOpFull';

    return BlockMirrorTextToBlocks.create_block(blockName, node.lineno, {
        "OP": op
    }, {
        "A": this.convert(left),
        "B": this.convert(right)
    }, {
        "inline": true
    });
}

Blockly.Python['ast_BinOpFull'] = Blockly.Python['ast_BinOp'];
BlockMirrorTextToBlocks.prototype['ast_BinOpFull'] = BlockMirrorTextToBlocks.prototype['ast_BinOp'];

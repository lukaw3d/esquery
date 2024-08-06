import esquery from '../esquery.js';
import conditional from './fixtures/conditional.js';
import simpleProgram from './fixtures/simpleProgram.js';

describe('Complex selector query', function () {

    it('two types child', function () {
        const matches = esquery(conditional, 'IfStatement > BinaryExpression');
        assert.includeMembers(matches, [
            conditional.body[0].test
        ]);
    });

    it('three types child', function () {
        const matches = esquery(conditional, 'IfStatement > BinaryExpression > Identifier');
        assert.includeMembers(matches, [
            conditional.body[0].test.left
        ]);
    });

    it('two types descendant', function () {
        const matches = esquery(conditional, 'IfStatement BinaryExpression');
        assert.includeMembers(matches, [
            conditional.body[0].test
        ]);
    });

    it('two types sibling', function () {
        const matches = esquery(simpleProgram, 'VariableDeclaration ~ IfStatement');
        assert.includeMembers(matches, [
            simpleProgram.body[3]
        ]);
    });

    it('two types adjacent', function () {
        const matches = esquery(simpleProgram, 'VariableDeclaration + ExpressionStatement');
        assert.includeMembers(matches, [
            simpleProgram.body[2]
        ]);
    });

    it('can not match a top level node', function () {
        // Test fix for issue #135: half of a child selector matches a top-level node.
        const matches = esquery(simpleProgram, 'NonExistingNodeType > *');
        assert.isEmpty(matches);
    });

    it('fails :has should not match self', function () {
        const matches = esquery(simpleProgram, 'BlockStatement:has(BlockStatement:has(BlockStatement))');
        assert.equal(0, matches.length);

        const matches2 = esquery(simpleProgram, 'Identifier:has([name="y"])');
        assert.equal(0, matches2.length);

        const matches3 = esquery(simpleProgram, 'BlockStatement:matches(BlockStatement:matches(BlockStatement))');
        assert.equal(1, matches3.length);
    });
});

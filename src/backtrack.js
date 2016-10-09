var support = require('@sbj42/maze-generator-support');
var GridMask = support.GridMask;
var dirs = support.directions;

/**
 * @typedef {Object} MGOptions
 * @property {Function} random Returns a random float between 0 (inclusive) and 1 (exclusive)
 */

/**
 * Chooses a random integer between 0 (inclusive) and max (exclusive)
 *
 * @param {MGOptions} options
 * @param {integer} max
 */
function randomInt(options, max) {
    return Math.floor(options.random() * max);
}

/**
 * Chooses a random element from an array
 *
 * @param {MGOptions} options
 * @param {Array} array
 */
function randomChoice(options, array) {
    return array[randomInt(options, array.length)];
}

/**
 * Returns an array of directions toward neighboring
 * cells that have not been visited (i.e. cells for
 * which visited.get returns false).
 *
 * @param {GridMask} visited
 * @param {integer[]} pos
 */
function getUnvisitedDirections(visited, pos) {
    var ret = [];
    for (var i = 0; i < dirs.ALL.length; i ++) {
        var dir = dirs.ALL[i];
        if (!visited.get(pos[0] + dirs.dx(dir), pos[1] + dirs.dy(dir)))
            ret.push(dir);
    }
    return ret;
}

/**
 * Recursive-backtracking maze generator.
 *
 * @param {Maze} maze
 * @param {MGOptions} options
 */
function backtrack(maze, options) {
    var width = maze.width();
    var height = maze.height();

    // The 'visited' mask marks cells that have been added to the maze
    // We use this to see which neighbors are available for connecting
    // with a passage.  To avoid making a passage to the outside of
    // the grid, we mark the exterior cells as if they were already
    // included.
    var visited = new GridMask(width, height, {exterior: true});

    // Start with a random cell in the grid
    var cur = [randomInt(options, width), randomInt(options, height)];
    // Mark the first cell as visited
    visited.set(cur[0], cur[1], true);
    // This array will hold the cells that we've moved through,
    // to which we may return later to create a new branch
    var stack = [];

    // Loop until the maze is complete
    for (;;) {

        // Which directions can we go from this cell,
        // that lead to cells that aren't yet in the maze?
        var neighbors = getUnvisitedDirections(visited, cur);

        if (neighbors.length) {
            // If there is at least one such direction, pick
            // one at random
            var dir = randomChoice(options, neighbors);
            // Push the current cell onto the stack
            stack.push(cur);
            // Dig a passage from the curent cell to the next cell
            maze.setPassage(cur[0], cur[1], dir, true);
            // Move on to the next cell
            cur = [cur[0] + dirs.dx(dir), cur[1] + dirs.dy(dir)];
            // Which is now in the maze
            visited.set(cur[0], cur[1], true);
        } else if (stack.length) {
            // If there are no available directions here, but
            // there are still cells in the stack, then pop
            // the last cell off the stack ("backtracking"),
            // and continue from there ("recusrive")
            cur = stack.pop();
        } else {
            // If there are no available directions and the
            // stack is empty, then the maze is complete
            break;
        }
    }
}

module.exports = backtrack;

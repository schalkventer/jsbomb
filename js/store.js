// @ts-check


/**
 * @typedef {'s' | 'm' | 'l'} Size -
 * @typedef {'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'bomb'} Status
 * @typedef {'paused' | 'running' | 'lost' | 'won'} Phase
 */


/**
 * The specific location as expressed by a column and row of a specific game
 * cell. 
 * @typedef {object} Placement
 *
 * @prop {number} column - Position of a cell from left side of the game. The
 * maximum amount of columns that can exist is determined by the size setting on
 * the game. However it can never be more than 30.
 *
 * @prop {number} row - Position of a cell from top of game. Note that there
 * will never be more than 6 rows in the game.
 */


/**
 * ...
 * @typedef {object} Cell
 * @prop {string} id - ...
 * @prop {Placement} placement
 * @prop {Status} status - ...
 */


/**
 * @typedef {object} Game
 * @prop {string} id - ...
 * @prop {Phase} phase - ...
 * @prop {Size} size - ...
 * @prop {number} time - ...
 * @prop {Record<string, boolean>} open - ...
 * @prop {Record<string, Cell>} cells - ...
 */


/**
 * @typedef {object} State
 * @prop {Game} game
 * 
 * @prop {object} highscores
 * @prop {number} highscores.s
 * @prop {number} highscores.m
 * @prop {number} highscores.l
 */


/**
 * @type {Record<Size, number>}
 */
const SIZE_MAP = {
    s: 6,
    m: 12,
    l: 24,
}

/**
 * 
 */
const OFFSETS = {
    topLeft: [-1, -1],
    topCenter: [0, -1],
    topRight: [1, -1],
    left: [-1, 0],
    center: [0, 0],
    right: [1, 0],
    bottomLeft: [-1, 1],
    bottomCenter: [0, 1],
    bottomRight: [1, 1],
}

/**
 * @return {string}
 */
const createId = () => [
        Math.random() * 1000000000000000000,
        new Date().getTime(),
        Math.random() * 1000000000000000000,
].join('')


/**
 * @param {Size} size
 * @returns {Placement}
 */
const calcRandomPlacement = (size) => {
    const column = Math.round(Math.random() * 6) + 1
    const row = Math.round(Math.random() * SIZE_MAP[size]) + 1

    return {
        column,
        row
    }
}


/**
 * @param {Placement[]} reference
 * @param {Placement} placement
 * @returns {boolean}
 */
const calcIfBomb = (reference, placement) => {
    const { row, column } = placement
    const match = reference.find(item => item.row === row && item.column === column)
    return Boolean(match)
}


/**
 * @param {any} value 
 * @returns {Status}
 */
const isStatus = (value) => {
    /**
     * @type {Status[]}
     */
    const STATUS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', 'bomb']
    if (!STATUS.includes(value)) throw new Error('Expected value to be of type "status"')
    return value
}


/**
 * @param {Placement[]} bombs
 * @param {Placement} placement
 * @returns {Status}
 */
const calcStatus = (bombs, placement) => {
    if (calcIfBomb(bombs, placement)) {
        return 'bomb'
    }

    const result = Object
        .values(OFFSETS)
        .reduce((acc, [x, y]) => {
            const isBomb = calcIfBomb(bombs, { column: placement.column + x, row: placement.row + y })
            return isBomb ? acc + 1 : acc
        }, 0)

    return isStatus(result.toString())
}


/**
 * @param {number} count 
 * @param {(index: number) => void} callback 
 */
const loopAmount = (count, callback) => {
    for (let i = 0; i < count; i++) {
        callback(i + 1)
    }
}


/**
 * @param {Size} size
 */
const createCells = (size) => {
    const bombs = []
    const totalBombs = Math.floor(SIZE_MAP[size] / 3)

    while (bombs.length < totalBombs) {
        const { column, row } = calcRandomPlacement(size)
        const hasPlacement = bombs.find(item => item.column === column && item.row === row)
        if (!hasPlacement) bombs.push({ column, row })
    }

    /**
     * @type {Record<string, Cell>}
     */
    const result = {}

    loopAmount(6, (row) => {
        loopAmount(SIZE_MAP[size], (column) => {
            const id = createId()

            result[id] = {
                id,
                status: calcStatus(bombs, { column, row  }),
                placement: {
                    column,
                    row,
                }
            }
        })
    })

    return result
}

/**
 * @param {Size} size
 * @returns {Game} 
 */
export const createNewGame = (size) => {
    const cells = createCells(size)
    const entries = Object.keys(cells).map(singleKey => [singleKey, false])

    return {
        id: createId(),
        cells: createCells(size),
        open: Object.fromEntries(entries),
        phase: 'paused',
        size,
        time: 0,
    }
}

/**
 * @typedef {object} Store
 * @prop {State} state
 * @prop {(prev: State, next: State) => void} [listen]
 * @prop {(fn: (state: State) => State) => void} mutate
 */

/**
 * @returns {Store}
 */
const createStore = () => {
    return {
        state: {
            game: createNewGame('s'),
            highscores: {
                s: 0,
                m: 0,
                l: 0,
            },
        },
        mutate (changes) {
            const prev = structuredClone(this.state)
            const next = structuredClone(changes(prev))
            this.state = next
            if (this.listen) this.listen(prev, next)
        },
    }
}

export const store = createStore()
export default store
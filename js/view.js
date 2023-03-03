// @ts-check

import { store } from './store.js'

/**
 * @param {Element} node
 * @param {(typeof store)['state']} state
 */
const render = (node, state) => {
    const {
        game: {
            cells,
            open,
            phase,
            size,
            time,
        },
    } = state

    const cellsHtml = Object.values(cells).map(({ id }) => /* html */ `
        <button class="cell" data-id="${id}" data-display="${open[id] ? 'open' : 'closed'}"></button>
    `).join('')

    node.innerHTML = /* html */ `
        <div class="grid">
            ${cellsHtml}
        </div>
    `
}

/**
 * @param {Element} node
 * @param {(typeof store)['state']} prev
 * @param {(typeof store)['state']} next
 */
const update = (node, prev, next) => {
    const {
        game: {
            id: gameId,
            cells,
            open,
        },
    } = next

    if (gameId !== prev.game.id) {
        const list = Array.from(document.querySelectorAll('[data-id]'))
        const newIds = Object.keys(cells)

        list.forEach((html, index) => {
            const innerId = newIds[index]
            html.setAttribute('data-display', 'closed') 
            html.setAttribute('data-id', innerId)
        })
    }

    Object.values(cells).forEach(({ id }) => {
        if (prev.game.open[id] && !open[id]) {
            /**
             * @type {any}
             */
            const html = node.querySelector(`[data-id="${id}"]`)
            html.setAttribute('data-display', 'closed')
        }

        if (!prev.game.open[id] && open[id]) {
             /**
             * @type {any}
             */
            const html = node.querySelector(`[data-id="${id}"]`)
            html.setAttribute('data-display', 'open')

            const status = cells[id].status
            if (status !== '0') html.innerText = status
        }
    })
}

/**
 * @param {Element} node
 * @param {Record<string, (event: Event) => void>} config
 */
const events = (node, config) => {
    Object.entries(config || {}).forEach(([name, callback]) => {
        node.addEventListener(name, event => {
            callback(event)
        })
    })
}

export const view = {
    render,
    update,
    events,
}

export default view
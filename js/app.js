// @ts-check

import view from './view.js'
import store, { createNewGame } from './store.js'

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js");
}

const app = document.querySelector('[data-app]')
if (!app) throw new Error('No app shell detected')

view.render(app, store.state)
store.listen = (prev, next) => { view.update(app, prev, next) }

view.events(app, {
    click: (event) => {
        /**
         * @type {any}
         */
        const target = event.target
        const { id } = target.dataset

        if (id) store.mutate(state => {
            const cell = state.game.cells[id]
            console.log(cell)

            if (cell.status === 'bomb') return {
                ...state,
                game: createNewGame('s'),
            }

            return {
                ...state,
                game: {
                    ...state.game,
                    open: {
                        ...state.game.open,
                        [id]: true,
                    }
                }

            }
        })

    }
})


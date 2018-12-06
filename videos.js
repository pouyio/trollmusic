const videos = {
    current: null,
    list: [
        // { id: 'HNpWuwSVyDk', user: 'pollo2' },
        // { id: '_kC_xaRs9lM', user: 'pollo3' },
        // { id: 'RvWbcK3YQ_o', user: 'pollo2' }
    ],
    add(id, user) {
        if (!this.current) {
            this.current = { id, user, seconds: 0 };
        }
        if (this.current && !this.list.some(v => v.id === id)) {
            this.list.push({ id, user })
        }
    }
}

module.exports = videos;
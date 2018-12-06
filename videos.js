const videos = {
    current: null,
    list: [
        // { id: 'HNpWuwSVyDk', user: 'pollo2' },
        // { id: '_kC_xaRs9lM', user: 'pollo3' },
        // { id: 'RvWbcK3YQ_o', user: 'pollo2' }
    ],
    queue(id, user) {
        if (this.current && this.current.id !== id && !this.list.some(v => v.id === id)) {
            this.list.push({ id, user })
        }
    },
    reset() {
        this.list = [];
    },
    removeAndNext(id) {
        this.list = this.list.filter(v => v.id !== id);
        if (this.list.length) {
            this.current = { ...this.list[0], seconds: 0 };
        } else {
            this.current = null;
        }
    }
}

module.exports = videos;
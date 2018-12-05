const videos = {
    list: [
        { id: 'HNpWuwSVyDk', user: 'pollo2', state: true, seconds: 30 },
        // { id: '_kC_xaRs9lM', user: 'pollo3', state: 0, seconds: 0 },
        // { id: 'RvWbcK3YQ_o', user: 'pollo2', state: 0, seconds: 0 }
    ],
    add: function (id, user) {
        if (!this.list.some(v => v.id === id)) {
            this.list.push({ user, id })
        }
    },
    update: function (id, seconds, isCurrent) {
        this.list = this.list.map(v => {
            if (v.id === id) {
                const updatedVid = { ...v, seconds, isCurrent }
                return updatedVid;
            }
            return v;
        })
    },
    remove: function (id) {
        this.list = this.list.filter(v => v.id === id);
    },
    getCurrent: function () {
        return this.list[0]
    }
}

module.exports = videos;
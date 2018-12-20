const videos = {
    current: null,
    list: [
        // { video: 'HNpWuwSVyDk', title: 'Architects un titulo muy largo Architects un titulo muy largo', user: 'pollo2' },
        // { video: '_kC_xaRs9lM', title: 'el segundo', user: 'pollo3' },
        // { video: 'RvWbcK3YQ_o', title: 'el tercero', user: 'pollo2' }
    ],
    add({ video, title, user }) {
        this.current = { video, title, user };
        if (this.current && this.current.video !== video && !this.list.some(v => v.video === video)) {
            this.list = [{ video, title, user }, ...this.list];
        }
    },
    queue({ video, title, user }) {
        if (this.current && this.current.video !== video && !this.list.some(v => v.video === video)) {
            this.list.push({ video,title, user })
        }
    },
    reset() {
        this.list = [];
    },
    removeAndNext(video) {
        this.list = this.list.filter(v => v.video !== video);
        if (this.list.length) {
            this.current = { ...this.list.shift(), seconds: 0 };
        } else {
            this.current = null;
        }
    }
}

module.exports = videos;
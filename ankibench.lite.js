/**
 * AnkiBench Lite
 * Main Script
 * 
 * Created in 1 hr.
 * (C) 2021 Soruto Project
 */

(async function () {
    const loaderOptions = {

        moduleCache: {
            vue: Vue
        },

        async getFile(url) {

            const res = await fetch(url);
            if (!res.ok)
                throw Object.assign(new Error(url + ' ' + res.statusText), { res });
            return await res.text();
        },

        addStyle(textContent) {

            const style = Object.assign(document.createElement('style'), { textContent });
            const ref = document.head.getElementsByTagName('style')[0] || null;
            document.head.insertBefore(style, ref);
        },
    }

    const { loadModule } = window["vue3-sfc-loader"];

    const index_page = Vue.defineAsyncComponent(() => loadModule('./pages/index.vue', loaderOptions));
    const start_page = Vue.defineAsyncComponent(() => loadModule('./pages/start.vue', loaderOptions));
    const learn_page = Vue.defineAsyncComponent(() => loadModule('./pages/learn.vue', loaderOptions));

    const routes = [
        { path: "/", component: index_page },
        { path: "/start/:fileId", component: start_page },
        { path: "/learn/:fileId", component: learn_page },
    ]

    const router = VueRouter.createRouter({
        history: VueRouter.createWebHashHistory(),
        routes
    })

    const App = Vue.defineAsyncComponent(() => loadModule('App.vue', loaderOptions))

    const app = Vue.createApp(App);

    app.use(router)

    app.mount("#app");

})();

//DB init
const db = new Dexie("ankibench-lite-db");
db.version(1).stores({
    files: "id"
});

const generateId = function(){
    const char = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let id = "";
    for(let i = 0 ; i < 16; i++){
        id+=char[Math.floor(Math.random() * char.length)]
    }
    return id
}
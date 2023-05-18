// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    //   modules: ['@nuxt/ui'],
    css: ['bootstrap/dist/css/bootstrap.css'],
    //   script: [{ src: 'bootstrap/dist/js/bootstrap.min.js', body: true }],
    router: {
        options: {
            routes: () => [
                {
                    name: 'aaa',
                    path: '/aaa',
                    component: () => import('~/pages/about.vue'),
                },
            ],
        },
    },
});

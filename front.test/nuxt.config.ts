import { NuxtPage } from 'nuxt/schema';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    //   modules: ['@nuxt/ui'],
    css: ['bootstrap/dist/css/bootstrap.css'],
    //   script: [{ src: 'bootstrap/dist/js/bootstrap.min.js', body: true }],
    hooks: {
        'pages:extend'(pages) {
            // add a route
            pages.push({
                name: 'articles',
                path: '/',
                file: '~/pages/articles.vue',
            });
            // remove routes
            function removePagesMatching(
                pattern: RegExp,
                pages: NuxtPage[] = []
            ) {
                const pagesToRemove = [];
                console.log(pages);
                for (const page of pages) {
                    if (pattern.test(page.file as string)) {
                        pagesToRemove.push(page);
                    } else {
                        removePagesMatching(pattern, page.children);
                    }
                }
                for (const page of pagesToRemove) {
                    pages.splice(pages.indexOf(page), 1);
                }
            }
            removePagesMatching(/\.ts$/, pages);
        },
    },
});

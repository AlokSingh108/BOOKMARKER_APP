// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["vuetify/styles/main.sass", "@mdi/font/css/materialdesignicons.css"],
  build: {
    transpile: ["vuetify"],
  },
  modules: ["@vite-pwa/nuxt"],
  pwa: {
    manifest: {
      name: "Bookmarker App",
      short_name: "Bookmarker",
      description: "Save your all important bookmarks at one place! Install and access through any device!",
      icons: [
        {
          src: "icons/icon_64x64.png",
          sizes: "64x64",
          type: "image/png",
        },
        {
          src: "icons/icon_144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
     
      ],

      

    },
    workbox: {
      navigateFallback: "/",
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },



  // plugins: ["@/plugins/firebase.js"],
});

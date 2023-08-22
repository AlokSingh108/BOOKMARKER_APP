<template>
  <VitePwaManifest />
  <nav>
    <v-toolbar color="cyan-darken-3" app>
      <v-icon
        class="ma-3"
        icon="mdi-menu"
        @click="navDrawer=!navDrawer"
      ></v-icon>
      <v-toolbar-title>
        <span class="text-h3 font-weight-bold">BookMarker</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn size="large" @click="$emit('showlogin')">Login</v-btn>
      <v-btn size="large" @click="$emit('showsignup')">Sign Up</v-btn>
    </v-toolbar>

    <v-navigation-drawer
      color="deep-purple"
      width="200"
      v-model="navDrawer"
      app
      disable-resize-watcher
      temporary
    >
      <!-- <img src="../assets/Srilaprabhupada.jpeg"> -->
      <v-list align="center">
        <v-icon
          size="150"
          color="black"
          icon="mdi-bookmark-multiple"
          class="ma-5"
        ></v-icon>
        <v-btn size="x-large" variant="text" color="black ma-20">Login</v-btn>
        <v-list>
          <div class="text-caption">Don't have a account?</div>
          <div class="text-caption">create a new account.</div>
        </v-list>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  name: "toolBar",
  emits: ['showlogin', 'showsignup'],
  data() {
    return {
      navDrawer: false,
    };
  },
};
</script>

<style lang="scss" scoped></style>

<template>
  <VitePwaManifest />
  <nav>
    <v-toolbar color="cyan-darken-3" >
      <v-icon
        class="ma-3"
        icon="mdi-menu"
        @click="navDrawer = !navDrawer"
      ></v-icon>
      <v-toolbar-title>
        <span class="text-h3 font-weight-bold">BookMarker</span>
      </v-toolbar-title>
      <v-btn
        variant="text"
        color="white-text"
        class="ma-3"
        prepend-icon="mdi-home"
        @click="$emit('home')"
        >Home
      </v-btn>
      <v-btn
        variant="text"
        color="white-text"
        class="ma-3"
        prepend-icon="mdi-bookmark-multiple"
        @click="$emit('showAllBookmarks')"
        >All bookmarks</v-btn
      >
      <v-btn append-icon="mdi-logout" @click="$emit('logout')">Logout</v-btn>
    </v-toolbar>

    <v-navigation-drawer disable-resize-watcher color="deep-purple" v-model="navDrawer" app temporary>
      <!-- <img src="../assets/Srilaprabhupada.jpeg"> -->
      <v-list align="center">
        <v-icon
          size="100"
          color="black"
          icon="mdi-bookmark-multiple"
          class="ma-10"
        ></v-icon>
        <v-list>
          <v-btn
            variant="text"
            color="blue-grey-darken-4"
            class="ma-3"
            prepend-icon="mdi-bookmark-multiple-outline"
            @click="$emit('showAllBookmarks'), (navDrawer = !navDrawer)"
            >All bookmarks</v-btn
          >
        </v-list>
        <v-list v-for="item in menucontent" :key="item.content">
          <v-btn
            variant="text"
            color="blue-grey-darken-4"
            class="ma-3"
            :prepend-icon="item.icon"
            >{{ item.content }}</v-btn
          >
        </v-list>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  name: "navigatorTop",
  data() {
    return {
      navDrawer: false,
      emit: ["showAllBookmarks", "home", "logout"],
      menucontent: [
        {
          icon: "mdi-plus",
          content: "Add Bookmark",
        },
        {
          icon: "mdi-square-edit-outline",
          content: "Modify",
        },
        {
          icon: "mdi-magnify",
          content: "Search",
        },
        {
          icon: "mdi-delete",
          content: "Delete",
        },
        {
          icon: "mdi-star",
          content: "Rate Us",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>

<template>
  <v-app>
    <toolbar
      @showAllBookmarks="all = true"
      @home="all = false"
      @logout="$emit('logout')"
    ></toolbar>
    <buttonS v-if="!all" />

    <allBookmarks v-if="all" @deletebookmark="deletecard" />
  </v-app>
</template>

<script>
import {
  collection,
  doc,
  deleteDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { setupFirebase } from "../../composables/firebasesetup.js";
import toolbar from "./toolbar.vue";
import { inject, ref, provide } from "vue";
import buttonS from "./buttons.vue";
import allBookmarks from "./allBookmarks.vue";
// import structuredClone from '@ungap/structured-clone';
export default {
  name: "index1",
  data() {
    return {};
  },
  setup() {
    const uname = inject("username");
    // console.log(uname.value);
    // onMounted(()=>{
    //   //
    // })
    const all = ref(false);
    const title = ref("");
    const desc = ref("");
    const link = ref("");
    let ABM = [];

    // firebase setup
    const firestore = setupFirebase();
    const name = collection(firestore, "name");
    const d = doc(name, uname.value);
    const group = collection(d, "group");

    // group items
    let items = [];
    onSnapshot(group, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        const Title = { ...doc.data() };
        let count = 0;
        items.forEach((book) => {
          if (book.title === Title.title) {
            count += 1;
          }
        });
        if (count == 0) {
          items.push({
            ...doc.data(),
          });
        }
      });
    });

    
    // all bookmark array
    onSnapshot(allBM, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        let count = 0;
        ABM.forEach((book) => {
          if (book.id === doc.id) {
            count += 1;
          }
        });
        if (count == 0) {
          ABM.push({
            ...doc.data(),
            id: doc.id,
            showDesc: false,
            show:true,
          });
        }
      });
    });

    provide("ABM", ABM);

    // deleting bookmark
    function deletecard(id) {
      console.log(id);
      // const docref = doc(firestore, "name/" + uname.value +"/bookmarks", id);
      const col = collection(d, "bookmarks");

      const docref = doc(col, id);

      console.log(docref);
      deleteDoc(docref)
        .then((e) => {
          // e.preventDefault();
          console.log("delete success");
        })
        .catch(() => {
          console.log("error");
        });
    }
    provide("items", items);

    return {
      deletecard,
      title,
      link,
      desc,
      all,
    };
  },
  data() {
    return {
      emit: ["logout"],
    };
  },
  components: {
    toolbar,
    buttonS,
    allBookmarks,
  },
};
</script>

<style scoped>
.len {
  width: 500px;
}
</style>

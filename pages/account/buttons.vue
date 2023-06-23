<template>
  <div>
    <v-sheet class="d-flex middle">
      <v-btn
        append-icon="mdi-plus"
        width="220"
        height="60"
        color="success"
        @click="dialog = true"
      >
        ADD Bookmark
      </v-btn>
    </v-sheet>

    <v-dialog v-model="dialog" width="auto">
      <v-card>
        <v-toolbar color="primary" title="Add Bookmark"></v-toolbar>
        <!--  <v-card-text>  -->
        <v-form>
          <v-text-field
            label="Title"
            v-model="title"
            :rules="[(v) => !!v || 'Title is required']"
          ></v-text-field>
          <v-textarea
            label="Description"
            rows="2"
            cols="40"
            v-model="desc"
          ></v-textarea>
          <v-combobox
            v-model:search="search"
            :hide-no-data="false"
            :items="items"
            hide-selected
            label="Add or Create a new Group"
            persistent-hint
            small-chips
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-title>
                  No results matching "<strong>{{ search }}</strong
                  >". Press <kbd>enter</kbd> to create a new one
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-combobox>
          <v-text-field
            label="Link"
            v-model="link"
            type="url"
            :rules="[(v) => !!v || 'Link is required']"
          ></v-text-field>
        </v-form>
        <!--  </v-card-text>  -->
        <v-card-actions>
          <div>
            <v-btn color="success" width="250" @click.prevent="addBookmark()"
              >Add</v-btn
            >
            <!-- <v-spacer></v-spacer> -->
            <v-btn color="primary" width="250" @click="dialog = false"
              >Close Dialog</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { inject, ref } from "vue";
import { collection, doc, addDoc, getDocs } from "firebase/firestore";
export default {
  name: "buttonS",
  setup() {
    const uname = inject("username");
    const dialog = ref(false);
    const title = ref("");
    const desc = ref("");
    const link = ref("");
    const search = ref("");

    let items = ref(inject("items"));

    // addbutton function
    function addBookmark() {
      if (title.value == "") {
        alert("Please enter valid title");
        return;
      }
      if (link.value == "") {
        alert("Please enter valid link");
        return;
      }

      const f = setupFirebase();
      const name = collection(f, "name");
      const userdoc = doc(name, uname.value);
      const group = collection(userdoc, "group");
      getDocs(group).then((snapshot) => {
        let grcnt = 0;
        snapshot.docs.forEach((doc) => {
          const Title = { ...doc.data() };
          if (Title.title == search.value) {
            grcnt = grcnt + 1;
          }
        });
        if (grcnt === 0) {
          addDoc(group, {
            title: search.value,
          })
            .then(() => {
              console.log("added successfully");
            })
            .catch(() => {
              console.log("error in new group");
            });
        }
      });

      const grcol = collection(userdoc, "bookmarks");
      addDoc(grcol, {
        title: title.value,
        description: desc.value,
        link: link.value,
        group: search.value,
      })
        .then(() => {
          title.value = "";
          desc.value = "";
          link.value = "";
          dialog.value = false;
        })
        .catch(() => {
          console.log("error in add");
        });
    }
    return {
      dialog,
      addBookmark,
      title,
      link,
      desc,
      items,
      search,
    };
  },
};
</script>

<style scoped>
.middle {
  width: 250px;
  height: 300px;
  margin: auto;
  margin-top: 10%;
}
</style>

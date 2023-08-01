<template>
<!-- <div> -->

<form action="">
    <v-sheet class="d-flex justify-sm-space-around flex-wrap mt-5" justify="center">
        <div>
            <!-- search bar -->
            <v-icon icon="mdi-magnify"></v-icon>
            <input size="30" class="ma-2 pa-2 border" type="text" placeholder="search here" v-model="searchBar" />
            <!-- combo box -->
            <v-combobox v-model:search="search" :hide-no-data="true" v-model="model" :items="items" hide-selected label="Group" class="ma-3" persistent-hint small-chips>
            </v-combobox>
        </div>
    </v-sheet>
</form>

<!-- All Book Marks or searched bookmarks -->
<div>
    <v-sheet class="d-flex justify-sm-space-around flex-wrap" justify="center">
        <v-sheet v-for="bookmark in sortFunc()" :key="bookmark.id">
            <v-sheet v-show="bookmark.show" class="align-self-center pa-4">
                <v-card v-if="
              filteredList(bookmark) &&
              (search === bookmark.group || search == 'All')
            " class="pa-2" min-width="320" max-width="380" border>
                    <v-card-title class="text-decoration-underline font-weight-bold">
                        {{ bookmark.title }}</v-card-title>

                    <v-card-subtitle> group: {{ bookmark.group }} </v-card-subtitle>

                    <v-card-actions>
                        <a target="_blank" :href=addlink(bookmark.link)>
                            <v-btn color="green-accent-4" variant="text"> Link </v-btn>
                        </a>

                        <v-spacer></v-spacer>
                        <v-btn prepend-icon="mdi-content-copy" size="28" @click="copylink(bookmark.link)" class="ma-2" color="deep-purple-darken-3">
                            <v-tooltip activator="parent" location="top">Copy Link</v-tooltip>
                        </v-btn>
                        <v-btn prepend-icon="mdi-square-edit-outline" size="28" class="ma-2" color="deep-purple-darken-3" v-model="uid" :r="r" @click="reserve(bookmark), dialog=true">
                            <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                        </v-btn>

                        <v-dialog v-model="dialog" width="auto">
                            <v-card>
                                <v-toolbar color="primary" title="Update Bookmark"></v-toolbar>
                                <!--  <v-card-text>  -->
                                <v-form>
                                    <v-text-field label="Title" v-model="newtitle" :rules="[(v) => !!v || 'Title is required']"></v-text-field>
                                    <v-textarea label="Description" rows="2" cols="40" v-model="newdesc"></v-textarea>
                                    <v-combobox v-model:search="newgrp" v-model="newgrp" :hide-no-data="false" :items="items" hide-selected label="Add or Create a new Group" persistent-hint small-chips>
                                        <template v-slot:no-data>
                                            <v-list-item>
                                                <v-list-item-title>
                                                    No results matching "<strong>{{ newgrp }}</strong>". Press <kbd>enter</kbd> to create a new one
                                                </v-list-item-title>
                                            </v-list-item>
                                        </template>
                                    </v-combobox>
                                    <v-text-field label="Link" v-model="newlink" type="url" :rules="[(v) => !!v || 'Link is required']"></v-text-field>
                                </v-form>
                                <!--  </v-card-text>  -->
                                <v-card-actions>
                                    <div>
                                        <v-btn color="success" width="250" v-model="uid" :r="r" @click="update(), dialog=false">Save</v-btn>
                                        <!-- <v-spacer></v-spacer> -->
                                        <v-btn color="primary" width="250" @click="dialog = false">Close Dialog</v-btn>
                                    </div>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <v-btn prepend-icon="mdi-delete" size="28" @click="
                  $emit('deletebookmark', bookmark.id),
                    (bookmark.show = false)
                " class="ma-2" color="deep-purple-darken-3">
                            <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                        </v-btn>

                        <v-btn :text="bookmark.showDesc ? 'Collapse' : 'Expand'" :append-icon="
                  bookmark.showDesc ? 'mdi-chevron-up' : 'mdi-chevron-down'
                " @click="bookmark.showDesc = !bookmark.showDesc" width="120"></v-btn>
                    </v-card-actions>

                    <v-expand-transition>
                        <div v-show="bookmark.showDesc">
                            <v-divider></v-divider>

                            <v-card-text>
                                {{ bookmark.description }}
                            </v-card-text>
                        </div>
                    </v-expand-transition>
                    <v-container class="ma-n5" id="extra"></v-container>
                </v-card>
            </v-sheet>
        </v-sheet>
    </v-sheet>
</div>
</template>

<script>
import {
    inject,
    ref,
    onMounted
} from "vue";
import {
    collection,
    doc,
    addDoc,
    getDocs,
    updateDoc
} from "firebase/firestore";

export default {
    name: "allBookmarks",
    emits: ["deletebookmark"],
    data() {
        return {
            searchBar: "",
            model: ["All"],
            str: "https://",
        };
    },

    setup() {
        let ABM = ref(inject("ABM"));
        const items = inject("items");
        if (items.find((e) => e == "All") == undefined) items.push("All");
        const search = ref("All");
        const uname = inject("username");

        const f = setupFirebase();
        const name = collection(f, "name");
        const userdoc = doc(name, uname.value);
        const grcol = collection(userdoc, "bookmarks");
        const grp = collection(userdoc, "group");

        const dialog = ref(false);

        let newtitle = ref("");
        let newdesc = ref("");
        let newlink = ref("");
        let newgrp = ref("");
        let uid = ref("");
        let r = ref(""); // r use kiye kyuki reserve krne se kuch aur bookmark() ja raha tha and update() click krne se kuch aur
        let check = ref(true);
   

        // yeh dialog dikhne wala function hai

        function reserve(bookmark) {
            newtitle.value = bookmark.title
            newdesc.value = bookmark.description
            newlink.value = bookmark.link
            console.log(bookmark.group);
            newgrp.value = bookmark.group
            uid.value = bookmark.id;
            r = bookmark;
            console.log(uid.value);
        }

        function update() {
            console.log(newgrp.value);
            updateDoc(doc(userdoc, "bookmarks", uid.value), {
                title: newtitle.value,
                description: newdesc.value,
                link: newlink.value,
                group: newgrp.value,
            }).then(() => {
                    r.title = newtitle.value;
                    r.description = newdesc.value;
                    r.link = newlink.value;
                    r.group = newgrp.value;
                    newtitle.value = "";
                    newdesc.value = "";
                    newlink.value = "";
                    console.log(uid.value);
                    uid.value = "";
                    r.value = "";
                    getDocs(grp).then((snapshot) => {

                        snapshot.docs.forEach((doc) => {
                            const Title = {
                                ...doc.data()
                            };
                            if (Title.title === newgrp.value) {
                                check.value = false;
                            }
                        });
                        if (check.value === true) {
                            addDoc(grp, {
                                    title: newgrp.value,
                                })
                                .then(() => {
                                    console.log("added successfully");
                                })
                                .catch(() => {
                                    console.log("error in new group");
                                });
                        }
                    });

                })
            }

            // const f = setupFirebase();
            //   const name = collection(f, "name");
            //   const userdoc = doc(name, uname.value);
            //   const bookm = collection(userdoc, "bookmarks");

            // onMounted(async() =>{
            //  let cdata = await getDocs(bookm)
            //  cdata.forEach((b) =>{
            //   bm.value.push({...b.data(),id: b.id})
            //  })
            // })

            return {
                ABM,
                search,
                items,
                dialog,
                reserve,
                newdesc,
                newlink,
                newtitle,
                newgrp,
                update,
                uid,
                r,
                check,
            };
        },

        methods: {
            sortFunc() {
                return this.ABM.slice().sort(function (a, b) {
                    return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1;
                });
            },

            addlink(link) {

                if (link.includes(this.str))
                    link = link.substr(8)

                return `https://${link}`;
            },

            filteredList(book) {
                return (
                    book.title.toLowerCase().includes(this.searchBar.toLowerCase()) ||
                    book.description.toLowerCase().includes(this.searchBar.toLowerCase())
                );
            },

            copylink(link) {
                const storage = document.createElement("textarea");
                storage.value = link;
                document.getElementById("extra").appendChild(storage);
                storage.select();
                storage.setSelectionRange(0, 99999);
                document.execCommand("copy");
                console.log("link copied");
                document.getElementById("extra").removeChild(storage);
            },
        },
    };
</script>

<style scoped>
.box {
    height: 20px;
}
</style>

<template>
  <VitePwaManifest />
  <v-app>
    <toolBar v-if="!show" @showlogin="showloginpage = true, showsignuppage = false" @showsignup="showloginpage = false, showsignuppage = true"/>


    <v-dialog v-model="wrongPass" width="auto">
      <v-card>

        <v-toolbar class="pa-10 invalidCreds">Wrong password entered</v-toolbar>

      </v-card>
    </v-dialog>

    <v-dialog v-model="wrongEmail" width="auto">
      <v-card>

        <v-toolbar class="pa-10 invalidCreds">Invalid email entered</v-toolbar>

      </v-card>
    </v-dialog>

    <v-dialog v-model="wrongUser" width="auto">
      <v-card>

        <v-toolbar class="pa-10 invalidCreds">User does not exist</v-toolbar>

      </v-card>
    </v-dialog>

    
    
    <!-- login page  -->
    <div v-if="showloginpage">
      <form class="signup">
        <div class="middle">
          <div class="text-subtitle-1 text-medium-emphasis">Account</div>
          <v-text-field type="email" density="compact" placeholder="Email address"  variant="outlined" v-model="email" prepend-inner-icon="mdi-email-outline" :rules="[v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Enter a valid E-mail']" ></v-text-field><v-spacer></v-spacer>
          
          <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
            Password </div>
          <v-text-field  density="compact" variant="outlined" @click:append-inner="visible = !visible"
            prepend-inner-icon="mdi-lock-outline" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
             :type="visible ? 'text' : 'password'" v-model="password"
            placeholder="Enter your password"></v-text-field><v-spacer></v-spacer>
          <v-btn block variant="outlined" variants="tonal" color="blue-darken-3" class="bg-blue-lighten-5 mb-6"
            append-icon="mdi-login" @click="login">Login</v-btn>
          
            <v-btn block variant="outlined" @click="showloginpage = false, showsignuppage = true">
            New user? Sign Up Now!
            <v-tooltip activator="parent" location="bottom">Signup Here</v-tooltip>
          </v-btn>
          
        </div>
      </form>
    </div>


    <!-- for signup page -->
    <div v-if="showsignuppage">
        <form class="signup">
          <div class="middle">
            
           <v-text-field label="Username" v-model="username"
            :rules="[v => !!v || 'Username is required']"></v-text-field><v-spacer></v-spacer>
          <v-text-field label="Enter Your Email" v-model="email"
            :rules="[v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Enter a valid E-mail']"></v-text-field><v-spacer></v-spacer>
          <v-text-field label="Password" v-model="password"
            :rules="[v => !!v || 'password is required']"></v-text-field><v-spacer></v-spacer>
            
            <v-btn variant="outlined" class="ml-8 mt-4" append-icon="" @click="newaccount">Create Account</v-btn>
          </div>
        </form>
      </div>
    <index1 v-if="show" @logout="logoutfunction"/>
  </v-app>
</template>

<script lang="ts">
import toolBar from "./toolbar.vue";
import index1 from "./account/index.vue";
import { ref, provide } from "vue";



// for authentication setup 
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

import{setupAuth} from "../composables/authsetup.js";

export default {
  components: {
    toolBar,
    index1,
  },
  setup() {
      const show = ref(false);
      const showloginpage = ref(true);
      const showsignuppage = ref(false);
      const username = ref("");
      const email = ref("");
      const password = ref("");
      const auth = setupAuth();
      const wrongUser = ref(false);
      const wrongPass = ref(false);
      const wrongEmail = ref(false);
      provide('username', username);
      

      // login function 
      function login() {

        signInWithEmailAndPassword(auth, email.value, password.value)
          .then((cred) => {
            console.log('user created:', cred.user);
            show.value=true;
            showloginpage.value = false;
            username.value = email.value.split('@')[0];
          })
          .catch((err) => {
          console.log("error: ", err.message)

          if (err.message.includes("user-not-found"))
            wrongUser.value = true;

          if (err.message.includes("wrong-password"))
            wrongPass.value = true;

          if (err.message.includes("wrong-email"))
            wrongEmail.value = true;
        })
          
          onAuthStateChanged(auth, (user)=>{
            if (user) {
      
          } else {
          
          }
        })     
      }

      // signout function 
      function logoutfunction(){
        console.log("logout success")
        signOut(auth)
        .then(() => {
      
          show.value = false;
          email.value = "";
          password.value = "";
          showloginpage.value = true;
        })
        .catch((error) => {
              // An error happened.
        });
      }

      // signup function 
      function newaccount() {
        createUserWithEmailAndPassword(auth, email.value, password.value)
          .then((cred) => {
            console.log('user created:', cred.user);
              
              signInWithEmailAndPassword(auth, email.value, password.value)
              .then((cred) => {
                console.log('user created:', cred.user);
                show.value=true;
                showsignuppage.value = false;
                username.value = email.value.split('@')[0];
              })
              .catch((err) =>{
                console.log(err.message)
              })
          })
          .catch((err) =>{
            console.log(err.message)
          })
      }

    return {
      show,
      username,
      email,
      password,
      login,
      logoutfunction,
      newaccount,
      showloginpage,
      showsignuppage,
      wrongEmail,
      wrongPass,
      wrongUser
    };
  },
  data() {
    return {
      visible: false,
    }
  }
};
</script>

<style scoped>
.middle {
  width: 250px;
  height: 300px;
  margin: auto;
  margin-top: 10%;
}
.center {
  margin: 25%;
  margin-top: 20px;
}

.invalidCreds {
text-align: center;
background-color: white;
color: red;

}
</style>

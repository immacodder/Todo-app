<template>
  <v-card>
    <v-form @submit.prevent ref="form">
      <v-card-title class="justify-center pt-12">{{
        signup ? 'Sign up' : 'Login'
      }}</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="email"
          :rules="[rules.isEmpty, rules.isValidEmail]"
          label="Email"
          append-icon="email"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :rules="[rules.isEmpty, rules.isLongEnough]"
          label="Password"
          :append-icon="show1 ? 'visibility_off' : 'visibility'"
          :type="show1 ? 'text' : 'password'"
          @click:append="show1 = !show1"
        ></v-text-field>
        <v-text-field
          v-model="passwordRepeat"
          v-if="signup"
          label="Repeat password"
          :rules="[
            rules.isEmpty,
            rules.isLongEnough,
            rules.isTheSameAsPassword
          ]"
          :append-icon="show2 ? 'visibility_off' : 'visibility'"
          :type="show2 ? 'text' : 'password'"
          @click:append="show2 = !show2"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="pb-8">
        <v-spacer></v-spacer>
        <v-btn type="submit" class="px-16" color="primary" @click="onFormSubmit"
          >Submit</v-btn
        >
        <v-spacer></v-spacer
      ></v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { firebase } from '../main'

let password = ''

export default Vue.extend({
  props: {
    signup: Boolean as PropType<boolean>
  },
  data: () => ({
    show1: false,
    show2: false,
    email: '',
    password: '',
    passwordRepeat: '',
    rules: {
      isEmpty: (v: string) => !!v || 'Please enter something',
      isLongEnough: (v: string) =>
        v.length > 8 || 'Password needs to be at least 8 characters long',
      isValidEmail: (v: string) =>
        v.includes('@') || 'Please enter a valid email',
      isTheSameAsPassword: (v: string) =>
        v === password ? true : `Passwords don't match`
    }
  }),
  watch: {
    password: v => (password = v)
  },
  methods: {
    onFormSubmit() {
      if ((this.$refs.form as any).validate()) {
        this.signup ? this.onSignUp() : this.onLogin()
      }
    },
    onSignUp() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(user => {
          console.log(user.user?.email, user)
          this.$router.push('/')
        })
    },
    onLogin() {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
    }
  }
})
</script>

PasswordField

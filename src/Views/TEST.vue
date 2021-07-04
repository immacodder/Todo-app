<template>
  <v-main>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col sm="5" lg="4" xl="3">
          <v-card elevation="12">
            <v-row justify="center" class="py-12">
              <v-col cols="10">
                <v-card-title class="justify-center font-weight-bold">{{
                  signup ? 'Sign Up' : 'Login'
                }}</v-card-title>
                <v-card-text>
                  <v-form>
                    <v-text-field
                      color="primary"
                      label="Email"
                      append-icon="email"
                    ></v-text-field>
                    <v-text-field
                      color="primary"
                      :append-icon="!show1 ? 'visibility' : 'visibility_off'"
                      :type="!show1 ? 'password' : 'text'"
                      @click:append="show1 = !show1"
                      label="Password"
                    ></v-text-field>
                    <v-text-field
                      v-if="signup"
                      color="primary"
                      :append-icon="!show2 ? 'visibility' : 'visibility_off'"
                      :type="!show2 ? 'password' : 'text'"
                      @click:append="show2 = !show2"
                      label="Repeat password"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer> </v-spacer>
                  <v-btn color="secondary">
                    Continue
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-col>
              <router-link style="" to="/">Login instead?</router-link>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
export default {
  props: {
    signup: Boolean
  },
  data: () => ({ show1: false, show2: false })
}
</script>

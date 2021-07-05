<template>
  <v-main>
    <v-container class="fill-height text-center" v-if="user === null">
      <v-spacer></v-spacer>
      <v-progress-circular
        indeterminate
        color="primary"
        class="d-block"
      ></v-progress-circular>
      Loading...
      <v-spacer></v-spacer>
    </v-container>
    <template>
      <v-container>
        <v-row>
          <v-dialog
            width="400"
            transition="dialog-top-transition"
            v-model="dialog"
          >
            <template #activator="{on, attrs}">
              <v-col class="text-right" cols="12">
                <template v-if="user === false || null">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    class="ml-auto mr-2 primary"
                    @click="$router.push({ name: 'Login' })"
                    >Login</v-btn
                  >
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    @click="$router.push({ name: 'Signup' })"
                    class="ml-auto secondary"
                    >Sign Up</v-btn
                  >
                </template>
                <template v-else-if="!!user">
                  <span class="text--secondary mr-2">{{
                    user && user.email
                  }}</span>
                  <v-btn @click="onSignout" color="secondary">
                    Sign out
                  </v-btn>
                </template>
              </v-col>
            </template>
            <router-view></router-view>
          </v-dialog>
        </v-row>
      </v-container>
      <v-container style="padding-top: 10rem;">
        <v-snackbar v-model="snackbar.shown" :timeout="3000">
          {{ snackbar.message }}
          <template #action>
            <v-btn @click="snackbar.action()" text>
              Undo
            </v-btn>
          </template>
        </v-snackbar>
        <v-row justify="center">
          <v-col md="7" xl="5">
            <v-form ref="form" @submit.prevent="onFormSubmit">
              <v-text-field
                outlined
                label="Add a todo"
                autocomplete="off"
                append-icon="add"
                @click:append="onFormSubmit"
                v-model="value"
                :rules="rules"
                @blur="formValidate(true)"
              >
              </v-text-field>
            </v-form>
            <v-card
              v-if="
                showDone
                  ? !!Object.keys(todos).length
                  : !!Object.keys(undoneTodos).length
              "
            >
              <v-list>
                <v-slide-y-transition leave-absolute group tag="div">
                  <div
                    v-for="(item, key, index) in showDone ? todos : undoneTodos"
                    :key="key"
                  >
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title
                          :class="{
                            'text-decoration-line-through': item.completed
                          }"
                        >
                          <input
                            id="editInput"
                            v-if="key === editTarget"
                            v-model="editValue"
                            @keydown.enter="handleEdit(key, editValue)"
                            type="text"
                            ref="input"
                            @blur="handleEdit(key, editValue)"
                          />
                          <span v-else>{{ item.title }}</span>
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-icon>
                        <v-tooltip bottom>
                          <template #activator="{on, attrs}">
                            <v-btn
                              color="primary"
                              v-on="on"
                              icon
                              v-bind="attrs"
                              @click="handleComplete(key, !item.completed)"
                              ><v-icon>{{
                                item.completed ? 'remove_done' : 'done'
                              }}</v-icon></v-btn
                            >
                          </template>
                          <span>{{
                            item.completed ? 'Undo Todo' : 'Complete Todo'
                          }}</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template #activator="{ on, attr }">
                            <v-btn
                              icon
                              color="secondary"
                              v-on="on"
                              v-bind="attr"
                              @click="onEditClick(key)"
                            >
                              <v-icon>edit</v-icon>
                            </v-btn>
                          </template>
                          <span>Edit</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template #activator="{ on, attr }">
                            <v-btn
                              color="red"
                              v-on="on"
                              icon
                              v-bind="attr"
                              @click="handleDelete(key)"
                            >
                              <v-icon>delete</v-icon>
                            </v-btn>
                          </template>
                          <span>Delete</span>
                        </v-tooltip>
                      </v-list-item-icon>
                    </v-list-item>
                    <v-divider
                      v-if="
                        index + 1 <
                          Object.keys(showDone ? todos : undoneTodos).length
                      "
                    ></v-divider>
                  </div>
                </v-slide-y-transition>
              </v-list>
            </v-card>
            <p v-else class="text-subtitle-1 secondary--text text-center">
              {{
                !!user
                  ? 'A list of todos will be rendered here :)'
                  : 'Please authorize in order to continue'
              }}
            </p>
            <v-checkbox
              v-model="showDone"
              color="accent"
              label="Show done?"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-main>
</template>

<style scoped>
#editInput {
  outline: none;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { firebase } from '../main'

interface todoEntry {
  title: string
  userId: string
  completed: boolean
  createdAt: number
}
interface Todos {
  [key: string]: todoEntry
}

export default Vue.extend({
  data: () => ({
    todos: {} as Todos,
    dialog: false,
    value: '',
    editValue: '',
    snackbar: {
      action: (): void => {},
      shown: false,
      message: ''
    },
    showDone: !!localStorage.getItem('showDone'),
    user: null as false | null | firebase.User,
    unsubscribe: [] as any[],
    editTarget: '' as null | string,
    rules: [
      (v: string) =>
        (!!v && v.length >= 2) ||
        'The todo entry needs to be at least 2 characters long'
    ]
  }),
  watch: {
    dialog(v) {
      !v && this.$router.push('/')
    },
    user(v) {
      this.dialog && v && (this.dialog = false && this.$router.push('/'))
    },
    showDone: v => localStorage.setItem('showDone', v ? 'show' : '')
  },
  created() {
    const unsub1 = firebase.auth().onAuthStateChanged(user => {
      if (!user) this.user = false
      else {
        this.user = user

        const unsub2 = firebase
          .firestore()
          .collection('todos')
          .where('userId', '==', this.user.uid)
          .orderBy('createdAt', 'desc')
          .onSnapshot(snapshot => {
            const obj: Todos = {}
            snapshot.forEach(todo => {
              obj[todo.id] = todo.data() as todoEntry
            })
            this.todos = { ...obj }
          })

        this.unsubscribe.push(unsub2)
      }
    })

    this.unsubscribe.push(unsub1)
  },
  computed: {
    undoneTodos() {
      const obj: Todos = {}

      Object.keys(this.todos).filter(key => {
        !this.todos[key].completed && (obj[key] = this.todos[key])
      })

      return obj
    }
  },
  beforeDestroy() {
    this.unsubscribe.forEach(v => v())
  },
  methods: {
    onSignout() {
      firebase.auth().signOut()
      this.todos = {}
    },
    addTodo(title: string) {
      if (!this.user) return

      const todo: todoEntry = {
        title,
        completed: false,
        userId: this.user.uid,
        createdAt: new Date().getTime()
      }

      firebase
        .firestore()
        .collection('todos')
        .add(todo)
    },
    deleteTodo(id: string) {
      firebase
        .firestore()
        .doc(`todos/${id}`)
        .delete()
    },
    updateTodo(id: string, payload: { title?: string; completed?: boolean }) {
      firebase
        .firestore()
        .doc(`todos/${id}`)
        .update(payload)
    },
    formValidate(reset?: boolean) {
      const ref = <any>this.$refs.form
      if (reset) ref.resetValidation()
      else return ref.validate()
    },
    onFormSubmit() {
      if (!this.value) return
      if (this.formValidate()) {
        this.addTodo(this.value)
        this.value = ''
        this.formValidate(true)
      }
    },
    handleComplete(id: string, completed: boolean) {
      const toggleComplete = (completed: boolean) =>
        this.updateTodo(id, { completed })

      toggleComplete(completed)
      this.snackbar.shown = true
      this.snackbar.action = () => {
        toggleComplete(!completed)
        this.snackbar.shown = false
      }
      this.snackbar.message = `You have ${
        completed ? 'completed' : 'undone'
      } todo`
    },
    handleDelete(id: string) {
      const todoToDelete = this.todos[id]

      this.deleteTodo(id)

      this.snackbar.shown = true
      this.snackbar.action = () => {
        firebase
          .firestore()
          .doc(`todos/${id}`)
          .set(todoToDelete)
        this.snackbar.shown = false
      }
      this.snackbar.message = `You have deleted a todo`
    },
    async onEditClick(id: string) {
      this.editTarget = id
      this.editValue = this.todos[id].title
      await this.$nextTick()
      ;(<any>this.$refs.input)[0].focus()
    },
    handleEdit(id: string, title: string) {
      this.editTarget = null
      this.updateTodo(id, { title })
    }
  }
})
</script>

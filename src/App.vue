<template>
  <v-app>
    <v-main>
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
          <v-col lg="5">
            <v-form ref="form" @submit.prevent="onFormSubmit">
              <v-text-field
                outlined
                label="Add a todo"
                autocomplete="off"
                append-icon="add"
                @click:append="onFormSubmit"
                v-model="value"
              >
              </v-text-field>
            </v-form>

            <v-card
              v-if="showDone ? !!todos.length : !!undoneTodos.length"
              color="primary"
            >
              <v-list>
                <div
                  v-for="(item, index) of showDone ? todos : undoneTodos"
                  :key="item.id"
                >
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title
                        :class="{
                          'text-decoration-line-through': item.completed
                        }"
                        >{{ item.title }}</v-list-item-title
                      >
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-tooltip bottom>
                        <template #activator="{on, attrs}">
                          <v-icon
                            color="primary"
                            v-on="on"
                            v-bind="attrs"
                            @click="handleComplete(item.id, !item.completed)"
                            >{{
                              item.completed ? 'remove_done' : 'done'
                            }}</v-icon
                          >
                        </template>
                        <span>{{
                          item.completed ? 'Undo Todo' : 'Complete Todo'
                        }}</span>
                      </v-tooltip>
                    </v-list-item-icon>
                  </v-list-item>
                  <v-divider
                    v-if="index + 1 < (showDone ? todos : undoneTodos).length"
                  ></v-divider>
                </div>
              </v-list>
            </v-card>
            <p v-else class="text-subtitle-1 accent--text text-center">
              A list of todos will be rendered here :)
            </p>
            <v-checkbox v-model="showDone" label="Show done?"></v-checkbox>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { v4 as uuid } from 'uuid'

interface todoEntry {
  title: string
  id: string
  completed: boolean
}

export default Vue.extend({
  data: () => ({
    todos: [] as todoEntry[],
    value: '',
    snackbar: {
      action: (): void => {},
      shown: false,
      message: ''
    },
    showDone: false
  }),
  computed: {
    undoneTodos() {
      return this.todos.filter(v => !v.completed)
    }
  },
  methods: {
    addTodo(title: string) {
      this.todos.push({
        title,
        id: uuid(),
        completed: false
      })
    },
    onFormSubmit() {
      this.addTodo(this.value)
      this.value = ''
    },
    handleComplete(id: string, complete: boolean) {
      const toggleComplete = (id: string, complete: boolean) => {
        this.todos = this.todos.map(v => {
          if (v.id === id) v.completed = complete
          return v
        })
      }

      toggleComplete(id, complete)
      this.snackbar.shown = true
      this.snackbar.action = () => {
        toggleComplete(id, !complete)
        this.snackbar.shown = false
      }
      this.snackbar.message = `You have ${
        complete ? 'completed' : 'undone'
      } todo`
    }
  }
})
</script>

<template>
  <div class="container">
    <v-sheet class="mx-auto adjust-with-layout">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center">
          <h1>Log in</h1>
          <p>Please, populate the form below in order to log in!</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-form ref="form" v-model="formValid" @submit.prevent="submit">
            <v-text-field v-model="username" :rules="usernameRules" label="Username"></v-text-field>
            <v-text-field v-model="password" :rules="passwordRules" label="Password" type="password"></v-text-field>
            <v-btn class="mt-2" type="submit" block color="#3F51B5">Submit</v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
  </div>
</template>

<script lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from "vue-router";
import axios from 'axios';
import axiosInstance from '@/interceptors/axiosInterceptor.js'
import { useStore } from "vuex";
import { useValidationRules } from '@/validationRules/loginValidationRules'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default {
  name: "Login",
  setup() {
    const {
        usernameRules, 
        passwordRules
    } = useValidationRules();
    const data = reactive({
      username: '',
      password: ''
    });
    const username = ref('');
    const password = ref('');
    const router = useRouter();
    const store = useStore();
    const formValid = ref(false);

    const submit = async () => {
      try {
        if (formValid.value) {
          const payload = {
            username: username.value,
            password: password.value
          };

          const response = await axios.post('http://localhost:8080/api/auth/login', payload, { withCredentials: true });
          const token = response.data.token;
          document.cookie = `jwt=${token}`;

          const user = await fetchUser();

          await store.dispatch('setAuth', true);
          await store.dispatch('setRole', user.roles[0]);
          await store.dispatch('setUserId', user.id);
          await store.dispatch('setFullName', `${user.firstName} ${user.lastName}`);
          await store.dispatch('setInitials', `${user.firstName[0]}${user.lastName[0]}`);
          router.push('/');
        }
        
      } catch (error) {
        Object.values(error?.response?.data?.errors)?.forEach(errorMessage => {
          toast.error(errorMessage, {
            autoClose: 10000
          })
        });
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get('users/get-current-user', { withCredentials: true });
        return response.data;
      } catch (error) {
        await store.dispatch('setAuth', false);
        await store.dispatch('setRole', null);
        await store.dispatch('setUserId', null);
        await store.dispatch('setFullName', null);
        await store.dispatch('setInitials', null);
        throw error;
      }
    };

    return {
      formValid,
      data,
      submit,
      username,
      usernameRules,
      password,
      passwordRules
    };
  }
};
</script>

<style scoped>
  .adjust-with-layout {
    margin-top: 64px;
    margin-bottom: 50px;
    width: 100% !important;
  }
</style>
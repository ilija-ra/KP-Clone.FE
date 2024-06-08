<template>
    <form @submit.prevent="submit">
      <h1 class="h3 mb-3 fw-normal">Please register!</h1>
    
      <input id="first-name" v-model="data.firstName" type="text" class="form-control" placeholder="First name" required>
  
      <input v-model="data.lastName" type="text" class="form-control" placeholder="Last name" required>
  
      <input v-model="data.username" type="text" class="form-control" placeholder="Username" required>

      <input v-model="data.emailAddress" type="email" class="form-control" placeholder="Email address" required>

      <input v-model="data.phoneNumber" type="text" class="form-control" placeholder="Phone number" required>

      <input v-model="data.password" type="password" class="form-control" placeholder="Password" required>

      <input v-model="data.confirmedPassword" type="password" class="form-control" placeholder="Confirmed password" required>

      <select v-model="data.role" class="form-control" required>
        <option value="0">--Select role--</option>
        <option value="SELLER">Seller</option>
        <option value="BUYER">Buyer</option>
      </select>
  
      <button class="w-100 btn btn-lg btn-primary" type="submit">Register</button>
    </form>
  </template>
  
  <script lang="ts">
  import {reactive} from 'vue';
  import {useRouter} from "vue-router";
  import axios from 'axios';

  export default {
    name: "Register",
    setup() {
      const data = reactive({
        firstName: '',
        lastName: '',
        username: '',
        emailAddress: '',
        phoneNumber: '',
        password: '',
        confirmedPassword: '',
        role: '0'
      });

      const router = useRouter();
  
      const submit = async () => {       
        axios.post('http://localhost:8080/api/auth/register', data)
          .then(response => {
            console.log('Success:', response);
            router.push('/login');
          })
          .catch(error => {
            console.error('Error:', error.response.data.errors);
          });
      }
  
      return {
        data,
        submit
      }
    }
  }
  </script>
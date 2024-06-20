  <template>
    <div class="container">
      <v-sheet class="mx-auto adjust-with-layout">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center">
            <h1>Registration</h1>
            <p>Please, populate the form below in order to register!</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-form ref="form" v-model="formValid" @submit.prevent="submit">
              <v-text-field v-model="firstName" :rules="firstNameRules" label="First name"></v-text-field>
              <v-text-field v-model="lastName" :rules="lastNameRules" label="Last name"></v-text-field>
              <v-text-field v-model="username" :rules="usernameRules" label="Username"></v-text-field>
              <v-text-field v-model="email" :rules="emailRules" label="Email"></v-text-field>
              <v-text-field v-model="phoneNumber" :rules="phoneNumberRules" label="Phone number"></v-text-field>
              <v-text-field v-model="password" :rules="passwordRules" label="Password" type="password"></v-text-field>
              <v-text-field v-model="confirmPassword" :rules="confirmPasswordRules" label="Confirm password" type="password"></v-text-field>
              <v-select label="Choose role" v-model="role" :rules="roleRules" :items="['BUYER', 'SELLER']"></v-select>
              <v-btn class="mt-2" type="submit" block color="#3F51B5">Submit</v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    </div>
</template>
  
<script>
  import { ref, computed } from 'vue';
  import axios from 'axios';
  import {useRouter} from "vue-router";
  import { useValidationRules } from '@/validationRules/registerValidationRules';
  import { toast } from 'vue3-toastify'
  import 'vue3-toastify/dist/index.css'

  export default {
    setup() {
      const { 
        firstNameRules, 
        lastNameRules, 
        usernameRules, 
        emailRules, 
        phoneNumberRules, 
        passwordRules, 
        confirmPasswordRules, 
        roleRules 
      } = useValidationRules();

      const router = useRouter();
      const formValid = ref(false);
      const firstName = ref('');
      const lastName = ref('');
      const username = ref('');
      const email = ref('');
      const phoneNumber = ref('');
      const password = ref('');
      const confirmPassword = ref('');
      const role = ref('');
  
      const confirmPasswordRulesComputed = computed(() => confirmPasswordRules(password.value));
  
      const submit = () => {
        if (formValid.value) {
          const payload = {
            id: null,
            firstName: firstName.value,
            lastName: lastName.value,
            username: username.value,
            emailAddress: email.value,
            phoneNumber: phoneNumber.value,
            password: password.value,
            confirmedPassword: confirmPassword.value,
            role: role.value,
          };

          axios.post('http://localhost:8080/api/auth/register', payload)
            .then(response => {
              console.log('Success:', response);
              router.push('/login');
            })
            .catch(error => {
              // console.error('Error:', error.response.data.errors);
              Object.values(error?.response?.data?.errors).forEach(errorMessage => {
                toast.error(errorMessage, {
                  autoClose: 10000
                });
              });
            });
        } else {
          toast.error('Form is not valid', {
            autoClose: 10000
          });
        }
      };
  
      return {
        formValid,
        firstName,
        firstNameRules,
        lastName,
        lastNameRules,
        username,
        usernameRules,
        email,
        emailRules,
        phoneNumber,
        phoneNumberRules,
        password,
        passwordRules,
        confirmPassword,
        confirmPasswordRules: confirmPasswordRulesComputed,
        role,
        roleRules,
        submit,
      };
    }
  }
</script>
  
<style scoped>
  .adjust-with-layout {
    margin-top: 64px;
    margin-bottom: 50px;
    width: 100% !important;
  }
</style>
  
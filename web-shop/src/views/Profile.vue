<template>
    <div class="container">
        <v-container>
            <v-card>
                <v-card-title>Edit Profile</v-card-title>
                <v-card-text>
                  <v-img :src="profile.profilePicture" class="mb-3"></v-img>
                  <v-form ref="form" v-model="formValid" @submit.prevent="submit">
                    <v-text-field v-model="profile.firstName" label="First Name" outlined :rules="nameRules"></v-text-field>
                    <v-text-field v-model="profile.lastName" label="Last Name" outlined :rules="nameRules"></v-text-field>
                    <v-text-field v-model="profile.username" label="Username" outlined :rules="usernameRules"></v-text-field>
                    <v-text-field v-model="profile.emailAddress" label="Email" outlined type="email" :rules="emailRules"></v-text-field>
                    <v-text-field v-model="profile.phoneNumber" label="Phone Number" outlined type="tel" :rules="phoneRules"></v-text-field>
                    <v-text-field v-model="profile.password" label="Password" outlined type="password" :rules="passwordRules"></v-text-field>
                    <v-text-field v-model="profile.confirmedPassword" label="Confirmed Password" outlined type="password" :rules="confirmedPasswordRules"></v-text-field>
                    <v-text-field v-model="profile.dateOfBirth" label="Date of Birth" outlined type="date" :rules="dateRules"></v-text-field>
                    <v-textarea v-model="profile.description" label="Description" outlined rows="3" max-rows="6" :rules="descriptionRules"></v-textarea>
                    <v-file-input v-model="selectedNewProfilePicture" label="Upload image" prepend-icon="mdi-camera" variant="filled" outlined :rules="profilePictureRules"></v-file-input>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#3F51B5" text @click="submit">Save</v-btn>
                </v-card-actions>
            </v-card>
  
            <confirm-password
                :dialog="confirmPasswordDialog"
                @update:dialog="val => confirmPasswordDialog = val"
                @confirmed="handlePasswordConfirmation"
                @cancelled="handlePasswordCancellation"
            />
        </v-container>
    </div>
</template>
  
<script>
  import { ref, onMounted, computed } from 'vue';
  import axiosInstance from '@/interceptors/axiosInterceptor.js';
  import axios from 'axios';
  import ConfirmPassword from '@/components/Profile/ConfirmPassword.vue';
  import { useStore } from "vuex";
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

  export default {
    name: 'EditProfile',
    components: { ConfirmPassword },
    props: {
      userId: {
        type: Number,
        required: true
      }
    },
    setup(props) {
        const store = useStore();
        const userId = computed(() => store.state.userId);
      const profile = ref({
        id: userId.value,
        firstName: '',
        lastName: '',
        username: '',
        emailAddress: '',
        phoneNumber: '',
        password: '',
        confirmedPassword: '',
        dateOfBirth: '',
        profilePicture: null,
        description: '',
        role: '',
        isBlocked: false
      });
      let selectedNewProfilePicture = ref(new File([], "", { type: "image/jpeg" }));
      const formValid = ref(false);
      const confirmedPassword = ref('');
      const confirmPasswordDialog = ref(false);
      const initialProfile = ref(null);
  
      const nameRules = [
        (v) => !!v || 'Name is required',
        (v) => v.length <= 50 || 'Name must be less than 50 characters'
      ];
      const usernameRules = [
        (v) => !!v || 'Username is required',
        (v) => v.length >= 3 || 'Username must be at least 3 characters long'
      ];
      const emailRules = [
        (v) => !!v || 'Email is required',
        (v) => /.+@.+\..+/.test(v) || 'Email must be valid'
      ];
      const phoneRules = [
        (v) => !!v || 'Phone number is required',
        (v) => /^\+?\d{10,15}$/.test(v) || 'Phone number must be valid'
      ];
      const passwordRules = [
        (v) => !!v || 'Password is required',
        (v) => v.length >= 6 || 'Password must be at least 6 characters long'
      ];
      const confirmedPasswordRules = [
        (v) => !!v || 'Confirmed Password is required',
        (v) => v.length >= 6 || 'Confirmed Password must be at least 6 characters long',
        (v) => v === profile.value.password || 'Passwords must match'
      ];
      const dateRules = [
        (v) => !!v || 'Date of birth is required',
        (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) || 'Date must be in YYYY-MM-DD format'
      ];
      const profilePictureRules = [
        (v) => !!v || 'Profile picture is required'
      ];
      const descriptionRules = [
        (v) => !!v || 'Description is required',
        (v) => v.length <= 500 || 'Description must be less than 500 characters'
      ];
  
      onMounted(() => {
        fetchProfileDetails();
      });
  
      const formatDateOfBirth = (dateString) => {
        const date = new Date(dateString);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
      };
  
      const fetchProfileDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/users/${userId.value}`);
          Object.assign(profile.value, response.data);
          profile.value.dateOfBirth = formatDateOfBirth(profile.value.dateOfBirth);
          initialProfile.value = { ...response.data };
          profile.value.confirmedPassword = response.data.password;
          profile.value.profilePicture = `data:image/jpeg;base64,${profile.value.profilePicture}`;
        } catch (error) {
          Object.values(error?.response?.data?.errors)?.forEach(errorMessage => {
          toast.error(errorMessage, {
            autoClose: 10000
          })
        });
        }
      };
  
      const submit = async () => {
        if (
          profile.value.emailAddress !== initialProfile.value.emailAddress ||
          profile.value.username !== initialProfile.value.username ||
          profile.value.password !== initialProfile.value.password
        ) {
          confirmPasswordDialog.value = true;
        } else {
          await updateProfile();
        }
      };

      const updateProfile = async () => {
        try {
          if (formValid.value) { 
            const formData = new FormData();
            formData.append('id', profile.value.id);
            formData.append('firstName', profile.value.firstName);
            formData.append('lastName', profile.value.lastName);
            formData.append('username', profile.value.username);
            formData.append('emailAddress', profile.value.emailAddress);
            formData.append('phoneNumber', profile.value.phoneNumber);
            formData.append('password', profile.value.password);
            formData.append('confirmedPassword', profile.value.confirmedPassword);
            formData.append('profilePicture', selectedNewProfilePicture.value);
            formData.append('dateOfBirth', new Date(profile.value.dateOfBirth).toISOString().split('T')[0]);
            formData.append('description', profile.value.description);
            formData.append('role', profile.value.role);
            formData.append('isBlocked', profile.value.isBlocked);

            const response = await axiosInstance.put(`/users`, formData, {
              headers: { 'content-type': 'multipart/form-data' },
            });

            initialProfile.value.password = profile.value.password
            initialProfile.value.username = profile.value.username
            initialProfile.value.emailAddress = profile.value.emailAddress
            toast.success('Profile updated successfully', {
              autoClose: 10000
            })
          } else {
              toast.error('Form is not valid', {
                autoClose: 10000
            });
          } 
        } catch (error) {
          Object.values(error?.response?.data?.errors)?.forEach(errorMessage => {
          toast.error(errorMessage, {
            autoClose: 10000
          })
        });
        }
      };
  
      const handlePasswordConfirmation = async (currentPassword) => {
        await updateProfile();
      };
  
      const handlePasswordCancellation = () => {
        console.log('Password confirmation cancelled');
      };
  
      return {
        profile,
        formValid,
        confirmedPassword,
        confirmPasswordDialog,
        nameRules,
        usernameRules,
        emailRules,
        phoneRules,
        passwordRules,
        confirmedPasswordRules,
        dateRules,
        profilePictureRules,
        descriptionRules,
        submit,
        handlePasswordConfirmation,
        handlePasswordCancellation,
        selectedNewProfilePicture
      };
    }
  };
</script>
  
<style scoped>
</style>
  
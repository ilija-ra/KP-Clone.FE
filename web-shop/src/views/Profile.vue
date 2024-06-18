<template>
    <div class="container">
        <v-container>
            <v-card>
                <v-card-title>Edit Profile</v-card-title>
                <v-card-text>
                <v-form ref="form">
                    <v-text-field v-model="profile.firstName" label="First Name" outlined :rules="nameRules"></v-text-field>
                    <v-text-field v-model="profile.lastName" label="Last Name" outlined :rules="nameRules"></v-text-field>
                    <v-text-field v-model="profile.username" label="Username" outlined :rules="usernameRules"></v-text-field>
                    <v-text-field v-model="profile.emailAddress" label="Email" outlined type="email" :rules="emailRules"></v-text-field>
                    <v-text-field v-model="profile.phoneNumber" label="Phone Number" outlined type="tel" :rules="phoneRules"></v-text-field>
                    <v-text-field v-model="profile.password" label="Password" outlined type="password" :rules="passwordRules"></v-text-field>
                    <v-text-field v-model="profile.confirmedPassword" label="Confirmed Password" outlined type="password" :rules="confirmedPasswordRules"></v-text-field>
                    <v-text-field v-model="profile.dateOfBirth" label="Date of Birth" outlined type="date" :rules="dateRules"></v-text-field>
                    <v-text-field v-model="profile.profilePicture" label="Profile Picture URL" outlined :rules="urlRules"></v-text-field>
                    <v-textarea v-model="profile.description" label="Description" outlined rows="3" max-rows="6" :rules="descriptionRules"></v-textarea>
                </v-form>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#3F51B5" text @click="saveChanges">Save</v-btn>
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
  import ConfirmPassword from '@/components/Profile/ConfirmPassword.vue';
  import { useStore } from "vuex";

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
        profilePicture: '',
        description: '',
        role: '',
        isBlocked: false
      });
  
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
      const urlRules = [
        (v) => !!v || 'Profile picture URL is required',
        (v) => /^(ftp|http|https):\/\/[^ "]+$/.test(v) || 'URL must be valid'
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
          const response = await axiosInstance.get(`/users/${userId.value}`);
          Object.assign(profile.value, response.data);
          profile.value.dateOfBirth = formatDateOfBirth(profile.value.dateOfBirth);
          initialProfile.value = { ...response.data };
          profile.value.confirmedPassword = response.data.password;
        } catch (error) {
          console.error('Error fetching profile details:', error);
        }
      };
  
      const saveChanges = async () => {
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
            console.log("profile.value", profile.value);
          const response = await axiosInstance.put(`/users`, profile.value);
          initialProfile.value.password = profile.value.password
          initialProfile.value.username = profile.value.username
          initialProfile.value.emailAddress = profile.value.emailAddress
          console.log('Profile updated successfully', response);
        } catch (error) {
          console.error('Error saving changes:', error);
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
        confirmedPassword,
        confirmPasswordDialog,
        nameRules,
        usernameRules,
        emailRules,
        phoneRules,
        passwordRules,
        confirmedPasswordRules,
        dateRules,
        urlRules,
        descriptionRules,
        saveChanges,
        handlePasswordConfirmation,
        handlePasswordCancellation
      };
    }
  };
</script>
  
<style scoped>
</style>
  
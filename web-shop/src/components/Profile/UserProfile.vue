<template>
    <v-dialog v-model="dialog" max-width="600px" @closed="onClosed">
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
            <v-text-field v-model="profile.dateOfBirth" label="Date of Birth" outlined type="date" :rules="dateRules"></v-text-field>
            <v-text-field v-model="profile.profilePicture" label="Profile Picture URL" outlined :rules="urlRules"></v-text-field>
            <v-textarea v-model="profile.description" label="Description" outlined rows="3" max-rows="6" :rules="descriptionRules"></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#3F51B5" text @click="onClosed">Cancel</v-btn>
          <v-btn color="#3F51B5" text @click="saveChanges">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
    import { ref, onMounted } from 'vue';
    import axiosInstance from '@/interceptors/axiosInterceptor.js';
    
    export default {
        name: 'UserProfile',
        props: {
        userId: {
            type: Number,
            required: true
        }
        },
        setup(props, { emit }) {
        const dialog = ref(false);
        const profile = ref({
            id: null,
            firstName: '',
            lastName: '',
            username: '',
            emailAddress: '',
            phoneNumber: '',
            password: '',
            dateOfBirth: '',
            profilePicture: '',
            description: '',
            role: '',
            averageRating: 0,
            numberOfRatings: 0,
            isBlocked: false
        });
    
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
    
        const fetchProfileDetails = async () => {
            try {
            const response = await axiosInstance.get(`/users/${1}`);
            Object.assign(profile.value, response.data);
            dialog.value = true;
            } catch (error) {
            console.error('Error fetching profile details:', error);
            }
        };
    
        const onClosed = () => {
            dialog.value = false;
            emit('closed');
        };
    
        const saveChanges = async () => {
            try {
            const response = await axiosInstance.put(`/users/${profile.value.id}`, profile.value);
            dialog.value = false;
            emit('saved');
            } catch (error) {
            console.error('Error saving changes:', error);
            }
        };
    
        return {
            dialog,
            profile,
            nameRules,
            usernameRules,
            emailRules,
            phoneRules,
            passwordRules,
            dateRules,
            urlRules,
            descriptionRules,
            onClosed,
            saveChanges
        };
        }
    };
  </script>
  
  <style scoped>
  </style>
  
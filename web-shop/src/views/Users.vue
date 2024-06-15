<template>
    <div class="container">
        <v-row>
            <v-col cols="12">
                <h1>USERS</h1>
            </v-col>
        </v-row>
        <v-data-table
            :headers="headers"
            :items="users"
            item-key="id"
            class="bottom-right">
            <template v-slot:item.action="{ item }">
                <v-icon @click="showDetails(item.id, item.role)">mdi-information-outline</v-icon>
            </template>
        </v-data-table>
        <UserDetails v-if="detailsModalOpen" :userId="selectedUserId" :userRole="selectedUserRole" @closed="onUserDetailsClosed" />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import axiosInstance from '@/interceptors/axiosInterceptor.js'
  import UserDetails from '@/components/Users/UserDetails.vue';
  // import { useStore } from "vuex";
  
  export default {
    name: "Reviews",
    components: {
        UserDetails
    },
    setup() {
      const users = ref([]);
      const selectedUserId = ref(null);
      const selectedUserRole = ref(null);
      const headers = [
        { text: 'ID', align: 'start', value: 'id' },
        { text: 'First name', align: 'start', value: 'firstName' },
        { text: 'Last name', align: 'start', value: 'lastName' },
        { text: 'Username', align: 'start', value: 'username' },
        { text: 'Email address', align: 'start', value: 'emailAddress' },
        { text: 'Role', align: 'start', value: 'role' },
        { text: 'Action', align: 'start', value: 'action' }
      ];
      let detailsModalOpen = ref(false);
  
      onMounted(() => {
        fetchUsers();
      });
  
      const fetchUsers = async () => {
        try {
          const response = await axiosInstance.get('/users');
          users.value = response.data.items;
        } catch (error) {
          // console.error('Error fetching products:', error);
        }
      };

      const showDetails = (id, role) => {
        if (selectedUserId.value === id) {
            selectedUserId.value = null;
            selectedUserRole.value = null;
        } else {
            selectedUserId.value = id;
            selectedUserRole.value = role;
            detailsModalOpen.value = true;
        }
      };
  
      const onUserDetailsClosed = () => {
        selectedUserId.value = null;
        selectedUserRole.value = null;
        detailsModalOpen.value = false;
      };
  
      return {
        headers,
        users,
        selectedUserId,
        selectedUserRole,
        detailsModalOpen,
        showDetails,
        fetchUsers,
        onUserDetailsClosed,
      };
    }
  };
  </script>
  
  <style>
  /* .container {
    position: relative;
  }
  
  .bottom-right {
    position: absolute;
    bottom: 0;
    right: 0;
  } */
  </style>
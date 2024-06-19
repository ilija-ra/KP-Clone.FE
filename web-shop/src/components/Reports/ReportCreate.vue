<template>
    <div class="container">
        <v-container>
            <v-card>
                <v-card-title>Create report</v-card-title>
                <v-card-text>
                <v-form ref="form">
                    <v-select v-model="selectedReported" clearable label="Select user" :items=userFullNames :rules="reportedIdRules"></v-select>
                    <v-textarea v-model="report.reason" label="Reason" outlined rows="3" max-rows="6" :rules="reasonRules"></v-textarea>
                </v-form>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#3F51B5" text @click="saveChanges">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </div>
</template>
  
<script>
  import { ref, onMounted, computed } from 'vue';
  import axiosInstance from '@/interceptors/axiosInterceptor.js';
  import { useStore } from "vuex";
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
  export default {
    name: 'CreateReport',
    setup(props) {
      let selectedReported = ref(null);
      const users = ref([]);
      const userFullNames = ref([]);
      const store = useStore();
      const userId = computed(() => store.state.userId);
      const role = computed(() => store.state.role);
      const report = ref({
        id: null,
        reason: null,
        reportedId: null,
        reporterId: null
      });
  
      const reportedIdRules = [
        (v) => !!v || 'User is required'
      ];
      const reasonRules = [
        (v) => !!v || 'Reason is required',
        (v) => v.length <= 750 || 'Comment must be less than 750 characters'
      ];

      onMounted(() => {
        let userRoles = '';
        if (role.value === 'BUYER') {
          userRoles = 'sellers';
        } else if (role.value === 'SELLER') {
          userRoles = 'buyers';
        }

        fetchUsers(userRoles);
      });

      const fetchUsers = async (userRoles) => {
        try {
          const response = await axiosInstance.get(`/users/options/${userRoles}`);
          users.value = response.data.items.filter(x => x.id != userId.value);
          userFullNames.value = users.value.map(x => x.fullName);
        } catch (error) {
          Object.values(error?.response?.data?.errors)?.forEach(errorMessage => {
            toast.error(errorMessage, {
              autoClose: 10000
            })
          });
        }
      };
  
      const saveChanges = async () => {
        try {
          const payload = {
            id: null,
            reason: report.value.reason,
            reportedId: selectedReported.value == null ? null : users.value.filter(x => x.fullName == selectedReported.value)[0].id,
            reporterId: userId.value
          }

          let userRole;

          if (role.value === 'BUYER') {
            userRole = 'seller';
          } else if (role.value === 'SELLER') {
            userRole = 'buyer';
          }

          const response = await axiosInstance.post(`/reports/create-for-${userRole}`, payload);

          if (response.status === 201) {
            toast.success('Report saved successfully', {
              autoClose: 10000
            })
            selectedReported.value = null;
            report.value.reason = null;
          } else {
            toast.error(response.statusText, {
              autoClose: 10000
            })
          }
        } catch (error) {
          Object.values(error?.response?.data?.errors)?.forEach(errorMessage => {
          toast.error(errorMessage, {
            autoClose: 10000
          })
        });
        }
      };
  
      return {
        report,
        selectedReported,
        userFullNames,
        reportedIdRules,
        reasonRules,
        saveChanges,
      };
    }
  };
</script>
  
<style scoped>
</style>
  
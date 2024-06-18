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

  export default {
    name: 'CreateReport',
    setup(props) {
      let selectedReported = ref(null);
      const users = ref([]);
      const userFullNames = ref([]);
      const store = useStore();
      const userId = computed(() => store.state.userId);
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
        fetchUsers();
      });

      const fetchUsers = async () => {
        try {
          const response = await axiosInstance.get(`/users/options`);
          users.value = response.data.items.filter(x => x.id != userId.value);
          userFullNames.value = users.value.map(x => x.fullName);
        } catch (error) {
          console.error('Error fetching product details:', error);
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

          const response = await axiosInstance.post(`/reports/create-for-seller`, payload);

          if (response.status === 201) {
            console.log('Report saved successfully');
            selectedReported.value = null;
            report.value.reason = null;
          } else {
            console.error('Error saving review:', response.statusText);
          }
        } catch (error) {
          console.error('Error saving changes:', error);
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
  
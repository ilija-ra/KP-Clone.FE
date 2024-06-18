<template>
    <v-dialog v-model="dialog" max-width="500px" @closed="onClosed">
      <v-card>
        <v-card-title>Reason for rejection</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-textarea v-model="decline.reason" label="Reason" outlined rows="3" max-rows="10" :rules="reasonRules"></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#3F51B5" text @click="onClosed">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="declineReport">Decline</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  import axiosInstance from '@/interceptors/axiosInterceptor.js';

  export default {
    name: 'ReportAcceptModal',
    props: {
      reportId: {
        type: Number,
        required: true
      }
    },
    setup(props, { emit }) {
      const dialog = ref(false);
      const decline = ref({
        id: null,
        reason: '',
      });
      let reportId = ref(null);
      
      const reasonRules = [
        (v) => !!v || 'Reason is required',
        (v) => v.length <= 750 || 'Reason must be less than 750 characters'
      ];

      const declineReport = async () => {
        try{
            const payload = {
                id: reportId,
                reason: decline.value.reason
            }

            const response = await axiosInstance.post(`/reports/decline`, payload);
            emit('decline');
            decline.value.reason = '';
            dialog.value = false; // Close the modal
        } catch (error){
            console.error('Error occured while accepting the report:', error);
        }
      };
  
      watch(() => props.reportId, (newId) => {
        if (newId) {
            reportId = newId;
            dialog.value = true;
        }
      });
  
      const onClosed = () => {
        dialog.value = false;
        emit('closed');
      };

      return {
        dialog,
        decline,
        declineReport,
        onClosed
      };
    }
  };
  </script>
  
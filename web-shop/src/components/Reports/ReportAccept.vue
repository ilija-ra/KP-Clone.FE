<template>
    <v-dialog v-model="dialog" max-width="500px" @closed="onClosed">
      <v-card>
        <v-card-title>Accept Report</v-card-title>
        <v-card-text>
          <p>Are you sure you want to accept this report?</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="acceptReport">Accept</v-btn>
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
      let reportId = ref(null);
      
      const acceptReport = async () => {
        try{
            const response = await axiosInstance.post(`/reports/accept/${Number(reportId)}`);
            emit('accept');
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
        emit('closed');
      };

      return {
        dialog,
        acceptReport,
        onClosed
      };
    }
  };
  </script>
  
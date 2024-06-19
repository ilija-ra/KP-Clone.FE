<template>
    <div class="container">
        <v-row>
            <v-col cols="12">
                <h1>REPORTS</h1>
            </v-col>
        </v-row>
        <v-data-table
            :headers="headers"
            :items="reports"
            item-key="id"
            class="bottom-right">
            <template v-slot:item.action="{ item }">
                <v-icon @click="accept(item.id)">mdi-check-outline</v-icon>
                <v-icon @click="decline(item.id)">mdi-delete-outline</v-icon>
            </template>
        </v-data-table>
        <ReportAccept v-if="acceptModalOpen" :reportId="selectedReportId" @closed="onReportAcceptClosed" @accept="fetchReports"/>
        <ReportDecline v-if="declineModalOpen" :reportId="selectedReportId" @closed="onReportDeclineClosed" @decline="fetchReports" />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import axiosInstance from '@/interceptors/axiosInterceptor.js'
  import ReportDecline from '@/components/Reports/ReportDecline.vue';
  import ReportAccept from '@/components/Reports/ReportAccept.vue';
  // import { useStore } from "vuex";
  
  export default {
    name: "Reviews",
    components: {
      ReportAccept,
      ReportDecline
    },
    setup() {
      const reports = ref([]);
      const selectedReportId = ref(null);
      const headers = [
        { text: 'ID', align: 'start', value: 'id' },
        { text: 'Reason', align: 'start', value: 'reason' },
        { text: 'Reported name', align: 'start', value: 'reportedName' },
        { text: 'Report status', align: 'start', value: 'reportStatus' },
        { text: 'Reporter Name', align: 'start', value: 'reporterName' },
        { text: 'Action', align: 'start', value: 'action' }
      ];
      let acceptModalOpen = ref(false);
      let declineModalOpen = ref(false);
  
      onMounted(() => {
        fetchReports();
      });
  
      const fetchReports = async () => {
        try {
          const response = await axiosInstance.get('/reports');
          reports.value = response.data.items;
        } catch (error) {
          // console.error('Error fetching products:', error);
        }
      };

      const accept = (id) => {
        if (selectedReportId.value === id) {
            selectedReportId.value = null;
        } else {
            selectedReportId.value = id;
            acceptModalOpen.value = true;
            declineModalOpen.value = false;
        }
      };

      const decline = (id) => {
        if (selectedReportId.value === id) {
            selectedReportId.value = null;
        } else {
            selectedReportId.value = id;
            declineModalOpen.value = true;
            acceptModalOpen.value = false;
        }
      };
  
      const onReportDeclineClosed = () => {
        selectedReportId.value = null;
        declineModalOpen.value = false;
      };

      const onReportAcceptClosed = () => {
        selectedReportId.value = null;
        acceptModalOpen.value = false;
      };
  
      return {
        headers,
        reports,
        selectedReportId,
        acceptModalOpen,
        declineModalOpen,
        fetchReports,
        accept,
        decline,
        onReportDeclineClosed,
        onReportAcceptClosed
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
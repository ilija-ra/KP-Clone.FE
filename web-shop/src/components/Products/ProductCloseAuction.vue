<template>
    <v-dialog v-model="dialog" max-width="500px" @closed="onClosed">
      <v-card>
        <v-card-title>Close Auction</v-card-title>
        <v-card-text>
          <p>Are you sure you want to close this auction?</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="#3F51B5" text @click="onClosed">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="closeAuction">Accept</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { ref, watch, computed } from 'vue';
  import { useStore } from 'vuex';
  import axiosInstance from '@/interceptors/axiosInterceptor.js';

  export default {
    name: 'ReportAcceptModal',
    props: {
        productId: {
        type: Number,
        required: true
      }
    },
    setup(props, { emit }) {
      const store = useStore();
      const userId = computed(() => store.state.userId);
      const dialog = ref(false);
      let productId = ref(null);
      
      const closeAuction = async () => {
        try{
            const payload = {
                sellerId: userId.value,
                productId: productId
            };

            const response = await axiosInstance.post(`/products/close-auction`, payload);
            emit('closeAuction');
            dialog.value = false; // Close the modal
        } catch (error){
            console.error('Error occured while accepting the report:', error);
        }
      };
  
      watch(() => props.productId, (newId) => {
        if (newId) {
            productId = newId;
            dialog.value = true;
        }
      });
  
      const onClosed = () => {
        dialog.value = false;
        emit('closed');
      };

      return {
        dialog,
        closeAuction,
        onClosed
      };
    }
  };
  </script>
  
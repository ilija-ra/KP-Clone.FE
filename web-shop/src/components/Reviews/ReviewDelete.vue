<template>
    <v-dialog v-model="dialog" max-width="500px" @closed="onClosed">
      <v-card>
        <v-card-title>Delete Review</v-card-title>
        <v-card-text>
          <p>Are you sure you want to delete this review?</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="#3F51B5" text @click="dialog = false">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="deleteReview">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  import axiosInstance from '@/interceptors/axiosInterceptor.js';

  export default {
    name: 'ReviewDeleteModal',
    props: {
      reviewId: {
        type: Number,
        required: true
      }
    },
    setup(props, { emit }) {
      const dialog = ref(false);
      let reviewId = ref(null);
      
      const deleteReview = async () => {
        try{
            const response = await axiosInstance.delete(`/reviews/${Number(reviewId)}`);
            emit('delete');
            dialog.value = false; // Close the modal
        } catch (error){
            console.error('Error occured while review delete:', error);
        }
      };
  
      watch(() => props.reviewId, (newId) => {
        if (newId) {
            reviewId = newId;
            dialog.value = true;
        }
      });
  
      const onClosed = () => {
        emit('closed');
      };

      return {
        dialog,
        onClosed,
        deleteReview
      };
    }
  };
  </script>
  
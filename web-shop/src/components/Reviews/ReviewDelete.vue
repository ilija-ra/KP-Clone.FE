<template>
    <v-dialog v-model="dialog" max-width="500px" @closed="onClosed">
      <v-card>
        <v-card-title>Delete Review</v-card-title>
        <v-card-text>
          <p>Are you sure you want to delete this review?</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="#3F51B5" text @click="onClosed">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="deleteReview">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  import axiosInstance from '@/interceptors/axiosInterceptor.js';
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
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

            if (response.status === 204) {
              toast.success('Review deleted successfully', {
                autoClose: 10000
              })
              emit('delete');
              dialog.value = false;
            } else {
              toast.error(response.statusText, {
                autoClose: 10000
              })
            }
        } catch (error){
          Object.values(error?.response?.data?.errors)?.forEach(errorMessage => {
          toast.error(errorMessage, {
            autoClose: 10000
          })
        });
        }
      };
  
      watch(() => props.reviewId, (newId) => {
        if (newId) {
            reviewId = newId;
            dialog.value = true;
        }
      });
  
      const onClosed = () => {
        dialog.value = false;
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
  
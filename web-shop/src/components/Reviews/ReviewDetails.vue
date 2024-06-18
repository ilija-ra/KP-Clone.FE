<template>
    <v-dialog v-model="dialog" max-width="500px" @closed="onClosed">
      <v-card v-if="review">
        <v-card-title>
          Review details of <span class="headline">{{ review.reviewerName }}</span>
        </v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Id:</v-list-item-title>
                    <v-list-item-subtitle v-html="review.id"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>Rate:</v-list-item-title>
                    <v-list-item-subtitle v-html="review.rate"></v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>Comment:</v-list-item-title>
                    <v-list-item-subtitle v-html="review.comment"></v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Date of review:</v-list-item-title>
                <v-list-item-subtitle v-html="review.reviewDate"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>Reviewed user:</v-list-item-title>
                    <v-list-item-subtitle v-html="review.reviewedName"></v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>Reviewer:</v-list-item-title>
                    <v-list-item-subtitle v-html="review.reviewerName"></v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#3F51B5" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { ref, watch, onMounted } from 'vue';
  import axios from 'axios';
  import axiosInstance from '@/interceptors/axiosInterceptor.js'
  
  export default {
    name: 'ReviewDetails',
    props: {
        reviewId: {
        type: Number,
        required: true
      }
    },
    setup(props, { emit }) {
      const dialog = ref(false);
      const review = ref(null);
  
      // Emit event when the dialog is closed
      const onClosed = () => {
        emit('closed');
      };

      const fetchReviewDetails = async (id) => {
        try {
          const response = await axiosInstance.get(`/reviews/${Number(id)}`);
          review.value = response.data;
          dialog.value = true;
        } catch (error) {
          console.error('Error fetching review details:', error);
        }
      };
  
      watch(() => props.reviewId, (newId) => {
        if (newId) {
          fetchReviewDetails(newId);
        }
      });
  
      return {
        dialog,
        review,
        onClosed
      };
    }
  };
  </script>
  
  <style scoped>
  .headline {
    font-weight: bold;
  }
  </style>
  
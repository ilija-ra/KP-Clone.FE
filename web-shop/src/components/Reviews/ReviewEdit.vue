<template>
    <v-dialog v-model="dialog" max-width="500px" @closed="onClosed">
      <v-card>
        <v-card-title>Edit Review</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="editedReview.rate" label="Rate" outlined type="number" :rules="rateRules"></v-text-field>
            <v-textarea v-model="editedReview.comment" label="Comment" outlined rows="3" max-rows="6" :rules="commentRules"></v-textarea>
            <v-text-field v-model="editedReview.reviewedId" label="Reviewed Id" outlined type="number" :rules="reviewedIdRules"></v-text-field>
            <v-text-field v-model="editedReview.reviewerId" label="Reviewer Id" outlined type="number" :rules="reviewerIdRules"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveChanges">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  import axiosInstance from '@/interceptors/axiosInterceptor.js';
  
  export default {
    name: 'EditReviewModal',
    props: {
      reviewId: {
        type: Number,
        required: true
      }
    },
    setup(props, { emit }) {
      const dialog = ref(false);
      const editedReview = ref({
        id: null,
        rate: null,
        comment: '',
        reviewedId: null,
        reviewerId: null
      });
  
      const idRules = [
        (v) => !!v || 'Id is required',
        (v) => v > 0 || 'Id must be greater than 0'
      ];
      const rateRules = [
        (v) => !!v || 'Rate is required',
        (v) => v > 0 || 'Rate must be greater than 0',
        (v) => v <= 5 || 'Rate must be less or equal to 5.'
      ];
      const commentRules = [
        (v) => !!v || 'Comment is required',
        (v) => v.length <= 500 || 'Comment must be less than 500 characters'
      ];
      const reviewedIdRules = [
        (v) => !!v || 'Reviewed Id is required',
        (v) => v > 0 || 'Reviewed Id must be greater than 0'
      ];
      const reviewerIdRules = [
        (v) => !!v || 'Reviewer Id is required',
        (v) => v > 0 || 'Reviewer Id must be greater than 0'
      ];

      const fetchReviewDetails = async (id) => {
        try {
          const response = await axiosInstance.get(`/reviews/${Number(id)}`);
          Object.assign(editedReview.value, response.data);
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
  
      const onClosed = () => {
        emit('closed');
      };
  
      const saveChanges = async () => {
        try {
          const payload = {
            id: editedReview.value.id,
            rate: editedReview.value.rate,
            comment: editedReview.value.comment,
            reviewedId: editedReview.value.reviewedId,
            reviewerId: editedReview.value.reviewerId
          }

          const response = await axiosInstance.put(`/reviews`, payload);
          dialog.value = false;
          emit('saved');
        } catch (error) {
          console.error('Error saving changes:', error);
        }
      };
  
      return {
        dialog,
        editedReview,
        idRules,
        rateRules,
        commentRules,
        reviewedIdRules,
        reviewerIdRules,
        onClosed,
        saveChanges
      };
    }
  };
  </script>
  
  <style scoped>
  </style>
  
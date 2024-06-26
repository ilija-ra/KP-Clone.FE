<template>
    <v-dialog v-model="dialog" max-width="500px" @closed="onClosed">
      <v-card>
        <v-card-title>Edit Review</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="editedReview.rate" label="Rate" outlined type="number" :rules="rateRules"></v-text-field>
            <v-textarea v-model="editedReview.comment" label="Comment" outlined rows="3" max-rows="6" :rules="commentRules"></v-textarea>
            <v-select v-model="selectedReviewed" clearable label="Select reviewed" :items=userFullNames :rules="reviewedIdRules"></v-select>
            <v-select v-model="selectedReviewer" clearable label="Select reviewer" :items=userFullNames :rules="reviewerIdRules"></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#3F51B5" text @click="onClosed">Cancel</v-btn>
          <v-btn color="#3F51B5" text @click="saveChanges">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { ref, watch, onMounted } from 'vue';
  import axiosInstance from '@/interceptors/axiosInterceptor.js';
  import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
  export default {
    name: 'EditReviewModal',
    props: {
      reviewId: {
        type: Number,
        required: true
      }
    },
    setup(props, { emit }) {
      const users = ref([]);
      const userFullNames = ref([]);
      const selectedReviewed = ref(null);
      const selectedReviewer = ref(null);
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
        () => selectedReviewer.value !== selectedReviewed.value || 'Reviewer and reviewed user must be different'
      ];
      const reviewerIdRules = [
        (v) => !!v || 'Reviewer Id is required',
        () => selectedReviewer.value !== selectedReviewed.value || 'Reviewer and reviewed user must be different'
      ];

      onMounted(() => {
        fetchUsers();
      });

      const fetchReviewDetails = async (id) => {
        try {
          const response = await axiosInstance.get(`/reviews/${Number(id)}`);
          Object.assign(editedReview.value, response.data);

          selectedReviewed.value = response.data.reviewedName;
          selectedReviewer.value = response.data.reviewerName;

          dialog.value = true;
        } catch (error) {
          Object.values(error?.response?.data?.errors)?.forEach(errorMessage => {
          toast.error(errorMessage, {
            autoClose: 10000
          })
        });
        }
      };
  
      const fetchUsers = async () => {
        try {
          const response = await axiosInstance.get(`/users/options`);
          users.value = response.data.items;
          userFullNames.value = users.value.map(x => x.fullName);
        } catch (error) {
          Object.values(error?.response?.data?.errors)?.forEach(errorMessage => {
          toast.error(errorMessage, {
            autoClose: 10000
          })
        });
        }
      };

      watch(() => props.reviewId, (newId) => {
        if (newId) {
          fetchReviewDetails(newId);
        }
      });
  
      const onClosed = () => {
        dialog.value = false;
        emit('closed');
      };
  
      const saveChanges = async () => {
        try {
          const payload = {
            id: editedReview.value.id,
            rate: editedReview.value.rate,
            comment: editedReview.value.comment,
            reviewedId: selectedReviewed.value == null ? null : users.value.filter(x => x.fullName == selectedReviewed.value)[0].id,
            reviewerId: selectedReviewer.value == null ? null : users.value.filter(x => x.fullName == selectedReviewer.value)[0].id
          }

          const response = await axiosInstance.put(`/reviews`, payload);

          if (response.status === 204) {
            toast.success('Review saved successfully', {
              autoClose: 10000
            })
            emit('saved');
            dialog.value = false;
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
        dialog,
        editedReview,
        idRules,
        rateRules,
        commentRules,
        reviewedIdRules,
        reviewerIdRules,
        onClosed,
        saveChanges,
        users,
        userFullNames,
        selectedReviewed,
        selectedReviewer
      };
    }
  };
  </script>
  
  <style scoped>
  </style>
  
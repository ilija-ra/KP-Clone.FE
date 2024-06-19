<template>
    <div class="container">
        <v-row>
            <v-col cols="12">
                <h1>REVIEWS</h1>
            </v-col>
        </v-row>
        <v-data-table
            :headers="headers"
            :items="reviews"
            item-key="id"
            class="bottom-right">
            <template v-slot:item.action="{ item }">
                <v-icon @click="showDetails(item.id)">mdi-information-outline</v-icon>
                <v-icon @click="editReview(item.id)">mdi-pencil-outline</v-icon>
                <v-icon @click="deleteReview(item.id)">mdi-delete-outline</v-icon>
            </template>
        </v-data-table>
        <ReviewDetails v-if="detailsModalOpen" :reviewId="selectedReviewId" @closed="onReviewDetailsClosed" />
        <ReviewEdit v-if="editModalOpen" :reviewId="selectedReviewId" @closed="onReviewEditClosed" @saved="fetchReviews"/>
        <ReviewDelete v-if="deleteModalOpen" :reviewId="selectedReviewId" @delete="fetchReviews" />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import axiosInstance from '@/interceptors/axiosInterceptor.js'
  import ReviewDetails from '@/components/Reviews/ReviewDetails.vue';
  import ReviewEdit from '@/components/Reviews/ReviewEdit.vue';
  import ReviewDelete from '@/components/Reviews/ReviewDelete.vue';
  // import { useStore } from "vuex";
  
  export default {
    name: "Reviews",
    components: {
      ReviewDetails,
      ReviewEdit,
      ReviewDelete
    },
    setup() {
      const reviews = ref([]);
      const categories = ref([]);
      const categoryNames = ref([]);
      const selectedReviewId = ref(null);
      const headers = [
        { title: 'ID', align: 'center', key: 'id' },
        { title: 'Rate', align: 'center', key: 'rate' },
        { title: 'Comment', align: 'center', key: 'comment' },
        { title: 'Reviewed User', align: 'center', key: 'reviewedName' },
        { title: 'Reviewer', align: 'center', key: 'reviewerName' },
        { title: 'Actions', align: 'center', value: 'action' }
      ];
      let detailsModalOpen = ref(false);
      let editModalOpen = ref(false);
      let deleteModalOpen = ref(false);
  
      onMounted(() => {
        fetchReviews();
      });
  
      const fetchReviews = async () => {
        try {
          const response = await axiosInstance.get('/reviews');
          reviews.value = response.data.items;
        } catch (error) {
          // console.error('Error fetching products:', error);
        }
      };

      const showDetails = (id) => {
        if (selectedReviewId.value === id) {
            selectedReviewId.value = null;
        } else {
            selectedReviewId.value = id;
            editModalOpen.value = false;
            deleteModalOpen.value = false;
            detailsModalOpen.value = true;
        }
      };

      const editReview = (id) => {
        if (selectedReviewId.value === id) {
            selectedReviewId.value = null;
        } else {
            selectedReviewId.value = id;
            detailsModalOpen.value = false;
            deleteModalOpen.value = false;
            editModalOpen.value = true;
        }
      };

      const deleteReview = (id) => {
        if (selectedReviewId.value === id) {
            selectedReviewId.value = null;
        } else {
            selectedReviewId.value = id;
            editModalOpen.value = false;
            detailsModalOpen.value = false;
            deleteModalOpen.value = true;
        }
      };
  
      const onReviewDetailsClosed = () => {
        selectedReviewId.value = null;
        detailsModalOpen.value = false;
      };

      const onReviewEditClosed = () => {
        selectedReviewId.value = null;
        editModalOpen.value = false;
      };
  
      return {
        headers,
        reviews,
        selectedReviewId,
        detailsModalOpen,
        editModalOpen,
        deleteModalOpen,
        showDetails,
        editReview,
        deleteReview,
        fetchReviews,
        onReviewDetailsClosed,
        onReviewEditClosed
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
<template>
    <div class="container">
        <v-row align="center">
            <v-col>
                <h1>MY REVIEWS</h1>
            </v-col>
            <v-col class="d-flex justify-end">
                <v-btn prepend-icon="mdi-plus" color="#3F51B5" @click="createReview()">New review</v-btn>
            </v-col>
        </v-row>
        <v-data-table
            :headers="headers"
            :items="reviews"
            item-key="id"
            class="bottom-right">
        </v-data-table>
        <ReviewCreate v-if="createModalOpen" @closed="onReviewCreateClosed" @saved="onReviewCreateSaved"/>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import axiosInstance from '@/interceptors/axiosInterceptor.js'
  import { useStore } from "vuex";
  import ReviewCreate from '@/components/Reviews/ReviewCreate.vue';
  
  export default {
    name: "MyReviews",
    components: {
        ReviewCreate
    },
    setup() {
      let createModalOpen = ref(false);
      const store = useStore();
      const userId = computed(() => store.state.userId);
      const reviews = ref([]);
      const headers = [
        { title: 'ID', align: 'center', key: 'id' },
        { title: 'Rate', align: 'center', key: 'rate' },
        { title: 'Comment', align: 'center', key: 'comment' },
        { title: 'Date', align: 'center', key: 'reviewDate' },
        { title: 'Reviewed User', align: 'center', key: 'reviewedName' },
        { title: 'Reviewer', align: 'center', key: 'reviewerName' },
      ];
  
      onMounted(() => {
        fetchMyReviews();
      });
  
      const fetchMyReviews = async () => {
        try {
          const response = await axiosInstance.get(`/reviews/get-by-reviewer-id/${userId.value}`);
          reviews.value = response.data.items;
        } catch (error) {
          // console.error('Error fetching products:', error);
        }
      };
  
      const createReview = () => {
        createModalOpen.value = false;
        createModalOpen.value = true;
      };

      const onReviewCreateSaved = () => {
        createModalOpen.value = false;
        fetchMyReviews();
      };

      const onReviewCreateClosed = () => {
        createModalOpen.value = false;
      };

      return {
        headers,
        reviews,
        fetchMyReviews,
        createReview,
        createModalOpen,
        onReviewCreateSaved,
        onReviewCreateClosed
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
<template>
    <div class="container">
        <v-row align="center">
            <v-col>
                <h1>REVIEWS ABOUT ME</h1>
            </v-col>
        </v-row>
        <v-data-table
          :headers="headers"
          :items="reviews"
          item-key="id"
          class="bottom-right">
        </v-data-table>
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
    setup() {
      const store = useStore();
      const userId = computed(() => store.state.userId);
      const role = computed(() => store.state.role);
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
        fetchReviewsAboutMe();
      });
  
      const fetchReviewsAboutMe = async () => {
        try {
          let helper = '';
          if (role.value === 'BUYER') {
            helper = 'purchase';
          } else if (role.value === 'SELLER') {
            helper = 'selling';
        }
          const response = await axiosInstance.get(`/reviews/my-${helper}-reviews/${userId.value}`);
          reviews.value = response.data.items;
        } catch (error) {
          // console.error('Error fetching products:', error);
        }
      };

      return {
        headers,
        reviews,
        fetchReviewsAboutMe
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
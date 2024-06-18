<template>
  <v-dialog v-model="dialog" max-width="500px" @closed="onClosed">
    <v-card>
      <v-card-title>Create review</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-select v-model="selectedReviewed" clearable label="Select user" :items=userFullNames :rules="reviewedIdRules"></v-select>
          <v-text-field v-model="review.rate" label="Rate" outlined :rules="rateRules"></v-text-field>
          <v-textarea v-model="review.comment" label="Comment" outlined rows="3" max-rows="6" :rules="commentRules"></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#3F51B5" text @click="dialog = false">Cancel</v-btn>
        <v-btn color="#3F51B5" text @click="saveChanges">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
  
<script>
  import { ref, onMounted, computed } from 'vue';
  import axiosInstance from '@/interceptors/axiosInterceptor.js';
  import { useStore } from "vuex";

  export default {
    name: 'ReviewCreate',
    setup(props, { emit }) {
      const dialog = ref(false);
      const users = ref([]);
      const initialProfile = ref(null);
      const store = useStore();
      const userId = computed(() => store.state.userId);
      const userFullNames = ref([]);
      const selectedReviewed = ref(null);
      const review = ref({
        id: null,
        rate: null,
        comment: '',
        reviewedId: null,
        reviewerId: null
      });
      
      const reviewedIdRules = [
        (v) => !!v || 'User is required'
      ];
      const rateRules = [
        (v) => !!v || 'Rate is required',
        (v) => (v >= 1 && v <= 5) || 'Rate range is 1 to 5.'
      ];
      const commentRules = [
        (v) => !!v || 'Comment is required',
        (v) => v.length <= 500 || 'Comment must be less than 500 characters'
      ];
  
      onMounted(() => {
        fetchSellers();
      });
  
      const fetchSellers = async () => {
        try {
          const response = await axiosInstance.get(`/users/options/sellers`);
          users.value = response.data.items.filter(x => x.id != userId.value);
          userFullNames.value = users.value.map(x => x.fullName);
          dialog.value = true;
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      };

      const saveChanges = async () => {
        try {
          const payload = {
            id: null,
            rate: review.value.rate,
            comment: review.value.comment,
            reviewedId: selectedReviewed.value == null ? null : users.value.filter(x => x.fullName == selectedReviewed.value)[0].id,
            reviewerId: userId.value
          }

          const response = await axiosInstance.post(`/reviews/create-for-seller`, payload);

          if (response.status === 201) {
            console.log('Review saved successfully');
            emit('saved');
            dialog.value = false;
            // Optionally, you can add further logic here, such as resetting the form or providing user feedback
          } else {
            console.error('Error saving review:', response.statusText);
          }
        } catch (error) {
          console.error('Error saving changes:', error);
        }
      };

      const onClosed = () => {
        emit('closed');
      };
  
      return {
        review,
        selectedReviewed,
        userFullNames,
        reviewedIdRules,
        rateRules,
        commentRules,
        saveChanges,
        onClosed,
        dialog
      };
    }
  };
</script>
  
<style scoped>
</style>
  
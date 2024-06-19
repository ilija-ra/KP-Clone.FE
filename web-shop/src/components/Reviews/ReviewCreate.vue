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
        <v-btn color="#3F51B5" text @click="onClosed">Cancel</v-btn>
        <v-btn color="#3F51B5" text @click="saveChanges">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
  
<script>
  import { ref, onMounted, computed } from 'vue';
  import axiosInstance from '@/interceptors/axiosInterceptor.js';
  import { useStore } from "vuex";
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
  export default {
    name: 'ReviewCreate',
    setup(props, { emit }) {
      const dialog = ref(false);
      const users = ref([]);
      const initialProfile = ref(null);
      const store = useStore();
      const userId = computed(() => store.state.userId);
      const role = computed(() => store.state.role);
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
        fetchUsers();
      });
  
      const fetchUsers = async () => {
        try {
          let userRoles = '';
          if (role.value === 'BUYER') {
            userRoles = 'sellers';
          } else if (role.value === 'SELLER') {
            userRoles = 'buyers';
          }

          const response = await axiosInstance.get(`/users/options/${userRoles}`);
          users.value = response.data.items.filter(x => x.id != userId.value);
          userFullNames.value = users.value.map(x => x.fullName);
          dialog.value = true;
        } catch (error) {
          Object.values(error?.response?.data?.errors)?.forEach(errorMessage => {
          toast.error(errorMessage, {
            autoClose: 10000
          })
        });
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
          };

          let userRole;

          if (role.value === 'BUYER') {
            userRole = 'seller';
          } else if (role.value === 'SELLER') {
            userRole = 'buyer';
          }

          const response = await axiosInstance.post(`/reviews/create-for-${userRole}`, payload);

          if (response.status === 201) {
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

      const onClosed = () => {
        dialog.value = false
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
  
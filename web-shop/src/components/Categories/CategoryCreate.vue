<template>
    <v-dialog v-model="dialog" max-width="500px" @closed="onClosed">
      <v-card>
        <v-card-title>Create product</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="category.name" label="Name" outlined :rules="nameRules"></v-text-field>
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
    import axios from 'axios';
    import axiosInstance from '@/interceptors/axiosInterceptor.js';
    import { useStore } from "vuex";
  import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

    export default {
      name: 'ReviewCreate',
      setup(props, { emit }) {
        const dialog = ref(false);
        const store = useStore();
        const userId = computed(() => store.state.userId);
        const role = computed(() => store.state.role);
        const category = ref({
          id: null,
          name: null,
        });
        
        const nameRules = [
          (v) => !!v || 'User is required',
          (v) => (v.length >= 2 && v.length <= 50) || 'Name length range is between 2 to 50.'
        ];
    
        onMounted(() => {
          dialog.value = true;
        });
  
        const saveChanges = async () => {
          try {
            const payload = {
                id: null,
                name: category.value.name
            };
  
            const response = await axiosInstance.post(`/categories`, payload);
  
            if (response.status === 201) {
              toast.success('Category saved successfully', {
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
          category,
          nameRules,
          saveChanges,
          onClosed,
          dialog
        };
      }
    };
  </script>
    
  <style scoped>
  </style>
    
<template>
    <v-dialog v-model="dialog" max-width="500px" @closed="onClosed">
      <v-card v-if="product">
        <v-card-title>
          Details of <span class="headline">{{ product.name }}</span>
        </v-card-title>
        <v-card-text>
          <v-img :src="product.image" class="mb-3" height="200px"></v-img>
          <v-list dense>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>ID: {{ product.id }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>Name:</v-list-item-title>
                    <v-list-item-subtitle v-html="product.name"></v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>Description:</v-list-item-title>
                    <v-list-item-subtitle v-html="product.description"></v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Category:</v-list-item-title>
                <v-list-item-subtitle v-html="product.categoryName"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>Price:</v-list-item-title>
                    <v-list-item-subtitle v-html="product.price"></v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>Sale type:</v-list-item-title>
                    <v-list-item-subtitle v-html="product.saleType"></v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#3F51B5" text @click="onClosed">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { ref, watch, onMounted } from 'vue';
  import axios from 'axios';
  import axiosInstance from '@/interceptors/axiosInterceptor.js'
  
  export default {
    name: 'ProductDetails',
    props: {
      productId: {
        type: Number,
        required: true
      }
    },
    setup(props, { emit }) {
      const dialog = ref(false);
      const product = ref(null);

      // Emit event when the dialog is closed
      const onClosed = () => {
        dialog.value = false;
        emit('closed');
      };

      const fetchProductDetails = async (id) => {
        try {
          const response = await axiosInstance.get(`/products/${Number(id)}`);
          product.value = response.data;
          dialog.value = true;
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      };
  
      watch(() => props.productId, (newId) => {
        if (newId) {
          fetchProductDetails(newId);
        }
      });
  
      return {
        dialog,
        product,
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
  
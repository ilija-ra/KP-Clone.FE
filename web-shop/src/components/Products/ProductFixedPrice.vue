<template>
    <v-dialog v-model="dialog" max-width="500px" @closed="onClosed">
      <v-card>
        <v-card-title>Buy Product</v-card-title>
        <v-card-text>
          <p>Are you sure you want to buy this product?</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="#3F51B5" text @click="onClosed">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="buyProductFixedPrice">Buy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { ref, computed, watch } from 'vue';
  import { useStore } from 'vuex';
  import axiosInstance from '@/interceptors/axiosInterceptor.js';

  export default {
      name: 'FixedPriceBuyModal',
      props: {
        productId: {
          type: Number,
          required: true
        }
      },
      setup(props, { emit }) {
        const store = useStore();
        const userId = computed(() => store.state.userId);
        const dialog = ref(false);
        let productId = ref(null);

      const buyProductFixedPrice = async () => {
        try {
          const payload = {
            buyerId: userId.value,
            productId: productId
          };

          const response = await axiosInstance.post('/products/buy-product-fixed-price', payload);
          emit('fixedPriceBuy');
          dialog.value = false;
        } catch (error) {
          // console.error('Error fetching products:', error);
        }
      };
    
      watch(() => props.productId, (newId) => {
        if (newId) {
          productId = newId;
          dialog.value = true;
        }
      });

      const onClosed = () => {
        dialog.value = false;
        emit('closed');
      };

      return {
        dialog,
        onClosed,
        buyProductFixedPrice
      };
    }
  };
  </script>
  
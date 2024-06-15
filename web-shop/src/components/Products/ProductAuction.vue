<template>
    <v-dialog v-model="dialog" max-width="500px" @closed="onClosed">
      <v-card>
        <v-card-title>Enter price for this product</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="price" type="number" label="Price" :rules="reasonRules"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="buyProductAuction">Buy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { ref, computed, watch } from 'vue';
  import { useStore } from 'vuex';
  import axiosInstance from '@/interceptors/axiosInterceptor.js';

  export default {
    name: 'AuctionBuyModal',
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
      const price = ref(null);
      let productId = ref(null);
      
      const reasonRules = [
        (v) => !!v || 'Reason is required',
        (v) => v.length <= 750 || 'Reason must be less than 750 characters'
      ];

      const buyProductAuction = async () => {
        try{
            const payload = {
                potentialBuyerId: userId.value,
                productId: productId,
                price: price.value
            };

            const response = await axiosInstance.post('/products/buy-product-auction', payload);
            emit('auctionBuy');
            dialog.value = false;
        } catch (error){
            console.error('Error occured while buying a product:', error);
        }
      };
  
      watch(() => props.productId, (newId) => {
        if (newId) {
          productId = newId;
          dialog.value = true;
        }
      });
  
      const onClosed = () => {
        emit('closed');
      };

      return {
        dialog,
        price,
        buyProductAuction,
        onClosed
      };
    }
  };
  </script>
  
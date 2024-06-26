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
          <v-btn color="#3F51B5" text @click="onClosed">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="buyProductAuction">Buy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { ref, computed, watch } from 'vue';
  import { useStore } from 'vuex';
  import axiosInstance from '@/interceptors/axiosInterceptor.js';
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
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
          Object.values(error?.response?.data?.errors)?.forEach(errorMessage => {
              toast.error(errorMessage, {
                autoClose: 10000
              })
            });
        }
      };
  
      watch(() => props.productId, (newId) => {
        if (newId) {
          productId = newId;
          dialog.value = true;
        }
      });
  
      const onClosed = () => {
        dialog.value = false
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
  
<template>
    <v-dialog v-model="dialog" max-width="500px" @closed="onClosed">
      <v-card>
        <v-card-title>Edit product</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="product.name" label="Name" outlined :rules="nameRules"></v-text-field>
            <v-textarea v-model="product.description" label="Description" outlined rows="3" max-rows="6" :rules="descriptionRules"></v-textarea>
            <v-text-field v-model="product.price" label="Price" outlined :rules="priceRules"></v-text-field>
            <v-select v-model="selectedSaleType" clearable label="Select sale type" :items="['FIXED_PRICE', 'AUCTION']" :rules="saleTypeRule"></v-select>
            <v-select v-model="selectedCategoryName" clearable label="Select category" :items=categoryNames :rules="categoryRules"></v-select>
            <v-text-field v-model="product.image" label="Image" outlined :rules="imageRules"></v-text-field>
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
    import { ref, onMounted, computed, watch  } from 'vue';
    import axios from 'axios';
    import axiosInstance from '@/interceptors/axiosInterceptor.js';
    import { useStore } from "vuex";
  
    export default {
      name: 'ProductEdit',
      props: {
      productId: {
        type: Number,
        required: true
       }
      },
      setup(props, { emit }) {
        const dialog = ref(false);
        const categories = ref([]);
        const categoryNames = ref([]);
        const users = ref([]);
        const initialProfile = ref(null);
        const store = useStore();
        const userId = computed(() => store.state.userId);
        const role = computed(() => store.state.role);
        let selectedSaleType = ref(null);
        let selectedCategoryName = ref(null);
        const product = ref({
          id: null,
          name: null,
          description: null,
          price: null,
          categoryId: null,
          saleType: null,
          image: null
        });
        
        const nameRules = [
          (v) => !!v || 'User is required',
          (v) => (v.length >= 2 && v.length <= 50) || 'Name length range is between 2 to 50.'
        ];
        const descriptionRules = [
          (v) => !!v || 'Description is required',
          (v) => v.length <= 500 || 'Comment must be less than 500 characters'
        ];
        const priceRules = [
          (v) => !!v || 'Price is required',
          (v) => v > 0 || 'Price must be greater than 0'
        ];
        const saleTypeRule = [
          (v) => !!v || 'Sale Type is required'
        ];
        const categoryRules = [
          (v) => !!v || 'Category is required'
        ];
        const imageRules = [
          (v) => !!v || 'Image is required'
        ];
    
        onMounted(() => {
          fetchUsers();
          fetchCategories();
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
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        };

        const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/categories');
            categories.value = response.data.items;
            categoryNames.value = categories.value.map(x => x.name);
            } catch (error) {
                // console.error('Error fetching products:', error);
            }
        };
  
        const saveChanges = async () => {
          try {
            const payload = {
                id: product.value.id,
                name: product.value.name,
                description: product.value.description,
                image: product.value.image,
                price: product.value.price,
                saleType: selectedSaleType.value,
                sellerId: userId.value,
                categoryId: selectedCategoryName.value == null ? null : categories.value.filter(x => x.name == selectedCategoryName.value)[0].id
            };
  
            const response = await axiosInstance.put(`/products`, payload);
  
            if (response.status === 204) {
              console.log('Product saved successfully');
              dialog.value = false;
              emit('saved');
              
            } else {
              console.error('Error saving product:', response.statusText);
            }
          } catch (error) {
            console.error('Error saving changes:', error);
          }
        };

        const fetchProductDetails = async (id) => {
        try {
          const response = await axiosInstance.get(`/products/${Number(id)}`);
          Object.assign(product.value, response.data);

          selectedSaleType.value = response.data.saleType;
          selectedCategoryName.value = response.data.categoryName;

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

        const onClosed = () => {
          dialog.value = false
          emit('closed');
        };
    
        return {
          product,
          nameRules,
          descriptionRules,
          priceRules,
          saleTypeRule,
          categoryRules,
          imageRules,
          saveChanges,
          onClosed,
          dialog,
          categories,
          categoryNames,
          selectedSaleType,
          selectedCategoryName
        };
      }
    };
  </script>
    
  <style scoped>
  </style>
    
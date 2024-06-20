<template>
    <v-dialog v-model="dialog" max-width="500px" @closed="onClosed">
      <v-card>
        <v-card-title>Edit product</v-card-title>
        <v-card-text>
          <v-img :src="product.image" class="mb-3" height="200px"></v-img>
          <v-form ref="form" v-model="formValid" @submit.prevent="submit">
            <v-text-field v-model="product.name" label="Name" outlined :rules="nameRules"></v-text-field>
            <v-textarea v-model="product.description" label="Description" outlined rows="3" max-rows="6" :rules="descriptionRules"></v-textarea>
            <v-text-field v-model="product.price" label="Price" outlined :rules="priceRules"></v-text-field>
            <v-select v-model="selectedSaleType" clearable label="Select sale type" :items="['FIXED_PRICE', 'AUCTION']" :rules="saleTypeRule"></v-select>
            <v-select v-model="selectedCategoryName" clearable label="Select category" :items=categoryNames :rules="categoryRules"></v-select>
            <!-- <v-text-field v-model="product.image" label="Image" outlined :rules="imageRules"></v-text-field> -->
            <v-file-input v-model="selectedNewImage" label="Upload image" prepend-icon="mdi-camera" variant="filled" :rules="imageRules"></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#3F51B5" text @click="onClosed">Cancel</v-btn>
          <v-btn color="#3F51B5" text @click="submit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
    
  <script>
    import { ref, onMounted, computed, watch  } from 'vue';
    import axios from 'axios';
    import axiosInstance from '@/interceptors/axiosInterceptor.js';
    import { useStore } from "vuex";
  import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
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
        const formValid = ref(false);
        const categories = ref([]);
        const categoryNames = ref([]);
        const users = ref([]);
        const initialProfile = ref(null);
        const store = useStore();
        const userId = computed(() => store.state.userId);
        const role = computed(() => store.state.role);
        let selectedSaleType = ref(null);
        let selectedCategoryName = ref(null);
        let selectedNewImage = ref(new File([], "", { type: "image/jpeg" }));
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
            Object.values(error?.response?.data?.errors)?.forEach(errorMessage => {
              toast.error(errorMessage, {
                autoClose: 10000
              })
            });
          }
        };

        const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/categories');
            categories.value = response.data.items;
            categoryNames.value = categories.value.map(x => x.name);
            } catch (error) {
              Object.values(error?.response?.data?.errors)?.forEach(errorMessage => {
              toast.error(errorMessage, {
                autoClose: 10000
              })
            });
            }
        };
  
        const submit = async () => {
          try {
            if (formValid.value) { 
              const formData = new FormData();
              formData.append('id', product.value.id);
              formData.append('name', product.value.name);
              formData.append('description', product.value.description);
              formData.append('price', product.value.price);
              formData.append('saleType', selectedSaleType.value);
              formData.append('categoryId', selectedCategoryName.value == null ? null : categories.value.find((x) => x.name === selectedCategoryName.value) ?.id);
              formData.append('image', selectedNewImage.value);
              formData.append('sellerId', userId.value);
    
              const response = await axiosInstance.put(`/products`, formData, {
              headers: { 'content-type': 'multipart/form-data' },
              });
    
              if (response.status === 204) {
                toast.success('Product saved successfully', {
                  autoClose: 10000
                })
                dialog.value = false;
                emit('saved');
              } else {
                toast.error(response.statusText, {
                  autoClose: 10000
                })
              }
            } else {
              toast.error('Form is not valid', {
                autoClose: 10000
            });
            
            }
          } catch (error) {
            Object.values(error?.response?.data?.errors)?.forEach(errorMessage => {
              toast.error(errorMessage, {
                autoClose: 10000
              })
            });
          }
        };

        const fetchProductDetails = async (id) => {
        try {
          const response = await axiosInstance.get(`/products/${Number(id)}`);
          Object.assign(product.value, response.data);

          selectedSaleType.value = response.data.saleType;
          selectedCategoryName.value = response.data.categoryName;
          product.value.image = `data:image/jpeg;base64,${product.value.image}`;
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
          formValid,
          product,
          nameRules,
          descriptionRules,
          priceRules,
          saleTypeRule,
          categoryRules,
          imageRules,
          submit,
          onClosed,
          dialog,
          categories,
          categoryNames,
          selectedSaleType,
          selectedCategoryName,
          selectedNewImage
        };
      }
    };
  </script>
    
  <style scoped>
  </style>
    
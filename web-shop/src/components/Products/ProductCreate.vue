<template>
  <v-dialog v-model="dialog" max-width="500px" @closed="onClosed">
    <v-card>
      <v-card-title>Create product</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="formValid" @submit.prevent="submit">
          <v-text-field v-model="product.name" label="Name" outlined :rules="nameRules"></v-text-field>
          <v-textarea v-model="product.description" label="Description" outlined rows="3" max-rows="6" :rules="descriptionRules"></v-textarea>
          <v-text-field v-model="product.price" label="Price" outlined :rules="priceRules"></v-text-field>
          <v-select v-model="selectedSaleType" clearable label="Select sale type" :items="['FIXED_PRICE', 'AUCTION']" :rules="saleTypeRules" ></v-select>
          <v-select v-model="selectedCategoryName" clearable label="Select category" :items="categoryNames" :rules="categoryRules"></v-select>
          <v-file-input v-model="product.image" label="Upload image" prepend-icon="mdi-camera" variant="filled" :rules="imageRules"></v-file-input>
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

<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import axiosInstance from '@/interceptors/axiosInterceptor.js';
import { useStore } from 'vuex';
import { useValidationRules } from '@/validationRules/productCreateValidationRules.js';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: 'ProductCreate',
  setup(props, { emit }) {
    const dialog = ref(false);
    const formValid = ref(false);
    const categories = ref([]);
    const categoryNames = ref([]);
    const users = ref([]);
    const store = useStore();
    const userId = computed(() => store.state.userId);
    const role = computed(() => store.state.role);
    const selectedSaleType = ref(null);
    const selectedCategoryName = ref(null);

    const product = ref({
      id: null,
      name: null,
      description: null,
      price: null,
      categoryId: null,
      saleType: null,
      image: null,
    });

    const {
      nameRules,
      descriptionRules,
      priceRules,
      saleTypeRules,
      categoryRules,
      imageRules,
    } = useValidationRules();

    onMounted(() => {
      fetchUsers();
      fetchCategories();
      dialog.value = true;
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
        users.value = response.data.items.filter(
          (x) => x.id !== userId.value
        );
      } catch (error) {
        Object.values(error?.response?.data?.errors)?.forEach((errorMessage) => {
          toast.error(errorMessage, {
            autoClose: 10000,
          });
        });
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/categories');
        categories.value = response.data.items;
        categoryNames.value = categories.value.map((x) => x.name);
      } catch (error) {
        Object.values(error?.response?.data?.errors)?.forEach((errorMessage) => {
          toast.error(errorMessage, {
            autoClose: 10000,
          });
        });
      }
    };

    const submit = async () => {
      try {
        if (formValid.value) {
          const formData = new FormData();
          formData.append('name', product.value.name);
          formData.append('description', product.value.description);
          formData.append('price', product.value.price);
          formData.append('saleType', selectedSaleType.value);
          formData.append('categoryId', selectedCategoryName.value == null ? null : categories.value.find((x) => x.name === selectedCategoryName.value) ?.id);
          formData.append('image', product.value.image);
          formData.append('sellerId', userId.value);
          
          const response = await axiosInstance.post(`/products`, formData, {
            headers: { 'content-type': 'multipart/form-data' },
          });

          if (response.status === 201) {
            toast.success('Product saved successfully', {
              autoClose: 10000,
            });
            emit('saved');
            dialog.value = false;
          } else {
            toast.error(response.statusText, {
              autoClose: 10000,
            });
          }
        } else {
          toast.error('Form is not valid', {
            autoClose: 10000
        });

      } }catch (error) {
        Object.values(error?.response?.data?.errors)?.forEach((errorMessage) => {
          toast.error(errorMessage, {
            autoClose: 10000,
          });
        });
      }
    };

    const onClosed = () => {
      dialog.value = false;
      emit('closed');
    };

    return {
      formValid,
      product,
      nameRules,
      descriptionRules,
      priceRules,
      saleTypeRules,
      categoryRules,
      imageRules,
      submit,
      onClosed,
      dialog,
      categories,
      categoryNames,
      selectedSaleType,
      selectedCategoryName
    };
  },
};
</script>

<style scoped>
.adjust-with-layout {
  margin-top: 64px;
  margin-bottom: 50px;
  width: 100% !important;
}
</style>

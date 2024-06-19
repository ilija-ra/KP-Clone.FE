<template>
    <div class="container">
        <v-row align="center">
            <v-col>
                <h1>MY PRODUCTS</h1>
            </v-col>
            <v-col class="d-flex justify-end" v-if="role === 'SELLER'">
                <v-btn prepend-icon="mdi-plus" color="#3F51B5" @click="createProduct()" style="margin-right: 5px;">New product</v-btn>
                <v-btn prepend-icon="mdi-plus" color="#3F51B5" @click="createCategory()">New category</v-btn>
            </v-col>
        </v-row>
        <v-data-table
            :headers="headers"
            :items="products"
            item-key="id"
            class="bottom-right">
            <template v-slot:item.action="{ item }" v-if="role === 'SELLER'">
              <v-icon v-if="item.saleType === 'AUCTION'" @click="closeAuction(item.id)">mdi-close-circle-outline</v-icon>
              <v-icon @click="editProduct(item.id)">mdi-pencil-outline</v-icon>
          </template>
        </v-data-table>
        <ProductCreate v-if="createProductModalOpen" @closed="onProductCreateClosed" @saved="onProductCreateSaved"/>
        <ProductEdit v-if="editProductModalOpen" :productId="selectedProductId" @closed="onProductEditClosed" @saved="onProductEditSaved"/>
        <CategoryCreate v-if="createCategoryModalOpen" @closed="onCategoryCreateClosed" @saved="onCategoryCreateSaved"/>
        <ProductCloseAuction v-if="closeAuctonModalOpen" :productId="selectedProductId" @closed="onCloseAuctionClosed" @closeAuction="onCloseAuctionDone"/>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import axiosInstance from '@/interceptors/axiosInterceptor.js'
  import { useStore } from "vuex";
  import ProductCreate from '@/components/Products/ProductCreate.vue';
  import CategoryCreate from '@/components/Categories/CategoryCreate.vue';
  import ProductCloseAuction from '@/components/Products/ProductCloseAuction.vue';
  import ProductEdit from '@/components/Products/ProductEdit.vue';
  import { toast } from 'vue3-toastify'
  import 'vue3-toastify/dist/index.css'

  export default {
    name: "MyProducts",
    components: {
        ProductCreate,
        CategoryCreate,
        ProductCloseAuction,
        ProductEdit
    },
    setup() {
      let createProductModalOpen = ref(false);
      let createCategoryModalOpen = ref(false);
      let closeAuctonModalOpen = ref(false);
      let editProductModalOpen = ref(false);
      let selectedProductId = ref(null);
      const store = useStore();
      const userId = computed(() => store.state.userId);
      const role = computed(() => store.state.role);
      const products = ref([]);
      const headers = [
        { text: 'ID', align: 'start', value: 'id' },
        { text: 'Name', align: 'start', value: 'name' },
        { text: 'Price', align: 'start', value: 'price' },
        { text: 'Sale Type', align: 'start', value: 'saleType' },
        { text: 'Publish Date', align: 'start', value: 'publishDate' },
        { text: 'Action', align: 'start', value: 'action' }
      ];
  
      onMounted(() => {
        fetchMyProducts();
      });
  
      const fetchMyProducts = async () => {
        try {
            let helper = '';
            if (role.value === 'BUYER') {
            helper = 'buyer';
            } else if (role.value === 'SELLER') {
            helper = 'seller';
        }

          const response = await axiosInstance.get(`/products/get-by-${helper}-id/${userId.value}`);
          products.value = response.data.items;
        } catch (error) {
          Object.values(error?.response?.data?.errors)?.forEach(errorMessage => {
            toast.error(errorMessage, {
              autoClose: 10000
            })
          });
        }
      };
  
      const createProduct = () => {
        createProductModalOpen.value = true;
      };

      const onProductCreateSaved = () => {
        createProductModalOpen.value = false;
        fetchMyProducts();
      };

      const onProductCreateClosed = () => {
        createProductModalOpen.value = false;
      };

      const editProduct = (id) => {
        selectedProductId.value = selectedProductId.value == id ? null : id;
        editProductModalOpen.value = true;
      };

      const onProductEditSaved = () => {
        editProductModalOpen.value = false;
        fetchMyProducts();
      };

      const onProductEditClosed = () => {
        editProductModalOpen.value = false;
      };

      const createCategory = () => {
        createCategoryModalOpen.value = true;
      };

      const onCategoryCreateSaved = () => {
        createCategoryModalOpen.value = false;
        fetchMyProducts();
      };

      const onCategoryCreateClosed = () => {
        createCategoryModalOpen.value = false;
      };

      const closeAuction = (id) => {
        selectedProductId.value = selectedProductId.value == id ? null : id;
        closeAuctonModalOpen.value = true;
      };

      const onCloseAuctionDone = () => {
        selectedProductId.value = null;
        closeAuctonModalOpen.value = false;
        fetchMyProducts();
      };

      const onCloseAuctionClosed = () => {
        selectedProductId.value = null;
        closeAuctonModalOpen.value = false;
      };

      return {
        headers,
        role,
        products,
        fetchMyProducts,
        createProductModalOpen,
        createCategoryModalOpen,
        createProduct,
        onProductCreateSaved,
        onProductCreateClosed,
        editProduct,
        onProductEditSaved,
        onProductEditClosed,
        editProductModalOpen,
        createCategory,
        onCategoryCreateSaved,
        onCategoryCreateClosed,
        closeAuction,
        onCloseAuctionDone,
        onCloseAuctionClosed,
        closeAuctonModalOpen,
        selectedProductId
      };
    }
  };
  </script>
  
  <style>
  /* .container {
    position: relative;
  }
  
  .bottom-right {
    position: absolute;
    bottom: 0;
    right: 0;
  } */
  </style>
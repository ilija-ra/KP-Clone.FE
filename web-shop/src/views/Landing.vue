<template>
  <div class="container">
    <v-row>
      <v-col cols="12">
        <h1>PRODUCTS</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-text-field v-model="search" @keyup.enter="searchProducts" label="Search by name and description..." prepend-icon="$vuetify"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="minPrice" @keyup.enter="searchProducts" label="From price"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="maxPrice" @keyup.enter="searchProducts" label="To price"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-select v-model="selectedSaleType" @update:model-value="searchProducts" clearable label="Filter by sale type" :items="['FIXED_PRICE', 'AUCTION']"></v-select>
      </v-col>
      <v-col cols="2">
        <v-select v-model="selectedCategoryName" @update:model-value="searchProducts" clearable label="Filter by category" :items=categoryNames></v-select>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="products"
      item-key="id"
      class="bottom-right">
      <template v-slot:item.action="{ item }">
        <v-icon @click="showDetails(item.id)">mdi-information-outline</v-icon>
        <v-icon v-if="auth && role === 'BUYER'" @click="buy(item.id, item.saleType)">mdi-cart-outline</v-icon>
      </template>
    </v-data-table>
    <ProductDetails v-if="detailsModalOpen" :productId="selectedProductId" @closed="onProductDetailsClosed" />
    <ProductAuction v-if="auctionBuyModalOpen" :productId="selectedProductId" @closed="onAuctionBuyProductClosed" @auctionBuy="searchProducts"/>
    <ProductFixedPrice v-if="fixedPriceBuyModalOpen" :productId="selectedProductId" @closed="onFixedPriceBuyProductClosed" @fixedPriceBuy="searchProducts" />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
import axiosInstance from '@/interceptors/axiosInterceptor.js'
import ProductDetails from '@/components/Products/ProductDetails.vue';
import ProductFixedPrice from '@/components/Products/ProductFixedPrice.vue';
import ProductAuction from '@/components/Products/ProductAuction.vue';
// import { useStore } from "vuex";

export default {
  name: "Landing",
  components: {
    ProductDetails,
    ProductFixedPrice,
    ProductAuction
  },
  setup() {
    // const message = ref('You are not logged in!');
    // const store = useStore();
    const products = ref([]);
    const categories = ref([]);
    const categoryNames = ref([]);
    const selectedProductId = ref(null);
    const search = ref(null);
    const minPrice = ref(null);
    const maxPrice = ref(null);
    const selectedSaleType = ref(null);
    const selectedCategoryName = ref(null);
    const store = useStore();
    const auth = computed(() => store.state.authenticated);
    const role = computed(() => store.state.role);
    let detailsModalOpen = ref(false);
    let fixedPriceBuyModalOpen = ref(false);
    let auctionBuyModalOpen = ref(false);
    

    onMounted(() => {
      searchProducts();
      fetchCategories();
    });

    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products');
        products.value = response.data.items;
      } catch (error) {
        // console.error('Error fetching products:', error);
      }
    };

    const searchProducts = async () => {
      try {
        const payload = {
          searchCriteria: search.value,
          fromPrice: minPrice.value,
          toPrice: maxPrice.value,
          saleType: selectedSaleType.value,
          categoryId: selectedCategoryName.value == null ? null : categories.value.filter(x => x.name == selectedCategoryName.value)[0].id
        };

        const response = await axios.post('http://localhost:8080/api/products/search', payload);
        products.value = response.data.items;
      } catch (error) {
        // console.error('Error fetching products:', error);
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

    const headers = [
      { text: 'ID', align: 'start', value: 'id' },
      { text: 'Name', align: 'start', value: 'name' },
      { text: 'Image', align: 'start', value: 'image' },
      { text: 'Price', align: 'start', value: 'price' },
      { text: 'Sale Type', align: 'start', value: 'saleType' },
      { text: 'Publish Date', align: 'start', value: 'publishDate' },
      { text: 'Seller Name', align: 'start', value: 'sellerName' },
      { text: 'Seller Rate', align: 'start', value: 'sellerRate' },
      { text: 'Action', align: 'start', value: 'action' }
    ];

    const showDetails = (id) => {
        if (selectedProductId.value === id) {
          selectedProductId.value = null;
        } else {
          selectedProductId.value = id;
          detailsModalOpen.value = true;
          fixedPriceBuyModalOpen.value = false;
          auctionBuyModalOpen.value = false;
        }
      };

    const buy = (id, saleType) => {
      if (saleType === 'FIXED_PRICE') {
        fixedPriceBuy(id);
      } else {
        auctionBuy(id);
      }
    };

    const fixedPriceBuy = (id) => {
      if (selectedProductId.value === id) {
        selectedProductId.value = null;
      } else {
        selectedProductId.value = id;
        fixedPriceBuyModalOpen.value = true;
        auctionBuyModalOpen.value = false;
        detailsModalOpen.value = false;
      }
    };

    const auctionBuy = (id) => {
      if (selectedProductId.value === id) {
        selectedProductId.value = null;
      } else {
        selectedProductId.value = id;
        auctionBuyModalOpen.value = true;
        fixedPriceBuyModalOpen.value = false;
        detailsModalOpen.value = false;
      }
    };

    const onProductDetailsClosed = () => {
      selectedProductId.value = null;
      detailsModalOpen.value = false;
    };

    const onFixedPriceBuyProductClosed = () => {
      selectedProductId.value = null;
      fixedPriceBuyModalOpen.value = false;
    };

    const onAuctionBuyProductClosed = () => {
      selectedProductId.value = null;
      auctionBuyModalOpen.value = false;
    };

    return {
      auth,
      role,
      headers,
      products,
      selectedProductId,
      showDetails,
      detailsModalOpen,
      auctionBuyModalOpen,
      fixedPriceBuyModalOpen,
      buy,
      searchProducts,
      onProductDetailsClosed,
      search,
      minPrice,
      maxPrice,
      selectedSaleType,
      selectedCategoryName,
      categories,
      categoryNames,
      onFixedPriceBuyProductClosed,
      onAuctionBuyProductClosed
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
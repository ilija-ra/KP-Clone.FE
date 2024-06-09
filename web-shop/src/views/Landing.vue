<template>
  <div class="container">
    <v-data-table
      :headers="headers"
      :items="plants"
      density="compact"
      item-key="id"
      class="bottom-right">
      <template v-slot:item.action="{ item }">
        <v-icon @click="showDetails(item.id)">mdi-information-outline</v-icon>
      </template>
    </v-data-table>
    <ProductDetails :productId="selectedProductId" @closed="onProductDetailsClosed" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import axiosInstance from '@/interceptors/axiosInterceptor.js'
import ProductDetails from '@/components/Products/ProductDetails.vue';
// import { useStore } from "vuex";

export default {
  name: "Landing",
  components: {
    ProductDetails
  },
  setup() {
    // const message = ref('You are not logged in!');
    // const store = useStore();
    const plants = ref([]);
    const selectedProductId = ref(null);;
    const search = ref('');
    const minPrice = ref(null);
    const maxPrice = ref(null);
    const selectedSaleType = ref(null);
    const selectedCategory = ref(null);

    onMounted(() => {
      fetchPlants();
      // fetchUser();
    });

    // const fetchUser = async () => {
    //   try {
    //     const response = await axiosInstance.get('users/get-current-user', { withCredentials: true });
    //     message.value = `Hi! ${response.data.firstName}`;
    //     await store.dispatch('setAuth', true);
    //   } catch (error) {
    //     await store.dispatch('setAuth', false);
    //   }
    // }

    const fetchPlants = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products');
        plants.value = response.data.items;
      } catch (error) {
        // console.error('Error fetching plants:', error);
      }
    };

    const headers = [
      { text: 'ID', align: 'start', value: 'id' },
      { text: 'Name', align: 'start', value: 'name' },
      { text: 'Image', align: 'start', value: 'image' },
      { text: 'Price', align: 'start', value: 'price' },
      { text: 'Sale Type', align: 'start', value: 'saleType' },
      { text: 'Publish Date', align: 'start', value: 'publishDate' },
      { text: 'Action', align: 'start', value: 'action' }
    ];

    const showDetails = (id) => {
      if (selectedProductId.value === id) {
        selectedProductId.value = null;
      } else {
        selectedProductId.value = id;
      }
    };

    const onProductDetailsClosed = () => {
      // Define behavior when ProductDetails component is closed
      // For example, reset any state related to ProductDetails
      selectedProductId.value = null;
    };

    return {
      // message,
      headers,
      plants,
      selectedProductId,
      showDetails,
      onProductDetailsClosed
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
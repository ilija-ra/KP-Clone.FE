<template>
    <v-dialog v-model="dialog" max-width="700px" @closed="onClosed">
      <v-card v-if="user">
        <v-card-title>
          User details of <span class="headline">{{ user.username }}</span>
        </v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Id:</v-list-item-title>
                <v-list-item-subtitle v-html="user.id"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>First Name:</v-list-item-title>
                <v-list-item-subtitle v-html="user.firstName"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Last Name:</v-list-item-title>
                <v-list-item-subtitle v-html="user.lastName"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Email Address:</v-list-item-title>
                <v-list-item-subtitle v-html="user.emailAddress"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Phone Number:</v-list-item-title>
                <v-list-item-subtitle v-html="user.phoneNumber"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Date of Birth:</v-list-item-title>
                <v-list-item-subtitle v-html="user.dateOfBirth"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Profile Picture:</v-list-item-title>
                <v-list-item-subtitle v-html="user.profilePicture"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Description:</v-list-item-title>
                <v-list-item-subtitle v-html="user.description"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Role:</v-list-item-title>
                <v-list-item-subtitle v-html="user.role"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Rating:</v-list-item-title>
                <v-list-item-subtitle v-html="user.averageRating"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-title>
          Products
        </v-card-title>
        <v-data-table
            :headers="prouductHeaders"
            :items="products"
            item-key="id"
            class="bottom-right">
       </v-data-table>
       <v-card-title>
          Reviews
        </v-card-title>
        <v-data-table
            :headers="reviewHeaders"
            :items="reviews"
            item-key="id"
            class="bottom-right">
       </v-data-table>
       <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#3F51B5" text @click="onClosed">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  import axiosInstance from '@/interceptors/axiosInterceptor.js';

  export default {
    name: 'UserDetails',
    components: {
        // UserDetailsProducts
    },
    props: {
      userId: {
        type: Number,
        required: true
      },
      userRole: {
        type: String,
        required: true
      }
    },
    setup(props, { emit }) {
      const dialog = ref(false);
      const user = ref(null);
      const products = ref([]);
      const reviews = ref([]);

      // Emit event when the dialog is closed
      const onClosed = () => {
        dialog.value = false;
        emit('closed');
      };
  
    const prouductHeaders = [
        { text: 'ID', align: 'start', value: 'id' },
        { text: 'Name', align: 'start', value: 'name' },
        { text: 'Image', align: 'start', value: 'image' },
        { text: 'Price', align: 'start', value: 'price' },
        { text: 'Sale Type', align: 'start', value: 'saleType' },
        { text: 'Publish Date', align: 'start', value: 'publishDate' },
        // { text: 'Action', align: 'start', value: 'action' }
    ];

    const reviewHeaders = [
        { text: 'ID', align: 'start', value: 'id' },
        { text: 'Rate', align: 'start', value: 'rate' },
        { text: 'Comment', align: 'start', value: 'comment' },
        { text: 'Reviewer', align: 'start', value: 'reviewerName' },
        { text: 'Review Date', align: 'start', value: 'reviewDate' },
        // { text: 'Action', align: 'start', value: 'action' }
    ];

    const fetchUserDetails = async (id) => {
        try {
        const response = await axiosInstance.get(`/users/${Number(id)}`);
        user.value = response.data;
        //   dialog.value = true;
        } catch (error) {
        console.error('Error fetching user details:', error);
        }
    };

    const fetchUserProducts = async (id) => {
        try {
            let response;
            if (props.userRole === 'SELLER') {
                response = await axiosInstance.get(`/products/get-by-seller-id/${Number(id)}`);
            } else if (props.userRole === 'BUYER') {
                response = await axiosInstance.get(`/products/get-by-buyer-id/${Number(id)}`);
            }
            products.value = response.data.items;
        } catch (error) {
                console.error('Error fetching products:', error);
        }
    };

    const fetchUserReviews = async (id) => {
        try {
            const response = await axiosInstance.get(`/reviews/get-by-reviewed-id/${Number(id)}`);
            reviews.value = response.data.items;
        } catch (error) {
            // console.error('Error fetching products:', error);
        }
    };

    watch(() => props.userId, (newId) => {
        if (newId) {
            fetchUserDetails(newId);
            fetchUserProducts(newId);
            fetchUserReviews(newId);
            dialog.value = true;
        }
    });
  
      return {
        dialog,
        user,
        products,
        reviews,
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
  
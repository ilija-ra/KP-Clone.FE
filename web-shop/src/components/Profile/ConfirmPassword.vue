<template>
    <v-dialog v-model="dialogVisible" max-width="500px">
      <v-card>
        <v-card-title>Confirm Current Password</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field 
              v-model="currentPassword" 
              label="Current Password" 
              outlined 
              type="password" 
              :rules="passwordRules">
            </v-text-field>
            <div style="color: #AF382F;">{{ passwordMatchMessage }}</div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#3F51B5" text @click="cancel">Cancel</v-btn>
          <v-btn color="#3F51B5" text @click="confirm">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
    import { ref, watch, computed } from 'vue';
    import axiosInstance from '@/interceptors/axiosInterceptor.js';
    import { useStore } from "vuex";
    import { useRouter } from 'vue-router';
    import { toast } from 'vue3-toastify'
    import 'vue3-toastify/dist/index.css'

    export default {
        name: 'ConfirmPassword',
        props: {
        dialog: {
            type: Boolean,
            required: true
        }
        },
        emits: ['update:dialog', 'confirmed', 'cancelled'],
        setup(props, { emit }) {
            const currentPassword = ref('');
            const dialogVisible = ref(props.dialog);
            const store = useStore();
            const router = useRouter();
            const userId = computed(() => store.state.userId);
            const passwordMatchMessage = ref('');
            
            watch(() => props.dialog, (newVal) => {
                dialogVisible.value = newVal;
            });
        
            const passwordRules = [
                (v) => !!v || 'Password is required',
                (v) => v.length >= 6 || 'Password must be at least 6 characters long'
            ];

            const confirm = async () => {
                const payload = { userId: userId.value , password: currentPassword.value }
                const response = await axiosInstance.post('users/check-password', payload);

                if (!response.data) {
                    toast.error('You mismatched a current password! Try again.', {
                      autoClose: 10000
                    });
                    return;
                }

                await store.dispatch('setAuth', false);
                await store.dispatch('setRole', null);
                await store.dispatch('setUserId', null);
                await store.dispatch('setFullName', null);
                await store.dispatch('setInitials', null);
                router.push('/login');

                emit('confirmed', currentPassword.value);
                emit('update:dialog', false);
            };
        
            const cancel = () => {
                emit('cancelled');
                emit('update:dialog', false);
            };
        
            return {
                currentPassword,
                passwordRules,
                dialogVisible,
                confirm,
                cancel,
                passwordMatchMessage
            };
        }
    };
  </script>
  
  <style scoped>
  </style>
  
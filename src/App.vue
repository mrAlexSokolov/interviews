<script setup>
import { RouterView } from "vue-router";
import { ref, onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MenuHeader from "@/components/MenuHeader.vue";
import Loader from "@/components/Loader.vue";

import { useAuthStore } from "./stores/authStore";

const authStore = useAuthStore();

const isLoading = ref(true);

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      authStore.userId = user.uid;
    } else {
      authStore.userId = "";
    }
    isLoading.value = false;
  });
});
</script>

<template>
  <Loader v-if="isLoading" />
  <div v-else class="container">
    <MenuHeader />
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
}
</style>

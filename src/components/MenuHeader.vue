<script setup>
import { RouterLink, useRouter } from "vue-router";
import { ref, computed } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { useAuthStore } from "@/stores/authStore.js";

const authStore = useAuthStore();
const router = useRouter();

const items = ref([
  {
    label: "SignIn",
    icon: "pi pi-user",
    path: "/auth",
    show: computed(() => !authStore.userId),
  },
  {
    label: "Add",
    icon: "pi pi-plus",
    path: "/",
    show: computed(() => !!authStore.userId),
  },
  {
    label: "Interviews list",
    icon: "pi pi-list",
    path: "/interviews",
    show: computed(() => !!authStore.userId),
  },
  {
    label: "Statistics",
    icon: "pi pi-chart-pie",
    path: "/statistics",
    show: computed(() => !!authStore.userId),
  },
]);
// S I G N  O U T
const onSignOut = async () => {
  try {
    await signOut(getAuth());
    authStore.userId = "";
    router.push("/auth");
  } catch (error) {
    console.log("error:", error.message);
  }
};
</script>
<template>
  <Prime-MenuBar :model="items" class="menu">
    <template #item="{ item, props }">
      <RouterLink
        :to="item.path"
        class="flex align-items-center"
        v-bind="props.action"
        v-if="item.show"
      >
        <span :class="item.icon" class="p-menuitem-icon" />
        <span class="ml-2">{{ item.label }}</span>
      </RouterLink>
    </template>
    <template #end>
      <span
        v-if="!!authStore.userId"
        class="flex align-items-center menu-exit"
        @click="onSignOut()"
      >
        <span class="pi pi-sign-out p-menuitem-icon" />
        <span class="ml-2">SignOut</span>
      </span>
    </template>
  </Prime-MenuBar>
</template>
<style scoped>
.menu {
  margin: 20px 0;
}
.menu-exit {
  cursor: pointer;
}
</style>

<script setup>
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "@/stores/authStore";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

import { getAuth } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";

import { useToast } from "primevue/usetoast";
const toast = useToast();

const db = getFirestore();
const authStore = useAuthStore();
const router = useRouter();
//
const company = ref("");
const vacancyLink = ref("");
const contactName = ref("");
const contactTelegram = ref("");
const contactWhatsApp = ref("");
const contactPhone = ref("");
const isLoading = ref(false);

//
const disabledButton = computed(() => {
  return !(company.value && vacancyLink.value && contactName.value);
});
//
const addNewInterview = async () => {
  const payload = {
    id: uuidv4(),
    company: company.value,
    vacancyLink: vacancyLink.value,
    contactName: contactName.value,
    contactTelegram: contactTelegram.value,
    contactWhatsApp: contactWhatsApp.value,
    contactPhone: contactPhone.value,
    createdAt: new Date(),
    result: "In progress",
  };
  const userId = getAuth().currentUser?.uid;
  if (userId) {
    try {
      isLoading.value = true;
      await setDoc(doc(db, `users/${userId}/interviews`, payload.id), payload);
      isLoading.value = false;
      router.push("/interviews");
    } catch (error) {
      console.log(error);
    }
  }
};
//
onMounted(() => {
  if (authStore.justRegistered) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "you are successfully registered",
      life: 6000,
    });
    authStore.justRegistered = false;
  }
});
//
</script>

<template>
  <Prime-Toast position="top-right" />
  <div class="content-interview">
    <Prime-Card>
      <template #title>New interview</template>
      <template #content>
        <Prime-FloatLabel class="mb-5">
          <Prime-InputText id="company" class="input" v-model="company" />
          <label for="company">Company</label>
        </Prime-FloatLabel>
        <Prime-FloatLabel class="mb-5">
          <Prime-InputText
            id="vacancyLink"
            class="input"
            v-model="vacancyLink"
          />
          <label for="vacancyLink">Vacancy description (link)</label>
        </Prime-FloatLabel>
        <Prime-FloatLabel class="mb-5">
          <Prime-InputText
            id="contactName"
            class="input"
            v-model="contactName"
          />
          <label for="contactName">Contact Name</label>
        </Prime-FloatLabel>
        <Prime-FloatLabel class="mb-5">
          <Prime-InputText
            id="contactTelegram"
            class="input"
            v-model="contactTelegram"
          />
          <label for="contactTelegram">Telegram username</label>
        </Prime-FloatLabel>
        <Prime-FloatLabel class="mb-5">
          <Prime-InputText
            id="contactWhatsApp"
            class="input"
            v-model="contactWhatsApp"
          />
          <label for="contactWhatsApp">WhatsApp telephone</label>
        </Prime-FloatLabel>
        <Prime-FloatLabel class="mb-5">
          <Prime-InputText
            id="contactPhone"
            class="input"
            v-model="contactPhone"
          />
          <label for="contactPhone">Contact Phone</label>
        </Prime-FloatLabel>
        <Prime-Button
          @click="addNewInterview"
          label="Add New Interview"
          :loading="isLoading"
          :disabled="disabledButton"
        />
      </template>
    </Prime-Card>
  </div>
</template>
<style scoped>
.content-interview {
  max-width: 600px;
  margin: auto;
}
.input {
  width: 100%;
}
</style>

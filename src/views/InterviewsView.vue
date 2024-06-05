<script setup>
import { RouterLink } from "vue-router";
import { ref, onMounted } from "vue";
import Loader from "@/components/Loader.vue";
import { useConfirm } from "primevue/useconfirm";
import { FilterMatchMode } from "primevue/api";
import moment from "moment";

import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  where,
} from "firebase/firestore";

import { getAuth } from "firebase/auth";

const db = getFirestore();
const confirm = useConfirm();

const interviews = ref([]);
const isLoading = ref(true);
const result = ref("Show all");

const filters = ref({
  global: {
    value: null,
    matchMode: FilterMatchMode.CONTAINS,
  },
});

const getAllInterviews = async (isFilter = null) => {
  isLoading.value = true;
  try {
    const userId = getAuth().currentUser?.uid;
    if (userId) {
      let getData;
      if (!isFilter || result.value === "Show all") {
        getData = query(
          collection(db, `users/${userId}/interviews`),
          orderBy("createdAt", "desc")
        );
      } else {
        getData = query(
          collection(db, `users/${userId}/interviews`),
          orderBy("createdAt", "desc"),
          where("result", "==", result.value)
        );
      }

      const res = await getDocs(getData);
      //console.log(res, userId);
      interviews.value = res.docs.map((el) => el.data());
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};
//
const onRemoveInterview = (id, company) => {
  console.log(id);
  confirm.require({
    message: `Do you want to delete interview for ${company} ?`,
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancel",
    acceptLabel: "Delete",
    rejectClass: "p-button-secondary p-button-outlined",
    acceptClass: "p-button-danger",
    accept: async () => {
      isLoading.value = true;
      const userId = getAuth().currentUser?.uid;
      if (userId) {
        try {
          await deleteDoc(doc(db, `users/${userId}/interviews`, id));
          interviews.value = interviews.value.filter((el) => el.id != id);
        } catch (error) {
          console.log(error);
        }
      }
      isLoading.value = false;
    },
    reject: () => {
      console.log("reject");
    },
  });
};
//
onMounted(async () => {
  await getAllInterviews();
});
//
</script>

<template>
  <Prime-ConfirmDialog></Prime-ConfirmDialog>

  <Loader v-if="isLoading" />

  <div>
    <Prime-DataTable
      :value="interviews"
      v-model:filters="filters"
      :globalFilterFields="['company', 'contactName', 'result']"
    >
      <template #header>
        <div class="flex align-items-center justify-content-between">
          <h2>Interviews list</h2>

          <div class="flex gap-5">
            <!-- Radio buttons filter -->

            <div class="flex flex-wrap gap-3 mb-3 mt-1">
              <div class="flex align-items-center">
                <Prime-RadioButton
                  v-model="result"
                  inputId="showall"
                  name="rezult"
                  value="Show all"
                  @change="getAllInterviews('Show all')"
                />
                <label for="showall" class="ml-2" style="font-weight: 500"
                  >Show all</label
                >
              </div>
            </div>

            <div class="flex flex-wrap gap-3 mb-3 mt-1">
              <div class="flex align-items-center">
                <Prime-RadioButton
                  v-model="result"
                  inputId="disclaimer"
                  name="rezult"
                  value="Disclaimer"
                  @change="getAllInterviews('Disclaimer')"
                />
                <label for="disclaimer" class="ml-2" style="font-weight: 500"
                  >Disclaimer</label
                >
              </div>
            </div>

            <div class="flex flex-wrap gap-3 mb-3 mt-1">
              <div class="flex align-items-center">
                <Prime-RadioButton
                  v-model="result"
                  inputId="offer"
                  name="rezult"
                  value="Offer"
                  @change="getAllInterviews('Offer')"
                />
                <label for="offer" class="ml-2" style="font-weight: 500"
                  >Offer</label
                >
              </div>
            </div>

            <div class="flex flex-wrap gap-3 mb-3 mt-1">
              <div class="flex align-items-center">
                <Prime-RadioButton
                  v-model="result"
                  inputId="inProgress"
                  name="rezult"
                  value="In progress"
                  @change="getAllInterviews('In progress')"
                />
                <label for="inProgress" class="ml-2" style="font-weight: 500"
                  >In progress</label
                >
              </div>
            </div>

            <!-- end radio buttons -->
            <Prime-IconField iconPosition="left">
              <Prime-InputIcon>
                <i class="pi pi-search" />
              </Prime-InputIcon>
              <Prime-InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </Prime-IconField>
          </div>
        </div>
      </template>
      <Prime-Column field="company" header="Company"></Prime-Column>
      <Prime-Column field="contactName" header="Contact Name"></Prime-Column>
      <Prime-Column header="Vacancy">
        <template #body="slotProps">
          <a :href="slotProps.data.vacancyLink" target="_blank">
            <i class="contact-icons pi pi-link text-blue-500" />
          </a>
        </template>
      </Prime-Column>
      <Prime-Column header="Salary range">
        <template #body="slotProps">
          <span
            >₪{{ slotProps.data.salaryFrom }}-₪{{
              slotProps.data.salaryTo
            }}</span
          >
        </template>
      </Prime-Column>
      <Prime-Column header="Stages">
        <template #body="slotProps">
          <Prime-Badge
            v-for="(stage, ind) in slotProps.data.stages"
            :key="ind"
            :value="ind + 1"
            rounded
            style="margin-right: 5px"
            v-tooltip.top="
              `${stage.name} ${moment(stage.date?.toDate()).format(
                'DD/MM/YYYY'
              )}`
            "
          ></Prime-Badge>
        </template>
      </Prime-Column>
      <Prime-Column header="Upshot">
        <template #body="slotProps">
          <Prime-Badge
            v-if="slotProps.data.result === 'In progress'"
            severity="info"
            >in progress</Prime-Badge
          >
          <template v-else>
            <Prime-Badge
              :value="slotProps.data.result"
              :severity="
                slotProps.data.result === 'Offer' ? 'success' : 'danger'
              "
            ></Prime-Badge>
          </template>
        </template>
      </Prime-Column>
      <Prime-Column header="Contacts">
        <template #body="slotProps">
          <div class="contacts">
            <a
              v-if="slotProps.data.contactTelegram"
              :href="`https://t.me/${slotProps.data.contactTelegram}`"
              target="_blank"
            >
              <i class="contact-icons pi pi-telegram text-blue-500" />
            </a>
            <a
              v-if="slotProps.data.contactWhatsApp"
              :href="`https://wa.me/${slotProps.data.contactWhatsApp}`"
              target="_blank"
            >
              <i class="contact-icons pi pi-whatsapp text-green-500" />
            </a>
            <a
              v-if="slotProps.data.contactPhone"
              :href="`https://tel:${slotProps.data.contactPhone}`"
              target="_blank"
            >
              <i class="contact-icons pi pi-phone text-gray-500" />
            </a>
          </div>
        </template>
      </Prime-Column>
      <Prime-Column>
        <template #body="slotProps">
          <div class="flex gap-2">
            <RouterLink :to="`/interview/${slotProps.data.id}`">
              <Prime-Button
                icon="pi pi-pencil"
                severity="info"
                style="width: 40px; height: 40px"
              />
            </RouterLink>
            <Prime-Button
              icon="pi pi-trash"
              severity="danger"
              style="width: 40px; height: 40px"
              @click="
                onRemoveInterview(slotProps.data.id, slotProps.data.company)
              "
            />
          </div>
        </template>
      </Prime-Column>
    </Prime-DataTable>
  </div>
  <Prime-InlineMessage severity="warn" v-if="!isLoading && !interviews.length"
    >List of interviews is empty</Prime-InlineMessage
  >
</template>
<style scoped>
.contacts {
  display: flex;
  align-items: center;
  gap: 15px;
}
.contact-icons {
  font-size: 28px;
}
</style>

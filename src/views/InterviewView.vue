<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";

import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import moment from "moment";

import Loader from "@/components/Loader.vue";

const isLoading = ref(true);
const interview = ref({});
const interviewDate = ref(null);

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const db = getFirestore();
const interviewId = route.params.id;
const docref = doc(db, `users/${authStore.userId}/interviews`, interviewId);

//const minDate = ref(new Date());

const getInterview = async () => {
  try {
    const docSnap = await getDoc(docref);
    interview.value = docSnap.data();
    interviewDate.value = moment(interview.value.createdAt.toDate()).format(
      "DD/MM/YYYY h:mm:ss a"
    );
    //console.log(interviewDate.value);
    //console.log(interview.value);
    // convert stages date to DD/MM/YYYY
    if (interview.value.stages) {
      interview.value.stages = interview.value.stages.map((stage) => {
        console.log(typeof stage.date);
        return typeof stage.date?.toDate === "function"
          ? {
              ...stage,
              date: stage.date.toDate(),
            }
          : stage;
      });
    }
    isLoading.value = false;
  } catch (error) {
    console.log(error);
  }
};
//
const onNewStage = () => {
  if (interview.value) {
    if (!interview.value.stages) {
      interview.value.stages = [];
    }
    interview.value.stages.push({ name: "", date: new Date(), comments: "" });
  }
};
//
const onRemoveStage = (ind) => {
  interview.value.stages.splice(ind, 1);
};
//
const onDateSelect = (ind) => {
  //const myDate = moment()
  console.log(interview.value.stages[ind].date);
  // const date = interview.value.stages[ind].date;
  // interview.value.stages[ind].date = moment(date).format("DD/MM/YYYY");
};
//
const onSaveInterview = async () => {
  isLoading.value = true;
  //
  try {
    await updateDoc(docref, { ...interview.value });
    await getInterview();
  } catch (error) {
    console.log(error);
  }
};
//
onMounted(async () => {
  try {
    await getInterview();
    if (!interview.value) {
      console.log("Not Found !!!");
      router.push("/notfound");
    }
  } catch (error) {
    console.log(error);
  }
});
</script>
<template>
  <div class="content-interview" v-if="interview">
    <Loader v-if="isLoading" />

    <Prime-Card v-else>
      <template #title
        >Edit interview (created at {{ interviewDate }})</template
      >
      <template #content>
        <div class="flex flex-column gap-2">
          <label for="company" class="font-bold">Company:</label>
          <Prime-InputText
            class="imput mb-3"
            id="company"
            placeholder="Company"
            v-model="interview.company"
          />
        </div>
        <div class="flex flex-column gap-2">
          <label for="vacancy" class="font-bold">Vacancy description:</label>
          <Prime-InputText
            class="imput mb-3"
            id="vacancy"
            placeholder="Vacancy description (link)"
            v-model="interview.vacancyLink"
          />
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactName" class="font-bold">Contact name:</label>
          <Prime-InputText
            class="imput mb-3"
            id="contactName"
            placeholder="Contact name"
            v-model="interview.contactName"
          />
        </div>
        <div class="flex flex-column gap-2">
          <label for="telegramName" class="font-bold"
            >Telegram userename:</label
          >
          <Prime-InputText
            class="imput mb-3"
            id="telegramName"
            placeholder="Telegram userename"
            v-model="interview.contactTelegram"
          />
        </div>
        <div class="flex flex-column gap-2">
          <label for="whatsApp" class="font-bold">WhatsApp:</label>
          <Prime-InputText
            class="imput mb-3"
            id="whatsApp"
            placeholder="WhatsApp"
            v-model="interview.contactWhatsApp"
          />
        </div>
        <div class="flex flex-column gap-2">
          <label for="phone" class="font-bold">Phone:</label>
          <Prime-InputMask
            class="imput mb-3"
            id="phone"
            mask="(999) 999-999999"
            placeholder="(999) 999-999999"
            v-model="interview.contactPhone"
          />
        </div>
        <div class="flex flex-wrap gap-3 p-fluid mb-3">
          <div class="flex-auto">
            <Prime-InputNumber
              inputId="salaryFrom"
              placeholder="Salary from"
              mode="currency"
              currency="ILS"
              locale="en-IL"
              v-model="interview.salaryFrom"
            />
          </div>
          <div class="flex-auto">
            <Prime-InputNumber
              inputId="salaryTo"
              placeholder="Salary to"
              mode="currency"
              currency="ILS"
              v-model="interview.salaryTo"
            />
          </div>
        </div>
        <Prime-Button
          label="New stage"
          severity="info"
          icon="pi pi-plus"
          class="mb-3"
          @click="onNewStage"
        />

        <template v-if="interview.stages">
          <!-- S T A G E S -->
          <div
            v-for="(stage, ind) in interview.stages"
            :key="ind"
            class="interview-stage pl-5 pr-5"
          >
            <div class="flex flex-wrap gap-3 p-fluid mb-3">
              <div class="flex-auto">
                <Prime-InputText
                  v-model="stage.name"
                  :id="`stageName${ind}`"
                  placeholder="Stage name"
                />
              </div>
              <div class="flex-auto">
                <Prime-Calendar
                  v-model="stage.date"
                  :manualInput="false"
                  dateFormat="dd.mm.yy"
                  :id="`stageDate${ind}`"
                  placeholder="Stage date"
                  @date-select="onDateSelect(ind)"
                />
              </div>
            </div>
            <div class="flex flex-column gap-2 mb-3">
              <label :for="`stageComments${ind}`" class="font-bold"
                >Comments:</label
              >
              <Prime-Textarea
                v-model="stage.comments"
                :id="`stageComments${ind}`"
                rows="5"
              />
            </div>

            <Prime-Button
              @click="onRemoveStage(ind)"
              severity="danger"
              label="Remove stage"
            />
          </div>
          <!-- stages end -->
          <div class="flex flex-wrap gap-3 mb-3">
            <div class="flex align-items-center">
              <Prime-RadioButton
                v-model="interview.result"
                inputId="disclaimer"
                name="rezult"
                value="Disclaimer"
              />
              <label for="disclaimer" class="ml-2 font-bold">Disclaimer</label>
            </div>

            <div class="flex align-items-center">
              <Prime-RadioButton
                v-model="interview.result"
                inputId="offer"
                name="rezult"
                value="Offer"
              />
              <label for="offer" class="ml-2 font-bold">Offer</label>
            </div>
          </div>
        </template>
        <div class="flex flex-column gap-2">
          <Prime-Button
            label="Save interview"
            severity="info"
            icon="pi pi-save"
            style="width: 50%; margin-left: 25%"
            @click="onSaveInterview"
          />
        </div>
      </template>
    </Prime-Card>
  </div>
</template>
<style scoped>
.content-interview {
  max-width: 800px;
  margin: auto;
}
.input {
  width: 100%;
}
.interview-stage {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>

<script setup>
import { ref, onMounted } from "vue";

import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  doc,
} from "firebase/firestore";

import { getAuth } from "firebase/auth";

const chartData = ref();
const chartOptions = ref(null);

const db = getFirestore();

const interviews = ref([]);
const isLoading = ref(true);

const getAllInterviews = async () => {
  isLoading.value = true;
  try {
    const userId = getAuth().currentUser?.uid;
    if (userId) {
      const getData = query(
        collection(db, `users/${userId}/interviews`),
        orderBy("createdAt", "desc")
      );
      const res = await getDocs(getData);
      //console.log(res, userId);
      interviews.value = res.docs.map((el) => el.data());
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

onMounted(async () => {
  await getAllInterviews();
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

const setChartData = () => {
  const documentStyle = getComputedStyle(document.body);

  const data = [0, 0, 0];
  interviews.value.forEach((interview) => {
    if (interview.result === "Offer") {
      data[0]++;
      return;
    }
    if (interview.result === "Disclaimer") {
      data[1]++;
      return;
    }
    if (interview.result === "In progress") {
      data[2]++;
      return;
    }
  });

  return {
    labels: ["Offer", "Disclaimer", "In progress"],
    datasets: [
      {
        data,
        backgroundColor: [
          documentStyle.getPropertyValue("--green-500"),
          documentStyle.getPropertyValue("--red-400"),
          documentStyle.getPropertyValue("--blue-500"),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue("--green-400"),
          documentStyle.getPropertyValue("--red-400"),
          documentStyle.getPropertyValue("--blue-400"),
        ],
      },
    ],
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color");

  return {
    plugins: {
      legend: {
        labels: {
          cutout: "60%",
          color: textColor,
        },
      },
    },
  };
};
</script>

<template>
  <h2>Statistics</h2>
  <div class="card flex justify-content-center">
    <Prime-Chart
      type="doughnut"
      :data="chartData"
      :options="chartOptions"
      class="w-full md:w-30rem"
    />
  </div>
</template>

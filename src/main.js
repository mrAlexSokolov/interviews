//import './assets/main.css'

import "primeflex/primeflex.css";
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import PrimeVue from "primevue/config";

import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";

import Menubar from "primevue/menubar";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import ProgressBar from "primevue/progressbar";
import Toast from "primevue/toast";
import Card from "primevue/card";
import FloatLabel from "primevue/floatlabel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ConfirmDialog from "primevue/confirmdialog";
import InlineMessage from "primevue/inlinemessage";
import InputMask from "primevue/inputmask";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Calendar from "primevue/calendar";
import RadioButton from "primevue/radiobutton";
import Badge from "primevue/badge";
import Tooltip from "primevue/tooltip";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Chart from "primevue/chart";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "my-test-project-8d2c4.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE,
  projectId: "my-test-project-8d2c4",
  storageBucket: "my-test-project-8d2c4.appspot.com",
  messagingSenderId: "92867297324",
  appId: "1:92867297324:web:265179405d44c3ffc39189",
};

// Initialize Firebase
initializeApp(firebaseConfig);

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);

// PrimeVue directives
app.directive("tooltip", Tooltip);

// PrimeVue components
app.component("Prime-MenuBar", Menubar);
app.component("Prime-Button", Button);
app.component("Prime-InputText", InputText);
app.component("Prime-Toast", Toast);
app.component("Prime-ProgressBar", ProgressBar);
app.component("Prime-Card", Card);
app.component("Prime-FloatLabel", FloatLabel);
app.component("Prime-DataTable", DataTable);
app.component("Prime-Column", Column);
app.component("Prime-ConfirmDialog", ConfirmDialog);
app.component("Prime-InlineMessage", InlineMessage);
app.component("Prime-InputMask", InputMask);
app.component("Prime-InputNumber", InputNumber);
app.component("Prime-Textarea", Textarea);
app.component("Prime-Calendar", Calendar);
app.component("Prime-RadioButton", RadioButton);
app.component("Prime-Badge", Badge);
app.component("Prime-IconField", IconField);
app.component("Prime-InputIcon", InputIcon);
app.component("Prime-Chart", Chart);

app.mount("#app");

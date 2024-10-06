<script setup>
import axios from "axios";
import {ref} from "vue";
import {useNotificationStore} from "@/stores/notifications.js";
import {useColorsStore} from "@/stores/colors.js";
import {useRoute} from "vue-router";

const notifications = useNotificationStore()
const fileInput = ref(null);
const isLoading = ref(false);
const colors = useColorsStore()
const route = useRoute()

const triggerFileUpload = () => {
  fileInput.value.click();
}

const uploadFile = async () => {
  const file = fileInput.value.files[0];
  if (!file) return;

  isLoading.value = true;
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/admin/groups/${route.params.id}/by-file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        "Authorization": "Bearer " + localStorage.getItem('token')
      },
    });
    notifications.showNotification("success", "Успешно", "Файл успешно загружен");
    colors.getDetailColorGroup(route.params.id)
  } catch (error) {
    notifications.showNotification("error", "Произошла ошибка", e);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="h-full">
    <button
        @click="triggerFileUpload"
        class="block bg-mainColor py-3 px-2 rounded-md text-sm text-white font-semibold">
      Импортировать
    </button>
    <input
        type="file"
        id="fileUpload"
        name="fileUpload"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        ref="fileInput"
        class="hidden"
        @change="uploadFile"
    />
  </div>
</template>

<style scoped>
.hidden {
  display: none;
}
</style>
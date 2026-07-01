<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle v-if="!topLevel && !hasItems">{{ title }}</IonTitle>
        <IonButtons slot="start" v-if="topLevel || hasItems">
          <IonMenuButton></IonMenuButton>
        </IonButtons>
        <IonButtons slot="start" v-else>
          <IonBackButton @click="() => router.back()" defaultHref="/"></IonBackButton>
        </IonButtons>

        <IonButtons slot="end" v-if="extraButton">
          <IonButton>{{ extraButton.title }}</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent :fullscreen="true">
      <div id="container">
        <slot></slot>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { computed, onMounted, watch } from 'vue';
import router from '@/router/index.js';
import { items as itemsStore, title as titleStore } from '@/menuStore';
const props = defineProps<{
  topLevel?: boolean
  title?: string,
  items?: {
    title: string,
    url: string,
    iosIcon: string,
    mdIcon: string,
  }[]
  extraButton?: {
    title: string
  }

}>();

const hasItems = computed(() => (props.items?.length ?? 0) > 0)
</script>
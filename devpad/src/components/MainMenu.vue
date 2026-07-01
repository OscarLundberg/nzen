<template>
  <IonMenu menuId="main-menu" contentId="main" type="push">
    <IonHeader :translucent="true">
      <IonToolbar>
        <IonTitle v-if="title">Menu</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList :inset="true" lines="inset">
        <IonItem :button="true" v-for="item in items" :key="item.url" :routerLink="item.url">
          <IonIcon :ios="item.iosIcon" :md="item.mdIcon" aria-hidden="true" slot="start" />
          <IonLabel>
            {{ item.title }}
          </IonLabel>
        </IonItem>
      </IonList>
    </IonContent>
  </IonMenu>
</template>

<script setup lang="ts">
import { items, title } from '@/menuStore';
import { IonContent, IonHeader, IonList, IonTitle, IonToolbar, IonMenu, IonItem, IonLabel, IonIcon } from '@ionic/vue';

</script>
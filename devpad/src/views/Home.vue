<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  addOutline,
  addSharp,
  cloudUploadOutline,
  cloudUploadSharp,
  cubeOutline,
  cubeSharp,
} from 'ionicons/icons';
import PageBase from '@/components/PageBase.vue';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonItem, IonLabel, IonList, IonNavLink, IonSplitPane } from '@ionic/vue';

const appPages = [
  {
    title: 'Create project',
    url: '/Create',
    iosIcon: addOutline,
    mdIcon: addSharp,
  },
  {
    title: 'Import',
    url: '/Import',
    iosIcon: cloudUploadOutline,
    mdIcon: cloudUploadSharp,
  }
];


type Project = { name: string, createdDate: number, id: string };
const projects = ref<Project[]>([]);

onMounted(() => {
  const locallyStoredProjects: Project[] = JSON.parse(localStorage.getItem("nz_project_list") ?? "[]")

  if (locallyStoredProjects) {
    projects.value = [...locallyStoredProjects];
  }
});

</script>

<template>
  <PageBase title="Devpad"
    :items="[...appPages, ...projects.map(e => ({ title: e.name, url: `/project/${e.id}`, iosIcon: cubeOutline, mdIcon: cubeSharp }))]">
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          Welcome to devpad!
        </IonCardTitle>
        <IonCardSubtitle>GETTING STARTED</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        It looks like this is your first time with devpad.
        Would you like to take the VIP tour?

      </IonCardContent>
      <IonButton fill="clear">why yes</IonButton>
      <IonButton fill="clear" color="danger">no, i don't like to do things</IonButton>
    </IonCard>

    <IonList :inset="true" lines="inset">
      <IonItem routerLink="/Create">
        <IonIcon :ios="addOutline" slot="start"></IonIcon>
        <IonLabel>Create a new project...</IonLabel>
      </IonItem>
      <IonItem>
        <IonIcon :ios="cloudUploadOutline" slot="start"></IonIcon>
        <IonLabel>Import existing project...</IonLabel>
      </IonItem>
    </IonList>
  </PageBase>
</template>
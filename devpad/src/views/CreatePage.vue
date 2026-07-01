<script setup lang="ts">
import PageBase from '@/components/PageBase.vue';
import { IonInput, IonItem, IonList } from '@ionic/vue';
const id = Math.floor(Math.random() * 10 ** 15).toString(16);
</script>

<template>
    <PageBase title="Create project" :topLevel="false" :extraButton="{ title: 'Save' }">
        <IonList :inset="true" lines="inset">
            <IonItem>
                <IonInput placeholder="advantageous-mittens" label="Project name:"></IonInput>
            </IonItem>
            <IonItem>
                <IonInput :disabled="true" :readonly="true" :value="id" label="Project Id:"></IonInput>
            </IonItem>
        </IonList>
    </PageBase>
</template>
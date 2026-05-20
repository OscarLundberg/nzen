<script setup lang="ts">
import Features from './components/Features.vue';
import Footer from './components/Footer.vue';
import Hero from './components/Hero.vue';
import Navbar from './components/Navbar.vue';
import GettingStarted from './components/GettingStarted.vue';
import EditorApp from './components/EditorApp.vue';
const isApp = location.pathname.includes("/app")
</script>

<template>
  <main>
    <EditorApp v-if="isApp" />
    <template v-else>
      <div class="container-fluid">
        <Navbar />
        <main data-bs-spy="scroll" data-bs-target="#navbar">
          <Hero />
          <Features />
          <GettingStarted />
        </main>
        <Footer />
      </div>
    </template>
  </main>
</template>
<script setup lang="ts">
// The debounce function receives our function as a parameter
const debounce = (fn) => {

  // This holds the requestAnimationFrame reference, so we can cancel it if we wish
  let frame;

  // The debounce function returns a new function that can receive a variable number of arguments
  return (...params) => {

    // If the frame variable has been defined, clear it now, and queue for next frame
    if (frame) {
      cancelAnimationFrame(frame);
    }

    // Queue our function call for the next frame
    frame = requestAnimationFrame(() => {

      // Call our function and pass any params we received
      fn(...params);
    });

  }
};


// Reads out the scroll position and stores it in the data attribute
// so we can use it in our stylesheets
const storeScroll = () => {
  console.log("doing it")
  document.getElementsByTagName("html")[0].setAttribute("data-scroll", `${window.scrollY}`)
}

// Listen for new scroll events, here we debounce our `storeScroll` function
document.addEventListener('scroll', debounce(storeScroll), { passive: true });

// Update scroll position for first time
storeScroll();

</script>

<template>
  <nav id="navbar" class="navbar sticky-top navbar-expand-md">
    <div class="container-md w-80">
      <a class="navbar-brand" href="#home">nzen</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"
          aria-controls="navbarText" aria-expanded="true" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto ">
          <li class="nav-item">
            <a class="nav-link" href="#features">Features</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#getting-started">Getting started</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
nav {
  text-shadow: -2px 2px 2px black;
}

@media screen and (max-width: 768px) {
  nav {
    background-color: #32323285 !important;
  }
}

html[data-scroll='0'] nav {
  backdrop-filter: blur(0px);
  background-color: transparent !important;
  transition: background-color .6s ease-in;
  transition: backdrop-filter .6s ease-in;
}

html:not([data-scroll='0']) nav {
  transition: background-color .6s ease-in;
  transition: backdrop-filter .6s ease-in;
  backdrop-filter: blur(7px);
  background-color: #3232324d !important;
}


.active {
  color: var(--color-primary) !important;
}

nav {
  position: fixed;
  top: 0px;
  z-index: 10000;
  width: 100%;
}
</style>

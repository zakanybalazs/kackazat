<template>
  <section class="container">
    <div>
      <logo/>
      <h1 class="title">
        Kockázat kalkulátor
      </h1>
      <h2 class="subtitle">
        Kockázat kalkulátor egyetemi dolgozathoz, vizsgához, ellenérzéshez.
      </h2>
      <div class="links">
        <nuxt-link to="/kalkulator">
          <a
          href="https://nuxtjs.org/"
          target="_blank"
          class="button--green">Elkezdés</a>
        </nuxt-link>
          <a
          href="https://github.com/zakanybalazs/kockazat"
          target="_blank"
          class="button--grey">GitHub</a>
        <p style="margin-top:40px; color:gray">
          Készítette:
          <a href="https://www.facebook.com/balazs.zakany">Zákány Balázs</a>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  }
}
</script>

<style>
.button--green {
  cursor: pointer;
}
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

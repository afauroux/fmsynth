<template>
  <section class="container">
    <div>
      <fm-synth-logo/>
      <h2 class="title">
        FM MODULATION SYNTHESIS FROM WITHIN THE BROWSER
      </h2>
      
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          class="button--green">Documentation</a>
        <nuxt-link class="button--grey" to="/synth">Synth</nuxt-link>
      </div>
    </div>
  </section>
</template>

<script>
import FmSynthLogo from '~/components/FmSynthLogo.vue';

export default {
	components: {
		FmSynthLogo,
	},
	mounted: function() {
		console.log(this.$store.msg);
	},
};
</script>

<style scoped>
.container {
	min-height: 100vh;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: top;
	text-align: center;
	background-image: url('~/assets/background.jpg');
	background-size: cover;
}

.title {
	font-weight: 300;
	font-size: 34px;
	font-style: italic;
	color: #d8db02;
	word-spacing: 5px;
	padding-bottom: 15px;
}

.links {
	padding-top: 15px;
}
</style>

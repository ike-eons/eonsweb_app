<template>
  <v-app>
    <v-main>
      <transition name="fade">
        <router-view :key="$route.path" />
      </transition>
    </v-main>
  </v-app>
  <!-- <v-main>
		<router-view :key="$route.path" />
	</v-main> -->
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
  created() {
    this.$store.dispatch("lengthofusers");
  },
};
</script>

<style>
:root {
  --light-teal-1: #eaffff;
  --light-teal-2: hsla(180, 100%, 25%, 0.192);
  --light-teal-3: #66b2b2;
  --light-teal-4: #008080;
  --dark-teal: teal;

  --green-dark: rgb(9, 154, 151) 6.3%;
  --green-light: rgb(21, 205, 168) 90.6%;
  --white-color: #fff;
  --red-color: red;
}
::-webkit-scrollbar {
  width: 0px;
}
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}
</style>

<!-- <template>
  <v-app>
    <v-app-bar 
      app
      color="primary"
      dark
    >
      
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script> -->

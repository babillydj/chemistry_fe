<template>
  <div class="flex flex-col">
    <div class="p-5 border-b border-b-gray-400 text-center">
      <h1>MaSmiles</h1>
    </div>
    <div class="w-full h-[calc(100vh-97px)] overflow-hidden p-4">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HomePage',
  setup () {

  },
  data() {
    return {

    };
  },
  async mounted() {

  },
  methods: {

  }
}
</script>

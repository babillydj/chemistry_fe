<template>
  <div class="flex" :class="label.position == 'top' ? 'flex-col gap-2' : 'items-center gap-4'">
    <label 
      v-if="label.title" 
      :for="usedID" 
      class="text-sm text-gray-400 whitespace-nowrap"
      :class="[{'font-bold': label.fontWeight == 'bold'}]"
    >
      {{ label.title }}
    </label>
    <div class="pr-1.5 border-2 border-gray-100 rounded-lg text-sm w-fit cursor-pointer bg-white">
      <select 
        :id="usedID" 
        :value="modelValue" 
        name="select" 
        class="px-2 py-1 bg-white cursor-pointer rounded-lg outline-none font-bold"
        @change="onclick($event.target.value)" 
      >
        <option v-for="option in options" :key="option.value" :value="option.value" class="font-medium">
          {{ option.text }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SelectComponent",
    props: {
      label: {
        type: Object,
        required: false,
        default() {
          return {}
        },
      },
      modelValue: {
        type: String,
        required: true,
      },
      options: {
        type: Array,
        required: true
      }
    },
    emits: ['update:modelValue', 'select'],
    data () {
      return {
        usedID: (Math.random() + 1).toString(36).substring(7),
      }
    },
    methods: {
      onclick(value) {
        this.$emit('update:modelValue', value)
        this.$emit('select', value)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
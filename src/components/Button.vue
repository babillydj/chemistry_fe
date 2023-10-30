<template>
  <button 
    :disabled="isDisabled" 
    class="py-2.5 px-3 w-full rounded-md flex items-center justify-center" 
    :class="[bgColor, borderColor]" 
    @click="onClick"
  >
    <span v-if="label" :class="[textColor, 'text-sm font-bold']">{{ label }}</span>
  </button>
</template>

<script>
  export default {
    name: "ButtonComponent",
    props: {
      // primary, secondary, or tertiary
      type: {
        type: String,
        required: false,
        default: "primary",
      },
      label: {
        type: String,
        required: false,
        default: "",
      },
      // small, medium, or large
      size: {
        type: String,
        required: false,
        default: "medium",
      },
      isDisabled: {
        type: Boolean,
        required: false,
      },
      isLoading: {
        type: Boolean,
        required: false,
      },
    },
    emits: ['onClick'],
    computed: {
      bgColor() {
        let result = "bg-gray-800 hover:bg-gray-700 active:bg-gray-900";
        if (this.type == 'tertiary') {
          result = `bg-white enabled:hover:underline`;
        } else if (this.isDisabled) {
          result = `bg-gray-100`;
        } else if (this.type == 'secondary') {
          result = `bg-white hover:bg-gray-100 active:bg-gray-200`;
        } 
        return result;
      },
      textColor() {
        let result = "text-white";
        if (this.isDisabled) {
          result = `text-gray-300`;
        } else if (this.type == 'secondary' || this.type == 'tertiary') {
          result = `text-black`;
        } 
        return result;
      },
      borderColor() {
        let result = "border border-gray-0";
        if (this.isDisabled || this.type == 'tertiary') {
          result = `border-0`;
        } else if (this.type == 'secondary') {
          result = `border border-gray-800`;
        } 
        return result;
      },
      padSize() {
        let result = "py-2.5";
        if (this.size == 'small') {
          result = `py-2`;
        } else if (this.size == 'large') {
          result = `py-3`;
        } 
        return `${result} px-3`;
      }
    },
    methods: {
      onClick() {
        this.$emit("onClick")
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
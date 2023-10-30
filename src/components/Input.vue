<template>
  <div :class="fontSize">
    <label :for="usedID" class="font-bold text-[#52525C]"> {{ label }}</label>
    <div 
      class="border mt-3 p-2 rounded-lg flex items-center" 
      :class="[
        isError ? 'border-red-300' : 'border-gray-300', 
        isDisabled ? 'bg-gray-300' : 'bg-white', 
        {'bg-gray-300': isDisabled}
      ]"
    >
      <input 
        :id="usedID" :type="type"  :name="usedID"  :placeholder="placeholder" class="w-full outline-none bg-white"
        :value="modelValue"
        :disabled="isDisabled"
        @input="$emit('update:modelValue', $event.target.value)"
      >
    </div>
  </div>
</template>

<script>
  export default {
    name: "InputComponent",
    props: {
      modelValue: {
        type: String,
        required: true,
      },
      // text or password
      type: {
        type: String,
        required: false,
        default: "text",
      },
      label: {
        type: String,
        required: false,
        default: "",
      },
      placeholder: {
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
      isError: Boolean
    },
    emits: ['update:modelValue'],
    data() {
      return {
        usedID: (Math.random() + 1).toString(36).substring(7)
      }
    },
    computed: {
      inputType() {
        let result = "";
        if (this.type == 'secondary') {
          result = `bg-white`;
        } 
        return result;
      },
      bgColor() {
        let result = "bg-black";
        if (this.type == 'secondary') {
          result = `bg-white`;
        } 
        return result;
      },
      textColor() {
        let result = "text-white";
        if (this.type == 'secondary') {
          result = `text-black`;
        } 
        return result;
      },
      borderColor() {
        let result = "border-white";
        if (this.type == 'secondary') {
          result = `border-black`;
        } 
        return result;
      },
      fontSize() {
        let result = "";
        if (this.size == 'small') {
          result = `text-xs`;
        } else if (this.size == 'large') {
          result = `text-xl`;
        } 
        return result;
      },
      padSize() {
        let result = "p-4";
        if (this.size == 'small') {
          result = `p-2`;
        } else if (this.size == 'large') {
          result = `p-6`;
        } 
        return result;
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
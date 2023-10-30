<template>
  <div
    class="relative z-40"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="fixed inset-0 transition bg-gray-500/75 duration-300"
      :class="{ 'opacity-0': !show, 'duration-200': !show }"
    ></div>
    <div class="fixed inset-0 z-40">
      <div
        :id="usedID"
        class="flex h-full justify-center items-center"
        @click.stop="onWrapper"
      >
        <div
          class="relative rounded-lg bg-white/100 text-left shadow-xl transition-all duration-300 p-4"
          :class="{
            'opacity-0': !show,
            'scale-95': !show,
            'duration-200': !show,
            'w-fit max-w-[90%]': type == 'content',
            'h-5/6 w-11/12': type == 'large',
            'w-3/4': type == 'medium',
            'w-full h-full': type == 'full',
          }"
        >
          <div class="mb-4 relative h-fit" :class="{ 'pr-16': closeButton }">
            <slot name="header"> </slot>
              <span v-if="closeButton"  class="bg-transparent absolute top-1 right-0 h-6 w-6" @click.stop="close">
                X
              </span>
          </div>
          <div class="h-[calc(100%-85px)] overflow-y-auto">
            <slot name="content">
              <p class="text-gray-500">{{ contentText }}</p>
            </slot>
          </div>
          <div class="mt-10">
            <slot name="footer"> </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "ModalComponent",
  components: {
		
  },
  props: {
    type: {
      /**current type modal : medium, large, full**/
      type: String,
      required: false,
      default: "medium",
    },
    contentText: {
      type: String,
      required: false,
      default: "Ente kadang kadang ...",
    },
    closeButton: {
      type: Boolean,
      required: false,
    },
  },
  emits: ["close"],
  data() {
    return {
      usedID: (Math.random() + 1).toString(36).substring(7),
      isLoading: false,
      isClosing: false,
      show: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.show = true;
    }, 0);
  },
  methods: {
    close() {
      this.show = false;
      setTimeout(() => {
        this.$emit("close", false);
      }, 250);
    },
    onWrapper(event) {
      if (event.target.id == this.usedID) {
        this.close();
      }
    },
  },
};
</script>

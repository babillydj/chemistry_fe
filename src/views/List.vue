<template>
    <div class="w-full h-full flex flex-col gap-6 items-center">
      <div
        :data-active="isDragOver"
        class="w-1/2 h-32 p-4 bg-teal-100 border border-teal-300 flex items-center justify-center cursor-pointer"
        @dragenter.prevent="handleDragOver"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        @click.self="clickLabel"
      >
        <template v-if="onChooseFile">
          <label
            :id="usedID"
            :ref="`label-file-${usedID}`"
            :for="`upload-file-${usedID}`"
            class="text-2xl text-teal-700  cursor-pointer"
          >
            Drag or upload .smi file here
            <span v-if="isError" class="text-base text-red-300">{{ errorMessage }}</span>
          </label>
          <input
            :id="`upload-file-${usedID}`"
            type="file"
            class="hidden"
            @change="onInputChange"
          />
        </template>
        <template v-else>
          <div class="flex justify-between">
            <div class="flex items-center gap-4">
              <div>
                <p class="mt-1 text-xs text-secondary-50">
                  Please wait...
                  <span v-if="onProgress"
                    >- (remaining time: {{ timeRemaining || "Calculating" }})</span
                  >
                </p>
              </div>
            </div>
          </div>
          
        </template>
      </div>
      <div v-if="molecules.length == 0" class="p-4 border border-gray-400 w-3/4 rounded-lg shadow-lg">
        <p>The list is empty</p> 
      </div>
      <div v-else class="flex-grow flex flex-col gap-4 items-center w-full overflow-auto">
        <div
            v-for="molecule,idx in molecules" :key="idx"
            class="p-4 border border-gray-400 w-3/4 rounded-lg shadow-lg cursor-pointer"
            @click="gotoDetail(molecule.id)"
        >
          <p>name : {{molecule.name}}</p> 
          <p>smiles : {{molecule.smiles}}</p> 
        </div>
      </div>
    </div>
</template>
<script>
import { doRequest } from "@/lib/request"
import { apiUrls } from "@/lib/request/urls"

export default {
  name: 'ListPage',
  setup () {

  },
  data() {
    return {
      molecules: [],
      usedID: null,
      isError: false,
      onChooseFile: true,
      onProgress: false,
      timeRemaining: null,
      isDragOver: false,
      errorMessage: ''
    };
  },
  mounted() {
    this.getMolecules()
  },
  methods: {
    async getMolecules() {
      const payload = {
        url: apiUrls.moleculeList,
        method: 'get',
        data: {}
      }
      const response = await doRequest(payload)
      this.molecules = response.data
    },
    gotoDetail(id) {
      this.$router.push({path: '/detail/' + id})
    },
    clickLabel() {
      this.$refs[`label-file-${this.usedID}`].click()
    },
    async uploadToServer(files) {
      this.onChooseFile = false
      let formData = new FormData()
      formData.append("file", files[0])
      
      const payload = {
        url: apiUrls.uploadSmile,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        data: formData,
        onUploadProgress: (progressEvent) => {
          this.onUploadProgress(progressEvent)
        },
      }
      const response = await doRequest(payload)
      if (response.status == 200) {
        this.onCompleteUpload()
      } else {
        console.log(response)
        this.onErrorUpload(response.statusText)
      }
    },
    async onInputChange(event, dragFiles = null) {
      this.isError = false
      let files = dragFiles ? dragFiles : event.target.files
      if (files.length > 0) {
        this.uploadToServer(files)
      }
    },
    handleDragOver() {
      if (this.onChooseFile) this.isDragOver = true
    },
    handleDragLeave() {
      if (this.onChooseFile) this.isDragOver = false
    },
    handleDrop(event) {
      if (this.onChooseFile) {
        this.isDragOver = false
        const files = event.dataTransfer.files
        this.onInputChange(null, files)
      }
    },
    onUploadProgress(progressEvent) {
      this.onProgress = true

      const bytesRemaining = progressEvent.total - progressEvent.loaded
      const speed = progressEvent.loaded / progressEvent.timeStamp // Average speed in bytes per millisecond
      const timeRemaining = bytesRemaining / speed // Time remaining in milliseconds
      if (timeRemaining < 60000) {
        this.timeRemaining = Math.round(timeRemaining / 1000) + " seconds"
      } else {
        this.timeRemaining = Math.round(timeRemaining / 60000) + " minutes"
      }
    },
    onCompleteUpload() {
      this.onProgress = false
      this.onChooseFile = true
      this.getMolecules()
    },
    onErrorUpload(error) {
      this.errorMessage = error
      this.isError = true
      this.onProgress = false
      this.onChooseFile = true
    },
  }
}
</script>

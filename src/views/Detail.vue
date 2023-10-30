<template>
  <div class="w-full h-full pt-10 flex flex-col gap-4 items-center">
    <div v-if="isNotFound" class="flex flex-col gap-4">
      <span>Data Not Found</span>
      <button class="border border-gray-400 w-40" @click="gotoList">Go Back</button>
    </div>
    <div v-else class="p-4 flex flex-col gap-6  border border-gray-300">
      <div class="flex gap-4">
        <div class="flex flex-col">
          <span>name</span>
          <span>smile</span>
          <span>description</span>
          <span>log_p</span>
          <span>number_of_atoms</span>
          <span>molecular_weight</span>
        </div>
        <div class="flex flex-col">
          <span v-for="key,idx of Object.keys(detail)" :key="idx">: {{detail[key]}}</span>
        </div>
      </div>
      <div class="flex gap-4">
        <MaButton label="Delete" @on-click="isOpenDelete = true" ></MaButton>
        <MaButton label="Edit" @on-click="isOpenEdit = true" ></MaButton>
      </div>
    </div>
    <div v-if="detail.smiles" class="mt-10 p-4 border border-gray-300">
      <MoleculeStructure
        :id="`structure-example-svg-1`"
        :structure="detail.smiles"
        :width="800"
        :height="500"
        svg-mode
      ></MoleculeStructure>
    </div>
    <div class="w-1/3 mt-10">
      <MaButton label="Go Back" type="secondary" @on-click="gotoList" ></MaButton>
    </div>
  </div>
  
	<MaModal
    v-if="isOpenEdit"
    @close="isOpenEdit = false"
  >
  <template #header>
      <div class="pt-8">
        <p class="text-[32px] font-bold text-center mb-4">Update Smile</p>
      </div>
    </template>

    <template #content>
      <div class="">
        <MaInput v-model="newName" label="Name" placeholder="input new name" />
        <div class="mt-4">
          <label for="desc" class="font-bold text-[#52525C]">Description</label>
          <textarea 
            id="desc" 
            v-model="newDesc" 
            name="desc" rows="3" 
            placeholder="input new description" 
            class="w-full mt-2 p-2 rounded-lg bg-white border border-gray-300 outline-none">
          </textarea>
        </div>
      </div>
    </template>
    <template #footer>
      
      <div class="w-full flex flex-col items-center justify-center">
          <div class="w-[260px] flex flex-col gap-4">
            <MaButton label="Save" @on-click="updateSmile"></MaButton>
            <MaButton label="Back" type="secondary" @on-click="isOpenEdit = false"></MaButton>
          </div>
        </div>
    </template>
  </MaModal>

	<MaModal
    v-if="isOpenDelete"
    @close="isOpenDelete = false"
  >
  <template #header>
      <div class="pt-8">
        <p class="text-[32px] font-bold text-center mb-4">delete?</p>
      </div>
    </template>

    <template #content>
      <div class="">
        <p class="text-xl text-center text-gray-500">Are you sure want to delete this?</p>
      </div>
    </template>
    <template #footer>
      
      <div class="w-full flex flex-col items-center justify-center">
          <div class="w-[260px] flex flex-col gap-4">
            <MaButton label="Yes" @on-click="deleteSmile"></MaButton>
            <MaButton label="Maybe later" type="secondary" @on-click="isOpenDelete = false"></MaButton>
          </div>
        </div>
    </template>
  </MaModal>
</template>

<script>
import { doRequest } from "@/lib/request"
import { apiUrls } from "@/lib/request/urls"

import MaModal from '@/components/Modal.vue';
import MaButton from '@/components/Button.vue';
import MaInput from '@/components/Input.vue';
import MoleculeStructure from "@/components/MoleculeStructure.vue";

export default {
  name: 'DetailPage',
  components: {
    MaModal,
    MaButton,
    MaInput,
    MoleculeStructure
  },
  setup() {},
  data() {
    return {
      detail: {},
      isOpenEdit: false,
      newName: '',
      newDesc: '',
      isOpenDelete: false,
      isNotFound: false
    };
  },
  mounted() {
    this.getMoleculeDetail()
  },
  methods: {
    async getMoleculeDetail() {
      const id = this.$route.params.id
      const payload = {
        url: apiUrls.moleculeDetail(id),
        method: 'get',
        data: {}
      }
      const response = await doRequest(payload)
      if (response.status == 200) {
        const data = response.data
  
        this.detail = {
          name: data.name,
          smiles: data.smiles,
          description: data.description,
          log_p: data.log_p,
          molecular_weight: data.molecular_weight,
          number_of_atoms: data.number_of_atoms,
        }
        
        this.newName = data.name
        this.newDesc = data.description
      } else {
        this.isNotFound = true
      }
    },
    async updateSmile() {
      const id = this.$route.params.id
      const payload = {
        url: apiUrls.moleculeDetail(id),
        method: 'put',
        data: {
          name: this.newName,
          description: this.newDesc,
        }
      }
      await doRequest(payload)
      this.isOpenEdit = false
      this.getMoleculeDetail()
    },
    async deleteSmile() {
      const id = this.$route.params.id
      const payload = {
        url: apiUrls.moleculeDetail(id),
        method: 'delete',
        data: {}
      }
      await doRequest(payload)
      this.isOpenDelete = false
      this.getMoleculeDetail()
    },
    gotoList() {
      this.$router.push({path: '/list'})
    }
  }
};
</script>

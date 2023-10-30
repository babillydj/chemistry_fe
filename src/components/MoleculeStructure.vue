<template>
  <p v-if="rdkitError">Error loading renderer</p>

  <p v-if="!rdkitLoaded">Loading renderer</p>

  <span
    v-else-if="!isValidMolString(structure)"
    :title="`Cannot render structure: ${structure}`"
  ></span>

  <template v-else>
    <div class="flex gap-4">
      <div class="w-1/3 flex flex-col gap-4">
        <span class="text-xl font-bold mb-4">Descriptors</span>
        <div class="overflow-auto" :style="`height: ${height}px`">
          <div v-for="item, idx in descriptorsSorted" :key="idx">
            <span class="has-text-weight-bold">{{item[0]}}</span>: {{item[1]}}
          </div>
        </div>
      </div>
    
      <div class="border-l border-gray-300 pl-6">
        <span class="text-xl font-bold mb-4">Sample</span>
        <div
          v-if="svgMode"
          :class="`molecule-structure-svg ${className}`"
          :style="{ width: width, height: height }"
          v-html="svg"
        ></div>
      
        <div v-else :class="`molecule-canvas-container ${className}`">
          <canvas
            :title="structure"
            :id="id"
            :width="width"
            :height="height"
          ></canvas>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup>
import { nextTick, onMounted, onUpdated, reactive, ref, watch } from "vue";

const props = defineProps({
  /**
   * Generic props
   */
  id: {
    type: String,
    required: true
  },
  className: {
    type: String,
    default: ""
  },
  svgMode: {
    type: Boolean,
    default: false
  },
  width: {
    type: Number,
    default: 250
  },
  height: {
    type: Number,
    default: 200
  },
  /**
   * RDKit-specific props
   */
  structure: {
    type: String,
    required: true
  },
  subStructure: {
    type: String,
    default: ""
  },
  extraDetails: {
    type: Object,
    default() {
      return {}
    }
  },
  drawingDelay: {
    type: Number,
    default: undefined
  }
});

// RDKit state reporting values
let rdkitLoaded = ref(false);
let rdkitError = ref(false);

// Molecule state values
let wasCalled = ref(false);
let molDetails = reactive({
  width: props.width,
  height: props.height,
  bondLineWidth: 1,
  addStereoAnnotation: true,
  ...props.extraDetails
});
let svg = ref("");
let descriptorsSorted = ref([])


/**
 * Validate the molecule
 */
function isValid(m) {
  return !!m;
}

/**
 * Validate the string representation of the molecule
 */
function isValidMolString(s) {
  const mol = window.RDKit.get_mol(s || "invalid");
  const isValidMol = isValid(mol);
  mol?.delete();

  return isValidMol;
}

/**
 * Get highlight details for molecule
 */
function getMolDetails(mol, qmol) {
  if (isValid(mol) && isValid(qmol)) {
    // get substructure highlight details
    const details = JSON.parse(mol?.get_substruct_matches(qmol) || "");
    // reduce the list of objects to a single list object with all atoms and bonds
    const detailsMerged = details
      ? details.reduce(
          (
            acc,
            { atoms, bonds }
          ) => ({
            atoms: [...acc.atoms, ...atoms],
            bonds: [...acc.bonds, ...bonds]
          }),
          { atoms: [], bonds: [] }
        )
      : details;

    return JSON.stringify({
      ...molDetails,
      ...(props.extraDetails || {}),
      ...detailsMerged
    });
  } else {
    // if one of the molecules are not valid, return no highlight details
    return JSON.stringify({
      ...molDetails,
      ...(props.extraDetails || {})
    });
  }
}

/**
 * Draw the molecule to the canvas, or return set the SVG variable
 */
async function drawSVGorCanvas() {
  const mol = window.RDKit.get_mol(props.structure || "invalid");
  const qmol = window.RDKit.get_qmol(props.subStructure || "invalid");
  const isValidMol = isValid(mol);

  if (props.svgMode && isValidMol) {
    const svgGenerated = (mol).get_svg_with_highlights(getMolDetails(mol, qmol));
    svg.value = svgGenerated;
  } else if (isValidMol) {
    await nextTick(); // function needs to wait until canvas is rendered
    const canvas = document.getElementById(props.id);
    (mol).draw_to_canvas_with_highlights(canvas, getMolDetails(mol, qmol));
  }

  /**
   * Delete C++ mol objects manually
   * https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#memory-management
   */
  mol?.delete();
  qmol?.delete();
}

/**
 * Calls the main drawing logic, either with a delay or without
 */
function draw() {
  if (props.drawingDelay) {
    setTimeout(() => drawSVGorCanvas(), props.drawingDelay);
  } else {
    drawSVGorCanvas();
  }
}

/**
 * Ensures draw() is only called once
 */
function drawOnce() {
  return () => {
    if (wasCalled.value === false) {
      wasCalled.value = true;
      draw();
    }
  };
}

function descriptor() {
  const mol = window.RDKit.get_mol(props.structure);
  const descriptors = JSON.parse(mol.get_descriptors());
  descriptorsSorted.value = Object.keys(descriptors)
    .sort(function(a,b) {return a.localeCompare(b, undefined, {sensitivity: 'base'});})
    .map(function(descriptor) {return [descriptor, descriptors[descriptor]]}) 
  console.log(descriptorsSorted)
}

/**
 * Load molecule on component mount
 */
onMounted(() => {
  window
    .initRDKitModule()
    .then(function (RDKit) {
      console.log("RDKit version: " + RDKit.version());
      window.RDKit = RDKit;
      rdkitLoaded.value = true;
      try {
        draw();
        descriptor()
      } catch (err) {
        console.error(err);
      }
    })
    .catch(() => {
      // handle loading errors here...
    });
});

/**
 * Redraw molecule on component update, or props changes
 */

onUpdated(() => {
  if (!rdkitError.value && rdkitLoaded.value && !props.svgMode) {
    drawOnce();
  }
});

watch(props, () => draw());
</script>

<style>
.molecule-structure-svg svg rect:first-of-type {
  fill: transparent !important;
}
</style>
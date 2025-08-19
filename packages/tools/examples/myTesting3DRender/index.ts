import type { Types } from '@cornerstonejs/core';
import {
  CONSTANTS,
  Enums,
  getRenderingEngine,
  RenderingEngine,
  setVolumesForViewports,
  volumeLoader,
} from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import {
  addButtonToToolbar,
  addDropdownToToolbar,
  addManipulationBindings,
  createImageIdsAndCacheMetaData,
  initDemo,
  setTitleAndDescription,
} from '../../../../utils/demo/helpers';


const { ToolGroupManager, Enums: csToolsEnums } = cornerstoneTools;

const { ViewportType } = Enums;

// Define a unique id for the volume
let renderingEngine;

const volumeName = 'CT_VOLUME_ID'; // Id of the volume less loader prefix
const volumeLoaderScheme = 'cornerstoneStreamingImageVolume'; // Loader id which defines which volume loader to use
const volumeId = `${volumeLoaderScheme}:${volumeName}`; // VolumeId with loader id + volume id
const renderingEngineId = 'myRenderingEngine';
const viewportId = '3D_VIEWPORT';

// ======== Set up page ======== //
setTitleAndDescription(
  '3D Volume Rendering',
  'Here we demonstrate how to 3D render a volume.'
);

const size = '500px';
const content = document.getElementById('content');
const viewportGrid = document.createElement('div');

viewportGrid.style.display = 'grid'; // it can be flex or grid, the difference is that grid is a 2D layout and flex is a 1D layout
viewportGrid.style.gridTemplateColumns = '1fr 1fr'; // it means that the viewport grid will have 2 columns, each column will take up 1/2 of the width of the viewport grid

// The style.display property sets the CSS display type of an element.
// Setting `display = 'flex'` enables the CSS Flexbox layout model for the element,
// allowing its children to be laid out and aligned easily in a flexible way.
// The style.flexDirection property determines the direction in which the flex items (children)
// are placed in the flex container. Setting `flexDirection = 'row'` arranges the children
// horizontally (side by side), while `flexDirection = 'column'` would arrange them vertically.
 
// Example:
// viewportGrid.style.display = 'flex'; // enables flexbox layout
// viewportGrid.style.flexDirection = 'row'; // children are laid out in a row (horizontally)


const element1 = document.createElement('div');
element1.oncontextmenu = () => false;

element1.style.width = size;
element1.style.height = size;

viewportGrid.appendChild(element1);

content.appendChild(viewportGrid);

const instructions = document.createElement('p'); // p is a paragraph tag
instructions.innerText = 'Click the image to rotate it.';

content.append(instructions);

addButtonToToolbar({
  title: 'Apply random rotation',
  onClick: () => {
    // Get the rendering engine
    const renderingEngine = getRenderingEngine(renderingEngineId);

    // Get the volume viewport
    const viewport = renderingEngine.getViewport(
      viewportId
    ) as Types.IVolumeViewport;

    // Apply the rotation to the camera of the viewport
    viewport.setViewPresentation({ rotation: Math.random() * 360 });
    viewport.render();
  },
});

addDropdownToToolbar({
  // preset is a dropdown menu that allows the user to select a preset
  // it contains a list of presets that are defined in the CONSTANTS.VIEWPORT_PRESETS like CT-Bone, CT-Lung, CT-Brain, etc.
  options: {
    values: CONSTANTS.VIEWPORT_PRESETS.map((preset) => preset.name),
    defaultValue: 'CT-Bone',
  },
  onSelectedValueChange: (presetName) => {
    viewport.setProperties({ preset: presetName });
    viewport.render();
  },
});

// ============================= //

let viewport;

/**
 * Runs the demo
 */
async function run() {
  // Init Cornerstone and related libraries
  await initDemo();

  const toolGroupId = 'TOOL_GROUP_ID';

  // Define a tool group, which defines how mouse events map to tool commands for
  // Any viewport using the group
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

  // Add the tools to the tool group and specify which volume they are pointing at
  addManipulationBindings(toolGroup, {
    is3DViewport: true,
  });

  // Get Cornerstone imageIds and fetch metadata into RAM
  const imageIds = await createImageIdsAndCacheMetaData({
    StudyInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7009.2403.871108593056125491804754960339',
    SeriesInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7009.2403.367700692008930469189923116409',
    wadoRsRoot: 'https://d14fa38qiwhyfd.cloudfront.net/dicomweb',
  });

  // Instantiate a rendering engine
  renderingEngine = new RenderingEngine(renderingEngineId);

  // Create the viewports

  const viewportInputArray = [
    {
      viewportId: viewportId,
      type: ViewportType.VOLUME_3D,
      element: element1,
      defaultOptions: {
        orientation: Enums.OrientationAxis.CORONAL,
        background: CONSTANTS.BACKGROUND_COLORS.slicer3D,
      },
    },
  ];

  renderingEngine.setViewports(viewportInputArray);

  // Set the tool group on the viewports
  toolGroup.addViewport(viewportId, renderingEngineId);

  // Define a volume in memory
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds,
  });

  // Set the volume to load
  volume.load();
  viewport = renderingEngine.getViewport(viewportId);

  await setVolumesForViewports(
    renderingEngine,
    [{ volumeId }],
    [viewportId]
  ).then(() => {
    viewport.setProperties({
      preset: 'CT-Bone',
    });
    viewport.render();
  });
}

run();

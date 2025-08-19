import type { Types } from '@cornerstonejs/core';
import {
  RenderingEngine,
  Enums,
  setVolumesForViewports,
  volumeLoader,
  getRenderingEngine,
  CONSTANTS,
} from '@cornerstonejs/core';
import {
  initDemo,
  createImageIdsAndCacheMetaData,
  setTitleAndDescription,
  setCtTransferFunctionForVolumeActor,
  addManipulationBindings,
  addButtonToToolbar,
  addDropdownToToolbar,
} from '../../../../utils/demo/helpers';
import * as cornerstoneTools from '@cornerstonejs/tools';

// This is for debugging purposes
console.warn(
  'Click on index.ts to open source code for this example --------->'
);

const {
  ToolGroupManager,
  Enums: csToolsEnums,
  CrosshairsTool,
  PanTool,
  ZoomTool,
  LengthTool,
  WindowLevelTool,
} = cornerstoneTools;

const { MouseBindings } = csToolsEnums;
const { ViewportType } = Enums;

// Define unique ids for the volume
const volumeName = 'CT_VOLUME_ID';
const volumeLoaderScheme = 'cornerstoneStreamingImageVolume';
const volumeId = `${volumeLoaderScheme}:${volumeName}`;
const renderingEngineId = 'myRenderingEngine';

// Viewport IDs
const viewportIdAxial = 'CT_AXIAL';
const viewportIdSagittal = 'CT_SAGITTAL';
const viewportIdCoronal = 'CT_CORONAL';
const viewportId3D = 'CT_3D';
const viewportIds = [viewportIdAxial, viewportIdSagittal, viewportIdCoronal, viewportId3D];

// Tool group IDs
const toolGroupIdMPR = 'MPR_TOOLGROUP_ID';
const toolGroupId3D = '3D_TOOLGROUP_ID';

// ======== Set up page ======== //
setTitleAndDescription(
  'MPR and 3D Rendering',
);

const content = document.getElementById('content');
const viewportGrid = document.createElement('div');

// Create 2x2 grid layout
viewportGrid.style.display = 'grid';
viewportGrid.style.gridTemplateColumns = '1fr 1fr';
viewportGrid.style.gridTemplateRows = '1fr 1fr';
viewportGrid.style.gap = '5px';
viewportGrid.style.width = '1000px';
viewportGrid.style.height = '1000px';

// Create 4 viewport elements
const elementAxial = document.createElement('div');
const elementSagittal = document.createElement('div');
const elementCoronal = document.createElement('div');
const element3D = document.createElement('div');

const size = '500px';
[elementAxial, elementSagittal, elementCoronal, element3D].forEach(element => {
  element.style.width = size;
  element.style.height = size;
  element.oncontextmenu = (e) => e.preventDefault();
});

// Add elements to grid
viewportGrid.appendChild(elementAxial);
viewportGrid.appendChild(elementSagittal);
viewportGrid.appendChild(elementCoronal);
viewportGrid.appendChild(element3D);

content.appendChild(viewportGrid);

// Add instructions
const instructions = document.createElement('p');
instructions.innerText = `
  🔴 MPR Viewports (3 views):
  - Axial (top-left), Sagittal (top-right), Coronal (bottom-left)
  - Default: Crosshairs tool for synchronized navigation
  - Use MPR tool buttons to switch: Pan, Zoom, Length measurement, Window/Level
  
  🧊 3D Viewport (Bottom right):
  - Click and drag to rotate 3D volume
  - Use preset dropdown for different rendering modes
  
  🎮 Controls:
  - Left Click: Active tool (Crosshairs, Pan, Zoom, Length, Window/Level)
  - Right Click: Pan (3D viewport)
  - Mouse Wheel: Zoom in/out
`;
content.appendChild(instructions);

// ============================= //

// Crosshair colors for each viewport
const viewportColors = {
  [viewportIdAxial]: 'rgb(200, 0, 0)',      // Red
  [viewportIdSagittal]: 'rgb(200, 200, 0)', // Yellow  
  [viewportIdCoronal]: 'rgb(0, 200, 0)',    // Green
};

// Crosshair configuration functions
function getReferenceLineColor(viewportId) {
  return viewportColors[viewportId];
}

function getReferenceLineControllable(viewportId) {
  return [viewportIdAxial, viewportIdSagittal, viewportIdCoronal].includes(viewportId);
}

function getReferenceLineDraggableRotatable(viewportId) {
  return [viewportIdAxial, viewportIdSagittal, viewportIdCoronal].includes(viewportId);
}

function getReferenceLineSlabThicknessControlsOn(viewportId) {
  return [viewportIdAxial, viewportIdSagittal, viewportIdCoronal].includes(viewportId);
}

// Add controls
addButtonToToolbar({
  title: 'Reset Camera',
  onClick: () => {
    const renderingEngine = getRenderingEngine(renderingEngineId);
    
    // Reset all viewports
    viewportIds.forEach(viewportId => {
      const viewport = renderingEngine.getViewport(viewportId);
      viewport.resetCamera();
      viewport.render();
    });
    
    console.log('All cameras reset');
  },
});


addButtonToToolbar({
  title: 'Random 3D Rotation',
  onClick: () => {
    const renderingEngine = getRenderingEngine(renderingEngineId);
    const viewport3D = renderingEngine.getViewport(viewportId3D) as Types.IVolumeViewport;
    
    const rotation = Math.random() * 360;
    viewport3D.setViewPresentation({rotation });
    viewport3D.render();
  },
});

// MPR

addButtonToToolbar({
  title: 'Length Measurement',
  onClick: () => {
    const toolGroup = ToolGroupManager.getToolGroup(toolGroupIdMPR);
    
    // Set length measurement as active tool
    toolGroup.setToolActive(LengthTool.toolName, {
      bindings: [{ mouseButton: MouseBindings.Primary }],
    });
    toolGroup.setToolPassive(CrosshairsTool.toolName);
    toolGroup.setToolPassive(PanTool.toolName);
    toolGroup.setToolPassive(ZoomTool.toolName);
    toolGroup.setToolPassive(WindowLevelTool.toolName);
    
    console.log('MPR Tool: Length measurement activated');
  },
});

addButtonToToolbar({
  title: 'Window/Level',
  onClick: () => {
    const toolGroup = ToolGroupManager.getToolGroup(toolGroupIdMPR);
    
    // Set window/level as active tool
    toolGroup.setToolActive(WindowLevelTool.toolName, {
      bindings: [{ mouseButton: MouseBindings.Primary }],
    });
    toolGroup.setToolPassive(CrosshairsTool.toolName);
    toolGroup.setToolPassive(PanTool.toolName);
    toolGroup.setToolPassive(ZoomTool.toolName);
    toolGroup.setToolPassive(LengthTool.toolName);
    
    console.log('MPR Tool: Window/Level activated');
  },
});


// 3D Preset dropdown
addDropdownToToolbar({
  options: {
    values: CONSTANTS.VIEWPORT_PRESETS.map((preset) => preset.name),
    defaultValue: 'CT-Bone',
  },
  onSelectedValueChange: (presetName) => {
    const renderingEngine = getRenderingEngine(renderingEngineId);
    const viewport3D = renderingEngine.getViewport(viewportId3D) as Types.IVolumeViewport;
    
    // Apply preset to 3D viewport
    viewport3D.setProperties({ preset: String(presetName) });
    
    // Force render all viewports after preset change
    renderingEngine.renderViewports([viewportId3D]);
    
    console.log(`Applied preset: ${presetName} to 3D viewport`);
  },
});

/**
 * Runs the demo
 */
async function run() {
  // Init Cornerstone and related libraries
  await initDemo();

  // Add tools to Cornerstone3D
  cornerstoneTools.addTool(CrosshairsTool);
  cornerstoneTools.addTool(PanTool);
  cornerstoneTools.addTool(ZoomTool);
  cornerstoneTools.addTool(LengthTool);
  cornerstoneTools.addTool(WindowLevelTool);

  // Get Cornerstone imageIds and fetch metadata into RAM
  const imageIds = await createImageIdsAndCacheMetaData({
    StudyInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
    SeriesInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
    wadoRsRoot: 'https://d14fa38qiwhyfd.cloudfront.net/dicomweb',
  });

  // Define a volume in memory
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds,
  });

  // Instantiate a rendering engine
  const renderingEngine = new RenderingEngine(renderingEngineId);

  // Create the viewports - 3 MPR + 1 3D
  const viewportInputArray = [
    {
      viewportId: viewportIdAxial,
      type: ViewportType.ORTHOGRAPHIC,
      element: elementAxial,
      defaultOptions: {
        orientation: Enums.OrientationAxis.AXIAL,
        background: <Types.Point3>[0, 0, 0],
      },
    },
    {
      viewportId: viewportIdSagittal,
      type: ViewportType.ORTHOGRAPHIC,
      element: elementSagittal,
      defaultOptions: {
        orientation: Enums.OrientationAxis.SAGITTAL,
        background: <Types.Point3>[0, 0, 0],
      },
    },
    {
      viewportId: viewportIdCoronal,
      type: ViewportType.ORTHOGRAPHIC,
      element: elementCoronal,
      defaultOptions: {
        orientation: Enums.OrientationAxis.CORONAL,
        background: <Types.Point3>[0, 0, 0],
      },
    },
    {
      viewportId: viewportId3D,
      type: ViewportType.VOLUME_3D,
      element: element3D,
      defaultOptions: {
        background: CONSTANTS.BACKGROUND_COLORS.slicer3D as Types.Point3,
      },
    },
  ];

  renderingEngine.setViewports(viewportInputArray);

  // Set the volume to load
  volume.load();

  console.log('Volume loaded, setting on viewports...');

  // Set volumes on the viewports - need different setup for 3D vs MPR
  await setVolumesForViewports(
    renderingEngine,
    [
      {
        volumeId,
        callback: setCtTransferFunctionForVolumeActor,
      },
    ],
    [viewportIdAxial, viewportIdSagittal, viewportIdCoronal] // MPR viewports first
  );

  // Set volume on 3D viewport separately (no transfer function callback for 3D)
  const viewport3DTemp = renderingEngine.getViewport(viewportId3D) as Types.IVolumeViewport;
  viewport3DTemp.setVolumes([{ volumeId }]);
  
  console.log('Volumes set on all viewports');

  // Create tool groups
  
  // MPR Tool Group (for crosshairs and manipulation)
  const toolGroupMPR = ToolGroupManager.createToolGroup(toolGroupIdMPR);
  addManipulationBindings(toolGroupMPR);

  // Add viewports to MPR tool group BEFORE setting tool active
  toolGroupMPR.addViewport(viewportIdAxial, renderingEngineId);
  toolGroupMPR.addViewport(viewportIdSagittal, renderingEngineId);
  toolGroupMPR.addViewport(viewportIdCoronal, renderingEngineId);

  // Add all MPR tools
  const isMobile = window.matchMedia('(any-pointer:coarse)').matches;

  // Crosshairs tool (primary navigation)
  toolGroupMPR.addTool(CrosshairsTool.toolName, {
    getReferenceLineColor,
    getReferenceLineControllable,
    getReferenceLineDraggableRotatable,
    getReferenceLineSlabThicknessControlsOn,
    mobile: {
      enabled: isMobile,
      opacity: 0.8,
      handleRadius: 9,
    },
  });

  // Add manipulation tools
  toolGroupMPR.addTool(PanTool.toolName);
  toolGroupMPR.addTool(ZoomTool.toolName);  
  toolGroupMPR.addTool(LengthTool.toolName);
  toolGroupMPR.addTool(WindowLevelTool.toolName);

  // Set default active tools
  toolGroupMPR.setToolActive(CrosshairsTool.toolName, {
    bindings: [{ mouseButton: MouseBindings.Primary }],
  });
  
  // Set other tools to passive initially
  toolGroupMPR.setToolPassive(PanTool.toolName);
  toolGroupMPR.setToolPassive(ZoomTool.toolName);
  toolGroupMPR.setToolPassive(LengthTool.toolName);
  toolGroupMPR.setToolPassive(WindowLevelTool.toolName);

  // 3D Tool Group (for 3D manipulation)
  const toolGroup3D = ToolGroupManager.createToolGroup(toolGroupId3D);
  addManipulationBindings(toolGroup3D, {
    is3DViewport: true,
  });

  // Add 3D viewport to 3D tool group
  toolGroup3D.addViewport(viewportId3D, renderingEngineId);

  // Set 3D preset after volume is loaded  
  const viewport3DFinal = renderingEngine.getViewport(viewportId3D) as Types.IVolumeViewport;
  
  // Wait a bit for volume to be fully loaded
  setTimeout(() => {
    viewport3DFinal.setProperties({
      preset: 'CT-Bone',
    });
    
    console.log('3D preset applied: CT-Bone');
    
    // Force render all viewports after everything is set up
    renderingEngine.renderViewports(viewportIds);
    
    console.log('All viewports rendered');
  }, 500);

  // Initial render
  renderingEngine.renderViewports(viewportIds);
}

run(); 
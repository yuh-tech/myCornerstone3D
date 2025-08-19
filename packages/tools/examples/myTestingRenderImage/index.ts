// 1. Display DICOM image
// 2. Add some tools to the viewport
// 3. Stack position
// Import lib
import type {Types} from '@cornerstonejs/core';
import {RenderingEngine, Enums, utilities, getRenderingEngine} from '@cornerstonejs/core' 
// Enums is used to get the viewport type like STACK, ORTHOGRAPHIC, etc.
// utilities is used to get the VOI range for the image
import {
    initDemo,
    createImageIdsAndCacheMetaData,
    setTitleAndDescription,
    addButtonToToolbar,
    addDropdownToToolbar,
    camera as cameraHelpers,
    ctVoiRange
} from '../../../../utils/demo/helpers';

const { ViewportType, Events } = Enums;

// define the rendering engine and viewport id first 
const renderingEngineId = 'myRenderingEngine';
const viewportId = 'CT_STACK';

// set up page UI
setTitleAndDescription (
    'My Testing DICOM Viewer',
    '1. Display DICOM image\n2. Add some tools to the viewport'
)

const content = document.getElementById('content');
const element = document.createElement('div');
element.id = 'cornerstone-element';
element.style.width = '500px';
element.style.height = '500px';

content.appendChild(element);

// create other UI elements
const info = document.createElement('div');
content.appendChild(info);

const rotationInfo = document.createElement('div');
info.appendChild(rotationInfo);

const flipHorizontalInfo = document.createElement('div');
info.appendChild(flipHorizontalInfo);

const flipVerticalInfo = document.createElement('div');
info.appendChild(flipVerticalInfo);


// add event listener to the element
element.addEventListener(Events.CAMERA_MODIFIED, (_) => {
    // Get the rendering engine
    const renderingEngine = getRenderingEngine(renderingEngineId);
  
    // Get the stack viewport
    const viewport = renderingEngine.getViewport(
      viewportId
    ) as Types.IStackViewport;
  
    if (!viewport) {
      return;
    }
  
    const { flipHorizontal, flipVertical } = viewport.getCamera();
    const { rotation } = viewport.getViewPresentation();
  
    rotationInfo.innerText = `Rotation: ${Math.round(rotation)}`;
    flipHorizontalInfo.innerText = `Flip horizontal: ${flipHorizontal}`;
    flipVerticalInfo.innerText = `Flip vertical: ${flipVertical}`;
  });


// add button to the toolbar
addButtonToToolbar(
    {
        title: 'Set Voi Range',
        onClick: () => {
            // Get the rendering engine
            const renderingEngine = getRenderingEngine(renderingEngineId);

            // Get the stack viewport
            const viewport = renderingEngine.getViewport(
                viewportId
            ) as Types.IStackViewport;

            // set a range to highligh the bones
            viewport.setProperties({
                voiRange: {upper: 2500, lower: -1500},
            })

            // render the image
            viewport.render();
        }, 
    }

)
addButtonToToolbar({
    title: 'Next Image',
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);
  
      // Get the stack viewport
      const viewport = renderingEngine.getViewport(
        viewportId
      ) as Types.IStackViewport;
  
      // Get the current index of the image displayed
      const currentImageIdIndex = viewport.getCurrentImageIdIndex();
  
      // Increment the index, clamping to the last image if necessary
      const numImages = viewport.getImageIds().length;
      let newImageIdIndex = currentImageIdIndex + 1;
  
      newImageIdIndex = Math.min(newImageIdIndex, numImages - 1);
  
      // Set the new image index, the viewport itself does a re-render
      viewport.setImageIdIndex(newImageIdIndex);
    },
  });
  
  addButtonToToolbar({
    title: 'Previous Image',
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);
  
      // Get the stack viewport
      const viewport = renderingEngine.getViewport(
        viewportId
      ) as Types.IStackViewport;
  
      // Get the current index of the image displayed
      const currentImageIdIndex = viewport.getCurrentImageIdIndex();
  
      // Increment the index, clamping to the first image if necessary
      let newImageIdIndex = currentImageIdIndex - 1;
  
      newImageIdIndex = Math.max(newImageIdIndex, 0);
  
      // Set the new image index, the viewport itself does a re-render
      viewport.setImageIdIndex(newImageIdIndex);
    },
  });
  
  addButtonToToolbar({
    title: 'Flip H',
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);
  
      // Get the stack viewport
      const viewport = renderingEngine.getViewport(
        viewportId
      ) as Types.IStackViewport;
  
      const { flipHorizontal } = viewport.getCamera();
      viewport.setCamera({ flipHorizontal: !flipHorizontal });
  
      viewport.render();
    },
  });
  
  addButtonToToolbar({
    title: 'Flip V',
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);
  
      // Get the stack viewport
      const viewport = renderingEngine.getViewport(viewportId);
  
      const { flipVertical } = viewport.getCamera();
  
      viewport.setCamera({ flipVertical: !flipVertical });
  
      viewport.render();
    },
  });
  
  addButtonToToolbar({
    title: 'Rotate Random',
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);
  
      // Get the stack viewport
      const viewport = renderingEngine.getViewport(viewportId);
  
      const rotation = Math.random() * 360;
  
      viewport.setViewPresentation({ rotation });
  
      viewport.render();
    },
  });
  
  addButtonToToolbar({
    title: 'Rotate Absolute 150',
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);
  
      // Get the stack viewport
      const viewport = renderingEngine.getViewport(viewportId);
  
      viewport.setViewPresentation({ rotation: 150 });
  
      viewport.render();
    },
  });
  
  addButtonToToolbar({
    title: 'Rotate Delta 30',
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);
  
      // Get the stack viewport
      const viewport = renderingEngine.getViewport(viewportId);
  
      const { rotation } = viewport.getViewPresentation();
      viewport.setViewPresentation({ rotation: rotation + 30 });
  
      viewport.render();
    },
  });
  
  addButtonToToolbar({
    title: 'Invert',
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);
  
      // Get the stack viewport
      const viewport = renderingEngine.getViewport(viewportId);
  
      const { invert } = viewport.getProperties();
      viewport.setProperties({ invert: !invert });
  
      viewport.render();
    },
  });
  
  addButtonToToolbar({
    title: 'Apply Random Zoom And Pan',
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);
  
      // Get the stack viewport
      const viewport = renderingEngine.getViewport(
        viewportId
      ) as Types.IStackViewport;
  
      // Reset the camera so that we can set some pan and zoom relative to the
      // defaults for this demo. Note that changes could be relative instead.
      viewport.resetCamera();
  
      // Get the current camera properties
      const camera = viewport.getCamera();
  
      const { parallelScale, position, focalPoint } =
        cameraHelpers.getRandomlyTranslatedAndZoomedCameraProperties(camera, 50);
  
      const newCamera = {
        parallelScale,
        position: position as Types.Point3,
        focalPoint: focalPoint as Types.Point3,
      };
  
      viewport.setCamera(newCamera);
      viewport.render();
    },
  });
  
  addButtonToToolbar({
    title: 'Apply Colormap',
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);
  
      // Get the stack viewport
      const viewport = renderingEngine.getViewport(viewportId);
  
      viewport.setProperties({ colormap: { name: 'hsv' } });
      viewport.render();
    },
  });
  
  addButtonToToolbar({
    title: 'Reset Viewport',
    onClick: () => {
      // Get the rendering engine
      const renderingEngine = getRenderingEngine(renderingEngineId);
  
      // Get the stack viewport
      const viewport = renderingEngine.getViewport(
        viewportId
      ) as Types.IStackViewport;
  
      // Resets the viewport's camera
      viewport.resetCamera();
      // Resets the viewport's properties
      viewport.resetProperties();
      viewport.render();
    },
  });

// render the image
async function run() {
    // init Cornerstone and related lib
    const config = (window as any).IS_TILED
    ? { core: { renderingEngineMode: 'tiled' } }
    : {};
  await initDemo(config);
  /*
  * initDemo is a helper function that initializes Cornerstone and related libraries.   
  * It sets up the environment for the demo, including the rendering engine, viewport, and other necessary components.
  */

  // Get cornerstone ImageIds and fetch metadata using the helper function
  // update the method for uploading the file to the server
  const imageIds = await createImageIdsAndCacheMetaData({
    StudyInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
    SeriesInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
    wadoRsRoot: 'https://d14fa38qiwhyfd.cloudfront.net/dicomweb', // this is the root url of the dicomweb server
  });
  

  // Create a rendering engine

  const renderingEngine = new RenderingEngine(renderingEngineId);
  // Create a stack viewport // this is the id of the viewport, it can be any string
  const viewportInput = {
    viewportId: viewportId,
    type: ViewportType.STACK, // this is the type of the viewport, it can be any viewport type (STACK, ORTHOGRAPHIC, etc.)
    element: element,
    defaultOptions: {
        background: [0, 0, 0] as Types.Point3, // black background
    }
  }

  renderingEngine.enableElement(viewportInput);

  // get stack viewport that was created
  const stackViewport = renderingEngine.getViewport(viewportId) as Types.IStackViewport

  // Define a stack contain a sigle image
  const stack = [imageIds[0], imageIds[1], imageIds[2]];

  // Set the stack viewport to display the image
  stackViewport.setStack(stack);

  // Set the VOI range for the stack viewport
  stackViewport.setProperties({voiRange: ctVoiRange});

  // render the image
  stackViewport.render();
}

run()
# MPR and 3D Rendering Example

A comprehensive example demonstrating **Multi-Planar Reconstruction (MPR)** and **3D Volume Rendering** in a unified 4-viewport layout.

## 🎯 Features

### 📐 **MPR (Multi-Planar Reconstruction)**
- **Axial View** (Top-left): Cross-sectional view from top
- **Sagittal View** (Top-right): Side view (left-right) 
- **Coronal View** (Bottom-left): Front view (anterior-posterior)
- **Synchronized Crosshairs**: Click and drag to navigate through all planes simultaneously
- **Individual Tools**: Pan, Zoom, Length measurement, Window/Level per viewport
- **Rotation Support**: Rotate all MPR views simultaneously
- **Professional Workflow**: Tool switching like clinical imaging software

### 🧊 **3D Volume Rendering** 
- **3D Viewport** (Bottom-right): Full 3D volume visualization
- **Interactive Rotation**: Click and drag to rotate the 3D volume
- **Preset Options**: Multiple rendering presets (CT-Bone, CT-Lung, etc.)

## 🖥️ **Layout**

```
┌─────────────────┬─────────────────┐
│   AXIAL (MPR)   │ SAGITTAL (MPR)  │
│    (Red)        │   (Yellow)      │
├─────────────────┼─────────────────┤
│ CORONAL (MPR)   │   3D VOLUME     │
│   (Green)       │   RENDERING     │
└─────────────────┴─────────────────┘
```

## 🚀 **How to Run**

```bash
# From cornerstone3D root directory
npm run example myTestingMPRAnd3D
```

## 🎮 **Controls**

### **MPR Viewports (Left 3 panels)**
- **Crosshairs Mode** (Default):
  - **Left Click + Drag**: Move crosshairs and synchronize views
  - **Crosshair Colors**: 🔴 Red (Axial), 🟡 Yellow (Sagittal), 🟢 Green (Coronal)
- **Pan Mode**: 
  - **Left Click + Drag**: Pan the image in selected viewport
- **Zoom Mode**:
  - **Left Click + Drag**: Zoom in/out in selected viewport
- **Length Measurement**:
  - **Left Click**: Start measurement
  - **Left Click**: End measurement (displays distance)
- **Window/Level Mode**:
  - **Left Click + Drag**: Adjust brightness/contrast
- **Mouse Wheel**: Zoom in/out (all modes)
- **Right Click + Drag**: Pan (all modes)

### **3D Viewport (Bottom-right)**
- **Left Click + Drag**: Rotate 3D volume
- **Right Click + Drag**: Pan
- **Mouse Wheel**: Zoom in/out

### **Toolbar Controls**

#### **General Controls**
- **Reset Camera**: Reset all viewports to default position

#### **MPR Tool Selection**
- **MPR: Crosshairs**: Activate crosshairs for synchronized navigation (default)
- **MPR: Pan**: Activate pan tool for individual viewport panning
- **MPR: Zoom**: Activate zoom tool for individual viewport zooming
- **MPR: Length**: Activate length measurement tool
- **MPR: Window/Level**: Activate window/level adjustment tool
- **MPR: Rotate All**: Apply random rotation to all 3 MPR viewports

#### **3D Controls**
- **Random 3D Rotation**: Apply random rotation to 3D viewport
- **Preset Dropdown**: Change 3D rendering preset (CT-Bone, CT-Lung, etc.)

## 💡 **Key Concepts**

### **MPR (Multi-Planar Reconstruction)**
- Shows **same volume** from different orientations
- **Crosshairs link** all 3 views - moving crosshair in one view updates others
- Essential for **surgical planning** and **diagnosis**

### **3D Volume Rendering**
- **Volume-based** rendering shows internal structures
- **Different presets** optimize for different tissues:
  - **CT-Bone**: Highlights skeletal structures
  - **CT-Lung**: Optimized for lung tissue
  - **CT-Brain**: Brain tissue visualization
  - **CT-Abdomen**: Abdominal organs

## 🛠️ **Technical Implementation**

### **Volume Management**
```typescript
// Single volume shared across all viewports
const volume = await volumeLoader.createAndCacheVolume(volumeId, { imageIds });

// Set same volume on all viewports
await setVolumesForViewports(renderingEngine, [{ volumeId }], viewportIds);
```

### **Tool Groups**
```typescript
// Separate tool groups for different functionality
const toolGroupMPR = ToolGroupManager.createToolGroup('MPR_TOOLGROUP_ID');  // Crosshairs
const toolGroup3D = ToolGroupManager.createToolGroup('3D_TOOLGROUP_ID');   // 3D manipulation
```

### **Viewport Types**
```typescript
// MPR viewports use ORTHOGRAPHIC
type: ViewportType.ORTHOGRAPHIC
orientation: Enums.OrientationAxis.AXIAL | SAGITTAL | CORONAL

// 3D viewport uses VOLUME_3D  
type: ViewportType.VOLUME_3D
```

## 🎓 **Educational Value**

This example demonstrates:

1. **Multi-viewport coordination** - how to sync multiple views with crosshairs
2. **Advanced tool management** - multiple tools per viewport with dynamic switching
3. **Volume sharing** - single dataset, multiple representations and interactions
4. **Professional MPR workflow** - crosshairs, pan, zoom, measurement, window/level
5. **3D integration** - combining 2D MPR navigation with 3D visualization
6. **User interaction patterns** - industry-standard medical imaging controls
7. **Tool state management** - activating/deactivating tools dynamically

## 📚 **Medical Applications**

### **Diagnostic Uses**
- **Radiological examination** from multiple angles
- **Pathology detection** in different planes
- **Anatomical structure analysis**

### **Surgical Planning**
- **Pre-operative planning** with 3D visualization
- **Navigation reference** during procedures
- **Patient education** with 3D models

### **Research & Education**
- **Medical training** with interactive 3D models
- **Research data analysis** from multiple perspectives
- **Case study presentations**

## 🔧 **Customization**

Extend this example by:

- Adding **measurement tools** across MPR views
- Implementing **volume cropping** in 3D
- Adding **annotation synchronization**
- Integrating **DICOM series comparison**
- Creating **custom rendering presets**

## 📖 **Related Examples**

- `myTestingCrosshair`: Pure MPR with crosshairs
- `myTesting3DRender`: Pure 3D volume rendering  
- `myTestingVolumeAPI`: Volume manipulation APIs

This example combines the best of both worlds: **precise MPR navigation** and **intuitive 3D visualization**! 🎯 
import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('cubes');
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [rotationZ, setRotationZ] = useState(0);
  const canvasRef = useRef(null);

  const generateRandomPerspective = () => {
    setRotationX(Math.random() * 360);
    setRotationY(Math.random() * 360);
    setRotationZ(Math.random() * 360);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Tab' || e.key === ' ') {
        e.preventDefault();
        generateRandomPerspective();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    drawPerspective();
  }, [activeTab, rotationX, rotationY, rotationZ]); // eslint-disable-line react-hooks/exhaustive-deps

  const drawPerspective = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with white background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Set up perspective
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 120;

    // Convert rotations to radians
    const radX = (rotationX * Math.PI) / 180;
    const radY = (rotationY * Math.PI) / 180;
    const radZ = (rotationZ * Math.PI) / 180;

    if (activeTab === 'cubes') {
      drawCube(ctx, centerX, centerY, scale, radX, radY, radZ);
    } else {
      drawCylinder(ctx, centerX, centerY, scale, radX, radY, radZ);
    }
  };

  const drawCube = (ctx, centerX, centerY, scale, radX, radY, radZ) => {
    // Define cube vertices
    const vertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], // back face
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]      // front face
    ];

    // Apply rotations
    const rotatedVertices = vertices.map(vertex => {
      let [x, y, z] = vertex;
      
      // Rotate around X axis
      const y1 = y * Math.cos(radX) - z * Math.sin(radX);
      const z1 = y * Math.sin(radX) + z * Math.cos(radX);
      
      // Rotate around Y axis
      const x2 = x * Math.cos(radY) + z1 * Math.sin(radY);
      const z2 = -x * Math.sin(radY) + z1 * Math.cos(radY);
      
      // Rotate around Z axis
      const x3 = x2 * Math.cos(radZ) - y1 * Math.sin(radZ);
      const y3 = x2 * Math.sin(radZ) + y1 * Math.cos(radZ);
      
      return [x3, y3, z2];
    });

    // Project to 2D
    const projectedVertices = rotatedVertices.map(vertex => {
      const [x, y, z] = vertex;
      const perspective = 1 / (1 + z * 0.3);
      return [
        centerX + x * scale * perspective,
        centerY + y * scale * perspective
      ];
    });

    // Define faces
    const faces = [
      [0, 1, 2, 3], // back
      [4, 5, 6, 7], // front
      [0, 1, 5, 4], // bottom
      [2, 3, 7, 6], // top
      [0, 3, 7, 4], // left
      [1, 2, 6, 5]  // right
    ];

    // Define edges (pairs of vertices)
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // back face
      [4, 5], [5, 6], [6, 7], [7, 4], // front face
      [0, 4], [1, 5], [2, 6], [3, 7]  // connecting edges
    ];

    // Draw edges individually with proper visibility
    edges.forEach(edge => {
      const [startIdx, endIdx] = edge;
      const start = projectedVertices[startIdx];
      const end = projectedVertices[endIdx];
      
      ctx.beginPath();
      ctx.moveTo(start[0], start[1]);
      ctx.lineTo(end[0], end[1]);
      
      // Clean line rendering
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });
  };

  const drawCylinder = (ctx, centerX, centerY, scale, radX, radY, radZ) => {
    const segments = 16;
    const radius = 0.8;
    const height = 1.6;

    // Generate cylinder vertices
    const vertices = [];
    
    // Bottom circle
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      vertices.push([Math.cos(angle) * radius, -height/2, Math.sin(angle) * radius]);
    }
    
    // Top circle
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      vertices.push([Math.cos(angle) * radius, height/2, Math.sin(angle) * radius]);
    }

    // Apply rotations
    const rotatedVertices = vertices.map(vertex => {
      let [x, y, z] = vertex;
      
      const y1 = y * Math.cos(radX) - z * Math.sin(radX);
      const z1 = y * Math.sin(radX) + z * Math.cos(radX);
      
      const x2 = x * Math.cos(radY) + z1 * Math.sin(radY);
      const z2 = -x * Math.sin(radY) + z1 * Math.cos(radY);
      
      const x3 = x2 * Math.cos(radZ) - y1 * Math.sin(radZ);
      const y3 = x2 * Math.sin(radZ) + y1 * Math.cos(radZ);
      
      return [x3, y3, z2];
    });

    // Project to 2D
    const projectedVertices = rotatedVertices.map(vertex => {
      const [x, y, z] = vertex;
      const perspective = 1 / (1 + z * 0.3);
      return [
        centerX + x * scale * perspective,
        centerY + y * scale * perspective
      ];
    });

    // Draw cylinder body
    for (let i = 0; i < segments; i++) {
      const next = (i + 1) % segments;
      const bottom1 = projectedVertices[i];
      const bottom2 = projectedVertices[next];
      const top1 = projectedVertices[i + segments];
      const top2 = projectedVertices[next + segments];

      // Draw side face with clean lines
      ctx.beginPath();
      ctx.moveTo(bottom1[0], bottom1[1]);
      ctx.lineTo(top1[0], top1[1]);
      ctx.lineTo(top2[0], top2[1]);
      ctx.lineTo(bottom2[0], bottom2[1]);
      ctx.closePath();
      
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    // Draw top and bottom faces
    ctx.beginPath();
    for (let i = 0; i < segments; i++) {
      const vertex = projectedVertices[i];
      if (i === 0) {
        ctx.moveTo(vertex[0], vertex[1]);
      } else {
        ctx.lineTo(vertex[0], vertex[1]);
      }
    }
    ctx.closePath();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < segments; i++) {
      const vertex = projectedVertices[i + segments];
      if (i === 0) {
        ctx.moveTo(vertex[0], vertex[1]);
      } else {
        ctx.lineTo(vertex[0], vertex[1]);
      }
    }
    ctx.closePath();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const calculateNormal = (vertices) => {
    const [v1, v2, v3] = vertices;
    const ux = v2[0] - v1[0];
    const uy = v2[1] - v1[1];
    const uz = v2[2] - v1[2];
    const vx = v3[0] - v1[0];
    const vy = v3[1] - v1[1];
    const vz = v3[2] - v1[2];
    
    return [uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx];
  };


  return (
    <div className="app">
      <header className="header">
        <h1>3D Reference</h1>
        <div className="tabs">
          <button 
            className={activeTab === 'cubes' ? 'active' : ''}
            onClick={() => setActiveTab('cubes')}
          >
            Cubes
          </button>
          <button 
            className={activeTab === 'cylinders' ? 'active' : ''}
            onClick={() => setActiveTab('cylinders')}
          >
            Cylinders
          </button>
        </div>
      </header>

      <div className="main-content">
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={700}
            height={500}
            className="perspective-canvas"
          />
        </div>
      </div>

      <div className="bottom-controls">
        <button className="random-btn" onClick={generateRandomPerspective}>
          🔀 Random Perspective
        </button>
        <p className="space-hint">Press Space for random perspective</p>
        <p className="credit">
          Built by <a href="https://maskmanlucifer.github.io/lucifer/" target="_blank" rel="noopener noreferrer">maskmanlucifer</a>
        </p>
      </div>
    </div>
  );
}

export default App;

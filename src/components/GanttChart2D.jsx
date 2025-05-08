// components/GanttChart2D.jsx
import React, { useRef, useEffect, useState } from "react";

const GanttChart2D = ({ scheduleData, isZoomed = false }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [contentHeight, setContentHeight] = useState(0);
  const animationRef = useRef(null);
  const currentTimeRef = useRef(0);

  useEffect(() => {
    if (!scheduleData || scheduleData.length === 0) return;

    // Determine canvas size from parent
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        // Set fixed height for visible area
        // The actual canvas height will be determined by content
        const visibleHeight = isZoomed 
          ? window.innerHeight * 0.8  // Taller when zoomed
          : Math.min(350, window.innerHeight * 0.5); // Reduced height when not zoomed
        
        setCanvasSize({ width: newWidth, height: visibleHeight });
        
        // Update canvas dimensions
        if (canvasRef.current) {
          canvasRef.current.width = newWidth; // Removed padding subtraction
        }
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scheduleData, isZoomed]);

  useEffect(() => {
    if (!scheduleData || scheduleData.length === 0 || !canvasRef.current || !containerRef.current) return;
    if (canvasSize.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Process colors with a better palette
    const baseColors = [
      '#3498db', // Blue
      '#2ecc71', // Green
      '#e74c3c', // Red
      '#f1c40f', // Yellow
      '#9b59b6', // Purple
      '#e67e22', // Orange
      '#1abc9c', // Turquoise
      '#d35400', // Dark Orange
    ];

    // Group by processId
    const processGroups = {};
    scheduleData.forEach(process => {
      if (!processGroups[process.processId]) {
        processGroups[process.processId] = [];
      }
      processGroups[process.processId].push(process);
    });

    // Find max time for animation loop
    const maxTime = Math.max(...scheduleData.map(item => item.startTime + item.duration));
    
    // Sort process IDs for consistent rendering
    const processIds = Object.keys(processGroups).sort((a, b) => parseInt(a) - parseInt(b));
    
    // Calculate layout dimensions
    const paddingX = 20; // Reduced padding further
    const paddingTop = 40;
    const labelWidth = 40; // Adjusted for better visibility
    const rowHeight = 35;
    const timelineHeight = 30;
    
    // Calculate scale factor to fit everything on screen
    const availableWidth = canvasSize.width - labelWidth - paddingX * 2;
    const timeScale = availableWidth / (maxTime + 1);
    
    // Calculate total height needed for all processes
    const totalContentHeight = (processIds.length * rowHeight) + timelineHeight + paddingTop * 2;
    setContentHeight(totalContentHeight);
    
    // Set canvas height to match content height
    canvas.height = totalContentHeight;
    
    // Define drawing functions
    const drawTimeline = (currentTime) => {
      ctx.save();
      
      // Draw time axis
      ctx.strokeStyle = '#34495e';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const xStart = labelWidth + paddingX;
      ctx.moveTo(xStart, paddingTop + timelineHeight);
      ctx.lineTo(xStart + timeScale * (maxTime + 1), paddingTop + timelineHeight);
      ctx.stroke();
      
      // Draw time markers
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = '10px Arial';
      ctx.fillStyle = '#34495e';

      // Calculate time interval dynamically based on maxTime and available width
      const minInterval = Math.ceil(maxTime / 10);
      const timeInterval = Math.max(1, minInterval);

      for (let i = 0; i <= Math.ceil(maxTime); i += timeInterval) {
        const x = xStart + i * timeScale;
        
        // Draw tick
        ctx.beginPath();
        ctx.moveTo(x, paddingTop + timelineHeight - 3);
        ctx.lineTo(x, paddingTop + timelineHeight);
        ctx.stroke();
        
        // Draw time label
        ctx.fillText(i.toString(), x, paddingTop + timelineHeight - 5);
      }
      
      // Draw current time indicator
      if (currentTime >= 0) {
        const indicatorX = xStart + currentTime * timeScale;
        
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(indicatorX, paddingTop);
        ctx.lineTo(indicatorX, totalContentHeight - paddingTop);
        ctx.stroke();
        
        // Draw pulsing circle at top
        const pulseSize = 4 + Math.sin(Date.now() * 0.005) * 2;
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(indicatorX, paddingTop, pulseSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw current time label
        ctx.fillStyle = 'rgba(231, 76, 60, 0.9)';
        ctx.fillRect(indicatorX - 20, paddingTop - 25, 40, 20);
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'middle';
        ctx.fillText(currentTime.toFixed(1), indicatorX, paddingTop - 15);
      }
      
      ctx.restore();
    };
    
    const drawProcessRows = () => {
      ctx.save();
      processIds.forEach((processId, index) => {
        const y = paddingTop + timelineHeight + index * rowHeight;
        ctx.fillStyle = index % 2 === 0 ? '#f8f9fa' : '#ecf0f2';
        ctx.fillRect(labelWidth + paddingX, y, timeScale * (maxTime + 1), rowHeight);
        ctx.fillStyle = '#2c3e50';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(
          `P${processId}`,
          labelWidth / 2,
          y + rowHeight / 2
        );
      });
      ctx.restore();
    };
    
    const drawProcessBlocks = (currentTime) => {
      ctx.save();
      
      processIds.forEach((processId, rowIndex) => {
        const processItems = processGroups[processId];
        const colorIndex = rowIndex % baseColors.length;
        const baseColor = baseColors[colorIndex];
        const activeColor = baseColor;
        const doneColor = baseColor;
        const y = paddingTop + timelineHeight + rowIndex * rowHeight;
        
        processItems.forEach(item => {
          const startTime = item.startTime;
          const duration = item.duration;
          const endTime = startTime + duration;
          
          // Block position and dimensions
          const blockX = labelWidth + paddingX + startTime * timeScale;
          const blockY = y + 4;
          const blockHeight = rowHeight - 8;
          
          if (currentTime < startTime) {
            // Not started yet
          } else if (currentTime >= startTime && currentTime < endTime) {
            // Currently active
            const progress = (currentTime - startTime) / duration;
            const blockWidth = progress * duration * timeScale;
            
            // Draw partial block
            ctx.fillStyle = activeColor;
            ctx.fillRect(blockX, blockY, blockWidth, blockHeight);
            
            // Draw progress border
            ctx.strokeStyle = '#2c3e50';
            ctx.lineWidth = 2;
            ctx.strokeRect(blockX, blockY, blockWidth, blockHeight);
            
            // Add glow effect
            ctx.shadowColor = baseColor;
            ctx.shadowBlur = 6;
            ctx.strokeRect(blockX, blockY, blockWidth, blockHeight);
            ctx.shadowBlur = 0;
            
            // Add time label if there's enough space
            if (blockWidth > 30) {
              ctx.fillStyle = 'white';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.font = '10px Arial';
              ctx.fillText(startTime.toFixed(1), blockX + blockWidth / 2, blockY + blockHeight / 2);
            }
          } else if (currentTime >= endTime) {
            // Completed
            const blockWidth = duration * timeScale;
            
            // Draw complete block
            ctx.fillStyle = doneColor;
            ctx.fillRect(blockX, blockY, blockWidth, blockHeight);
            
            // Draw border
            ctx.strokeStyle = '#2c3e50';
            ctx.lineWidth = 1;
            ctx.strokeRect(blockX, blockY, blockWidth, blockHeight);
            
            // Add time label if there's enough space
            if (blockWidth > 30) {
              ctx.fillStyle = 'white';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.font = '10px Arial';
              ctx.fillText(`${startTime.toFixed(1)} → ${endTime.toFixed(1)}`, 
                blockX + blockWidth / 2, blockY + blockHeight / 2);
            }
          }
        });
      });
      
      ctx.restore();
    };
    
    // Animation loop
    const animate = () => {
      if (!canvasRef.current) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw static elements
      drawProcessRows();
      
      // Update animation state
      if (isPlaying) {
        currentTimeRef.current += 0.02 * speed;
        
        // Loop animation when reaching end or beginning
        if (currentTimeRef.current > maxTime + 1) {
          currentTimeRef.current = 0;
        }
      }
      
      // Draw dynamic elements
      drawTimeline(currentTimeRef.current);
      drawProcessBlocks(currentTimeRef.current);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Clean up
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scheduleData, canvasSize, isPlaying, speed]);
  
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };
  
  const stopAnimation = () => {
    setIsPlaying(false);
    if (scheduleData && scheduleData.length > 0) {
      const maxTime = Math.max(...scheduleData.map(item => item.startTime + item.duration));
      currentTimeRef.current = maxTime + 1;
    }
  };
  
  const increaseSpeed = () => {
    setSpeed(prev => Math.min(10, prev + 0.5));
  };
  
  const decreaseSpeed = () => {
    setSpeed(prev => Math.max(0.5, prev - 0.5));
  };

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {/* Scrollable Container - removed horizontal scroll */}
      <div 
        className="w-full overflow-y-auto rounded" // Changed to overflow-y-auto only
        style={{ 
          height: canvasSize.height, 
          maxHeight: canvasSize.height,
          overflowX: 'hidden' // Explicitly hide horizontal scroll
        }}
      >
        <canvas ref={canvasRef} />
      </div>
      
      {/* Controls overlaid on top */}
      <div className="absolute top-2 left-2 flex items-center space-x-2 z-10">
        <button
          onClick={togglePlayPause}
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow text-xs"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={stopAnimation}
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow text-xs"
        >
          Stop Animation
        </button>
      </div>
      
      <div className="absolute bottom-2 right-2 flex items-center bg-white p-1 rounded shadow z-10 text-xs">
        <span className="mr-1">Speed:</span>
        <button
          onClick={decreaseSpeed}
          className="bg-gray-200 hover:bg-gray-300 px-1.5 py-0.5 rounded-l"
        >
          -
        </button>
        <span className="px-1">{speed}x</span>
        <button
          onClick={increaseSpeed}
          className="bg-gray-200 hover:bg-gray-300 px-1.5 py-0.5 rounded-r"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default GanttChart2D;
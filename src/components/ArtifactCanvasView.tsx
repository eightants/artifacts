"use client";
import { useState, useCallback, memo, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import { Artifact } from "src/types";

interface ArtifactCanvasViewProps {
  artifactName: string;
  description?: string;
  size?: number;
  artifacts: Artifact[];
  totalArtifacts: number;
}

interface Position {
  id: string;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
}

// Memoized draggable item component
const DraggableItem = memo(
  ({
    artifact,
    position,
    artifactName,
    containerSize,
    onDrag,
  }: {
    artifact: Artifact;
    position: Position;
    artifactName: string;
    containerSize: { width: number; height: number };
    onDrag: (id: string, x: number, y: number) => void;
  }) => {
    // Convert relative positions (0-1) to actual pixels
    const x = position.x * (containerSize.width - 200); // Subtract image width + padding
    const y = position.y * (containerSize.height - 200); // Subtract image height + padding

    return (
      <Draggable
        key={artifact.id}
        defaultPosition={{ x, y }}
        onDrag={(e, data) => {
          // Convert pixel positions back to relative (0-1)
          const relX = data.x / (containerSize.width - 200);
          const relY = data.y / (containerSize.height - 200);
          onDrag(artifact.id, relX, relY);
        }}
        bounds="parent"
        scale={1}
        position={undefined}
      >
        <div
          className="absolute cursor-move"
          style={{
            transform: `rotate(${position.rotation}deg)`,
            zIndex: position.zIndex,
            willChange: "transform",
          }}
        >
          <div className="p-3 rounded-xl">
            <img
              src={`/${artifactName}/output_compressed/${artifact.images.front}`}
              alt={artifact.title}
              className="w-[150px] h-[150px] object-contain rounded-lg drop-shadow-[5px_5px_5px_#222]"
              draggable={false}
            />
          </div>
        </div>
      </Draggable>
    );
  }
);

DraggableItem.displayName = "DraggableItem";

export function ArtifactCanvasView({
  artifacts,
  artifactName,
  totalArtifacts,
}: ArtifactCanvasViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Use totalArtifacts for height calculation instead of filtered artifacts
  const minHeight = Math.ceil(totalArtifacts / 15) * 100 + 100;

  // Initialize positions with relative coordinates (0-1)
  const [positions, setPositions] = useState<Position[]>(() =>
    artifacts.map((artifact) => ({
      id: artifact.id,
      // Create a more chaotic, overlapping layout
      x: Math.random() * 0.9 + 0.05, // Keep slightly away from edges (5% - 95%)
      y: Math.random() * 0.9 + 0.05,
      rotation: Math.random() * 40 - 20, // More rotation variation (-20° to +20°)
      zIndex: Math.floor(Math.random() * 100), // Random initial z-index
    }))
  );

  // Update container size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width,
          height: Math.max(rect.height, minHeight),
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [minHeight]);

  const handleDrag = useCallback((id: string, x: number, y: number) => {
    setPositions((prevPositions) => {
      const maxZ = Math.max(...prevPositions.map((p) => p.zIndex));
      return prevPositions.map((pos) =>
        pos.id === id
          ? {
              ...pos,
              x: Math.max(0, Math.min(1, x)), // Clamp between 0 and 1
              y: Math.max(0, Math.min(1, y)), // Clamp between 0 and 1
              zIndex: maxZ + 1,
            }
          : pos
      );
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-primaryText/[0.03] border border-border rounded-xl"
      style={{ minHeight: `${minHeight}px` }}
    >
      <div className="opacity-40 absolute inset-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] bg-repeat"></div>
      <div className="absolute inset-0 p-1 z-10">
        {containerSize.width > 0 &&
          artifacts.map((artifact) => {
            const position = positions.find((p) => p.id === artifact.id);
            if (!position) return null;

            return (
              <DraggableItem
                key={artifact.id}
                artifact={artifact}
                position={position}
                artifactName={artifactName}
                containerSize={containerSize}
                onDrag={handleDrag}
              />
            );
          })}
      </div>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";

const ShapeBlur = dynamic(() => import("./ShapeBlur"), { ssr: false });

export default function HomeShapeBlurAmbient() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-[12] opacity-[0.14]"
      aria-hidden
    >
      <ShapeBlur
        variation={0}
        shapeSize={1}
        roundness={0.5}
        borderSize={0.05}
        circleSize={0.25}
        circleEdge={1}
      />
    </div>
  );
}

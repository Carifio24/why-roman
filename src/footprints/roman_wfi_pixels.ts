import { PolyLine } from "@wwtelescope/engine";

import type { Point } from "./types";
import { corners as romanWFICorners } from "./roman_wfi_footprint";

const chip = romanWFICorners[0];
const PIXEL_SIZE_ARCSEC = 0.11;
const PIXEL_SIZE_DEG = PIXEL_SIZE_ARCSEC / 3600;


const left = 0.5 * (chip[0][0] + chip[1][0]);
const top = 0.5 * (chip[0][1] + chip[3][1]);
const right = 0.5 * (chip[2][0] + chip[3][0]);
const bottom = 0.5 * (chip[1][1] + chip[2][1]);

// 0.05 is the footprint's offset in the viewer
const gridSize = 3;
// const fromLeft = Math.round((right - 0.05) / PIXEL_SIZE_DEG);
// const fromTop = Math.round(top / PIXEL_SIZE_DEG);
const fromTop = 100;
const fromLeft = 1500;
console.log(fromLeft, fromTop);

const gridLeft = left + fromLeft * PIXEL_SIZE_DEG;
const gridTop = top - fromTop * PIXEL_SIZE_DEG;
const gridRight = gridLeft + gridSize * PIXEL_SIZE_DEG;
const gridBottom = gridTop - gridSize * PIXEL_SIZE_DEG;
console.log(gridLeft, gridTop);

function createPixelGridLines() {
  const lines: PolyLine[] = [];
  for (let i = 0; i <=gridSize; i++) {
    const verticalLineX = gridLeft + i * PIXEL_SIZE_DEG;
    const verticalLine = new PolyLine();
    verticalLine.addPoint(verticalLineX, gridTop);
    verticalLine.addPoint(verticalLineX, gridBottom);
    lines.push(verticalLine);
  
    const horizontalLineY = gridTop + i * PIXEL_SIZE_DEG;
    const horizontalLine = new PolyLine();
    horizontalLine.addPoint(gridLeft, horizontalLineY);
    horizontalLine.addPoint(gridRight, horizontalLineY);
    lines.push(horizontalLine);
  }
}

export const corners: Point[][] = [];
for (let i = 0; i < gridSize; i++) {
  const pixelLeft = gridLeft + i * PIXEL_SIZE_DEG;
  const pixelRight = pixelLeft + PIXEL_SIZE_DEG;
  for (let j = 0; j < gridSize; j++) {
    const pixelTop = gridTop - j * PIXEL_SIZE_DEG;
    const pixelBottom = pixelTop - PIXEL_SIZE_DEG;
    corners.push([
      [pixelLeft, pixelTop],
      [pixelLeft, pixelBottom],
      [pixelRight, pixelBottom],
      [pixelRight, pixelTop],
    ]);
  }
}

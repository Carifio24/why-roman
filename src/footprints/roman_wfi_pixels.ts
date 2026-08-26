import { PolyLine } from "@wwtelescope/engine";

import type { Point } from "./types";
import { corners as romanWFICorners } from "./roman_wfi_footprint";

let chip = romanWFICorners[0];
chip = chip.map(pt => [pt[0] - 0.05, pt[1]]);
const PIXEL_SIZE_ARCSEC = 0.11;
const PIXEL_SIZE_DEG = 10 * PIXEL_SIZE_ARCSEC / 3600;
const GRID_SIZE = 4;  // 4 x 4 grid
const HALF_GRID_SIZE = 0.5 * GRID_SIZE;

// We've shifted the footprint to the right by 0.05 deg
// so the center is at RA=0.05 deg, Dec=0 deg
// We want to find the pixel that contains this point

const left = 0.5 * (chip[0][0] + chip[1][0]);
const top = 0.5 * (chip[0][1] + chip[3][1]);

const fromLeft = Math.floor(-left / PIXEL_SIZE_DEG);
const fromTop = Math.floor(top / PIXEL_SIZE_DEG) + 1;
console.log(fromLeft, fromTop);

const gridLeft = left + (fromLeft - HALF_GRID_SIZE) * PIXEL_SIZE_DEG;
const gridTop = top - (fromTop - HALF_GRID_SIZE) * PIXEL_SIZE_DEG;
const gridRight = gridLeft + GRID_SIZE * PIXEL_SIZE_DEG;
const gridBottom = gridTop - GRID_SIZE * PIXEL_SIZE_DEG;
console.log(gridLeft, gridTop);

function createPixelGridLines() {
  const lines: PolyLine[] = [];
  for (let i = 0; i <= GRID_SIZE; i++) {
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
for (let i = 0; i < GRID_SIZE; i++) {
  const pixelLeft = gridLeft + i * PIXEL_SIZE_DEG;
  const pixelRight = pixelLeft + PIXEL_SIZE_DEG;
  for (let j = 0; j < GRID_SIZE; j++) {
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

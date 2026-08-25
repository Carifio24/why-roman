import { Color, Coordinates, Dates, Matrix3d, RenderContext, SimpleLineList, TriangleList, Vector3d, WWTControl } from "@wwtelescope/engine";
import { flat } from "./utils";
import { executeWithTransforms } from "./display";

import { Point } from "./footprints/types";
import earcut, {refine} from 'earcut';
import { D2R } from "@cosmicds/vue-toolkit";


function samePoint(p1: Point, p2: Point): boolean {
  return p1[0] === p2[0] && p1[1] === p2[1];
}

function getScreenPoints(wwt: WWTControl, worldPts: Point[]): Point[] {
  return worldPts.map(pt => {
    
    const screen = wwt.getScreenPointForCoordinates(pt[0] / 15, pt[1]);
    return [screen.x, screen.y];
  });


function shiftCorners(corners: Point[][], offsetXDeg: number = 0, offsetYDeg: number = 0): Point[][] {
  return corners.map(corner => corner.map(pair => [pair[0] - offsetXDeg, pair[1] - offsetYDeg]));
}

// NB: Clip space is the space [-1, 1]^2
function convertScreenPointsToClip(renderContext: RenderContext, screenPts: Point[][]): Point[][] {
  const width = renderContext.width;
  const height = renderContext.height;
  const slopeH = 2 / width;
  const interceptH = -1;
  // I don't know why this needed to be switched slopeV needs the negative and not the intercept
  const slopeV = -2 / height;
  const interceptV = 1;
  const transform = (point: Point): Point => [point[0] * slopeH + interceptH, point[1] * slopeV + interceptV];
  return screenPts.map(box => box.map(transform));
}

interface DrawFootprintOptions {
  id: string;
  footprint: Point[][];
  color: Color;
  fill: boolean;
  fillOpacity: number;
  offsetXDeg?: number;
  offsetYDeg?: number;
  show?: boolean;
  opacity?: number;
  linewidth?: number;
}


const positionShiftedFootprints: Map<string, Point[][]> = new Map<string, Point[][]>();
const delaunayCache: Map<string, number[]> = new Map<string, number[]>();


// earcut needs to not straddle 0/360.
// since we only get indices out, we can just shift 
// the RA values so that even -360 ends up positive, no neeed to shift back. 
export function skyEarcut(ring: Point[]): number[] {
  const ref = ring[0][0];
  const coords = flat(ring.map(([ra, dec]) => [((ra - ref + 540) % 360), dec]));
  const triangles = earcut(coords);
  refine(triangles, coords);
  return triangles;
}

// Returns a flat list of indices into `vertices`, 3 per triangle.
export function getDelaunay(vertices: Point[], id: string): number[] {
  const cached = delaunayCache.get(id);
  if (cached) {
    return cached;
  }
  const triangles = skyEarcut(vertices); // returns flat list of triangle indices (from original list)
  delaunayCache.set(id, triangles);
  return triangles;
}


function perpendicularOffsetVector(v1: Vector3d, v2: Vector3d, delta: number, lengthen: number = 0): [Vector3d, Vector3d] {
  const f = Vector3d.create(v2.x - v1.x, v2.y - v1.y, 0);
  const norm = Math.sqrt(f.x * f.x + f.y * f.y);
  const fhat = Vector3d.create(f.x / norm, f.y / norm, 0);
  const perp = Vector3d.create(-fhat.y, fhat.x, 0);
  const offset = Vector3d.create(perp.x * delta, perp.y * delta, 0);
  if (lengthen !== 0) {
    const parallelOff = Vector3d.create(fhat.x * lengthen / 2, fhat.y * lengthen / 2, 0);
    offset.x += parallelOff.x;
    offset.y += parallelOff.y;
    return [Vector3d.create(v1.x + offset.x - parallelOff.x, v1.y + offset.y - parallelOff.y, 0), Vector3d.create(v2.x + offset.x + parallelOff.x, v2.y + offset.y + parallelOff.y, 0)];
  }
  return [Vector3d.create(v1.x + offset.x, v1.y + offset.y, 0), Vector3d.create(v2.x + offset.x, v2.y + offset.y, 0)];
}

function addLineWidth(footprint: SimpleLineList, v1: Vector3d, v2: Vector3d, onePix: number, pxWidth: number) {
  const halfWidth = Math.floor(pxWidth / 2);
  for (let i = 1; i <= halfWidth; i++) {
    const perpsPlus = perpendicularOffsetVector(v1, v2, onePix * i, halfWidth * onePix);  // lengthen the vector so corners match. assumes nearly right angle joins -_-
    const perpsMinus = perpendicularOffsetVector(v1, v2, -onePix * i, halfWidth * onePix); 
    footprint.addLine(...perpsPlus);
    footprint.addLine(...perpsMinus);
  }
}

export function drawFootprint(wwt: WWTControl, options: DrawFootprintOptions) {
  if (options.show === false) {
    return;
  }
  const footprint = new SimpleLineList();
  footprint.pure2D = true;
  footprint.set_depthBuffered(true);

  let positionedShiftedCorners: Point[][];
  if (positionShiftedFootprints.has(options.id)) {
    positionedShiftedCorners = positionShiftedFootprints.get(options.id)!;
  } else {
    positionedShiftedCorners = shiftCorners(
      options.footprint,
      options.offsetXDeg ?? 0,
      options.offsetYDeg ?? 0
    );
    positionShiftedFootprints.set(options.id, positionedShiftedCorners);
  }

  const renderContext = wwt.renderContext;
  let onePixSquare = [] as Point[][];
  const worldZeros = Matrix3d.rotationYawPitchRoll(90 * D2R, 0, 0);
  const currentWorld = renderContext.get_world().clone();
  currentWorld.invert();
  const viewZeros = Matrix3d.lookAtLH(
    Vector3d.create(0, 0, 0),
    Vector3d.create(0, 0, -1), 
    Vector3d.create(0, 1, 0)
  );
  const currentView = renderContext.get_view().clone();
  currentView.invert();

  const zeroTransforms = {
    world: Matrix3d.multiplyMatrix(worldZeros, currentWorld),
    view: Matrix3d.multiplyMatrix(viewZeros, currentView),
  };

  const getOnePxSquare = (rc: RenderContext) => {
    onePixSquare = convertScreenPointsToClip(rc, [[[0, 0], [1, 1]]]);
  };
  executeWithTransforms(renderContext, getOnePxSquare, zeroTransforms);
  const onePix = [Math.abs(onePixSquare[0][0][0] - onePixSquare[0][1][0]), Math.abs(onePixSquare[0][0][1] - onePixSquare[0][1][1])];

  const triangles = new TriangleList(); // TriangleList should support pure2D. 
  triangles.pure2D = true;
  triangles.depthBuffered = false; // false, otherwise only the first draw is visible.
  const date = new Dates(0, 1);

  // Since the line width has been added I think it makes sense to keep doing things in screen points
  const draw = (_rc: RenderContext) => {

    const screenPoints = positionedShiftedCorners.map(box => getScreenPoints(wwt, box));
    const clipPoints = convertScreenPointsToClip(renderContext, screenPoints);

    clipPoints.forEach((box, index) => {
      const vectors = box.map(pt => Vector3d.create(...pt, 0));
      for (let i = 0; i < box.length - 1; i++) {
        footprint.addLine(vectors[i], vectors[i+1]);
        if (options.linewidth && options.linewidth > 1) {
          addLineWidth(footprint, vectors[i], vectors[i+1], onePix[0], options.linewidth);
        }
      }
      footprint.addLine(vectors[box.length - 1], vectors[0]);
      if (options.linewidth && options.linewidth > 1) {
        addLineWidth(footprint, vectors[box.length - 1], vectors[0], onePix[0], options.linewidth);
      }
      

      if (options.fill) {
        const triangleColor = Color.fromArgb(Math.round(options.fillOpacity * (options.opacity ?? 1) * 255), options.color.r, options.color.g, options.color.b);
        // if the box is actually just a box use the original method
        if (vectors.length === 4) {
          triangles.addTriangle(vectors[0], vectors[1], vectors[2], triangleColor, date);
          triangles.addTriangle(vectors[2], vectors[3], vectors[0], triangleColor, date);
        } 
        if (vectors.length > 4) {
          const triangleIndices = getDelaunay(options.footprint[index], `${options.id}:${index}`);
          // count up the triangles. just a list of indices in order
          for (let i = 0; i < triangleIndices.length; i += 3) {
            triangles.addTriangle(
              vectors[triangleIndices[i]],
              vectors[triangleIndices[i + 1]],
              vectors[triangleIndices[i + 2]],
              triangleColor,
              date
            );
          }
          
        }
        
      }
    });

    const opacity = options.opacity ?? 1;
    footprint.drawLines(wwt.renderContext, opacity, options.color);
  
    if (options.fill) {
      triangles.draw(wwt.renderContext, 1, true);
    }
  };

  executeWithTransforms(renderContext, draw, zeroTransforms);
}



const outlineCache: Map<string, SimpleLineList> = new Map<string, SimpleLineList>();
/*
 If we try to draw large outlines that same was as we were with the free-floating 
 outlines, then when a line list was directly behind the camera, it would end up getting
 drawn as straight lines stretching accross the view. This doesn't happen with Constellations, 
 so I use the same drawing steps as from Constellations._drawSingleConstellation
 
 Constellations
 - use raDecTo3D for the positions. 
 - SimpleLineList
 - set_depthBuffered(false)
 - no pure2D = true << pure2D does not use the world matrix, when false it does!
 - add the point directly to the line. 
 
 footprint ra and dec should both be in degrees
*/
function getOutline(id: string, footprint: Point[][]): SimpleLineList {
  // From Constellations._drawSingleConstellation
  const cached = outlineCache.get(id);
  if (cached) {
    return cached;
  }

  const lineList = new SimpleLineList();
  lineList.set_depthBuffered(false);

  footprint.forEach(shape => {
    const vecs = shape.map(pt => Coordinates.raDecTo3d(pt[0] / 15, pt[1])); // takes RA hours
    for (let i = 0; i < vecs.length - 1; i++) {
      lineList.addLine(vecs[i], vecs[i + 1]);
    }
    if (!samePoint(shape[0], shape[shape.length - 1])) {
      lineList.addLine(vecs[vecs.length - 1], vecs[0]);
    }
  });

  outlineCache.set(id, lineList);
  return lineList;
}



export function drawStaticFootprint(wwt: WWTControl, options: DrawFootprintOptions) {
  if (options.show === false) {
    return;
  }

  const footprint = getOutline(options.id, options.footprint);
  footprint.drawLines(wwt.renderContext, options.opacity ?? 1, options.color);

  if (options.fill) {
    const fill = new TriangleList();
    fill.depthBuffered = false;
    const date = new Dates(0, 1);

    const triangleColor = Color.fromArgb(Math.round(options.fillOpacity * (options.opacity ?? 1) * 255), options.color.r, options.color.g, options.color.b);
    options.footprint.forEach((shape, index) => {
      const vecs = shape.map(pt => Coordinates.raDecTo3d(pt[0] / 15, pt[1])); // takes RA hours

      // cached per polygon, not per footprint. the id alone would hand every
      // ring the first ring's triangulation
      const triangleIndices = getDelaunay(shape, `${options.id}:${index}`);
      for (let i = 0; i < triangleIndices.length; i += 3) {
        fill.addTriangle(
          vecs[triangleIndices[i]],
          vecs[triangleIndices[i + 1]],
          vecs[triangleIndices[i + 2]],
          triangleColor,
          date
        );
      }
    });

    fill.draw(wwt.renderContext, 1, true);
  }
}

/* eslint-disable */

import { Color, Coordinates, Dates, RenderContext, Settings, SimpleLineList, SpaceTimeController, TriangleList, Vector3d, WWTControl } from "@wwtelescope/engine";
import { horizontalToEquatorial, flat } from "./utils";
import { D2H, H2D, D2R } from "@wwtelescope/astro";
import { TriangleList2D } from "./wwt-hacks";

import { Point } from "./footprints/types";
import earcut, {flatten, deviation, refine} from 'earcut';

function samePoint(p1: Point, p2: Point): boolean {
  return p1[0] === p2[0] && p1[1] === p2[1];
}

function shiftCorners(corners: Point[][], offsetXDeg: number = 0, offsetYDeg: number = 0): Point[][] {
  const nPoints = corners.reduce((currVal, corner) => currVal + corner.length, 0);
  const meanIndex = (index: number) => corners.reduce((currVal, corner) => currVal + corner.reduce((curr, pair) => curr + pair[index], 0), 0) / nPoints;

  // const meanRA = meanIndex(0);
  // const meanDec = meanIndex(1);
  const meanRA = offsetXDeg;
  const meanDec = offsetYDeg;
  return corners.map(corner => corner.map(pair => [pair[0] - meanRA, pair[1] - meanDec]));
}

function getScreenPoints(wwt: WWTControl, worldPts: Point[]): Point[] {
  return worldPts.map(pt => {
    
    const screen = wwt.getScreenPointForCoordinates(pt[0] / 15, pt[1]);
    return [screen.x, screen.y];
  });
}

function _getWorldPoints(wwt: WWTControl, screenPts: Point[]): Point[] {
  return screenPts.map(pt => {
    const raDec = wwt.getCoordinatesForScreenPoint(...pt);
    return [15 * (raDec.x + 720) / 360, raDec.y];
  });
}

// NB: Clip space is the space [-1, 1]^2
function convertScreenPointsToClip(wwt: WWTControl, screenPts: Point[][]): Point[][] {
  const width = wwt.renderContext.width;
  const height = wwt.renderContext.height;
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
  canvasId?: string;
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



const positionShiftedFootprints: Map<string, Point[][]> = new Map();
const _fakeControl: Map<string, WWTControl> = new Map();
const fakeRendered: Map<string,boolean> = new Map();
const delaunayCache: Map<string, number[]> = new Map();

const fakeCenters: Map<string, Record<string, number>> = new Map();
function setupFakeControl(wwt: WWTControl, options: DrawFootprintOptions) {
  
  const canvasId = options.canvasId ?? options.id;
  
  // we can only have 1 control per canvas
  if (!_fakeControl.has(canvasId)) {
    const fakeControl = new WWTControl();
    fakeControl.renderContext = new RenderContext();
    _fakeControl.set(canvasId, fakeControl);
  }
  const fakeControl = _fakeControl.get(canvasId)!;
  
  if (!positionShiftedFootprints.has(options.id)) {
    // with when this runs, the initial RA/Dec is the Galactic Center at 17.76h-28.9d
    if (!fakeCenters.has(canvasId)) {
      fakeCenters.set(canvasId, {ra: wwt.renderContext.get_RA(), dec: wwt.renderContext.get_dec()});
    }
    const {ra, dec} = fakeCenters.get(canvasId)!;
    const psc = shiftCorners(options.footprint, options.offsetXDeg ?? 0, options.offsetYDeg ?? 0).map(corner => corner.map(pair => [pair[0] + ra * 15, pair[1] + dec]));
    positionShiftedFootprints.set(options.id, psc as Point[][]);
  }
  
  if (!(fakeRendered.has(canvasId) && fakeRendered.get(canvasId))) {
    const shadow = document.getElementById(`${canvasId}`) as HTMLCanvasElement;
    // @ts-ignore
    fakeControl.canvas = shadow; fakeControl.renderContext.gl = shadow.getContext("webgl2"); fakeControl.renderContext.set_backgroundImageset(wwt.renderContext.get_backgroundImageset());
    fakeControl.renderOneFrame();
    // @ts-ignore
    fakeControl.renderContext.set_world(wwt.renderContext.get_world()); fakeControl.renderContext.set_view(wwt.renderContext.get_view()); fakeControl.renderContext.set_projection(wwt.renderContext.get_projection());
    fakeRendered.set(canvasId,true);
  }
  
  return {fakeControl, positionedShiftedCorners: positionShiftedFootprints.get(options.id)!}
}

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
  
/**
 * TODO: There is a problem with how these get drawn. 
 * The coordintes to this are essentiallly delta_RA and delta_Dec, not actually coordinates
 * So there should be some sorta declincation correction, cos(dec + delta_dec) -> cos(delta_dec) if central dec = 0. 
 * 
 */
export function drawFootprint(wwt: WWTControl, options: DrawFootprintOptions) {
  if (options.show === false) {
    return;
  }
  const {fakeControl, positionedShiftedCorners } = setupFakeControl(wwt, options);
  const footprint = new SimpleLineList();
  footprint.pure2D = true;
  footprint.set_depthBuffered(true);

  const camera = wwt.renderContext.viewCamera;
  fakeControl.renderContext.viewCamera.zoom = camera.zoom;


  // @ts-ignore
  fakeControl.renderContext.set_projection(wwt.renderContext.get_projection());
  const screenPoints = positionedShiftedCorners.map(box => getScreenPoints(fakeControl, box));
  const clipPoints = convertScreenPointsToClip(fakeControl, screenPoints);
  const onePixSquare = convertScreenPointsToClip(fakeControl, [[[0, 0], [1, 1]]]);
  const onePix = [Math.abs(onePixSquare[0][0][0] - onePixSquare[0][1][0]), Math.abs(onePixSquare[0][0][1] - onePixSquare[0][1][1])];

  const triangles = new TriangleList(); // TringleList should support pure2D. 
  triangles.pure2D = true;
  triangles.depthBuffered = false; // false, otherwise only the first draw is visible.
  const date = new Dates(0, 1);

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
        const triangleIndices = getDelaunay(positionedShiftedCorners[index], `${options.id}:${index}`);
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
}






const outlineCache: Map<string, SimpleLineList> = new Map();
/*
 If we try to draw large outlines that same was as we were with the free-floating 
 outlines, then when a line list was directly behind the camera, it would end up getting
 drawn as straight lines stretching accross the view. This doesn't happen with Constellations, 
 so I use the same drawing steps as rom Constellations._drawSingleConstellation
 
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

  const footprint = getOutline(options.id, options.footprint)
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

import { D2R } from "@wwtelescope/astro";
import { Matrix3d, Vector3d, type RenderContext } from "@wwtelescope/engine";

interface PositionDeg {
  raDeg: number;
  decDeg: number;
}

export function executeWithTransforms(renderContext: RenderContext, callable: CallableFunction, transforms: {
  world?: Matrix3d,
  view?: Matrix3d,
  projection?: Matrix3d,
}) {

  const oldWorld = transforms.world ? renderContext.get_world().clone() : renderContext.get_world();
  const oldWorldBase = transforms.world ? renderContext.get_worldBase().clone() : renderContext.get_world();
  const oldView = transforms.view ? renderContext.get_view().clone() : renderContext.get_view();
  const oldProjection = transforms.projection ? renderContext.get_projection().clone() : renderContext.get_projection();

  if (transforms.world) {
    renderContext.set_worldBase(Matrix3d.multiplyMatrix(transforms.world, renderContext.get_world())); renderContext.set_world(renderContext.get_worldBase().clone());
  }
  if (transforms.view) {
    renderContext.set_view(Matrix3d.multiplyMatrix(transforms.view, renderContext.get_view()));
  }
  if (transforms.projection) {
    renderContext.set_projection(Matrix3d.multiplyMatrix(transforms.projection, renderContext.get_projection()));
  }
  renderContext.makeFrustum();

  callable(renderContext);

  renderContext.set_worldBase(oldWorldBase);
  renderContext.set_world(oldWorld);
  renderContext.set_view(oldView);
  renderContext.set_projection(oldProjection);
  renderContext.makeFrustum();
}

export function getWorldMatrixForPosition(position: PositionDeg): Matrix3d {
  return Matrix3d.rotationYawPitchRoll(-(position.raDeg - 90) * D2R, -position.decDeg * D2R, 0);
}

export function getViewMatrixForRotation(angleDeg: number): Matrix3d {
  return Matrix3d.lookAtLH(
    Vector3d.create(0, 0, 0),
    Vector3d.create(0, 0, -1), 
    Vector3d.create(Math.sin(angleDeg * D2R), Math.cos(angleDeg * D2R), 0),
  );
}

export interface CreateTransformsOptions {
  position: PositionDeg;
  rotationDeg: number;
  renderContext: RenderContext;
}

export function createTransformsForCamera(options: CreateTransformsOptions) {
  const initWorld = getWorldMatrixForPosition(options.position);
  const initView = getViewMatrixForRotation(options.rotationDeg);
  const currentWorld = options.renderContext.get_world().clone();
  currentWorld.invert();
  const currentView = options.renderContext.get_view().clone();
  currentView.invert();

  return {
    world: Matrix3d.multiplyMatrix(initWorld, currentWorld),
    view: Matrix3d.multiplyMatrix(initView, currentView),
  };
}

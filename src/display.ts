import { Matrix3d, type RenderContext } from "@wwtelescope/engine";

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

import { LegacyRef, useCallback, useEffect, useRef, useState } from "react";

export interface ID3WrapperProps {
  wrapperEl: any;
  data: any;
  width: number;
  height: number;
  d3ComponentClass: any;

  //  allow to pass additional props
  //  to the d3 component as needed
  [key: string]: any;
}

export interface ID3ComponentClassInstance {
  resize: any;
  update: any;
}

export default function D3Wrapper(props: ID3WrapperProps) {
  const { wrapperEl, data, width, height, d3ComponentClass } = props;
  const cachedDimsRef = useRef({ width: 800, height: 600 });

  let [viz, setViz] = useState<ID3ComponentClassInstance | null>(null);

  const elRef = useRef<SVGSVGElement | HTMLDivElement>(null);

  const handleVizError = useCallback((err: any) => {
    //  d3 components can get quite complex and corrupted data might break them
    //  easily if not super careful, so introducing component-level error boundary
    //  here to allow the rest of the app render other UI
    console.error("handleVizError", err);
  }, []);

  function updateViz() {
    const vizProps = { ...props };

    try {
      if (!viz) {
        setViz(new d3ComponentClass(elRef.current, vizProps));
      } else {
        viz.update(vizProps);
      }

      //  update cached dimensions so that we can avoid
      //  potential re-rerenders with updateVizOnResize
      cachedDimsRef.current = { width, height };
    } catch (err) {
      handleVizError(err);
    }
  }

  function updateVizOnResize() {
    //  check whether the dimensions have changed since
    //  last update of data, otherwise no need
    //  to call resize again, since that's part of viz.update
    //  anyways
    const hasDimensionChanged =
      cachedDimsRef.current.width !== width ||
      cachedDimsRef.current.height !== height;

    if (hasDimensionChanged) {
      try {
        viz && viz.resize(width, height);
      } catch (err) {
        handleVizError(err);
      }
    }
  }

  useEffect(updateViz, [
    viz,
    data,
    width,
    height,
    handleVizError,
    d3ComponentClass,
    props,
  ]);
  useEffect(updateVizOnResize, [width, height, handleVizError, viz]);

  //  make sure to switch svg to display block (from default inline)
  //  otherwise parent might have bigger height which could lead
  //  to incorrect measurements and resizes
  const svgStyle = { display: "block" };

  return wrapperEl === "svg" ? (
    <svg
      ref={elRef as unknown as LegacyRef<SVGSVGElement>}
      style={svgStyle}
      width={width}
      height={height}
    />
  ) : (
    <div
      ref={elRef as unknown as LegacyRef<HTMLDivElement>}
      style={{ width, height }}
    />
  );
}

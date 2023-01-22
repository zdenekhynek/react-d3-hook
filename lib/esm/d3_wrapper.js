var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useCallback, useEffect, useRef, useState, } from "react";
export default function D3Wrapper(props) {
    var wrapperEl = props.wrapperEl, data = props.data, width = props.width, height = props.height, d3ComponentClass = props.d3ComponentClass;
    var cachedDimsRef = useRef({ width: 800, height: 600 });
    var _a = useState(null), viz = _a[0], setViz = _a[1];
    var elRef = useRef(null);
    var handleVizError = useCallback(function (err) {
        //  d3 components can get quite complex and corrupted data might break them
        //  easily if not super careful, so introducing component-level error boundary
        //  here to allow the rest of the app render other UI
        console.error("handleVizError", err);
    }, []);
    function updateViz() {
        var vizProps = __assign({}, props);
        try {
            if (!viz) {
                setViz(new d3ComponentClass(elRef.current, vizProps));
            }
            else {
                viz.update(vizProps);
            }
            //  update cached dimensions so that we can avoid
            //  potential re-rerenders with updateVizOnResize
            cachedDimsRef.current = { width: width, height: height };
        }
        catch (err) {
            handleVizError(err);
        }
    }
    function updateVizOnResize() {
        //  check whether the dimensions have changed since
        //  last update of data, otherwise no need
        //  to call resize again, since that's part of viz.update
        //  anyways
        var hasDimensionChanged = cachedDimsRef.current.width !== width ||
            cachedDimsRef.current.height !== height;
        if (hasDimensionChanged) {
            try {
                viz && viz.resize(width, height);
            }
            catch (err) {
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
    var svgStyle = { display: "block" };
    return wrapperEl === "svg" ? (React.createElement("svg", { ref: elRef, style: svgStyle, width: width, height: height })) : (React.createElement("div", { ref: elRef, style: { width: width, height: height } }));
}

"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
function D3Wrapper(props) {
    var wrapperEl = props.wrapperEl, data = props.data, width = props.width, height = props.height, d3ComponentClass = props.d3ComponentClass;
    var cachedDimsRef = (0, react_1.useRef)({ width: 800, height: 600 });
    var _a = (0, react_1.useState)(null), viz = _a[0], setViz = _a[1];
    var elRef = (0, react_1.useRef)(null);
    var handleVizError = (0, react_1.useCallback)(function (err) {
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
    (0, react_1.useEffect)(updateViz, [
        viz,
        data,
        width,
        height,
        handleVizError,
        d3ComponentClass,
        props,
    ]);
    (0, react_1.useEffect)(updateVizOnResize, [width, height, handleVizError, viz]);
    //  make sure to switch svg to display block (from default inline)
    //  otherwise parent might have bigger height which could lead
    //  to incorrect measurements and resizes
    var svgStyle = { display: "block" };
    return wrapperEl === "svg" ? (react_1.default.createElement("svg", { ref: elRef, style: svgStyle, width: width, height: height })) : (react_1.default.createElement("div", { ref: elRef, style: { width: width, height: height } }));
}
exports.default = D3Wrapper;

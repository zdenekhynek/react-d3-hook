import { Selection, select } from "d3-selection";
import { line } from "d3-shape";
import { NumberValue, ScaleLinear, scaleLinear } from "d3-scale";
import { min, max } from "d3-array";
import { Axis, axisBottom, axisLeft } from "d3-axis";

export const MARGIN = { top: 15, right: 90, bottom: 60, left: 90 };

export interface IDatum {
  x: number;
  y: number;
}

export interface IProps {
  width: number;
  height: number;
  data: IDatum[];
  xAxisLabel: string;
  yAxisLabel: string;
  onMouseOver: Function;
  onMouseMove: Function;
  onMouseOut: Function;
}

export default class D3LineChart {
  container: SVGSVGElement;
  wrapper: Selection<SVGGElement, any, null, undefined>;
  svg: Selection<SVGSVGElement, any, null, undefined>;
  xDomain: [number, number];
  xScale: ScaleLinear<number, any>;
  xAxisFn: Axis<NumberValue>;
  yScale: ScaleLinear<number, number>;
  yDomain: [number, number];
  yAxisFn: Axis<NumberValue>;
  props: IProps;

  constructor(container: any, props: any) {
    this.container = container;
    this.props = props;
    this.svg = select(container);

    this.xDomain = [0, 0];
    this.xScale = scaleLinear();
    this.xAxisFn = axisBottom(this.xScale);

    this.yDomain = [0, 0];
    this.yScale = scaleLinear();
    this.yAxisFn = axisLeft(this.yScale);

    this.wrapper = this.svg.append("g").attr("class", "wrapper");
  }

  onMouseOver(_: any, lineData: any) {
    if (this.props.onMouseOver) {
      if (typeof this.props.onMouseOver === "function") {
        this.props.onMouseOver(lineData);
      } else {
        console.error(
          `Linecharts onMouseOver prop should be callable, got: ${this.props.onMouseOver}`
        );
      }
    }
  }

  onMouseMove(_: any, lineData: any) {
    if (this.props.onMouseMove) {
      if (typeof this.props.onMouseMove === "function") {
        this.props.onMouseMove(lineData);
      } else {
        console.error(
          `Linecharts onMouseMove prop should be callable, got: ${this.props.onMouseMove}`
        );
      }
    }
  }

  onMouseOut() {
    if (this.props.onMouseOut) {
      if (typeof this.props.onMouseOut === "function") {
        this.props.onMouseOut();
      } else {
        console.error(
          `Linecharts onMouseOut prop should be callable, got: ${this.props.onMouseOut}`
        );
      }
    }
  }

  updateData() {
    const { data, height, width } = this.props;
    if (!data || !height || !width) {
      return;
    }

    const vizWidth = width - MARGIN.left - MARGIN.right;
    const vizHeight = height - MARGIN.top - MARGIN.bottom;
    const translateString = `translate(${MARGIN.left} ${MARGIN.top})`;

    this.wrapper.attr("transform", translateString);
    this.wrapper.attr("width", vizWidth).attr("height", vizHeight);

    this.xDomain = [
      min(data, (d: IDatum) => d.x) || 0,
      max(data, (d: IDatum) => d.x) || 0,
    ];
    this.xScale = scaleLinear().domain(this.xDomain).range([0, vizWidth]);

    this.yDomain = [0, max(data, (d: any) => d.y)];
    this.yScale = scaleLinear().domain(this.yDomain).range([vizHeight, 0]);

    const sel = this.wrapper.selectAll(".line").data([data]);
    const selEnter: any = sel.enter().append("g").attr("class", "line");
    selEnter.append("path").attr("class", "lineGraphic");

    selEnter.on("mouseover", this.onMouseOver.bind(this));
    selEnter.on("mousemove", this.onMouseMove.bind(this));
    selEnter.on("mouseout", this.onMouseOut.bind(this));

    const selMerge = sel.merge(selEnter);
    selMerge
      .select(".lineGraphic")
      // .transition()
      .attr(
        "d",
        line(
          (d) => this.xScale(d.x),
          (d) => this.yScale(d.y)
        )
        //.curve(curvexBasis)
      )
      .style("stroke", "purple")
      .style("fill", "none");

    sel.exit().remove();

    if (this.wrapper.select("g.x-axis").empty()) {
      //  x-axis
      this.wrapper
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0 ${vizHeight})`)
        .append("text")
        .attr("class", "x-axis-label")
        .attr("y", "25")
        .attr("x", vizWidth / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(this.props.xAxisLabel);

      //   left y-axis
      this.wrapper
        .append("g")
        .attr("class", "y-axis-left")
        .append("text")
        .attr("class", "y-axis-left-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", 0 - vizHeight / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(this.props.yAxisLabel);
    }

    this.xAxisFn = axisBottom(this.xScale).tickSize(-vizHeight);
    this.wrapper.selectAll("g.x-axis").call(this.xAxisFn as any);
    this.wrapper.select("text.x-axis-label").attr("x", vizWidth / 2);

    this.yAxisFn = axisLeft(this.yScale).tickSize(-vizWidth);
    this.wrapper.selectAll("g.y-axis-left").call(this.yAxisFn as any);
    this.wrapper.selectAll("g.y-axis-left .tick text").attr("x", "-7");
  }

  resize(width: number, height: number) {
    //  rendering in percentages, so do not need to resize
    this.update({ width, height });
  }

  update(props: any) {
    this.props = Object.assign({}, this.props, props);
    this.updateData();
  }
}

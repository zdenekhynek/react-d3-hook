import { select } from "d3-selection";
import { line, curveBasis } from "d3-shape";
import { scaleLinear } from "d3-scale";
import { min, max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";

export const MARGIN = { top: 15, right: 90, bottom: 60, left: 90 };

class LineChart {
  container: any;
  props: any;
  svg: any;
  xDomain: any;
  xScale: any;
  xScaleDomain: any;
  xAxisFn: any;
  yScale: any;
  yDomain: any;
  yAxisFn: any;
  yRightDomain: any;
  yRightAxisFn: any;
  wrapper: any;

  constructor(container: any, props: any) {
    this.container = container;
    this.props = props;
    this.svg = select(container);

    this.xDomain = null;
    this.xScale = null;
    this.xScaleDomain = null;
    this.xAxisFn = null;

    this.yScale = null;
    this.yDomain = null;
    this.yAxisFn = null;

    this.wrapper = this.svg.append("g").attr("class", "wrapper");
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

    this.xDomain = [min(data, (d: any) => d.x), max(data, (d: any) => d.x)];
    this.xScale = scaleLinear().domain(this.xDomain).range([0, vizWidth]);

    this.yDomain = [0, max(data, (d: any) => d.y)];
    this.yScale = scaleLinear().domain(this.yDomain).range([vizHeight, 0]);

    const sel = this.wrapper.selectAll(".line").data([data]);
    const selEnter = sel.enter().append("g").attr("class", "line");
    selEnter.append("path").attr("class", "lineGraphic");

    // selEnter.on("mouseover", this.onMouseOver.bind(this));
    // selEnter.on("mousemove", this.onMouseMove.bind(this));
    // selEnter.on("mouseout", this.onMouseOut.bind(this));

    const selMerge = sel.merge(selEnter);
    selMerge
      .select(".lineGraphic")
      // .transition()
      .attr(
        "d",
        line()
          .curve(curveBasis)
          .x((d: any) => this.xScale(d.x))
          .y((d: any) => this.yScale(d.y))
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
        .text(this.props.yAxisLabels[0]);
    }

    this.xAxisFn = axisBottom(this.xScale).tickSize(-vizHeight);
    this.wrapper.selectAll("g.x-axis").call(this.xAxisFn);
    this.wrapper.select("text.x-axis-label").attr("x", vizWidth / 2);

    this.yAxisFn = axisLeft(this.yScale).tickSize(-vizWidth);
    this.wrapper.selectAll("g.y-axis-left").call(this.yAxisFn);
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

export default LineChart;

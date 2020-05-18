Vue.component("controls", {
  props: ["circles", "lines", "strokeWidth", "strokeDasharray", "color"],
  data() {
    return {
      colorOptions: [
        {
          label: "Bright Gray",
          value: "#EEEEEE",
        },
        {
          label: "Chinese Silver",
          value: "#CCCCCC",
        },
        {
          label: "Spanish Gray",
          value: "#999999",
        },
        {
          label: "Granite Gray",
          value: "#666666",
        },
        {
          label: "Dark Charcoal",
          value: "#333333",
        },
        {
          label: "Black",
          value: "#000000",
        },
      ],
    };
  },
  template: `<div id="controls" >
    <div class="controls__input-group">
      <label htmlFor="circles"># of circles</label>
      <input type="number" name="circles" id="circles" min=1 :value="circles" @input="$emit('circlesInput', +$event.target.value)"/>
    </div>
    <div class="controls__input-group">
      <label htmlFor="lines"># of lines</label>
      <input type="number" name="lines" id="lines" min=2 :value="lines" @input="$emit('linesInput', +$event.target.value)"/>
    </div>
    <div class="controls__input-group">
      <label htmlFor="strokeWidth">Stroke width</label>
      <input type="number" name="strokeWidth" id="strokeWidth" min=1 :value="strokeWidth" @input="$emit('strokeWidthInput', +$event.target.value)"/>
    </div>
    <div class="controls__input-group">
      <label htmlFor="strokeDasharray">Dash value</label>
      <input type="number" name="strokeDasharray" id="strokeDasharray" min=0 :value="strokeDasharray" @input="$emit('strokeDasharrayInput', +$event.target.value)"/>
    </div>
    <div class="controls__input-group">
      <label htmlFor="color">Color</label>
      <select id="color" :value="color" @input="$emit('colorInput', $event.target.value)">
        <option v-for="color in colorOptions" :key="color.value" :value="color.value">{{color.label}}</option>
      </select>
    </div>
  </div>`,
});

Vue.component("mandala-generator", {
  props: ["name"],
  data() {
    return {
      center: {
        x: 500 / 2,
        y: 500 / 2,
      },
      paper: null,
      circles: 4,
      circlesGroup: null,
      lines: 4,
      linesGroup: null,
      strokeWidth: 1,
      strokeDasharray: 3,
      color: "#666666",
    };
  },
  mounted() {
    this.paper = Snap("#svg");
    const {width, height} = this.$refs.svg.getBoundingClientRect()
    this.center = {
      x: width /2,
      y: height /2
    }
    this.circlesGroup = this.paper.group().attr({
      strokeWidth: this.strokeWidth,
      stroke: this.color,
      strokeDasharray: this.strokeDasharray,
    });
    this.linesGroup = this.paper.group().attr({
      strokeDasharrayWidth: this.strokeWidth,
      stroke: this.color,
      strokeDasharray: this.strokeDasharray,
    });

    this.drawCircles(this.circles);
    this.drawLines(this.lines);
  },
  computed: {
    radio() {
      return Math.min(this.center.x, this.center.y) - this.strokeWidth;
    },
  },
  methods: {
    addCircle(radio) {
      const { x, y } = this.center;
      this.circlesGroup.circle(x, y, radio).attr({
        fill: "none",
      });
    },
    drawLines(amount) {
      this.lines = amount;
      this.linesGroup.clear();
      const { x, y } = this.center;
      const n = amount * 2;
      for (let i = 0; i < amount; i++) {
        const startX = x + this.radio * Math.cos((2 * Math.PI * i) / n);
        const startY = y + this.radio * Math.sin((2 * Math.PI * i) / n);
        const endX = x + this.radio * Math.cos((2 * Math.PI * (i + amount)) / n);
        const endY = y + this.radio * Math.sin((2 * Math.PI * (i + amount)) / n);
        this.linesGroup.line(startX, startY, endX, endY);
      }
    },
    drawCircles(value) {
      this.circles = value;
      this.circlesGroup.clear();
      const radialDistance = this.radio / value;
      for (let i = 0; i < value; i++) {
        this.addCircle(radialDistance * (i + 1));
      }
    },
    linesHandler(value) {
      console.log("linesHandler", value);
    },
    strokeWidthHandler(value) {
      this.strokeWidth = value;
      this.circlesGroup.attr({
        strokeWidth: value,
      });
      this.linesGroup.attr({
        strokeWidth: value,
      });
      this.drawCircles(this.circles);
      this.drawLines(this.lines);
    },
    strokeDasharrayHandler(value) {
      this.strokeDasharray = value;
      this.circlesGroup.attr({
        strokeDasharray: value,
      });
      this.linesGroup.attr({
        strokeDasharray: value,
      });
    },
    colorHandler(value) {
      this.color = value;
      this.circlesGroup.attr({
        stroke: value,
      });
      this.linesGroup.attr({
        stroke: value,
      });
    },
  },
  template: `<div class="container">
    <controls
      :circles="circles"
      :lines="lines"
      :strokeWidth="strokeWidth"
      :strokeDasharray="strokeDasharray"
      :color="color"
      @circlesInput="drawCircles"
      @linesInput="drawLines"
      @strokeWidthInput="strokeWidthHandler"
      @strokeDasharrayInput="strokeDasharrayHandler"
      @colorInput="colorHandler"
    />
    <div class="svg-container">
      <svg id="svg" ref="svg" :style=""/>
    </div>
  </div>`
});

var vm = new Vue({
  el: "#app",
  template: "<mandala-generator />",
});

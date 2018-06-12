<template>
    <div ref="knob" class="knob">
      <span ref="label">{{name}}</span>
      <div ref="canvasContainer">
        <canvas ref="canvas"/>
        <div ref="inputDiv" class="inputDiv"> 
            <input ref="input" class="input"/>
        </div>
      </div>
    </div>
</template>


<script>
import Knob from "~/components/Knob.vue";
export default {
  props: ["initVal", "minVal", "maxVal", "name", "colorBG", "colorFG"],
  data() {
    return {
      p_canvas: undefined,
      p_div: undefined,
      p_height: undefined,
      p_input: undefined,
      p_inputDiv: undefined,
      p_listeners: [],
      p_mousebutton: false,
      p_previousVal: 0,
      p_timeout: null,
      p_width: undefined,
      /*
			 * Properties of this this.
			 */
      p_properties: {
        angleEnd: 2.0 * Math.PI,
        angleOffset: -0.5 * Math.PI,
        angleStart: 0,
        colorBG: this.colorBG ? this.colorBG : "#181818",
        colorFG: this.colorFG ? this.colorFG : "#ff8800",
        needle: false,
        readonly: false,
        trackWidth: 0.4,
        valMin: this.minVal ? this.minVal : 0,
        valMax: this.maxVal ? this.maxVal : 100,
        val: this.initVal ? this.initVal : 0
      }
    };
  },
  mounted() {
    //size calculation
    let div = this.$refs.knob;
    let input = this.$refs.input;
    let inputDiv = this.$refs.inputDiv;
    // let height = this.$refs.canvasContainer.clientHeight;
    //let width = this.$refs.canvasContainer.clientWidth;
    //console.log(width);
    // let heightString = height.toString();
    // let widthString = width.toString();
    // let smaller = width < height ? width : height;
    // width = smaller;
    // height = smaller;
    // let fontSize = 0.2 * smaller;
    // let fontSizeString = fontSize.toString();

    this.p_width = 100; //width;
    this.p_height = 100; //height;
    this.p_div = div;
    this.p_input = input;
    this.p_inputDiv = this.$refs.inputDiv;
    this.p_canvas = this.$refs.canvas;
    //style modification after creation
    // div.style.height = heightString + "px";
    // div.style.width = widthString + "px";
    // input.style.fontSize = fontSizeString + "px";
    //input.style.height = heightString + "px";
    //input.style.width = widthString + "px";
    //inputDiv.style.fontSize = fontSizeString + "px";
    //inputDiv.style.height = heightString + "px";
    //inputDiv.style.width = widthString + "px";

    this.$refs.label.style.color = this.colorFG;
    this.$nextTick(() => {
      this.p_canvas.addEventListener("dblclick", this.doubleClickListener);
      this.p_canvas.addEventListener("mousedown", this.mouseDownListener);
      this.p_canvas.addEventListener("mouseleave", this.mouseCancelListener);
      this.p_canvas.addEventListener("mousemove", this.mouseMoveListener);
      this.p_canvas.addEventListener("mouseup", this.mouseUpListener);
      this.p_canvas.addEventListener("resize", this.resizeListener);
      this.p_canvas.addEventListener("touchstart", this.mouseDownListener);
      this.p_canvas.addEventListener("touchmove", this.mouseMoveListener);
      this.p_canvas.addEventListener("touchend", this.mouseUpListener);
      this.p_canvas.addEventListener("touchcancel", this.mouseCancelListener);
      this.p_canvas.addEventListener("wheel", this.scrollListener);
      this.p_input.addEventListener("keypress", this.keyPressListener);
    });

    this.redraw();
    //this.resize();
  },
  methods: {
    /*
			 * Notify listeners about value changes.
			 */
    p_notifyUpdate: function() {
      var properties = this.p_properties;
      var value = properties.val;
      var listeners = this.p_listeners;
      var numListeners = listeners.length;

      /*
				 * Call all listeners.
				 */
      for (var i = 0; i < numListeners; i++) {
        var listener = listeners[i];

        /*
					 * Call listener, if it exists.
					 */
        if (listener !== null) listener(this, value);
      }
    },

    /*
			 * Abort value change, restoring the previous value.
			 */
    abort: function() {
      var previousValue = this.p_previousVal;
      var properties = this.p_properties;
      properties.val = previousValue;
      this.redraw();
    },

    /*
			 * Adds an event listener.
			 */
    addListener: function(listener) {
      var listeners = this.p_listeners;
      listeners.push(listener);
    },

    /*
			 * Commit value, indicating that it is no longer temporary.
			 */
    commit: function() {
      var properties = this.p_properties;
      var value = properties.val;
      this.p_previousVal = value;
      this.redraw();
      this.p_notifyUpdate();
    },

    /*
			 * Returns the value of a property of this this.
			 */
    getProperty: function(key) {
      return this.p_properties[key];
    },

    /*
			 * Returns the current value of the this.
			 */
    getValue: function() {
      var properties = this.p_properties;
      var value = properties.val;
      return value;
    },

    /*
			 * Return the DOM node representing this this.
			 */
    node: function() {
      var div = this.p_div;
      return div;
    },

    /*
			 * Redraw the knob on the canvas.
			 */
    redraw: function() {
      this.resize();
      var properties = this.p_properties;
      var needle = properties.needle;
      var angleStart = properties.angleStart;
      var angleOffset = properties.angleOffset;
      var angleEnd = properties.angleEnd;
      var actualStart = angleStart + angleOffset;
      var actualEnd = angleEnd + angleOffset;
      var value = properties.val;
      var valueStr = value.toString();
      var valMin = properties.valMin;
      var valMax = properties.valMax;
      var relValue = (value - valMin) / (valMax - valMin);
      var relAngle = relValue * (angleEnd - angleStart);
      var angleVal = actualStart + relAngle;
      var colorTrack = properties.colorBG;
      var colorFilling = properties.colorFG;
      var trackWidth = properties.trackWidth;
      var height = this.p_height;
      var width = this.p_width;
      var smaller = width < height ? width : height;
      var centerX = 0.5 * width;
      var centerY = 0.5 * height;
      var radius = 0.4 * smaller;
      var lineWidth = Math.round(trackWidth * radius);
      var fontSize = 0.2 * smaller;
      var fontSizeString = fontSize.toString();
      var canvas = this.p_canvas;
      var ctx = canvas.getContext("2d");

      /*
				 * Clear the canvas.
				 */
      ctx.clearRect(0, 0, width, height);

      /*
				 * Draw the track.
				 */
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, actualStart, actualEnd);
      ctx.lineCap = "butt";
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = colorTrack;
      ctx.stroke();

      /*
				 * Draw the filling.
				 */
      ctx.beginPath();

      /*
				 * Check if we're in needle mode.
				 */
      if (needle)
        ctx.arc(centerX, centerY, radius, angleVal - 0.1, angleVal + 0.1);
      else ctx.arc(centerX, centerY, radius, actualStart, angleVal);

      ctx.lineCap = "butt";
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = colorFilling;
      ctx.stroke();

      /*
				 * Draw the number.
				 */
      ctx.font = fontSizeString + "px sans-serif";
      ctx.fillStyle = colorFilling;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(valueStr, centerX, centerY);

      /*
				 * Set the color of the input element.
				 */
      var elemInput = this.p_input;
      elemInput.style.color = colorFilling;
    },

    /*
			 * This is called as the canvas or the surrounding DIV is resized.
			 */
    resize: function() {
      var canvas = this.p_canvas;
      canvas.style.height = "100%";
      canvas.style.width = "100%";
      canvas.height = this.p_height;
      canvas.width = this.p_width;
    },

    /*
			 * Sets the value of a property of this this.
			 */
    setProperty: function(key, value) {
      this.p_properties[key] = value;
      this.redraw();
    },

    /*
			 * Sets the value of this this.
			 */
    setValue: function(value) {
      this.setValueFloating(value);
      this.commit();
    },

    /*
			 * Sets floating (temporary) value of this this.
			 */
    setValueFloating: function(value) {
      var properties = this.p_properties;
      var valMin = properties.valMin;
      var valMax = properties.valMax;

      /*
				 * Clamp the actual value into the [valMin; valMax] range.
				 */
      if (value < valMin) value = valMin;
      else if (value > valMax) value = valMax;

      value = Math.round(value);
      this.setProperty("val", value);
    },

    /*
      * Convert mouse event to value.
      */
    mouseEventToValue: function(e, properties) {
      var canvas = e.target;
      var width = canvas.scrollWidth;
      var height = canvas.scrollHeight;
      var centerX = 0.5 * width;
      var centerY = 0.5 * height;
      var x = e.offsetX;
      var y = e.offsetY;
      var relX = x - centerX;
      var relY = y - centerY;
      var angleStart = properties.angleStart;
      var angleEnd = properties.angleEnd;
      var angleDiff = angleEnd - angleStart;
      var angle = Math.atan2(relX, -relY) - angleStart;
      var twoPi = 2.0 * Math.PI;

      /*
        * Make negative angles positive.
        */
      if (angle < 0) {
        if (angleDiff >= twoPi) angle += twoPi;
        else angle = 0;
      }

      var valMin = properties.valMin;
      var valMax = properties.valMax;
      var value = angle / angleDiff * (valMax - valMin) + valMin;

      /*
        * Clamp values into valid interval.
        */
      if (value < valMin) value = valMin;
      else if (value > valMax) value = valMax;

      return value;
    },

    /*
      * Show input element on double click.
      */
    doubleClickListener: function(e) {
      var properties = this.p_properties;
      var readonly = properties.readonly;

      /*
        * If knob is not read-only, display input element.
        */
      if (!readonly) {
        e.preventDefault();
        var inputDiv = this.p_inputDiv;
        inputDiv.style.display = "block";
        var inputElem = this.p_input;
        inputElem.focus();
        this.redraw();
      }
    },

    /*
      * This is called when the mouse button is depressed.
      */
    mouseDownListener: function(e) {
      var btn = e.buttons;
      var inputDiv = this.p_inputDiv;
      var input = this.p_input;
      if (inputDiv.style.display == "block") {
        inputDiv.style.display = "none";
        input.style.display = "none";
        var value = input.value;
        var val = parseInt(value);
        var valid = isFinite(val);
        if (valid) this.setValue(val);
        input.value = "";
      }
      /*
        * It is a left-click.
        */
      if (btn === 1) {
        var properties = this.p_properties;
        var readonly = properties.readonly;

        /*
          * If knob is not read-only, process mouse event.
          */
        if (!readonly) {
          e.preventDefault();
          var val = this.mouseEventToValue(e, properties);
          this.setValueFloating(val);
        }

        this.p_mousebutton = true;
      }

      /*
        * It is a middle click.
        */
      if (btn === 4) {
        var properties = this.p_properties;
        var readonly = properties.readonly;

        /*
          * If knob is not read-only, display input element.
          */
        if (!readonly) {
          e.preventDefault();
          var inputDiv = this.p_inputDiv;
          inputDiv.style.display = "block";
          var inputElem = this.p_input;
          inputElem.focus();
          this.redraw();
        }
      }
    },

    /*
      * This is called when the mouse cursor is moved.
      */
    mouseMoveListener: function(e) {
      var btn = this.p_mousebutton;

      /*
        * Only process event, if mouse button is depressed.
        */
      if (btn) {
        var properties = this.p_properties;
        var readonly = properties.readonly;

        /*
          * If knob is not read-only, process mouse event.
          */
        if (!readonly) {
          e.preventDefault();
          var val = this.mouseEventToValue(e, properties);
          this.setValueFloating(val);
        }
      }
    },

    /*
      * This is called when the mouse button is released.
      */
    mouseUpListener: function(e) {
      var btn = this.p_mousebutton;

      /*
        * Only process event, if mouse button was depressed.
        */
      if (btn) {
        var properties = this.p_properties;
        var readonly = properties.readonly;

        /*
          * If knob is not read only, process mouse event.
          */
        if (!readonly) {
          e.preventDefault();
          var val = this.mouseEventToValue(e, properties);
          this.setValue(val);
        }
      }

      this.p_mousebutton = false;
    },

    /*
      * This is called when the drag action is canceled.
      */
    mouseCancelListener: function(e) {
      var btn = this.p_mousebutton;

      /*
        * Abort action if mouse button was depressed.
        */
      if (btn) {
        this.abort();
        this.p_mousebutton = false;
      }
    },

    /*
      * This is called when the size of the canvas changes.
      */
    resizeListener: function(e) {
      this.redraw();
    },

    /*
      * This is called when the mouse wheel is moved.
      */
    scrollListener: function(e) {
      var readonly = this.getProperty("readonly");

      /*
        * If knob is not read only, process mouse wheel event.
        */
      if (!readonly) {
        e.preventDefault();
        var delta = e.deltaY;
        var direction = delta > 0 ? 1 : delta < 0 ? -1 : 0;
        var val = this.getValue();
        val += direction;
        this.setValueFloating(val);

        /*
          * Perform delayed commit.
          */
        // var commit = function() {
        //   this.commit();
        // };

        var timeout = this.p_timeout;
        window.clearTimeout(timeout);
        timeout = window.setTimeout(this.commit, 250);
        this.p_timeout = timeout;
      }
    },

    /*
      * This is called when the user presses a key on the keyboard.
      */
    keyPressListener: function(e) {
      var kc = e.keyCode;

      /*
        * Hide input element when user presses enter or escape.
        */
      if (kc === 13 || kc === 27) {
        var inputDiv = this.p_inputDiv;
        inputDiv.style.display = "none";
        var input = e.target;

        /*
          * Only evaluate value when user pressed enter.
          */
        if (kc === 13) {
          var value = input.value;
          var val = parseInt(value);
          var valid = isFinite(val);

          /*
            * Check if input is a valid number.
            */
          if (valid) this.setValue(val);
        }

        input.value = "";
      }
    }
  }
};
</script>


<style scoped>
.knob {
  display: flex;
  flex-direction: column;
  position: relative;
  text-align: center;

  width: 100%;
  height: 100%;
}

.input {
  background-color: rgba(0, 0, 0, 0.8);
  border: none;
  color: #ff8800;
  font-family: sans-serif;
  margin: auto;
  padding: 0px;
  text-align: center;
  display: block;

  width: 100%;
  height: 100%;
}
.inputDiv {
  bottom: 0px;
  display: none;
  left: 0px;
  position: absolute;
  right: 0px;
  top: 0px;

  width: 100%;
  height: 100%;
}
canvas {
  width: 100%;
  height: 100%;
}
/* label {
  font: 15px arial, sans-serif;
} */
</style>

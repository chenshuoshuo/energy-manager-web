<template>
  <div class="draw">
    <div
      class="background"
      :style="{ 'width':`${width}px`,'height':`${height}px`,'background':`url(${url}) no-repeat`,'background-size':'100% 100%' }"
    >
      <canvas
        :id="radom"
        :class="{canDraw: 'canvas'}"
        :width="width"
        :height="height"
        :style="{'width':`${width}px`,'height':`${height}px`}"
        @dblclick.stop.prevent="canvasHandler($event)"
      />
    </div>
    <div class="tip" @click="isTip = !isTip">
      <transition name="fade">
        <img v-if="isTip" class="tip" src="@/assets/point-images/close.png" alt>
      </transition>
      <transition name="fade">
        <img v-if="!isTip" class="tip" src="@/assets/point-images/open.png" alt>
      </transition>
    </div>
  </div>
</template>
<script>
const uuid = require('node-uuid')
import * as turf from '@turf/turf'
export default {
  model: {
    prop: 'polygons',
    event: 'input'
  },
  props: {
    polygons: {
      type: Array,
      default: () => []
    },
    canDraw: {
      type: Boolean,
      default: true
    },
    url: {
      // 图片路径
      type: String,
      default: ''
    },
    info: {
      // 位置点信息
      type: Array,
      default: () => []
    },
    width: {
      // 绘图区域宽度
      type: Number,
      default: 600
    },
    height: {
      // 绘图区域高度
      type: Number,
      default: 600
    },
    lineColor: {
      // 画笔颜色
      type: String,
      default: 'red'
    },
    lineWidth: {
      // 画笔宽度
      type: Number,
      default: 2
    },
    count: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      isTip: true,
      canvas: null,
      // 同一页面多次渲染时，用于区分元素的id
      radom: uuid.v4(),
      // canvas对象
      context: {},
      // 是否处于绘制状态
      canvasMoveUse: false,
      // 绘制矩形和椭圆时用来保存起始点信息
      // 储存坐标信息
      drawInfo: [{ pleacehoder: true }],
      // 存储所有面
      currentIndex: null
    }
  },
  watch: {
    info(val) {
      if (val) {
        this.initDraw()
      }
    }
  },
  mounted() {
    this.initDraw()
    this.drawPolygons()
    this.canvas.addEventListener('click', this.canvasSelect)
  },
  methods: {
    // 初始化绘制信息
    initDraw() {
      // 初始化画布
      this.canvas = document.getElementById(this.radom)
      this.context = this.canvas.getContext('2d')
      // 初始化画笔
      this.context.lineWidth = this.lineWidth
      this.context.strokeStyle = this.lineColor
      this.context.fillStyle = 'rgba(255,0,0,.2)'
      this.context.save()
    },
    drawPolygons() {
      this.polygons.forEach((element, index) => {
        this.context.moveTo(element[0].x, element[0].y)
        // 选中设置虚线
        if (this.currentIndex === index) {
          this.context.setLineDash([5, 5])
        } else {
          this.context.setLineDash([])
        }
        this.context.beginPath()
        element.forEach(item => {
          if (!item.pleacehoder) {
            this.context.lineTo(item.x, item.y)
          }
        })
        this.context.closePath()
        this.context.fill()
        this.context.stroke()
      })
    },
    drawPolygon(polygon) {
      // 每次画面都要重绘
      this.initCanvas()
      this.context.setLineDash([5, 5])
      this.context.moveTo(polygon[0].x, polygon[0].y)
      this.context.beginPath()
      polygon.forEach(item => {
        if (!item.pleacehoder) {
          this.context.lineTo(item.x, item.y)
        }
      })
      this.context.closePath()
      this.context.fill()
      this.context.stroke()
    },
    // 鼠标移动时绘制
    canvasMove(e) {
      if (this.canvasMoveUse) {
        this.drawInfo.splice(this.drawInfo.length - 1, 1, {
          x: e.offsetX,
          y: e.offsetY
        })
        this.drawPolygon(this.drawInfo)
      }
    },
    // 鼠标按下
    canvasClick(e) {
      this.canvasMoveUse = true
      this.drawInfo.splice(this.drawInfo.length - 1, 0, {
        x: e.offsetX,
        y: e.offsetY
      })
      this.drawPolygon(this.drawInfo)
    },
    // 双击
    canvasHandler() {
      this.canvasMoveUse = !this.canvasMoveUse
      this.currentIndex = null
      if (this.polygons.length < this.count) {
        // 开始
        if (this.canvasMoveUse) {
          this.canvas.addEventListener('click', this.canvasClick)
          this.canvas.addEventListener('mousemove', this.canvasMove)
          this.canvas.removeEventListener('click', this.canvasSelect)
          this.canvas.style.cursor = 'crosshair'
        } else {
          // 绘制结束
          this.canvas.removeEventListener('click', this.canvasClick)
          this.canvas.removeEventListener('mousemove', this.canvasMove)
          this.canvas.addEventListener('click', this.canvasSelect)
          this.canvas.style.cursor = ''
          if (this.drawInfo.length < 5) {
            this.drawInfo = []
            this.$message.error('请绘制一个面')
            this.initCanvas()
          } else {
            this.polygons.push(this.drawInfo)
            this.drawInfo = []
            this.initCanvas()
          }
        }
      }
    },
    // 选中一个面
    canvasSelect(e) {
      this.currentIndex = null
      this.polygons.forEach((element, index) => {
        const arr = element.map(item => [item.x, item.y])
        arr.push(arr[0])
        // 面
        const poly = turf.polygon([arr])
        // 边  需要把边转成面处理
        // const top = arr.map(element => {
        //   element = [element[0], element[1] + 5]
        //   return element
        // })
        // const bottom = arr.map(element => {
        //   element = [element[0], element[1] - 5]
        //   return element
        // }).reverse()
        // const line = turf.polygon([[... top, ...bottom, top[0]]])
        const pt = turf.point([e.offsetX, e.offsetY])
        // turf.booleanPointInPolygon(pt, line)
        if (turf.booleanPointInPolygon(pt, poly)) {
          this.currentIndex = index
        }
      })
      this.initCanvas()
    },
    // 删除
    handleDelete() {
      if (this.currentIndex !== null) {
        this.polygons.splice(this.currentIndex, 1)
        this.currentIndex = null
        this.initCanvas()
      } else {
        this.$message({
          type: 'error',
          message: '请选择要删除的区域'
        })
      }
    },
    // 获取坐标信息
    getInfo() {
      return this.polygons
    },
    // 重绘画布
    initCanvas() {
      this.context.clearRect(0, 0, this.width, this.height)
      this.drawPolygons()
    }
  }
}
</script>
<style lang="scss" scoped>
.draw {
  user-select: none;
}
.canvas {
  position: absolute;
  border: 2px solid red;
  cursor: crosshair;
}
.tip {
  position: fixed;
  bottom: 0;
  left: 0px;
  z-index: 2;
  .tip {
    width: 280px;
    height: auto;
  }
  .close-tip {
    width: 280px;
    height: auto;
  }
}
.fade-enter-active {
  animation: fade 0.5s;
}
.fade-leave-active /* .fade-leave-active below version 2.1.8 */ {
  animation: fade 0.5s reverse;
}
@keyframes fade {
  0% {
    transform: translate(0, 280px);
  }
  100% {
    transform: translate(0, 0);
  }
}
</style>

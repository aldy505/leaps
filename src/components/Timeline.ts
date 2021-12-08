import {defineComponent} from 'vue';

export default defineComponent({
  name: 'LeapsTimeline',
  provide() {
    return {
      $timeline: this,
    };
  },
  props: {
    from: {
      default() {
        return {};
      },
      type: Object,
    },
    keyframes: {
      default: null,
      type: Array,
    },
    // Animation direction, forward, reverse, or alternate
    direction: {
      default: 'loop',
      type: String,
    },
  },
  data() {
    return {
      currentFrame: 0,
      frames: {},
    };
  },
  computed: {
    isLastFrame() {
      return this.currentFrame === this.keyframes.length - 1;
    },
  },
  created() {
    this.setup();
    this.$on('next', this.nextFrame);
  },
  methods: {
    setup() {
      this.frames = Object.assign({}, ...this.keyframes);
      Object.keys(this.frames).forEach(key => {
        this.frames[key] = 0;
      });
      this.updateFrame();
    },
    nextFrame() {
      if (this.currentFrame < this.keyframes.length) {
        this.currentFrame++;
      }

      this.updateFrame();
    },
    updateFrame() {
      Object.assign(this.frames, this.keyframes[this.currentFrame]);
    },
  },
  render() {
    return this.$scopedSlots.default({
      frames: this.frames,
    });
  },
});

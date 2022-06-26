import {defineComponent} from 'vue';

export default defineComponent({
  name: 'Leaps',
  props: {
    from: {
      default() {
        return {};
      },
      type: Object,
    },
    to: {
      default() {
        return {};
      },
      type: Object,
    },
    // Spring stiffness, in kg / s^2
    stiffness: {
      default: 170,
      type: Number,
    },
    // Damping constant, in kg / s
    damping: {
      default: 26,
      type: Number,
    },
    // Spring mass
    mass: {
      default: 1,
      type: Number,
    },
    // Initial velocity
    velocity: {
      default: 0,
      type: Number,
    },
    // Precision
    precision: {
      default: 0.1,
      type: Number,
    },
    // Animation direction, forward, reverse, or alternate
    direction: {
      default: 'forward',
      type: String,
    },
  },
  data() {
    return {
      looping: '',
      frameRate: 1 / 60, // How many frame per ms
      start: {} as Record<string, unknown>,
      end: {} as Record<string, unknown>,
      leaps: {} as Record<string, number>,
      AnimationRequestID: 0,
      velocities: {} as Record<string, number>,
      isReverse: (() => this.direction === 'reverse')(),
      isAlternate: (() => this.direction === 'alternate')(),
    };
  },
  computed: {
    isLeapEnd() {
      return Object.keys(this.velocities).every(key => this.velocities[key] === 0);
    },
  },
  watch: {
    to() {
      window.requestAnimationFrame(this.leap);
    },
    from() {
      this.setup();
    },
  },
  created() {
    this.setup();
  },
  mounted() {
    window.requestAnimationFrame(this.leap);
  },
  methods: {
    setup() {
      Object.keys(this.to).forEach(key => {
        if (!this.from[key]) {
          // FIXME: find a way to not mutate a prop
          this.from[key] = 0;
        }

        this.velocities[key] = this.velocity;
        this.leaps[key] = this.isReverse ? this.to[key] : this.from[key];
      });
    },
    leap() {
      const end = this.isReverse ? this.from : this.to;

      Object.keys(this.to).forEach(key => {
        const springForce = -this.stiffness * (this.leaps[key] - end[key]);
        const damperForce = -this.damping * this.velocities[key];
        const acceleration = (springForce + damperForce) / this.mass;

        this.velocities[key] += acceleration * this.frameRate;
        this.leaps[key] += this.velocities[key] * this.frameRate;

        if (this.isDumped(this.velocities[key], this.leaps[key] - end[key])) {
          this.velocities[key] = 0;
          this.leaps[key] = Number(end[key]);
        }
      });
      if (!this.isLeapEnd) {
        window.cancelAnimationFrame(this.AnimationRequestID);
        this.AnimationRequestID = window.requestAnimationFrame(this.leap);
      }
    },
    isDumped(velocity: number, distance: number): boolean {
      return Math.abs(velocity) < this.precision && Math.abs(distance) < this.precision;
    },
  },
  render() {
    return this.$scopedSlots.default({
      leaps: this.leaps,
    });
  },
});

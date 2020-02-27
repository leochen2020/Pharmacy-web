<template>
  <div class="m-icon" :class="['m-icon-'+type]" @click="onClick()"></div>
</template>

<script>
export default {
  props: {
    /**
       * 图标类型
       */
    type: String
  },
  methods: {
    onClick () {
      this.$emit('click')
    }
  }
}
</script>

<style>
  @import "./m-icon.css";
</style>

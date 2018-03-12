<template>
  <header>
    <h3>{{title}}</h3>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      title:"记录每一天"
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3{
  color: #000;
  margin-bottom: 30px;
}
</style>

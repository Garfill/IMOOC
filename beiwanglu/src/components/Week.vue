<template>
  <div class="days">
    <date v-for="day in days" :key="day.id" :adate="day.day" :msg="day.msg"></date>
  </div>
</template>

<script>
  import date from './Date'

  export default {
		name: "Week",
		props:['days'],
    components: {
      date
    }
  }

</script>

<style scoped>
  div.days{
    margin-bottom: 50px;
  }
</style>

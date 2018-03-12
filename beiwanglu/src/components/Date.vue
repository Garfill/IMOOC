<template>
  <div class="days">
    <div class="up">{{datamap.day}}</div>
    <div class="mid" v-for="(msg,index) in msgs" :key="index">{{msg}}</div>
    <div class="bottom" v-on:click="done">Done</div>
  </div>
</template>

<script>
  export default {
    name: "date",
    props: {
      'date':{
				type:Object
			}
		},

    computed:{
			datamap:function(){
				return {
					id:this.date.id,
					day:this.date.day,
				}
			},
			msgs:function(){
				return this.date.msgs;
			}
		},
		methods:{
			done:function(){
				this.$emit('del',this.datamap.id)
			}
		}
  }
</script>

<style scoped>
  div.days {
    height: 200px;
    width: 150px;
    background-color: #666666;
    display: inline-block;
		vertical-align: top;
    margin-right: 20px;
    color: white;
    position: relative;
  }
  div.up{
    font-size: 10px;
    text-align: left;
    width: 100%;
    height: 20px;
    line-height: 20px;
    border-bottom: 2px solid white;
  }
  div.mid{
    width: 100%;
  }
  div.bottom{
    cursor: pointer;
    width: 100%;
    position: absolute;
    bottom: 0;
    border-top: 2px solid white;
  }

</style>

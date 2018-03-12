<template>
  <div class="days">
    <div class="up">{{adate}}</div>
    <div class="mid" :datap="msg">{{datap}}</div>
    <div class="bottom" v-on:click="remove">Done</div>
  </div>
</template>

<script>
  export default {
    name: "date",
    props: {
      "adate": {
        type: String
			},
			'msg':{
				type:String
			}
    },
    data:function(){
			return {
				datap : this.msg
			}
		},
		methods:{
			remove:function(){
				this.$emit('done');
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
    height: 100px;
  }
  div.bottom{
    cursor: pointer;
    width: 100%;
    position: absolute;
    bottom: 0;
    border-top: 2px solid white;
  }

</style>

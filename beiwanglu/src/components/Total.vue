<template>
	<div class="items">
		<date v-for="day in week" :key="day.id" :date = "day" @del="del"></date>
		<write @addone="add"></write>
	</div>
</template>

<script>
	import Date from './Date.vue'
	import Write from './Write.vue'

	export default  {
		name:'Total',
		components:{
			'date':Date,
			'write':Write
		},
		methods:{
			add:function(data){
				var num = data.data;
				var plan = data.plan;
				// console.log(this.week[num].msg);
				this.week[num].msgs.push(plan);
			},
			del:function(id){
				this.week[id].msgs = ["ok"];
			}
		},
		data:function(){
			return {
					week:[
              {day:'Monday',id:'0',msgs:[]},
              {day:'Tuesday',id:'1',msgs:[]},
              {day:'Wednesday',id:'2',msgs:[]},
              {day:'Thursday',id:'3',msgs:[]},
              {day:'Friday',id:'4',msgs:[]},
              {day:'Saturday',id:'5',msgs:[]},
              {day:'Sunday',id:'6',msgs:[]}
					]

			}
		}
	}
	

</script>

<style scoped>

</style>

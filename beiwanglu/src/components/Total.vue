<template>
	<div class="items">
		<week :days='week'></week>
		<write @addone="add"></write>
	</div>
</template>

<script>
	import Week from './Week.vue'
	import Write from './Write.vue'

	export default  {
		name:'Total',
		components:{
			'week':Week,
			'write':Write
		},
		methods:{
			add:function(data){
				var num = data.data;
				var plan = data.plan;
				console.log(this.week[num].msg);
				this.week[num].msg = plan;
			}
		},
		data:function(){
			return {
					week:[
              {day:'Monday',id:'0',msg:'plan1'},
              {day:'Tuesday',id:'1',msg:'plan2'},
              {day:'Wednesday',id:'2',msg:'plan3'},
              {day:'Thursday',id:'3',msg:'plan4'},
              {day:'Friday',id:'4',msg:'plan5'},
              {day:'Saturday',id:'5',msg:'plan6'},
              {day:'Sunday',id:'6',msg:'plan7'}
					]

			}
		}
	}
	

</script>

<style scoped>

</style>

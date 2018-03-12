<template>
  <div class="wirte">
    <select name="sele" id="sele">
      <option value="0">1</option>
      <option value="1">2</option>
      <option value="2">3</option>
      <option value="3">4</option>
      <option value="4">5</option>
      <option value="5">6</option>
      <option value="6">7</option>
    </select>
    <textarea type="text" name="task" id="task" placeholder="enter your plan" @keyup.enter="add" v-model="plan"></textarea>
  </div>
</template>

<script>
  export default {
    name: "write",
    data:function(){
      return {
        plan:''
      }
    },
    methods:{
      add:function(){
        var day = document.getElementsByTagName('select')[0].value;
        var plan = this.plan;
				this.$emit('addone',{data:day,plan:plan});
				this.plan = '';
      }
    }
  }
</script>

<style scoped>
div{
	margin-top: 30px;
}
  select,textarea{
    vertical-align: top;
  }
  select{
    height: 50px;
  }
  textarea{
    width: 300px;
    height: 100px;
  }
</style>

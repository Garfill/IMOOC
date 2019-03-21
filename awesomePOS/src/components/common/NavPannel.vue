<template>
    <div class="left-nav-block">
        <ul class="left-nav-list">
            <li v-for="(nav,navIndex) in navList" :key="navIndex" class="left-nav-item">
                {{nav.name}}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name:"navbar",
    data(){
        return {
            navList:[
                {
                    name:"收银",
                    path:"",
                },
                {
                    name:"店铺",
                    path:"",
                },
                {
                    name:"商品",
                    path:"",
                },
                {
                    name:"会员",
                    path:"",
                },
                {
                    name:"统计",
                    path:"",
                },
            ],
        }
    },
}
</script>

<style lang="scss" scoped>
    .left-nav-block{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100px;
        background: #fff;
        text-align: center;

        .left-nav-list{
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }

        .left-nav-item{
            font-size: 20px;
            color: #000;
        }
    }
</style>

<template>
    <div id="app1">
        <app-header></app-header>
        <app-content></app-content>
    </div>
</template>

<script>
import Header from "./components/Header";
import Total from "./components/Total";
// const jq = require("../jquery-3.2.1.js")
export default {
    name: "App",
    components: {
        "app-header": Header,
        "app-content": Total
    },
    mounted() {
        console.log("mounted")
        const jq = require("../jquery-3.2.1.js")
    }
};
</script>

<style>
* {
    margin: 0;
    padding: 0;
}

#app1 {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>

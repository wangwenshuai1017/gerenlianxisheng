<template>
  <div id="app">
    <header>
        <ul>
            <li v-for="item in header_list">
                {{item}}
            </li>
        </ul>
    </header>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      name:"wws",
      header_list:["首页","关于我们","招贤纳士","地理位置"]
    }
  }
}
</script>

<style>
*{
  margin:0;
  padding:0;
}
ul{
    display: flex;
    justify-content: space-around;
}
li{
  list-style: none;
}
header{
  padding:10px 0;
  background:#e47031;
}
</style>

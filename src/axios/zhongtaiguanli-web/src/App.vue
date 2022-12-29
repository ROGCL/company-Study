<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  created() {},
  methods: {},
};
</script>

<style lang="scss">
html,
body {
  height: 100%;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f7f7f7;
  height: 100%;
  overflow-y: none;
}

.el-tooltip__popper {
  max-width: 800px;
  max-width: 52vw;
}

* {
  box-sizing: border-box;
}
.filter-custom {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;

  .label {
    margin-right: 12px;
    font-size: 14px;
  }
}
.table-custom {
  padding: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .downDataToExcel {
    margin-bottom: 20px;
  }
  .pagination {
    margin: 20px;
  }
}
.pagination-custom {
  margin-top: 20px;
}
</style>

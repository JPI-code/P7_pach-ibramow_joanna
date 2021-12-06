var test=new Vue({
    el:'#test',
    data: {
        text: 'Hello World!'
    }
})

Vue.component("test_item", {
    template:"<h2>test_item</h2>"
})
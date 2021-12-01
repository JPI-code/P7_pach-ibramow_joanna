var test=new Vue({
    el:'#test',
    data: {
        text: 'Hello Word!'
    }
})

Vue.component("test_item", {
    template:"<h2>test_item</h2>"
})
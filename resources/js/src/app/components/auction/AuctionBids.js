// Vue.component('auction-bids', {
//     template: `<div>My name is {{name}} and I'm {{age}} years old.<input v-model="name"><input v-model="age">`,
//     data() {
//         return {
//             name: "Bob",
//             age: 22
//         };
//     },
//     methods: {
//     }
// })
//
// new Vue({
//             el: '#addAuctionVue',
//             data: {
//
//             },
//
//         })

`<!--<div>My name is {{name}} and I'm {{age}} years old.<input v-model="name"><input v-model="age"></div>-->`

// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");

Vue.component("auction-test", {

    props: [
        "template",
    ],

    data()
    {
        return {
        };
    },

    created()
    {
        this.$options.template = this.template;
    },

});

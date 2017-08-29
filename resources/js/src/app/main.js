const AuctionTest = require("components/auction/AuctionBids");


Vue.component('auction-bids', {
    template: `<div>My name is {{name}} and I'm {{age}} years old.<input v-model="name"><input v-model="age"></div>`,
    data() {
        return {
            name: "Bob",
            age: 22
        };
    },
    methods: {
    }
})

new Vue({
            el: '#addAuctionVue',
            components: {
              'auction-test': AuctionTest
            },
            data: {
            },

        })


// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");

Vue.component("auction-bids", {
    name: 'auctionbids',
    template: "<div>My name is {{name}} and I'm {{age}} years old.<input v-model=\"name\"><input v-model=\"age\"></div>",
    data()
    {
        return {
            name: "Bob",
            age: 22
        };
    },
    methods: {
    }
});

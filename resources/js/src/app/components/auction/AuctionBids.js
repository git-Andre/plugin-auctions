
// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");

Vue.component("auction-bids", {
    name: 'auctionbids',
    template: `
    <div class="col-lg-8 offset-lg-2" formGroup="maxBid">
        <p>{{name}} and I'm {{age}} years old</p>
        <input class="form-control form-control-lg text-muted"
                type="number"
                id="maximumBid"
                placeholder="Ihr Maximalgebot"
                aria-describedby="maxBidHelpBlock">
        <p id="maxBidHelpBlock" class="form-text text-muted text-center"> Bitte geben Sie
                                                                          mindestens 
                                                                          EUR ein!</p>
        <button class="btn btn-primary btn-lg btn-block" type="submit">Gebot abgeben</button>
    </div>
    `
    ,
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
// Vue.component("auction-bids", {
//     name: 'auctionbids',
//     template: "<div>My name is {{name}} and I'm {{age}} years old.<input v-model=\"name\"><input v-model=\"age\"></div>",
//     data()
//     {
//         return {
//             name: "Bob",
//             age: 22
//         };
//     },
//     methods: {
//     }
// });

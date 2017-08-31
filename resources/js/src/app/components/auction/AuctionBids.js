// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");
// Vue.config.devtools = true

Vue.component( "auction-bids", {
    name: "auctionbids",
    template: `
<div class="row container m-t-0 m-b-3">
    <p>${ test  }</p>
    <div class="m-b-1">
        <h4>Restzeit: <span class="countDown">{{ remainingTime }}</span></h4>
    </div>
    <div class="col-lg-8 offset-lg-2" formGroup="maxBid">
        <input class="form-control form-control-lg text-muted"
                type="number"
                id="maximumBid"
                placeholder="Ihr Maximalgebot"
                aria-describedby="maxBidHelpBlock"
        >
        <p id="maxBidHelpBlock" class="form-text text-muted text-center"> Bitte geben Sie mindestens {{ minBid }} ein!</p>
        <button class="btn btn-primary btn-lg btn-block" 
                type="submit">Gebot abgeben</button>
    </div>
</div>
    `,
    props: [
        "auction",
        "isActive"
    ],
    data: function () {
        return {
            remainingTime: "this.now",
            minBid: "this.auction",
            test: this.auction
        };
    },
    methods: {

    },
    computed: {
        // type: function () {
        //     return this.auction['id'];
        }

} );

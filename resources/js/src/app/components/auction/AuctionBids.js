// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");

Vue.component( "auction-bids", {
    name: 'auctionbids',
    template: `
<div class="root-component-auction m-t-0 m-b-2">
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
        <p id="maxBidHelpBlock" class="form-text text-muted text-center"> Bitte geben Sie mindestens {{ minBid }} EUR ein!</p>
        <button class="btn btn-primary btn-lg btn-block" type="submit">Gebot abgeben</button>
    </div>
</div>
    `
    ,
    props: [
        "auction",
    ],
    data() {
        return {
            remainingTime = this.now(),
            minBid = auction.id
        };
    },
    methods: {},
    computed: {
        now: function () {
            return Date.now()
        }
    }
} );

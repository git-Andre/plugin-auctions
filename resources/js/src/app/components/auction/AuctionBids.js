// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");

Vue.component( "auction-bids", {
    name: 'auctionbids',
    template: `
    <div class="root-component-auction">
        <dl class="auctionList">
            <div class="m-t-0">
                <dt>Restzeit:</dt>
                <dd class="countDown">{{ remainingTime }}</dd>
            </div>
        </dl>
        <div class="col-lg-8 offset-lg-2" formGroup="maxBid">
             <input class="form-control form-control-lg text-muted"
                    type="number"
                    id="maximumBid"
                    placeholder="Ihr Maximalgebot"
                    aria-describedby="maxBidHelpBlock"
                    >
            <p id="maxBidHelpBlock" class="form-text text-muted text-center"> Bitte geben Sie
                                                                              mindestens 
                                                                              EUR ein!</p>
            <button class="btn btn-primary btn-lg btn-block" type="submit">Gebot abgeben</button>
        </div>
    </div>
    `
    ,
    data() {
        return {
            remainingTime: 'Zeit wird berechnet... (in Kürze... :) )'
        };
    },
    methods: {}
} );


var Vue = require("vue");
// Vue.use(require('vue-chunk'));
// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");

Vue.component("auction-bids", {
    name: "AuctionBids",
    props: [
        "bidderList",
        "itemId",
        "item"
    ],
    data()
{
        return {
            // itemId: this.itemId,
            // bidderList: this.bidderList,
        };
    },
    created()
{
    },
    ready()
{
        this.itemId = item.itemId;
        this.bidderList = item.bidderList;
        // alert(this.itemId);
        console.log("this.itemId: " + this.itemId);
        console.log("data: " + this.bidderList);
    }
});

new Vue({
    el: 'body',
    components: {
        // nothing...
    }
        })

// const AuctionBids = require("./components/auction/AuctionBids");

// export default {
//     components: {
//         'auctionBids': AuctionBids
//     }
// }

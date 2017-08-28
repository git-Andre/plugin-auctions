// Vue.use(require('vue-chunk'));
// const ApiService      = require("services/ApiService");
// const ResourceService = require("services/ResourceService");
var Vue = require("vue");

Vue.component("auction-bids", {
    name: "AuctionBids",
    props: [
        "template",
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
        this.$options.template = this.template;
    },
    ready()
{
        this.itemId = item.itemId;
        this.bidderList = item.bidderList;
        // alert(this.itemId);
        // console.log( "this.itemId: " + this.itemId );
        // console.log( "data: " + this.bidderList );
    }
});

// const AuctionBids = require("./components/auction/AuctionBids");

// export default {
//     components: {
//         'auctionBids': AuctionBids
//     }
// }

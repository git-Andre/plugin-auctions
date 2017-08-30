Vue.config.devtools = true

vueApp = new Vue( {
                      el: "#addAuctionVue",
    template: `
        <p>
{{ auctionDataTest }}
</p>
    `,

                      components: {
                          // "auction-test": AuctionTest
                      },
                      props: [
                          "auctionData"
                      ],
                      data: function () {
                          return {
                              auctionDataTest: this.auctionData
                          }
                      }

                  } );

// var Profile;
// Profile = Vue.extend( {
//     components: {
//         auctionbids
//     },
//                           template: `
//     <p>test: {{ testData }} </p>
// `,
//                       } );
//
// new Profile().$mount( '#addAuctionVue' )

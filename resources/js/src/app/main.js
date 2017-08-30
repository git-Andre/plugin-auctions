Vue.config.devtools = true

vueApp = new Vue( {
                      el: "#addAuctionVue",
    template: `
        <p>
{{ auctionData }}
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
                              auctionData
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

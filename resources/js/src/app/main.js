Vue.config.devtools = true

vueApp = new Vue( {
                      el: "#addAuctionVue",

                      components: {
                          // "auction-test": AuctionTest
                      },
                      props: [
                      ],
                      data: function () {
                          return {
                          }
                      },
                      computed() {
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

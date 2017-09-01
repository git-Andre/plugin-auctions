
// let interval = null;
Vue.component( "auction-countdown", {
    props: [
        "template",
        "deadline",
        "stop",
        "interval" = null
    ],
    data: function data() {
        return {
            now: Math.trunc( (new Date()).getTime() / 1000 ),
            date: null,
            diff: 0
        }
    },
    created() {
        this.$options.template = this.template;
        let interval = null;
    },
    mounted() {
        this.date = Math.trunc( this.deadline)
        console.log( 'this.date: ' + this.date );

        // this.date = Math.trunc( Date.parse( this.deadline.replace( /-/g, "/" ) ) / 1000 )
        this.interval  = setInterval( () => {
            this.now = Math.trunc( (new Date()).getTime() / 1000 )
        }, 1000 )

        console.log( this.interval )
    },
    computed: {
        seconds() {
            return Math.trunc( this.diff ) % 60
        },
        minutes() {
            return Math.trunc( this.diff / 60 ) % 60
        },
        hours() {
            return Math.trunc( this.diff / 60 / 60 ) % 24
        },
        days() {
            return Math.trunc( this.diff / 60 / 60 / 24 )
        }
    },
    watch: {
        now(value) {
            this.diff = this.date - this.now;
            if ( this.diff <= 0 || this.stop ) {
                this.diff = 0;
                // Remove interval
                clearInterval( interval );
            }
        }
    }
} );

// ##########

// Vue.filter( 'twoDigits', (value) => {
//     if ( value.toString().length <= 1 ) {
//         return '0' + value.toString()
//     }
//     return value.toString()
// } )

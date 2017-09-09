Vue.component( "auction-countdown", {
    ready() {
        window.setInterval( () => {
            this.now = Math.trunc( (new Date()).getTime() / 1000 );
        }, 1000 );
    },
    props: [
        "template",
        "deadline",
        // "stop"
    ],
    data() {
        return {
            now: Math.trunc( (new Date()).getTime() / 1000 ),
            diff: 0
        }
    },
    created() {
        this.$options.template = this.template;
    },
    methods: {
        twoDigits(value) {
            if ( value.toString().length <= 1 ) {
                return '0' + value.toString()
            }
            return value.toString()
        },
        stopAuction() {
// Todo: herzlichen GWunsch Modal if loggedin user last Bidder... - CHECKOUT this item ???!!?
//             location.reload();
        }
    },
    computed: {
        seconds() {
            return this.twoDigits( (this.deadline - this.now) % 60 );
        },
        minutes() {
            return this.twoDigits( Math.trunc( (this.deadline - this.now) / 60 ) % 60 );
        },
        hours() {
            return this.twoDigits( Math.trunc( (this.deadline - this.now) / 60 / 60 ) % 24 );
        },
        days() {
            return this.twoDigits( Math.trunc( (this.deadline - this.now) / 60 / 60 / 24 ) );
        },
    },
    watch: {
        now(value) {
            this.diff = this.deadline - this.now;
            if ( this.diff <= 0) {
            // if ( this.diff <= 0 || this.stop ) {
                this.diff = 0;
                // Remove interval
                window.clearInterval();
                this.stopAuction();
            }
        }
    }
} );

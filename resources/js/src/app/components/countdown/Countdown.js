Vue.component( "auction-countdown", {
    ready() {
        this.timer = setInterval( () => { this.utcTimer() }, 1000 );
    },
    props: [
        "template",
        "deadline",
        "timer"
    ],
    data() {
        return {
            now: Math.trunc( (new Date()).getTime() / 1000 ),
            diff: 0
        }
    },
    created() {
        this.$options.template = this.template;
        this.deadline          = 0;
    },
    methods: {
        utcTimer() {
            this.now = Math.trunc( (new Date()).getTime() / 1000 );
            console.log( 'this.now: ' + this.now );

            var n = new Date()
            // n = Math.trunc( n / 1000 );
            console.log( 'n: ' + n );
            console.log( 'nUTC: ' + n.getUTCMinutes() );
            console.log( 'nUTC: ' + n.getUTCSeconds() );



        },
        twoDigits(value) {
            if ( value.toString().length <= 1 ) {
                return '0' + value.toString()
            }
            return value.toString()
        }
    },
    computed: {
        seconds() {
            return this.twoDigits( this.now % 60 ) + n.getUTCSeconds();
            // return this.twoDigits( (this.deadline - this.now) % 60 );
        },
        minutes() {
            return this.twoDigits( Math.trunc( this.now / 60 ) % 60 );
            // return this.twoDigits( Math.trunc( (this.deadline - this.now) / 60 ) % 60 );
        },
        hours() {
            return this.twoDigits( Math.trunc( this.now / 60 / 60 ) % 24 );
            // return this.twoDigits( Math.trunc( (this.deadline - this.now) / 60 / 60 ) % 24 );
        },
        days() {
            return this.twoDigits( Math.trunc(  this.now / 60 / 60 / 24 ) );
            // return this.twoDigits( Math.trunc( (this.deadline - this.now) / 60 / 60 / 24 ) );
        },
    },
    watch: {
        now(value) {
            if ( this.deadline > this.now ) {
                this.diff = this.deadline - this.now;
            }
            else {
                this.diff = 0;
                this.$parent.auctionEnd = true;
                window.clearInterval( this.timer );
            }
        }
    }
} )
;

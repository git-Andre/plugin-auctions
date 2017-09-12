Vue.component( "auction-countdown", {
    ready() {
        this.timer = setInterval( () => {
            this.now = Math.trunc( (new Date()).getTime() / 1000 );
        }, 1000 );
    },
    props: [
        "template",
        "deadline",
        "timer"
    ],
    data() {
        return {
            now: 1,
            diff: 1
        }
    },
    created() {
        this.$options.template = this.template;
        this.deadline          = 0;
    },
    methods: {
        twoDigits(value) {
            if ( value.toString().length <= 1 ) {
                return '0' + value.toString()
            }
            return value.toString()
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

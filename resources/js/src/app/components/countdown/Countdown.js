Vue.component( "auction-countdown", {
    ready() {
        window.setInterval( () => {
            this.now = Math.trunc( (new Date()).getTime() / 1000 );
        }, 1000 );
    },
    props: [
        "template",
        "deadline",
        "date",
        "stop"
    ],
    data() {
        return {
            now: Math.trunc( (new Date()).getTime() / 1000 ),
            diff: 0
        }
    },
    created() {
        this.$options.template = this.template;
        this.date              = this.deadline;
        /* String to Number ??? */
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
            return this.twoDigits((this.date - this.now) % 60);
        },
        minutes() {
            return this.twoDigits(Math.trunc( (this.date - this.now) / 60 ) % 60);
        },
        hours() {
            return this.twoDigits(Math.trunc( (this.date - this.now) / 60 / 60 ) % 24);
        },
        days() {
            return this.twoDigits(Math.trunc( (this.date - this.now) / 60 / 60 / 24 ));
        },
    },
    watch: {
        now(value) {
            this.diff = this.date - this.now;
            if ( this.diff <= 0 || this.stop ) {
                this.diff = 0;
                // Remove interval
                window.clearInterval();
            }
        }
    }
} );

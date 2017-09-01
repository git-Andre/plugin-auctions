
// let interval = null;
Vue.component( "auction-countdown", {
    ready() {
        window.setInterval(() => {
            this.now = Math.trunc((new Date()).getTime() / 1000);
        },1000);
    },
    props : {
        deadline : {
            type: Number,
            coerce: str => Math.trunc(str)
        }
    },
    data() {
        return {
            now: Math.trunc((new Date()).getTime() / 1000)
        }
    },
    computed: {
        seconds() {
            return (this.date - this.now) % 60;
        },
        minutes() {
            return Math.trunc((this.date - this.now) / 60) % 60;
        },
        hours() {
            return Math.trunc((this.date - this.now) / 60 / 60) % 24;
        },
        days() {
            return Math.trunc((this.date - this.now) / 60 / 60 / 24);
        }
    }} );

// ##########

// Vue.filter( 'twoDigits', (value) => {
//     if ( value.toString().length <= 1 ) {
//         return '0' + value.toString()
//     }
//     return value.toString()
// } )

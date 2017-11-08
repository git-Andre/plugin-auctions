Vue.component("auction-countdown", {
    props: [
        "template",
        "deadline",
        "timer",
        "now",
        "diff"
    ],
    data()
{
        return {};
    },
    created()
{
        this.$options.template = this.template;
        // this.deadline          = parseInt(this.deadline);
        this.now = Math.trunc((new Date()).getTime() / 1000);
        this.diff = 0;

    },
    ready()
{
        this.timer = window.setInterval(() =>
{
            this.Timer();
        }, 1000);
    },
    methods: {
        Timer()
{
            this.now = Math.trunc((new Date()).getTime() / 1000);
        },
        twoDigits(value)
{
            if (value.toString().length <= 1)
{
                return "0" + value.toString();
            }
            return value.toString();
        }
    },
    computed: {
        seconds()
{
            return this.twoDigits((this.deadline - this.now) % 60);
        },
        minutes()
{
            return this.twoDigits(Math.trunc((this.deadline - this.now) / 60) % 60);
        },
        hours()
{
            return this.twoDigits(Math.trunc((this.deadline - this.now) / 60 / 60) % 24);
        },
        days()
{
            return this.twoDigits(Math.trunc((this.deadline - this.now) / 60 / 60 / 24));
        }
    },
    watch: {
        now(value)
{
            if (this.deadline > this.now)
{
                this.diff = this.deadline - this.now;
            }
            else
{
                this.diff = 0;
                this.$parent.auctionEnd = true;
                window.clearInterval(this.timer);
            }
        }
    }
})
;

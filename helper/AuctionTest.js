const ApiService      = require("services/ApiService");
const ResourceService = require("services/ResourceService");

Vue.component("auction-test", {
    template: `
    <div class="col-xs-6">
        <a class="text-muted small add-to-wish-list"
                :class="{active: isActive}"
                href="javascript:void(0)"
                @click="switchState()"
                data-toggle="tooltip"
                data-placement="top"
                title="">
            <i class="fa fa-heart"></i>
            {{ "test text als Wunschlist getarnt..." }}
        </a>
    </div>
`,

    props: [
        "isActive",
        "variationId"
        // "template"
    ],

    data()
    {
        return {
            wishListCount: 0,
            isLoading: false
        };
    },

    created()
    {
        // this.$options.template = this.template;
    },

    ready()
    {
        ResourceService.bind("wishListCount", this);

        this.changeTooltipText();
    },

    methods:
    {
        switchState()
            {
            if (this.isActive)
                {
                this.removeFromWishList();
            }
            else
                {
                this.addToWishList();
            }
        },

        addToWishList()
            {
            if (!this.isLoading)
                {
                this.isLoading = true;
                ApiService.post("/rest/io/itemWishList", {variationId: this.variationId})
                        .done(() =>
                              {
                            this.isActive = true;
                            this.isLoading = false;
                            this.changeTooltipText();
                            this.updateWatchListCount(parseInt(this.wishListCount.count) + 1);
                        })
                        .fail(() =>
                              {
                            this.isLoading = false;
                        });
            }
        },

        removeFromWishList()
            {
            if (!this.isLoading)
                {
                this.isLoading = true;
                ApiService.delete("/rest/io/itemWishList/" + this.variationId)
                        .done(() =>
                              {
                            this.isActive = false;
                            this.isLoading = false;
                            this.changeTooltipText();
                            this.updateWatchListCount(parseInt(this.wishListCount.count) - 1);
                        })
                        .fail(() =>
                              {
                            this.isLoading = false;
                        });
            }
        },

        changeTooltipText()
            {
            const tooltipText = this.isActive ? "itemRemoveFromWishList" : "itemAddToWishList";

            $(".add-to-wish-list").attr("data-original-title", Translations.Template[tooltipText]).tooltip("hide").tooltip("setContent");
        },

        updateWatchListCount(count)
            {
            if (count >= 0)
                {
                ResourceService.getResource("wishListCount").set({count: count});
            }
        }
    }
});

// var ResourceService = require("services/ResourceService");

Vue.component("auction-gtc-check", {

    props: [
        "template",
        "gtcError"
    ],

    data: function()
    {
        return {
            isChecked: false,
            // gtcValidation: {gtc: {}}
        };
    },

    created: function()
    {
        this.$options.template = this.template;

        this.gtcError = true;
        // this.gtcValidation.gtc.validate = this.validate;
    },

    methods:
    {
        // validate: function()
        // {
        //     this.gtcValidation.gtc.showError = !this.isChecked;
        // }
    },

    watch:
    {
        // isChecked: function()
        // {
        //     this.gtcValidation.gtc.showError = false;
        // }
    }
});

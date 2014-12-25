(function () {
    'use strict';

    angular
        .module('thinkster.authentication.controllers')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$location', '$scope', 'Authentication'];

    function RegisterController($location, $scope, Authentication) {
        var vm = this;

        vm.register = register;

        activate();

        function activate() {
            if (Authentication.isAuthenticated()) {
                window.url = "/";
            }
        }

        function register() {
            Authentication.register(vm.email, vm.password, vm.username).then(registerSuccess, registerError);

            function registerSuccess(data, status, header, config) {
                Authentication.login(data.email, data.password);
            }

            function registerError(data, status, header, config) {
                console.error("Fatal error during register! " + data.error);
            }
        }
    }
})();
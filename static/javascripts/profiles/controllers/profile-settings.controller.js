(function () {
    'use strict';

    angular
        .module('thinkster.profiles.controllers')
        .controller('ProfileSettingsController', ProfileSettingsController);

    ProfileSettingsController.$inject = ['$location', '$routeParams', 'Authentication', 'Profile', 'Snackbar'];

    function ProfileSettingsController($location, $routeParams, Authentication, Profile, Snackbar) {
        var vm = this;

        vm.destroy = destroy;
        vm.update = update;

        activate();

        function activate() {
            var authenticatedAccount = Authentication.getAuthenticatedAccount();
            var username = $routeParams.username.substr(1);

            if (!authenticatedAccount) {
                $location.url("/");
                Snackbar.error('You are not authorized to view this page');
            } else {
                if (authenticatedAccount.username !== username) {
                    $location.url("/");
                    Snackbar.error('You are not authorized to view this page');
                }
            }

            Profile.get(username).then(profileSuccessFn, profileErrorFn);

            function profileSuccessFn(data, status, headers, config) {
                vm.profile = data.data;
            }

            function profileErrorFn(data, status, headers, config) {
                $location.url("/");
                Snackbar.error('User does not exist');
            }
        }

        function destroy() {
            console.error("Destroying " + vm.profile.username);
            Profile.destroy(vm.profile).then(destroySuccess, destroyFailure);

            function destroySuccess(data, status, headers, config) {
                Authentication.unauthenticate();
                window.location = "/";
                Snackbar.show('Your account has been deleted.');
            }

            function destroyFailure(data, status, headers, config) {
                Snackbar.error(data.error);
            }
        }

        function update() {
            Profile.update(vm.profile).then(profileSuccess, profileError);

            function profileSuccess(data, status, headers, config) {
                Snackbar.show('Profile updated');
            }

            function profileError(data, status, headers, config) {
                Snackbar.show('Couldnt update profile, ' + data.error);
            }
        }

    }
})();
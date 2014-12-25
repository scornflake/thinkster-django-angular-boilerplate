(function () {
    'use strict';

    angular
        .module('thinkster.authentication.services')
        .factory('Authentication', Authentication);

    Authentication.$inject = ['$cookies', '$http'];


    function Authentication($cookies, $http) {
        var Authentication = {
            register: register,
            login: login,
            logout: logout,
            getAuthenticatedAccount: getAuthenticatedAccount,
            setAuthenticatedAccount: setAuthenticatedAccount,
            isAuthenticated: isAuthenticated,
            unauthenticate: unauthenticate
        };

        return Authentication;

        function register(email, password, username) {
            return $http.post('/api/v1/accounts/', {
                username: username,
                password: password,
                email: email
            });
        }

        function logout() {
            return $http.post('/api/v1/logout/').then(logoutSuccess, logoutError);

            function logoutSuccess(data, status, headers, config) {
                Authentication.unauthenticate();
                window.location = "/";
            }

            function logoutError(data, status, headers, config) {
                console.error("Failed to log out the user.");
            }
        }

        function login(email, password) {
            return $http.post('/api/v1/login/', {
                email: email, password: password
            }).then(loginSuccessFn, loginErrorFn);

            function loginSuccessFn(data, status, headers, config) {
                Authentication.setAuthenticatedAccount(data.data);
                window.location = "/";
            }

            function loginErrorFn(data, status, headers, config) {
                console.error("Epic failure! " + data);
            }
        }

        function getAuthenticatedAccount() {
            if (!$cookies.authenticatedAccount) {
                return;
            }
            return JSON.parse($cookies.authenticatedAccount);
        }

        function setAuthenticatedAccount(account) {
            $cookies.authenticatedAccount = JSON.stringify(account);
        }

        function isAuthenticated() {
            return !!$cookies.authenticatedAccount;
        }

        function unauthenticate() {
            delete $cookies.authenticatedAccount;
        }
    }
})();
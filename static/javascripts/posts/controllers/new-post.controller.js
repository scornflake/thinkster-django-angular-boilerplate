(function () {
    'use strict';

    angular
        .module('thinkster.posts.controllers')
        .controller('NewPostController', NewPostController);

    NewPostController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar', 'Posts'];

    function NewPostController($rootScope, $scope, Authentication, Snackbar, Posts) {
        var vm = this;

        vm.submit = submit;

        function submit() {
            $rootScope.$broadcast('post.created', {
                content: vm.content,
                author: {
                    username: Authentication.getAuthenticatedAccount().username
                }
            });

            $scope.closeThisDialog();

            Posts.create(vm.content).then(postSuccess, postFailure);

            function postSuccess(data, status, headers, config) {
                Snackbar.show('Success! Post created');
            }

            function postFailure(data, status, headers, config) {
                $rootScope.$broadcast('post.created.error');
                Snackbar.error('Failed to create new post');
            }
        }


    }
})();
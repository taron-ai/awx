/*********************************************
 *  Copyright (c) 2014 AnsibleWorks, Inc.
 *
 * aboutansible.js
 *
 * The new about menu
 *
 */
  /**
 * @ngdoc overview
 * @name helpers
 * @description These are helpers...figure it out :)
*/
 /**
 * @ngdoc function
 * @name helpers.function:AboutAnsible
 * @description This is the code for the About Ansible modal window that pops up with cowsay giving company/tower info and copyright information.
*/


angular.module('AboutAnsibleHelpModal', ['RestServices', 'Utilities','ModalDialog'])
    .factory('AboutAnsibleHelp', ['$rootScope', '$compile', '$location' , 'Rest', 'GetBasePath', 'ProcessErrors', 'Wait', 'CreateDialog',
        function ($rootScope, $compile , $location, Rest, GetBasePath, ProcessErrors, Wait, CreateDialog) {
            return function () {

                var scope= $rootScope.$new(),
                url;

                url = GetBasePath('config');
                Rest.setUrl(url);
                Rest.get()
                    .success(function (data){
                        scope.$emit('BuildAboutDialog', data);
                    })
                    .error(function (data, status) {
                        ProcessErrors(scope, data, status, null, { hdr: 'Error!',
                            msg: 'Failed to get: ' + url + ' GET returned: ' + status });
                    });


                if (scope.removeDialogReady) {
                    scope.removeDialogReady();
                }
                scope.removeDialogReady = scope.$on('DialogReady', function() {
                   // element = angular.element(document.getElementById('about-modal-dialog'));
                   // $compile(element)(scope);
                    $('#about-modal-dialog').dialog('open');
                });

                if (scope.removeBuildAboutDialog) {
                    scope.removeBuildAboutDialog();
                }
                scope.removeBuildAboutDialog = scope.$on('BuildAboutDialog', function(e, data) {
                    var spaces, i, j,
                    paddedStr  = "",
                    version = data.version.replace(/-.*$/,'');

                    spaces = Math.floor((16-version.length)/2);
                    for( i=0; i<=spaces; i++){
                        paddedStr = paddedStr +" ";
                    }
                    paddedStr = paddedStr+version;
                    for( j = paddedStr.length; j<16; j++){
                        paddedStr = paddedStr + " ";
                    }
                    $('#about-modal-version').html(paddedStr);
                    scope.modalOK = function(){
                        $('#about-modal-dialog').dialog('close');
                    };
                    CreateDialog({
                        id: 'about-modal-dialog',
                        scope: scope,
                        // buttons: [],
                        width: 710,
                        height: 380,
                        minWidth: 300,
                        resizable: false,
                        // title:  , //'<img src="static/img/tower_login_logo.png">' ,//'About Ansible',
                        callback: 'DialogReady',
                        onOpen: function(){
                            $('#dialog-ok-button').focus();
                            $('#about-modal-dialog').scrollTop(0);
                            $('#about-modal-dialog').css('overflow-x', 'hidden');
                            $('.ui-widget-overlay').css('width', '100%');
                        }
                    });
                });

            };
        }
]);
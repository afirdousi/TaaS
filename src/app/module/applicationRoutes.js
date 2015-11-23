(function() {
    'use strict';

    var mainApp = angular.module('mainApp');

    mainApp.config([
        '$stateProvider',
        '$urlRouterProvider',
        'USER_ROLES',
        function($stateProvider, $urlRouterProvider, USER_ROLES) {

            $urlRouterProvider.otherwise('/search');
            $stateProvider
               .state('app', {
                    abstract: true,
                    views: {
                        root: {
                            templateUrl: 'app/views/mainLayout/mainLayout.html'
                        }
                    }
                })
               .state('app.search', {
                    url: '/dashboard',
                    views: {
                        "content@app": {
                            templateUrl: 'app/views/dashboardView/tester-dashboardView.html',
                            controller: 'dashboardViewCtrl',
                            controllerAs: 'vmSearch'
                        }
                    },
                    data: {
                        title: 'Search',
                        isSearchView: true,
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.basic]
                    }
                })
               .state('app.profile', {
                    url: '/profile',
                    views: {
                        "content@app": {
                            templateUrl: 'app/views/tester-profile/tester-profile.html',
                            controller: 'testerProfileCtrl',
                            controllerAs: 'vmTesterProfile'
                        }
                    },
                    data: {
                        title: 'Tester Profile',
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.basic]
                    }
                })
               .state('app.payment', {
                    url: '/payment',
                    views: {
                        "content@app": {
                            templateUrl: 'app/views/tester-payment/tester-payment.html',
                            controller: 'testerPaymentCtrl',
                            controllerAs: 'vmTesterPayment'
                        }
                    },
                    data: {
                        title: 'Tester Payment',
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.basic]
                    }
                })
               .state('app.bug', {
                    url: '/bug',
                    views: {
                        "content@app": {
                            templateUrl: 'app/views/tester-bug/tester-bug.html',
                            controller: 'testerBugCtrl',
                            controllerAs: 'vmTesterBug'
                        }
                    },
                    data: {
                        title: 'Bug Tracker',
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.basic]
                    }
                })
               .state('app.newoffer', {
                    url: '/newoffer',
                    views: {
                        "content@app": {
                            templateUrl: 'app/views/tester-newoffer/tester-newoffer.html',
                            controller: 'newOfferCtrl',
                            controllerAs: 'vmNewOffer'
                        }
                    },
                    data: {
                        title: 'New Project Offers',
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.basic]
                    }
                })
               .state('app.notification', {
                    url: '/notification',
                    views: {
                        "content@app": {
                            templateUrl: 'app/views/notification/notification.html',
                            controller: 'notificationCtrl',
                            controllerAs: 'vmNotification'
                        }
                    },
                    data: {
                        title: 'Notification',
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.basic]
                    }
                })
                .state('app.project', {
                    url: '/project',
                    views: {
                        "content@app": {
                            templateUrl: 'app/views/project/tester-project.html',
                            controller: 'testerProjectCtrl',
                            controllerAs: 'vmProject'
                        }
                    },
                    data: {
                        title: 'Project',
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.basic]
                    }
                })
                .state('app.project.detail', {
                    url: '/detail',
                    views: {
                        "detail@app.project": {
                            templateUrl: 'app/views/project/tester-project-detail.html',
                            controller: 'testerProjectDetailCtrl',
                            controllerAs: 'vmProjectDetail'
                        }
                    },
                    params:{
                      projectId:null
                    },
                    data: {
                        title: 'Project Details',
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.basic]
                    }
                })
               .state('app.config', {
                    url: '/config',
                    views: {
                        "content@app": {
                            templateUrl: 'app/views/configurationView/configurationView.html',
                            controller: 'configurationViewCtrl',
                            controllerAs: 'vmConfig'
                        }
                    },
                    data: {
                        title: 'Configuration',
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.basic]
                    }
                })
               .state('app.login', {
                    url: '/login',
                    views: {
                        "content@app": {
                            templateUrl: 'app/views/login/login.html',
                            controller: 'loginCtrl',
                            controllerAs: 'vmLogin'
                        }
                    },
                    data: {
                        title: 'Login',
                        isLoginPage: true
                    }
                })
               .state('app.accessDenied', {
                    url: '/access',
                    views: {
                        "content@app": {
                            templateUrl: 'app/views/accessView/accessDenied.html',
                            controller: 'accessDeniedCtrl',
                            controllerAs: 'vmAccessDenied'
                        }
                    },
                    data: {
                        title: 'Access Denied'
                    }
                })
               .state('app.admin', {
                    url: '/admin',
                    views: {
                        "content@app": {
                            templateUrl: 'app/views/adminView/admin.html',
                            controller: 'adminCtrl',
                            controllerAs: 'vmAdmin'
                        }
                    },
                    data: {
                        title: 'Admin',
                        authorizedRoles: [USER_ROLES.admin]
                    }
                })
               .state('app.admin.addUser', {
                    url: '/addUser',
                    views: {
                        "admin-content@app.admin": {
                            templateUrl: 'app/views/userView/addUser.html',
                            controller: 'addUserCtrl',
                            controllerAs: 'vmAddUser'
                        }
                    },
                    data: {
                        title: 'Admin - Add User',
                        authorizedRoles: [USER_ROLES.admin]
                    }
                })
               .state('app.admin.updateUser', {
                    url: '/updateUser',
                    views: {
                        "admin-content@app.admin": {
                            templateUrl: 'app/views/userView/updateUser.html',
                            controller: 'updateUserCtrl',
                            controllerAs: 'vmUpdateUser'
                        }
                    },
                    data: {
                        title: 'Admin - Update User',
                        authorizedRoles: [USER_ROLES.admin]
                    }
                })
               .state('app.admin.changeSolr', {
                    url: '/changeSolr',
                    views: {
                        "admin-content@app.admin": {
                            templateUrl: 'app/views/configSolrView/changeSolrCollection.html',
                            controller: 'changeSolrCollection',
                            controllerAs: 'vmChangeSolr'
                        }
                    },
                    data: {
                        title: 'Admin - Change Solr',
                        authorizedRoles: [USER_ROLES.admin]
                    }
                })
               .state('app.admin.maintenance', {
                    url: '/maintenance',
                    views: {
                        "admin-content@app.admin": {
                            templateUrl: 'app/views/maintenanceView/maintenanceView.html',
                            controller: 'maintenanceViewCtrl',
                            controllerAs: 'vmMaintenance'
                        }
                    },
                    data: {
                        title: 'Admin - Change Solr',
                        authorizedRoles: [USER_ROLES.admin]
                    }
                })
               .state('app.savedSearch', {
                    url: '/savedSearch',
                    views: {
                        "content@app": {
                            templateUrl: 'app/views/savedSearchView/savedSearch.html',
                            controller: 'savedSearchCtrl',
                            controllerAs: 'vmSavedSearch'
                        }
                    },
                    data: {
                        title: 'Saved Search',
                        authorizedRoles: [USER_ROLES.admin, USER_ROLES.advance]
                    }
                })
               .state('app.outage', {
                    url: '/outage',
                    views: {
                        "content@app": {
                            templateUrl: 'app/views/maintenanceView/outageView.html',
                            controller: 'outageViewCtrl',
                            controllerAs: 'vmOutage'
                        }
                    },
                    data: {
                        title: 'Saved Search',
                        authorizedRoles: []
                    }
                })
        }
    ]);

})();

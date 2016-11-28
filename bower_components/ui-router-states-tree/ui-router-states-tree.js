'use strict';

(function () {
    /**
     * @ngdoc overview
     * @name statesTree
     */
    angular.module('statesTree', ['ui.router']).
    /**
     * @ngdoc object
     * @name statesTree.statesTree
     * @requires $state
     */
        service('statesTree', [
            '$state',

            function ($state) {
                var statesTree = {
                    get: function () {
                        var tree = [];
                        angular.forEach($state.get(), function (state) {
                            placeState(tree, state);
                        });
                        return tree;
                    }
                };

                return statesTree;
            }
        ]);

    function placeState(tree, state) {
        var path = state.name.split('.');
        var node = tree;
        var currPath = [];
        angular.forEach(path, function (dir) {
            currPath.push(dir);
            var isLast = currPath.length === path.length;
            if (isLast) {
                //add state at current level:
                var copiedState=angular.copy(state);
                node.push(copiedState);
            } else {
                //next path part lays deeper
                var currPathStr = currPath.join('.');
                var parent;
                angular.forEach(node, function (item) {
                    if(item.name === currPathStr){
                        parent=item;
                    }
                });
                if (parent) {
                    if(!parent.hasOwnProperty('children')){
                        parent.children=[];
                    }
                    node = parent.children;
                } else {
                    throw 'no parent for state ' + parent + ' ' + state.name;
                }
            }

        });
    };

})();

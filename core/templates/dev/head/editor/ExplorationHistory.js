// Copyright 2014 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Controllers for the exploration history tab.
 *
 * @author sll@google.com (Sean Lip)
 */

oppia.controller('ExplorationHistory', ['$scope', '$http', 'explorationData', function(
    $scope, $http, explorationData) {
  $scope.explorationId = explorationData.explorationId;
  $scope.explorationSnapshotsUrl = '/createhandler/snapshots/' + $scope.$parent.explorationId;
  $scope.explorationSnapshots = null;

  $scope.$on('refreshVersionHistory', function(evt, data) {
    if (data.forceRefresh || $scope.explorationSnapshots === null) {
      $scope.refreshVersionHistory();
    }
  });

  // Refreshes the displayed version history log.
  $scope.refreshVersionHistory = function() {
    $scope.currentVersion = explorationData.data.version;
    $scope.compareVersion = {
      V1: $scope.currentVersion,
      V2: $scope.currentVersion
    }

    $http.get($scope.explorationSnapshotsUrl).then(function(response) {
      var data = response.data;

      $scope.explorationSnapshots = [];
      for (var i = 0; i < data.snapshots.length; i++) {
        $scope.explorationSnapshots.push({
          'committerId': data.snapshots[i].committer_id,
          'createdOn': data.snapshots[i].created_on,
          'commitMessage': data.snapshots[i].commit_message,
          'versionNumber': data.snapshots[i].version_number,
          'autoSummary': data.snapshots[i].auto_summary
        });
      }
    });
  };

  // Downloads the zip file for an exploration.
  $scope.downloadExplorationWithVersion = function(versionNumber) {
    // Note that this opens (and then immediately closes) a new tab. If we do
    // this in the same tab, the beforeunload handler is triggered.
    window.open($scope.explorationDownloadUrl + '?v=' + versionNumber, '&output_format=zip');
  };

  // Downloads the json string for an exploration.
  $scope.compareExplorations = function() {
    $http.get($scope.explorationDownloadUrl + '?v=' + $scope.compareVersion.V1 +
        '&output_format=json').then(function(response) {
      $scope.yamlStrV1 = response.data.yaml;
    });
    $http.get($scope.explorationDownloadUrl + '?v=' + $scope.compareVersion.V2 +
        '&output_format=json').then(function(response) {
      $scope.yamlStrV2 = response.data.yaml;
    });
  };
}]);

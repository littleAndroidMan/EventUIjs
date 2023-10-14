/**Copyright (c) 2023 Richard H Stannard
 
This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.*/

const EVUIUnit = {};
EVUIUnit.Controllers = {};
EVUIUnit.Resources = {};

/**The arguments injected from the server into the JS page that is spawning iframes to run tests.
@type {EVUIUnit.Resources.TestHostServerArgs}*/
EVUIUnit.TestHostServerArgs = {};

/**The arguments injected from the server into the JS page that is running a test.
@type {EVUIUnit.Resources.TestRunnerServerArgs}*/
EVUIUnit.TestRunnerServerArgs = {};

EVUIUnit.Constants = {};
EVUIUnit.Constants.QS_TestFile = "file";
EVUIUnit.Constants.Path_TestRunner = "/Unit/TestRunner";
EVUIUnit.Constants.Class_TestOutput = "testOutput";
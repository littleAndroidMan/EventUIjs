﻿/**Copyright (c) 2023 Richard H Stannard

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.*/

namespace EventUITestFramework.Model.Tests
{

    /// <summary>
    /// Indicates what type of test "runnable" object is being referenced.
    /// </summary>
    public enum TestRunnableType
    {
        /// <summary>
        /// Default.
        /// </summary>
        None = 0,
        /// <summary>
        /// Item is a dependency for a test.
        /// </summary>
        Dependency = 1,
        /// <summary>
        /// Item is a set of Runnables.
        /// </summary>
        Set = 2,
        /// <summary>
        /// Item is a code file with JavaScript tests inside.
        /// </summary>
        File = 3,
        /// <summary>
        /// Item is a piece of JavaScript test code.
        /// </summary>
        TestCode = 4,
        /// <summary>
        /// Item is a test root and starts a new hierarchy.
        /// </summary>
        Root = 5
    }

    /// <summary>
    /// Modes for indicating what should happen should a runnable fail.
    /// </summary>
    public enum TestFailureMode
    {
        /// <summary>
        /// A failing test will not stop any further execution of tests.
        /// </summary>
        Continue = 0,
        /// <summary>
        /// A failing test will stop the execution of the container that contains it.
        /// </summary>
        Abandon = 1,
        /// <summary>
        /// A failing test will stop all further test execution.
        /// </summary>
        Terminate = 2
    }

    public enum TestDependencyMode
    {
        None = 0,
        Add = 1,
        Remove = 2,
    }
}
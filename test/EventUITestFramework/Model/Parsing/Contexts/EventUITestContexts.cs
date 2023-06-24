﻿/**Copyright (c) 2023 Richard H Stannard

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.*/

namespace EventUITestFramework.Model.Parsing.Contexts
{
    public static class EventUITestContexts
    {
        public static EventUITestStringContext StringContext { get; set; } = new EventUITestStringContext();

        public static EventUITestDirectiveStringContext ParameterStringContext { get; } = new EventUITestDirectiveStringContext();

        public static EventUITestDirectiveContext DirectiveContext { get; } = new EventUITestDirectiveContext();

        public static EventUITestFileContext FileContext { get; } = new EventUITestFileContext();

        public static EventUITestParameterContext ParameterContext { get; } = new EventUITestParameterContext();

        public static EventUISingleLineCommentContext SingleLineCommentContext { get; } = new EventUISingleLineCommentContext();

    }
}

﻿/**Copyright (c) 2023 Richard H Stannard

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.*/

namespace EventUITestFramework.Model.Parsing.Contexts
{
    /// <summary>
    /// Represents a run of literal text (between two double-quotes) that should not have any other tokens processed in it.
    /// </summary>
    public class EventUITestDirectiveStringContext : TokenContextDefinition
    {
        public EventUITestDirectiveStringContext()
            : base("EventUITestDirectiveStringContext")
        {
            AddToken<DirectiveParameterStringToken>();
            AddToken<BackslashToken>();
        }

        public override bool EndsCurrentContext(TokenInstance tokenInstance)
        {
            if (base.EndsCurrentContext(tokenInstance) == true)
            {
                var previous = tokenInstance.GetPreviousToken();
                if (previous.Is<BackslashToken>()) return false;
                return true;
            }

            return false;
        }

        public override bool StartsNewContext(TokenInstance tokenInstance)
        {
            return false;
        }
    }
}


define (function ()
{
"use strict";

	return function (type, node)
	{
		try
		{
			if (node)
			{
				if (node .getValue)
					node = node .getValue ();

				if (node)
				{
					node = node .getInnerNode ();
				
					if (node .getType () .indexOf (type) !== -1)
						return node;
				}
			}
		}
		catch (error)
		{ }

		return null;
	}
});

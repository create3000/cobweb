
define (function ()
{
	return function (type, node)
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

		return null;
	}
});

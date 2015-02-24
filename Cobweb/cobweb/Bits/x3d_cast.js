
define (function ()
{
	return function (type, node)
	{
		node = node .getValue ();

		if (node)
		{
			node = node .getInnerNode ();
		
			if (type in node .getType ())
				return node;
		}

		return null;
	}
});

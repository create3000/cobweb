
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
],
function ($, X3DField, X3DConstants)
{
	var handler =
	{
		get: function (target, key)
		{
			if (key in target)
				return target [key];

			try
			{
				return target .getValue () .getField (key) .valueOf ();
			}
			catch (error)
			{
				return undefined;
			}
 		},
		set: function (target, key, value)
		{
			if (key in target)
				return target [key] = value;

			try
			{
				var
					field      = target .getValue () .getField (key),
					accessType = field .getAccessType ();

				if (accessType === X3DConstants .initializeOnly || accessType === X3DConstants .outputOnly)
					field .setValue (value);

	 			return true;
			}
			catch (error)
			{
				return false;
			}
		},
	};

	function SFNode (value)
	{
		X3DField .call (this, value ? value : null);

		return new Proxy (this, handler);
	}

	SFNode .prototype = $.extend (new X3DField (),
	{
		constructor: SFNode,
		copy: function ()
		{
			return new SFNode (this .getValue ());
		},
		getTypeName: function ()
		{
			return "SFNode";
		},
		getType: function ()
		{
			return X3DConstants .SFNode;
		},
		set: function (value)
		{
			X3DField .prototype .set .call (this, value ? value : null);
		},
		getNodeTypeName: function ()
		{
			return this .getValue () .getTypeName ();
		},
		getNodeName: function ()
		{
			return this .getValue () .getName ();
		},
		getFieldDefinitions: function ()
		{
			return this .getValue () .getFieldDefinitions ();
		},
		valueOf: function ()
		{
			if (this .getValue ())
				return this;

			return null;	
		},
		toString: function ()
		{
			var node = this .getValue ();
			return node ? node .toString () : "NULL";
		},
		toVRMLString: function ()
		{
			var node = this .getValue ();
			return node ? node .toVRMLString () : "NULL";
		},
		toXMLString: function ()
		{
			var node = this .getValue ();
			return node ? node .toXMLString () : "<!-- NULL -->";
		},
	});

	return SFNode;
});
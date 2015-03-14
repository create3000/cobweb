
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

			return target .getValue () .getField (key) .valueOf ();
 		},
		set: function (target, key, value)
		{
			if (key in target)
				return target [key] = value;

			target .getValue () .getField (key) .setValue (value);
 			return true;
		},
	};

	function SFNode (value)
	{
		X3DField .call (this, value ? value : null);

		var field = new Proxy (this, handler);

		return field;
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
		toString: function ()
		{
			return this .getValue () ? this .getValue () .toString () : "NULL";
		},
		toVRMLString: function ()
		{
			return this .getValue () ? this .getValue () .toVRMLString () : "NULL";
		},
		toXMLString: function ()
		{
			return this .getValue () ? this .getValue () .toXMLString () : "<!-- NULL -->";
		},
		valueOf: function ()
		{
			if (this .getValue ())
				return this;

			return null;	
		},
	});

	return SFNode;
});
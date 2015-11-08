
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
],
function ($, X3DField, X3DConstants)
{
"use strict";

	var handler =
	{
		get: function (target, key)
		{
			if (key in target)
				return target [key];

			try
			{
				var
					field      = target .getValue () .getField (key),
					accessType = field .getAccessType ();

				// Specification conform would be: accessType & X3DConstants .outputOnly.
				// But we allow read access to plain fields, too.
				if (accessType !== X3DConstants .inputOnly)
					return field .valueOf ();

				return undefined;
			}
			catch (error)
			{
				return undefined;
			}
 		},
		set: function (target, key, value)
		{
			if (key in target)
			{
				target [key] = value;
				return true;
			}

			try
			{
				var
					field      = target .getValue () .getField (key),
					accessType = field .getAccessType ();

				if (accessType & X3DConstants .inputOnly)
					field .setValue (value);

	 			return true;
			}
			catch (error)
			{
				//console .log (target, key, error);
				return false;
			}
		},
	};

	function SFNode (value)
	{
	   if (this instanceof SFNode)
	   {
			X3DField .call (this, value ? value : null);

			return new Proxy (this, handler);
		}

		return SFNode .call (Object .create (SFNode .prototype), value);
	}

	SFNode .prototype = $.extend (Object .create (X3DField .prototype),
	{
		constructor: SFNode,
		clone: function ()
		{
			return new SFNode (this .getValue ());
		},
		copy: function (executionContext)
		{
			var value = this .getValue ();
			
			if (value)
				return new SFNode (value .copy (executionContext));

			return new SFNode ();
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
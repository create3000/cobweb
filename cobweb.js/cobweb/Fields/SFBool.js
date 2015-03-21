
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
],
function ($, X3DField, X3DConstants)
{
	function SFBool (value)
	{
		X3DField .call (this, Boolean (value));
	}

	SFBool .prototype = $.extend (new X3DField (),
	{
		constructor: SFBool,
		copy: function ()
		{
			return new SFBool (this .getValue ());
		},
		equals: function (value)
		{
			return this .getValue () == value;
		},
		set: function (value)
		{
			X3DField .prototype .set .call (this, Boolean (value));
		},
		valueOf: function ()
		{
			return this .getValue ();
		},
		getTypeName: function ()
		{
			return "SFBool";
		},
		getType: function ()
		{
			return X3DConstants .SFBool;
		},
		valueOf: X3DField .prototype .getValue,
		toString: function ()
		{
			return this .getValue () ? "TRUE" : "FALSE";
		},
	});

	return SFBool;
});


define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
],
function ($, X3DField, X3DConstants)
{
	var
		unescape = /\\([\\"])/g,
		escape   = /([\\"])/g;

	function SFString (value)
	{
		X3DField .call (this, arguments .length ? String (value) : "");
	}
	
	$.extend (SFString,
	{
		unescape: function (string)
		{
			return string .replace (unescape, "$1");
		},
		escape: function (string)
		{
			return string .replace (escape, "\\$1");
		},
	});

	SFString .prototype = $.extend (new X3DField (),
	{
		constructor: SFString,
		copy: function ()
		{
			return new SFString (this .getValue ());
		},
		getTypeName: function ()
		{
			return "SFString";
		},
		getType: function ()
		{
			return X3DConstants .SFString;
		},
		set: function (value)
		{
			X3DField .prototype .set .call (this, String (value));
		},
		valueOf: function ()
		{
			return this .getValue ();
		},
		toString: function ()
		{
			return '"'+ SFString .escape (this .getValue ()) + '"';
		},
	});

	Object .defineProperty (SFString .prototype, "length",
	{
		get: function ()
		{
			return this .getValue () .length;
		},
		enumerable: true,
		configurable: false
	});

	return SFString;
});

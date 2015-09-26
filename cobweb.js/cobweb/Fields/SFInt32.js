
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
],
function ($, X3DField, X3DConstants)
{
	function SFInt32 (value)
	{
		if (this instanceof SFInt32)
			return X3DField .call (this, ~~value);
		
		return X3DField .call (Object .create (SFInt32 .prototype), ~~value);
	}

	SFInt32 .prototype = $.extend (Object .create (X3DField .prototype),
	{
		constructor: SFInt32,
		copy: function ()
		{
			return new SFInt32 (this .getValue ());
		},
		getTypeName: function ()
		{
			return "SFInt32";
		},
		getType: function ()
		{
			return X3DConstants .SFInt32;
		},
		set: function (value)
		{
			X3DField .prototype .set .call (this, ~~value);
		},
		valueOf: X3DField .prototype .getValue,
		toString: function ()
		{
			return String (this .getValue ());
		},
	});

	return SFInt32;
});

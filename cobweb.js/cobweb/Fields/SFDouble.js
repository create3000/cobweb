
define ([
	"jquery",
	"cobweb/Basic/X3DField",
	"cobweb/Bits/X3DConstants",
],
function ($, X3DField, X3DConstants)
{
	function SFDouble (value)
	{
		if (this instanceof SFDouble)
			return X3DField .call (this, arguments .length ? +value : 0);
		
		return X3DField .call (Object .create (SFDouble .prototype), arguments .length ? +value : 0);
	}

	SFDouble .prototype = $.extend (Object .create (X3DField .prototype),
	{
		constructor: SFDouble,
		copy: function ()
		{
			return new SFDouble (this .getValue ());
		},
		getTypeName: function ()
		{
			return "SFDouble";
		},
		getType: function ()
		{
			return X3DConstants .SFDouble;
		},
		set: function (value)
		{
			X3DField .prototype .set .call (this, +value);
		},
		valueOf: X3DField .prototype .getValue,
		toString: function ()
		{
			return String (this .getValue ());
		},
	});

	return SFDouble;
});

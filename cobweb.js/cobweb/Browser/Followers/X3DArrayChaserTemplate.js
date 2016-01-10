
define ("cobweb/Browser/Followers/X3DArrayChaserTemplate",
[
	"jquery",
	"cobweb/Browser/Followers/X3DArrayFollowerTemplate",
],
function ($,
          X3DArrayFollowerTemplate)
{
"use strict";

	return function (Type)
	{
		function X3DArrayChaserObject ()
		{
			this .array = this .getArray ();
		}
	
		X3DArrayChaserObject .prototype = $.extend (Object .create (X3DArrayFollowerTemplate (Type) .prototype),
		{
			setPreviousValue: function (value)
			{
				this .previousValue .setValue (value);
			},
			step: function (value1, value2, t)
			{
				var
					output   = this .output .getValue (),
					deltaOut = this .deltaOut .getValue ();

				value1 = value1 .getValue ();
				value2 = value2 .getValue ();

				this .deltaOut .length = output .length;

				for (var i = 0, length = output .length; i < length; ++ i)
					output [i] .getValue () .add (deltaOut [i] .getValue () .assign (value1 [i] .getValue ()) .subtract (value2 [i] .getValue ()) .multiply (t));
			},
		});
	
		return X3DArrayChaserObject;
	};
});




define ([
	"jquery",
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Fields",
],
function ($,
          X3DBaseNode,
          Fields)
{
"use strict";
	
	function Arc2DOptions (executionContext)
	{
		X3DBaseNode .call (this, executionContext);

		this .addChildren ("minAngle", new Fields .SFFloat (Math .PI / 20))
	}

	Arc2DOptions .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: Arc2DOptions,
		getTypeName: function ()
		{
			return "Arc2DOptions";
		},
		getComponentName: function ()
		{
			return "Cobweb";
		},
		getContainerField: function ()
		{
			return "arc2DOptions";
		},
	});

	return Arc2DOptions;
});

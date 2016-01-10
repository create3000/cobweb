
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
	
	function ArcClose2DOptions (executionContext)
	{
		X3DBaseNode .call (this, executionContext);

		this .addChildren ("minAngle", new Fields .SFFloat (Math .PI / 20))
	}

	ArcClose2DOptions .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: ArcClose2DOptions,
		getTypeName: function ()
		{
			return "ArcClose2DOptions";
		},
		getComponentName: function ()
		{
			return "Cobweb";
		},
		getContainerField: function ()
		{
			return "arcClose2DOptions";
		},
	});

	return ArcClose2DOptions;
});

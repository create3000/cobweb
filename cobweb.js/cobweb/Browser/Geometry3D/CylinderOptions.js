
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DBaseNode",
],
function ($,
          Fields,
          X3DBaseNode)
{
"use strict";
	
	function CylinderOptions (executionContext)
	{
		X3DBaseNode .call (this, executionContext);
			
		this .addChildren ("uDimension", new Fields .SFInt32 (1),
		                   "vDimension", new Fields .SFInt32 (20))
	}

	CylinderOptions .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: CylinderOptions,
		getTypeName: function ()
		{
			return "CylinderOptions";
		},
		getComponentName: function ()
		{
			return "Cobweb";
		},
		getContainerField: function ()
		{
			return "cylinderOptions";
		},
	});

	return CylinderOptions;
});

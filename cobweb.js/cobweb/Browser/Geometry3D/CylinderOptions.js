
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DBaseNode",
],
function ($,
          Fields,
          X3DBaseNode)
{
	with (Fields)
	{
		function CylinderOptions (executionContext)
		{
			X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);
				
			this .addChildren ("uDimension", new SFInt32 (1),
			                   "vDimension", new SFInt32 (20))
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
	}
});

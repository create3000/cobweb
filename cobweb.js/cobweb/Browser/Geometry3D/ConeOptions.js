
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
		function ConeOptions (executionContext)
		{
			X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);
		}

		ConeOptions .prototype = $.extend (new X3DBaseNode (),
		{
			constructor: ConeOptions,
			initialize: function ()
			{
				X3DBaseNode .prototype .initialize .call (this);

				this .addChildren ("uDimension", new SFInt32 (1),
				                   "vDimension", new SFInt32 (20))
			},
		});

		return ConeOptions;
	}
});

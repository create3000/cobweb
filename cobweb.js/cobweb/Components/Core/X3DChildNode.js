
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DNode, 
          X3DConstants)
{
	with (Fields)
	{
		function X3DChildNode (browser, executionContext)
		{
			X3DNode .call (this, browser, executionContext);

			this .addType (X3DConstants .X3DChildNode);
		}

		X3DChildNode .prototype = $.extend (new X3DNode (),
		{
			constructor: X3DChildNode,
			initialize: function ()
			{
				X3DNode .prototype .initialize .call (this);
				
				this .addChildren ("isCameraObject", new SFBool (false));
			},
			setCameraObject: function (value)
			{
				if (value !== this .isCameraObject_ .getValue ())
					this .isCameraObject_ = value;
			},
			getCameraObject: function ()
			{
				return this .isCameraObject_ .getValue ();
			},
		});

		return X3DChildNode;
	}
});

